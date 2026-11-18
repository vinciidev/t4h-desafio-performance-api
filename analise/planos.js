#!/usr/bin/env node
// Compara os planos EXPLAIN (ANALYZE, BUFFERS) guardados em diagnostico/<data>-<commit>/.
//
//   node analise/planos.js     # gera diagnostico/comparativo-planos.md
//
// Só lê os arquivos que o diagnostico/coletar.sh gravou; nada é digitado à mão.
// Para cada consulta e cada coleta mostra: tempo de execução, nós de leitura da tabela
// (Seq Scan, Index Scan...), linhas descartadas por filtro e blocos lidos do cache (shared hit).
// Os planos de 1e48069, 7b68209 e 6ac55d3 vêm da máquina A; os de ef8d217 e a8050f5, da B.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const PASTA = path.join(RAIZ, 'diagnostico');

// commit -> rótulo legível e máquina
const COLETAS = {
  '1e48069': 'base (A)',
  '7b68209': 'após 02a (A)',
  '6ac55d3': 'após 02b (A)',
  'ef8d217': 'após 04 (B)',
  'a8050f5': 'após 06 (B)',
};

const pastas = fs.readdirSync(PASTA, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{8}-\d{6}-[0-9a-f]+$/.test(d.name))
  .map((d) => d.name)
  .sort();

function lerPlano(arquivo) {
  const texto = fs.readFileSync(arquivo, 'utf8');
  const tempo = texto.match(/Execution Time: ([\d.]+) ms/);
  const nos = [...texto.matchAll(/(Parallel )?(Seq Scan|Index Only Scan|Index Scan|Bitmap Heap Scan|Bitmap Index Scan) (?:on|using) (\w+)/g)]
    .map((m) => `${m[2]} ${m[3]}`);
  const descartadas = [...texto.matchAll(/Rows Removed by Filter: (\d+)/g)].reduce((s, m) => s + Number(m[1]), 0);
  const buffers = texto.match(/Buffers: shared hit=(\d+)/);
  const sort = texto.match(/Sort Method: ([^\n]+?)\s+(?:Memory|Disk): (\S+)/);
  return {
    ms: tempo ? Number(tempo[1]) : NaN,
    nos: [...new Set(nos)],
    descartadas,
    blocos: buffers ? Number(buffers[1]) : NaN,
    sortDisco: /Sort Method: external merge\s+Disk/.test(texto),
    sort: sort ? sort[0].replace(/\s+/g, ' ') : null,
  };
}

const fmt = (x, c = 3) => (Number.isFinite(x) ? x.toFixed(c).replace('.', ',') : '—');
const fmtInt = (x) => (Number.isFinite(x) ? x.toLocaleString('pt-BR') : '—');

const consultas = new Set();
const dados = {}; // [commit][consulta]
for (const pasta of pastas) {
  const commit = pasta.split('-').pop();
  if (!COLETAS[commit]) continue;
  dados[commit] = {};
  for (const arq of fs.readdirSync(path.join(PASTA, pasta))) {
    const m = arq.match(/^02-explain-(.+)\.txt$/);
    if (!m) continue;
    consultas.add(m[1]);
    dados[commit][m[1]] = { ...lerPlano(path.join(PASTA, pasta, arq)), pasta, arq };
  }
}

const commits = Object.keys(COLETAS).filter((c) => dados[c]);
const linhas = [];
linhas.push('# Comparativo dos planos de execução');
linhas.push('');
linhas.push(`> Gerado por \`analise/planos.js\` em ${new Date().toISOString()} a partir de \`EXPLAIN (ANALYZE, BUFFERS)\` salvos em \`diagnostico/\`. Não editar à mão.`);
linhas.push('');
linhas.push('Colunas A vêm da primeira máquina, colunas B da segunda. **O plano (o tipo de nó) não depende da máquina; os tempos isolados dependem e servem só como indicação.** Cada célula: tempo de execução em ms · nós de leitura · linhas descartadas pelo filtro · blocos lidos do cache (`shared hit`).');
linhas.push('');
linhas.push(`| Consulta | ${commits.map((c) => COLETAS[c]).join(' | ')} |`);
linhas.push(`|---|${commits.map(() => '---').join('|')}|`);
for (const q of [...consultas].sort()) {
  const celulas = commits.map((c) => {
    const p = dados[c][q];
    if (!p) return '—';
    const nos = p.nos.length ? p.nos.join(' + ') : '(sem leitura de tabela)';
    const extra = p.sortDisco ? ' · ordena em disco' : '';
    return `${fmt(p.ms)} ms · ${nos} · ${fmtInt(p.descartadas)} descartadas · ${fmtInt(p.blocos)} blocos${extra}`;
  });
  linhas.push(`| \`${q}\` | ${celulas.join(' | ')} |`);
}
linhas.push('');
linhas.push('## Arquivos de origem');
linhas.push('');
for (const c of commits) {
  const qualquer = Object.values(dados[c])[0];
  linhas.push(`- **${COLETAS[c]}**: [\`diagnostico/${qualquer.pasta}/\`](${qualquer.pasta}/)`);
}
linhas.push('');
fs.writeFileSync(path.join(PASTA, 'comparativo-planos.md'), linhas.join('\n'));
console.log(`diagnostico/comparativo-planos.md: ${consultas.size} consultas × ${commits.length} coletas`);
