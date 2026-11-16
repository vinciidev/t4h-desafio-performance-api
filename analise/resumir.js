#!/usr/bin/env node
// Consolida as medições de resultados/ em medianas por rótulo, sem digitação manual.
//
//   node analise/resumir.js                 # gera analise/saida/resumo.md, execucoes.csv e medianas.json
//   node analise/resumir.js --svg           # também gera gráficos SVG em artigo/img/
//   node analise/resumir.js --base 00-linha-de-base
//
// Sem Node instalado, rode pelo container que o desafio já usa:
//   docker run --rm -v "$PWD":/w -w /w node:20.18.0-alpine node analise/resumir.js --svg
//
// Lê, de cada pasta resultados/<data>-<rotulo>/, os arquivos gerados pelo scripts/medir.sh:
// contexto.txt, resumo-k6.json, recursos.txt e contrato.txt. Nunca altera resultados/.
// Para cada rótulo calcula mediana, mínimo e máximo das execuções e compara com a linha de
// base e com o rótulo anterior. Avisa quando algo invalida a comparação: parâmetros de carga
// diferentes, arquivos sem commit, contrato quebrado, menos de 3 execuções, commits diferentes
// dentro do mesmo rótulo.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const PASTA_RESULTADOS = path.join(RAIZ, 'resultados');
const PASTA_SAIDA = path.join(__dirname, 'saida');
const PASTA_IMG = path.join(RAIZ, 'artigo', 'img');

const ROTAS = ['cliente', 'pedidos-do-cliente', 'cliente-por-email', 'pedidos-por-status', 'busca-produtos', 'vendas-por-dia', 'top-produtos'];

const argumentos = process.argv.slice(2);
const gerarSvg = argumentos.includes('--svg');
const indiceBase = argumentos.indexOf('--base');
const rotuloBaseInformado = indiceBase >= 0 ? argumentos[indiceBase + 1] : null;

// ---------- leitura de uma execução ----------

function lerSeExistir(arquivo) {
  return fs.existsSync(arquivo) ? fs.readFileSync(arquivo, 'utf8') : null;
}

function lerContexto(texto) {
  const contexto = { limites: {} };
  if (!texto) return contexto;
  for (const linha of texto.split('\n')) {
    const limite = linha.match(/^\s+([\w.-]+): cpus=(\d+).*memoria=(\d+)/);
    if (limite) {
      contexto.limites[limite[1]] = { cpus: Number(limite[2]) / 1e9, memoriaMiB: Number(limite[3]) / 1048576 };
      continue;
    }
    const par = linha.match(/^([^:]+):\s*(.*)$/);
    if (par && !linha.startsWith(' ')) contexto[par[1].trim()] = par[2].trim();
  }
  return contexto;
}

// recursos.txt: "<container> <amostras> <cpu_media>% <cpu_max>% <mem_media> MiB <mem_max> MiB"
function lerRecursos(texto) {
  const recursos = {};
  if (!texto) return recursos;
  for (const linha of texto.split('\n')) {
    const m = linha.match(/^(\S+)\s+(\d+)\s+([\d.]+)%\s+([\d.]+)%\s+([\d.]+) MiB\s+([\d.]+) MiB/);
    if (!m) continue;
    const servico = m[1].replace(/^desafio-performance[-_]/, '').replace(/[-_]\d+$/, '');
    recursos[servico] = { cpuMedia: +m[3], cpuMax: +m[4], memMedia: +m[5], memMax: +m[6] };
  }
  return recursos;
}

function lerContrato(texto) {
  if (!texto) return 'ausente';
  const ultima = texto.trim().split('\n').pop() || '';
  if (ultima.startsWith('Contrato mantido')) return 'mantido';
  if (ultima.startsWith('Contrato quebrado')) return 'quebrado';
  return 'indefinido';
}

function lerExecucao(nomePasta) {
  const pasta = path.join(PASTA_RESULTADOS, nomePasta);
  const jsonTexto = lerSeExistir(path.join(pasta, 'resumo-k6.json'));
  if (!jsonTexto) return null;
  const k6 = JSON.parse(jsonTexto);
  const contexto = lerContexto(lerSeExistir(path.join(pasta, 'contexto.txt')));
  const m = k6.metrics;
  const duracao = m.http_req_duration.values;

  const porRota = {};
  for (const rota of ROTAS) {
    const d = m[`http_req_duration{rota:${rota}}`];
    if (d) porRota[rota] = { p95: d.values['p(95)'], mediana: d.values.med, requisicoes: d.values.count };
  }

  return {
    pasta: nomePasta,
    rotulo: contexto.rotulo || nomePasta.replace(/^\d{8}-\d{6}-/, ''),
    commit: contexto.commit || '?',
    semCommit: contexto['arquivos alterados sem commit'] === undefined ? null : Number(contexto['arquivos alterados sem commit']),
    parametros: { vus: contexto.vus, duracao: contexto.duracao, semente: contexto.semente },
    limites: contexto.limites,
    reqPorSegundo: m.http_reqs.values.rate,
    requisicoes: m.http_reqs.values.count,
    p50: duracao.med,
    p95: duracao['p(95)'],
    p99: duracao['p(99)'],
    erros: m.http_req_failed ? m.http_req_failed.values.rate : 0,
    porRota,
    recursos: lerRecursos(lerSeExistir(path.join(pasta, 'recursos.txt'))),
    contrato: lerContrato(lerSeExistir(path.join(pasta, 'contrato.txt'))),
  };
}

// ---------- estatística ----------

function mediana(valores) {
  const v = valores.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (v.length === 0) return NaN;
  const meio = Math.floor(v.length / 2);
  return v.length % 2 ? v[meio] : (v[meio - 1] + v[meio]) / 2;
}

function resumo(valores) {
  const v = valores.filter((x) => Number.isFinite(x));
  return { mediana: mediana(v), min: Math.min(...v), max: Math.max(...v), n: v.length };
}

function variacao(depois, antes) {
  return Number.isFinite(depois) && Number.isFinite(antes) && antes !== 0 ? ((depois - antes) / antes) * 100 : NaN;
}

// ---------- formatação ----------

const fmt = (x, casas = 1) => (Number.isFinite(x) ? x.toFixed(casas).replace('.', ',') : '—');
const fmtPct = (x) => (Number.isFinite(x) ? `${x > 0 ? '+' : ''}${fmt(x, 0)}%` : '—');
const fmtFaixa = (r, casas = 1) => (r.n > 1 ? `${fmt(r.mediana, casas)} (${fmt(r.min, casas)}–${fmt(r.max, casas)})` : fmt(r.mediana, casas));

// ---------- principal ----------

if (!fs.existsSync(PASTA_RESULTADOS)) {
  console.error(`Pasta não encontrada: ${PASTA_RESULTADOS}`);
  process.exit(1);
}

const execucoes = fs.readdirSync(PASTA_RESULTADOS)
  .filter((nome) => /^\d{8}-\d{6}-/.test(nome))
  .sort()
  .map(lerExecucao)
  .filter(Boolean);

if (execucoes.length === 0) {
  console.error('Nenhuma medição encontrada em resultados/. Rode scripts/medir.sh primeiro.');
  process.exit(1);
}

// Agrupa por rótulo, na ordem da primeira execução de cada um.
const grupos = new Map();
for (const e of execucoes) {
  if (!grupos.has(e.rotulo)) grupos.set(e.rotulo, []);
  grupos.get(e.rotulo).push(e);
}

const rotuloBase = rotuloBaseInformado || [...grupos.keys()].find((r) => r.startsWith('00')) || [...grupos.keys()][0];
const servicos = [...new Set(execucoes.flatMap((e) => Object.keys(e.recursos)))].sort();

const consolidado = [...grupos.entries()].map(([rotulo, lista]) => {
  const r = {
    rotulo,
    execucoes: lista.map((e) => e.pasta),
    commits: [...new Set(lista.map((e) => e.commit))],
    parametros: lista[0].parametros,
    limites: lista[0].limites,
    reqPorSegundo: resumo(lista.map((e) => e.reqPorSegundo)),
    p50: resumo(lista.map((e) => e.p50)),
    p95: resumo(lista.map((e) => e.p95)),
    p99: resumo(lista.map((e) => e.p99)),
    erros: resumo(lista.map((e) => e.erros * 100)),
    porRota: {},
    recursos: {},
    avisos: [],
  };
  for (const rota of ROTAS) {
    r.porRota[rota] = resumo(lista.map((e) => (e.porRota[rota] ? e.porRota[rota].p95 : NaN)));
  }
  for (const s of servicos) {
    r.recursos[s] = {
      cpuMedia: resumo(lista.map((e) => (e.recursos[s] ? e.recursos[s].cpuMedia : NaN))),
      memMedia: resumo(lista.map((e) => (e.recursos[s] ? e.recursos[s].memMedia : NaN))),
      memMax: resumo(lista.map((e) => (e.recursos[s] ? e.recursos[s].memMax : NaN))),
    };
  }

  if (lista.length < 3) r.avisos.push(`só ${lista.length} execução(ões); o enunciado pede 3`);
  if (r.commits.length > 1) r.avisos.push(`execuções em commits diferentes: ${r.commits.join(', ')}`);
  const sujas = lista.filter((e) => e.semCommit === null || e.semCommit > 0);
  if (sujas.length) r.avisos.push(`arquivos sem commit (ou sem git) em: ${sujas.map((e) => e.pasta).join(', ')}`);
  const quebrados = lista.filter((e) => e.contrato !== 'mantido');
  if (quebrados.length && rotulo !== rotuloBase) r.avisos.push(`contrato não mantido em: ${quebrados.map((e) => `${e.pasta} (${e.contrato})`).join(', ')}`);
  const parametrosDiferentes = lista.filter((e) => JSON.stringify(e.parametros) !== JSON.stringify(lista[0].parametros));
  if (parametrosDiferentes.length) r.avisos.push('parâmetros de carga diferentes dentro do rótulo');
  return r;
});

const base = consolidado.find((r) => r.rotulo === rotuloBase);
for (const r of consolidado) {
  if (r !== base && JSON.stringify(r.parametros) !== JSON.stringify(base.parametros)) {
    r.avisos.push(`parâmetros de carga diferentes da base (${JSON.stringify(r.parametros)} vs ${JSON.stringify(base.parametros)}): comparação inválida`);
  }
}

// Sobreposição de faixas: se as faixas min–max se cruzam, a diferença pode ser ruído.
function sobrepoe(a, b) {
  return a.n > 1 && b.n > 1 && a.min <= b.max && b.min <= a.max;
}

// ---------- resumo.md ----------

const linhas = [];
linhas.push('# Resumo das medições');
linhas.push('');
linhas.push(`> Gerado por \`analise/resumir.js\` em ${new Date().toISOString()} a partir de ${execucoes.length} pastas de \`resultados/\`. Não editar à mão: rode o script de novo.`);
linhas.push('');
linhas.push(`Valores: **mediana** das execuções de cada rótulo, com a faixa (mínimo–máximo) entre parênteses. Base de comparação: \`${rotuloBase}\`. Parâmetros da base: VUS=${base.parametros.vus}, DURAÇÃO=${base.parametros.duracao}, SEMENTE=${base.parametros.semente}.`);
linhas.push('');
linhas.push('## Geral');
linhas.push('');
linhas.push('| Rótulo | Exec. | req/s | Δ base | Δ anterior | p95 (ms) | Δ base | Δ anterior | p50 (ms) | p99 (ms) | Erros (%) |');
linhas.push('|---|---|---|---|---|---|---|---|---|---|---|');
consolidado.forEach((r, i) => {
  const ant = i > 0 ? consolidado[i - 1] : null;
  const ruidoBase = r !== base && sobrepoe(r.p95, base.p95) ? ' ⚠︎' : '';
  linhas.push([
    `\`${r.rotulo}\``,
    r.execucoes.length,
    fmtFaixa(r.reqPorSegundo, 1),
    r === base ? '—' : fmtPct(variacao(r.reqPorSegundo.mediana, base.reqPorSegundo.mediana)),
    ant ? fmtPct(variacao(r.reqPorSegundo.mediana, ant.reqPorSegundo.mediana)) : '—',
    fmtFaixa(r.p95, 1),
    r === base ? '—' : fmtPct(variacao(r.p95.mediana, base.p95.mediana)) + ruidoBase,
    ant ? fmtPct(variacao(r.p95.mediana, ant.p95.mediana)) + (sobrepoe(r.p95, ant.p95) ? ' ⚠︎' : '') : '—',
    fmt(r.p50.mediana, 1),
    fmt(r.p99.mediana, 1),
    fmt(r.erros.mediana, 2),
  ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'));
});
linhas.push('');
linhas.push('⚠︎ = as faixas mínimo–máximo das execuções se sobrepõem: a diferença pode estar dentro do ruído.');
linhas.push('');

linhas.push('## Recursos (mediana das médias durante a carga)');
linhas.push('');
linhas.push(`| Rótulo | ${servicos.map((s) => `CPU ${s} (%)  | Mem ${s} (MiB) | Limite ${s}`).join(' | ')} |`);
linhas.push(`|---|${servicos.map(() => '---|---|---').join('|')}|`);
for (const r of consolidado) {
  const celulas = servicos.map((s) => {
    const rec = r.recursos[s];
    const lim = r.limites[s];
    const limite = lim ? `${fmt(lim.cpus, 2)} CPU / ${fmt(lim.memoriaMiB, 0)} MiB` : '—';
    return `${fmt(rec.cpuMedia.mediana, 1)} | ${fmt(rec.memMedia.mediana, 1)} | ${limite}`;
  });
  linhas.push(`| \`${r.rotulo}\` | ${celulas.join(' | ')} |`);
}
linhas.push('');
linhas.push('CPU: 100% = 1 CPU inteira (convenção do `docker stats`). Um container perto do próprio limite de CPU está saturado.');
linhas.push('');

linhas.push('## p95 por rota (ms)');
linhas.push('');
linhas.push(`| Rótulo | ${ROTAS.join(' | ')} |`);
linhas.push(`|---|${ROTAS.map(() => '---').join('|')}|`);
for (const r of consolidado) {
  linhas.push(`| \`${r.rotulo}\` | ${ROTAS.map((rota) => fmt(r.porRota[rota].mediana, 1)).join(' | ')} |`);
}
linhas.push('');
linhas.push('Rotas lentas têm poucas requisições por execução: o p95 por rota oscila mais que o geral.');
linhas.push('');

linhas.push('## Execuções por rótulo');
linhas.push('');
for (const r of consolidado) {
  linhas.push(`- \`${r.rotulo}\` (commit ${r.commits.join(', ')}): ${r.execucoes.map((p) => `[${p}](../../resultados/${p}/resumo.txt)`).join(' · ')}`);
}
linhas.push('');

const comAviso = consolidado.filter((r) => r.avisos.length);
linhas.push('## Avisos');
linhas.push('');
if (comAviso.length === 0) {
  linhas.push('Nenhum. Parâmetros iguais, commits limpos e contrato mantido em todas as medições.');
} else {
  for (const r of comAviso) for (const a of r.avisos) linhas.push(`- \`${r.rotulo}\`: ${a}`);
}
linhas.push('');

fs.mkdirSync(PASTA_SAIDA, { recursive: true });
fs.writeFileSync(path.join(PASTA_SAIDA, 'resumo.md'), linhas.join('\n'));

// ---------- execucoes.csv e medianas.json ----------

const cabecalho = ['pasta', 'rotulo', 'commit', 'sem_commit', 'vus', 'duracao', 'semente', 'req_s', 'p50_ms', 'p95_ms', 'p99_ms', 'erros_pct', 'contrato',
  ...ROTAS.map((r) => `p95_${r}_ms`), ...servicos.flatMap((s) => [`cpu_${s}_pct`, `mem_${s}_mib`])];
const csv = [cabecalho.join(',')];
for (const e of execucoes) {
  csv.push([
    e.pasta, e.rotulo, e.commit, e.semCommit, e.parametros.vus, e.parametros.duracao, e.parametros.semente,
    e.reqPorSegundo.toFixed(3), e.p50.toFixed(3), e.p95.toFixed(3), e.p99.toFixed(3), (e.erros * 100).toFixed(3), e.contrato,
    ...ROTAS.map((r) => (e.porRota[r] ? e.porRota[r].p95.toFixed(3) : '')),
    ...servicos.flatMap((s) => (e.recursos[s] ? [e.recursos[s].cpuMedia, e.recursos[s].memMedia] : ['', ''])),
  ].join(','));
}
fs.writeFileSync(path.join(PASTA_SAIDA, 'execucoes.csv'), `${csv.join('\n')}\n`);
fs.writeFileSync(path.join(PASTA_SAIDA, 'medianas.json'), `${JSON.stringify({ base: rotuloBase, rotulos: consolidado }, null, 2)}\n`);

// ---------- gráficos SVG (barras horizontais: mediana + faixa min–max) ----------

function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function graficoBarras({ titulo, subtitulo, unidade, casas, dados }) {
  const largura = 760;
  const margemEsq = 230;
  const margemDir = 90;
  const alturaLinha = 34;
  const topo = 74;
  const altura = topo + dados.length * alturaLinha + 34;
  const maiorValor = Math.max(...dados.map((d) => (Number.isFinite(d.max) ? d.max : d.valor))) || 1;
  // Escala com marcas "redondas" (1, 2 ou 5 × 10^n), cerca de 4 divisões.
  const bruto = maiorValor / 4;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const passo = [1, 2, 5, 10].map((f) => f * potencia).find((p) => p >= bruto);
  const marcas = Math.ceil(maiorValor / passo);
  const maximo = passo * marcas;
  const area = largura - margemEsq - margemDir;
  const x = (v) => margemEsq + (v / maximo) * area;

  const partes = [];
  partes.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}" width="${largura}" height="${altura}" role="img" aria-labelledby="t d">`);
  partes.push(`<title id="t">${escapar(titulo)}</title><desc id="d">${escapar(subtitulo)}</desc>`);
  partes.push(`<style>
    .fundo{fill:#fcfcfb}.tit{fill:#0b0b0b;font:600 16px system-ui,-apple-system,Segoe UI,sans-serif}
    .sub,.eixo{fill:#52514e;font:12px system-ui,-apple-system,Segoe UI,sans-serif}
    .rot{fill:#0b0b0b;font:13px ui-monospace,SFMono-Regular,Menlo,monospace}
    .val{fill:#0b0b0b;font:600 12px system-ui,-apple-system,Segoe UI,sans-serif}
    .grade{stroke:#e1e0d9;stroke-width:1}.barra{fill:#2a78d6}.faixa{stroke:#52514e;stroke-width:1.5}
    @media (prefers-color-scheme: dark){
      .fundo{fill:#1a1a19}.tit,.rot,.val{fill:#f0efec}.sub,.eixo{fill:#c3c2b7}
      .grade{stroke:#2c2c2a}.barra{fill:#3987e5}.faixa{stroke:#c3c2b7}
    }
  </style>`);
  partes.push(`<rect class="fundo" width="${largura}" height="${altura}" rx="8"/>`);
  partes.push(`<text class="tit" x="16" y="28">${escapar(titulo)}</text>`);
  partes.push(`<text class="sub" x="16" y="48">${escapar(subtitulo)}</text>`);

  for (let i = 0; i <= marcas; i += 1) {
    const v = passo * i;
    const px = x(v);
    partes.push(`<line class="grade" x1="${px}" x2="${px}" y1="${topo - 8}" y2="${altura - 30}"/>`);
    partes.push(`<text class="eixo" x="${px}" y="${altura - 14}" text-anchor="middle">${fmt(v, Number.isInteger(v) ? 0 : 1)}${i === marcas ? ` ${unidade}` : ''}</text>`);
  }

  dados.forEach((d, i) => {
    const y = topo + i * alturaLinha;
    const alturaBarra = 16;
    const yBarra = y + (alturaLinha - alturaBarra) / 2 - 4;
    const larguraBarra = Math.max(2, x(d.valor) - margemEsq);
    partes.push(`<text class="rot" x="${margemEsq - 12}" y="${yBarra + 12}" text-anchor="end">${escapar(d.rotulo)}</text>`);
    // Barra com ponta arredondada só do lado do valor (ancorada no zero).
    partes.push(`<path class="barra" d="M${margemEsq},${yBarra} h${Math.max(0, larguraBarra - 4)} a4,4 0 0 1 4,4 v${alturaBarra - 8} a4,4 0 0 1 -4,4 h${-Math.max(0, larguraBarra - 4)} z"><title>${escapar(`${d.rotulo}: ${fmt(d.valor, casas)} ${unidade} (faixa ${fmt(d.min, casas)}–${fmt(d.max, casas)})`)}</title></path>`);
    if (Number.isFinite(d.min) && Number.isFinite(d.max) && d.max > d.min) {
      const meio = yBarra + alturaBarra / 2;
      partes.push(`<line class="faixa" x1="${x(d.min)}" x2="${x(d.max)}" y1="${meio}" y2="${meio}"/>`);
      partes.push(`<line class="faixa" x1="${x(d.min)}" x2="${x(d.min)}" y1="${meio - 5}" y2="${meio + 5}"/>`);
      partes.push(`<line class="faixa" x1="${x(d.max)}" x2="${x(d.max)}" y1="${meio - 5}" y2="${meio + 5}"/>`);
    }
    const fimTexto = Math.max(x(d.valor), Number.isFinite(d.max) ? x(d.max) : 0) + 8;
    partes.push(`<text class="val" x="${fimTexto}" y="${yBarra + 12}">${fmt(d.valor, casas)}</text>`);
  });

  partes.push('</svg>');
  return `${partes.join('\n')}\n`;
}

if (gerarSvg) {
  fs.mkdirSync(PASTA_IMG, { recursive: true });
  const n = consolidado.map((r) => r.execucoes.length);
  const faixaN = Math.min(...n) === Math.max(...n) ? `${n[0]}` : `${Math.min(...n)} a ${Math.max(...n)}`;
  const notaExec = `Mediana de ${faixaN} execuções por rótulo; traço = mínimo–máximo. Fonte: resultados/ via analise/resumir.js.`;
  fs.writeFileSync(path.join(PASTA_IMG, 'p95-por-mudanca.svg'), graficoBarras({
    titulo: 'Tempo de resposta p95 por mudança (menor é melhor)',
    subtitulo: notaExec,
    unidade: 'ms',
    casas: 1,
    dados: consolidado.map((r) => ({ rotulo: r.rotulo, valor: r.p95.mediana, min: r.p95.min, max: r.p95.max })),
  }));
  fs.writeFileSync(path.join(PASTA_IMG, 'req-s-por-mudanca.svg'), graficoBarras({
    titulo: 'Requisições por segundo por mudança (maior é melhor)',
    subtitulo: notaExec,
    unidade: 'req/s',
    casas: 1,
    dados: consolidado.map((r) => ({ rotulo: r.rotulo, valor: r.reqPorSegundo.mediana, min: r.reqPorSegundo.min, max: r.reqPorSegundo.max })),
  }));
}

// ---------- terminal ----------

console.log(`${execucoes.length} execuções em ${consolidado.length} rótulos. Base: ${rotuloBase}`);
for (const r of consolidado) {
  console.log(`  ${r.rotulo.padEnd(34)} n=${r.execucoes.length}  req/s ${fmt(r.reqPorSegundo.mediana).padStart(8)}  p95 ${fmt(r.p95.mediana).padStart(9)} ms${r.avisos.length ? '  ⚠ ' + r.avisos.length + ' aviso(s)' : ''}`);
}
console.log(`\nSaída: analise/saida/resumo.md, execucoes.csv, medianas.json${gerarSvg ? ' e artigo/img/*.svg' : ''}`);
if (comAviso.length) console.log('Há avisos: veja a seção "Avisos" do resumo.md.');
