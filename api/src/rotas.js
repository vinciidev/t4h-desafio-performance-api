const express = require('express');
const { consultar } = require('./db');

const rotas = express.Router();

const STATUS_VALIDOS = ['pago', 'entregue', 'cancelado', 'pendente'];
const TAMANHO_PAGINA = 20;
const MAX_DIAS_RELATORIO = 31;

function inteiroPositivo(valor) {
  if (typeof valor !== 'string' || !/^\d+$/.test(valor)) return null;
  const numero = Number(valor);
  return numero > 0 && Number.isSafeInteger(numero) ? numero : null;
}

function dataValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const data = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor ? data : null;
}

function assincrono(manipulador) {
  return (req, res, next) => manipulador(req, res).catch(next);
}

function formatarCliente(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    cidade: linha.cidade,
    criado_em: linha.criado_em,
  };
}

rotas.get('/saude', (req, res) => {
  res.json({ status: 'ok' });
});

rotas.get('/clientes', assincrono(async (req, res) => {
  const email = req.query.email;
  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ erro: 'informe o parametro email' });
  }

  const linhas = await consultar(
    'SELECT * FROM clientes WHERE lower(email) = lower($1) ORDER BY id',
    [email.trim()],
  );
  res.json(linhas.map(formatarCliente));
}));

rotas.get('/clientes/:id', assincrono(async (req, res) => {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ erro: 'id invalido' });

  const linhas = await consultar('SELECT * FROM clientes WHERE id = $1', [id]);
  if (linhas.length === 0) return res.status(404).json({ erro: 'cliente nao encontrado' });
  res.json(formatarCliente(linhas[0]));
}));

rotas.get('/clientes/:id/pedidos', assincrono(async (req, res) => {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ erro: 'id invalido' });

  const clientes = await consultar('SELECT * FROM clientes WHERE id = $1', [id]);
  if (clientes.length === 0) return res.status(404).json({ erro: 'cliente nao encontrado' });

  const pedidos = await consultar(
    'SELECT * FROM pedidos WHERE cliente_id = $1 ORDER BY criado_em DESC, id DESC',
    [id],
  );

  // 3 consultas fixas em vez de 1 por pedido + 1 por item (N+1): o número de idas ao
  // banco deixa de crescer com os pedidos do cliente
  // (diagnostico/20261116-164528-1e48069-contar-clientes-42-pedidos.txt).
  // Ordem preservada: itens por id dentro de cada pedido. Experimento: experimentos.md, mudança 03.
  const idsPedidos = pedidos.map((pedido) => pedido.id);
  const todosItens = idsPedidos.length
    ? await consultar('SELECT * FROM itens_pedido WHERE pedido_id = ANY($1) ORDER BY pedido_id, id', [idsPedidos])
    : [];
  const itensPorPedido = new Map();
  for (const item of todosItens) {
    if (!itensPorPedido.has(item.pedido_id)) itensPorPedido.set(item.pedido_id, []);
    itensPorPedido.get(item.pedido_id).push(item);
  }
  const idsProdutos = [...new Set(todosItens.map((item) => item.produto_id))];
  const produtos = idsProdutos.length
    ? await consultar('SELECT * FROM produtos WHERE id = ANY($1)', [idsProdutos])
    : [];
  const produtoPorId = new Map(produtos.map((produto) => [produto.id, produto]));

  const resposta = [];
  for (const pedido of pedidos) {
    const itens = itensPorPedido.get(pedido.id) || [];

    const itensFormatados = [];
    let total = 0;
    for (const item of itens) {
      const produto = produtoPorId.get(item.produto_id);
      itensFormatados.push({
        produto_id: item.produto_id,
        produto_nome: produto.nome,
        quantidade: item.quantidade,
        preco_unitario_centavos: item.preco_unitario_centavos,
      });
      total += item.quantidade * item.preco_unitario_centavos;
    }

    resposta.push({
      id: pedido.id,
      status: pedido.status,
      criado_em: pedido.criado_em,
      total_centavos: total,
      itens: itensFormatados,
    });
  }

  res.json(resposta);
}));

rotas.get('/pedidos', assincrono(async (req, res) => {
  const status = req.query.status;
  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ erro: `status deve ser um de: ${STATUS_VALIDOS.join(', ')}` });
  }

  const pagina = req.query.pagina === undefined ? 1 : inteiroPositivo(req.query.pagina);
  if (pagina === null) return res.status(400).json({ erro: 'pagina invalida' });

  const [contagem] = await consultar('SELECT count(*) AS total FROM pedidos WHERE status = $1', [status]);
  const linhas = await consultar(
    'SELECT * FROM pedidos WHERE status = $1 ORDER BY criado_em DESC, id DESC LIMIT $2 OFFSET $3',
    [status, TAMANHO_PAGINA, (pagina - 1) * TAMANHO_PAGINA],
  );

  res.json({
    pagina,
    tamanho_pagina: TAMANHO_PAGINA,
    total: Number(contagem.total),
    pedidos: linhas.map((linha) => ({
      id: linha.id,
      cliente_id: linha.cliente_id,
      status: linha.status,
      criado_em: linha.criado_em,
    })),
  });
}));

rotas.get('/produtos/busca', assincrono(async (req, res) => {
  const termo = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (termo.length < 3) return res.status(400).json({ erro: 'o termo de busca precisa ter pelo menos 3 caracteres' });

  const linhas = await consultar(
    "SELECT * FROM produtos WHERE nome ILIKE '%' || $1 || '%' ORDER BY nome, id LIMIT 20",
    [termo],
  );
  res.json(linhas.map((linha) => ({
    id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria,
    preco_centavos: linha.preco_centavos,
  })));
}));

rotas.get('/relatorios/vendas-por-dia', assincrono(async (req, res) => {
  const inicio = dataValida(req.query.inicio);
  const fim = dataValida(req.query.fim);
  if (inicio === null || fim === null) {
    return res.status(400).json({ erro: 'informe inicio e fim no formato AAAA-MM-DD' });
  }
  const dias = (fim - inicio) / 86400000 + 1;
  if (dias < 1 || dias > MAX_DIAS_RELATORIO) {
    return res.status(400).json({ erro: `o periodo deve ter entre 1 e ${MAX_DIAS_RELATORIO} dias` });
  }

  const linhas = await consultar(
    `SELECT p.id AS pedido_id, p.criado_em, p.observacoes, i.quantidade, i.preco_unitario_centavos
       FROM pedidos p
       JOIN itens_pedido i ON i.pedido_id = p.id
      WHERE p.criado_em >= $1::date AND p.criado_em < $2::date + 1
        AND p.status <> 'cancelado'`,
    [req.query.inicio, req.query.fim],
  );

  const porDia = new Map();
  for (const linha of linhas) {
    const dia = linha.criado_em.toISOString().slice(0, 10);
    if (!porDia.has(dia)) porDia.set(dia, { pedidos: new Set(), itens: 0, receita: 0 });
    const acumulado = porDia.get(dia);
    acumulado.pedidos.add(linha.pedido_id);
    acumulado.itens += linha.quantidade;
    acumulado.receita += linha.quantidade * linha.preco_unitario_centavos;
  }

  const resposta = [...porDia.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([dia, acumulado]) => ({
      dia,
      pedidos: acumulado.pedidos.size,
      itens: acumulado.itens,
      receita_centavos: acumulado.receita,
    }));

  res.json(resposta);
}));

rotas.get('/relatorios/top-produtos', assincrono(async (req, res) => {
  const limite = req.query.limite === undefined ? 10 : inteiroPositivo(req.query.limite);
  if (limite === null || limite > 50) return res.status(400).json({ erro: 'limite deve ser um inteiro entre 1 e 50' });

  const linhas = await consultar(
    `SELECT pr.id, pr.nome, pr.categoria,
            sum(i.quantidade) AS unidades,
            sum(i.quantidade * i.preco_unitario_centavos) AS receita_centavos
       FROM itens_pedido i
       JOIN pedidos p ON p.id = i.pedido_id
       JOIN produtos pr ON pr.id = i.produto_id
      WHERE p.status <> 'cancelado'
      GROUP BY pr.id, pr.nome, pr.categoria
      ORDER BY receita_centavos DESC, pr.id
      LIMIT $1`,
    [limite],
  );

  res.json(linhas.map((linha) => ({
    produto_id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria,
    unidades: Number(linha.unidades),
    receita_centavos: Number(linha.receita_centavos),
  })));
}));

module.exports = rotas;
