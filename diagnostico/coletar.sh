#!/usr/bin/env bash
# Coleta o diagnóstico do banco: ambiente, parâmetros, tamanhos, índices e o plano
# (EXPLAIN ANALYZE, BUFFERS) de cada consulta das rotas, com parâmetros representativos.
#
#   diagnostico/coletar.sh            # grava em diagnostico/<data>-<commit>/
#
# As consultas abaixo são cópias das consultas da API ORIGINAL (api/src/rotas.js no commit
# do estado original). Depois de reescrever uma consulta na API, acrescente a versão nova
# aqui (com outro nome de arquivo) para comparar os planos antes e depois.
#
# Observações de método:
# - Cada consulta roda uma vez sem medir (aquece o cache) e depois com EXPLAIN ANALYZE.
# - Os parâmetros vão como literais; a API usa parâmetros ($1). O plano pode diferir do
#   plano genérico de uma consulta preparada, mas o driver pg não prepara por padrão.
# - Rode com a carga parada, para o tempo não sofrer interferência.

set -euo pipefail
cd "$(dirname "$0")/.."

if ! docker compose exec -T banco pg_isready -U loja -d loja >/dev/null 2>&1; then
  echo "O banco não está pronto. Suba tudo com: docker compose up -d --build" >&2
  exit 1
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo sem-git)"
PASTA="diagnostico/$(date +%Y%m%d-%H%M%S)-${COMMIT}"
mkdir -p "$PASTA"

psql_banco() {
  docker compose exec -T banco psql -U loja -d loja -X -v ON_ERROR_STOP=1 "$@"
}

valor() {
  psql_banco -tA -c "$1"
}

# --- 00: ambiente --------------------------------------------------------------------------
{
  echo "data: $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "commit: ${COMMIT}"
  echo "arquivos alterados sem commit: $(git status --porcelain -- . ':(exclude)resultados' ':(exclude)diagnostico' 2>/dev/null | wc -l | tr -d ' ')"
  echo
  echo "== containers"
  docker compose ps
  echo
  echo "== versão do PostgreSQL"
  valor "SELECT version();"
  echo
  echo "== parâmetros relevantes (valor e origem)"
  psql_banco -c "
    SELECT name, setting, unit, source
      FROM pg_settings
     WHERE name IN ('shared_buffers','effective_cache_size','work_mem','maintenance_work_mem',
                    'max_connections','jit','jit_above_cost','max_parallel_workers_per_gather',
                    'max_parallel_workers','max_worker_processes','random_page_cost',
                    'effective_io_concurrency','shared_preload_libraries')
     ORDER BY name;"
} > "${PASTA}/00-ambiente.txt" 2>&1

# --- 01: tabelas, índices e uso ----------------------------------------------------------
{
  echo "== tamanho das tabelas (dados, índices, total) e linhas estimadas"
  psql_banco -c "
    SELECT c.relname AS tabela,
           c.reltuples::bigint AS linhas_estimadas,
           pg_size_pretty(pg_relation_size(c.oid)) AS dados,
           pg_size_pretty(pg_indexes_size(c.oid)) AS indices,
           pg_size_pretty(pg_total_relation_size(c.oid)) AS total
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND c.relkind = 'r'
     ORDER BY pg_total_relation_size(c.oid) DESC;"
  echo
  echo "== índices existentes"
  psql_banco -c "SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;"
  echo
  echo "== varreduras desde a criação do banco (seq_scan alto em tabela grande = suspeito)"
  psql_banco -c "
    SELECT relname AS tabela, seq_scan, seq_tup_read, idx_scan, n_live_tup,
           last_vacuum, last_autovacuum, last_analyze, last_autoanalyze
      FROM pg_stat_user_tables ORDER BY seq_tup_read DESC;"
  echo
  echo "== banco: sessões, transações, arquivos temporários"
  psql_banco -c "
    SELECT datname, numbackends, sessions, xact_commit, temp_files, pg_size_pretty(temp_bytes) AS temp_bytes
      FROM pg_stat_database WHERE datname = 'loja';"
} > "${PASTA}/01-tabelas-e-indices.txt" 2>&1

# --- 02: planos das consultas das rotas -------------------------------------------------------
explicar() {
  local nome="$1" sql="$2"
  local arquivo="${PASTA}/02-explain-${nome}.txt"
  psql_banco -c "${sql}" >/dev/null 2>&1 || true   # aquecimento
  {
    echo "-- ${nome}"
    echo "-- $(date '+%Y-%m-%d %H:%M:%S %z') · commit ${COMMIT}"
    echo "${sql}"
    echo
    psql_banco -c "EXPLAIN (ANALYZE, BUFFERS, SETTINGS) ${sql}"
  } > "$arquivo" 2>&1
  echo "  ${arquivo}"
}

echo "Gerando planos em ${PASTA}/ ..."

# Valores reais para a rota de pedidos do cliente (cliente 42, como no contrato).
PEDIDO_ID="$(valor "SELECT id FROM pedidos WHERE cliente_id = 42 ORDER BY criado_em DESC, id DESC LIMIT 1;")"
PRODUTO_ID="$(valor "SELECT produto_id FROM itens_pedido WHERE pedido_id = ${PEDIDO_ID} ORDER BY id LIMIT 1;")"

explicar "clientes-id"              "SELECT * FROM clientes WHERE id = 31337"
explicar "clientes-email"           "SELECT * FROM clientes WHERE lower(email) = lower('cliente4@exemplo.com') ORDER BY id"
explicar "pedidos-do-cliente"       "SELECT * FROM pedidos WHERE cliente_id = 42 ORDER BY criado_em DESC, id DESC"
explicar "itens-do-pedido"          "SELECT * FROM itens_pedido WHERE pedido_id = ${PEDIDO_ID} ORDER BY id"
explicar "produto-por-id"           "SELECT * FROM produtos WHERE id = ${PRODUTO_ID}"
explicar "pedidos-status-contagem"  "SELECT count(*) AS total FROM pedidos WHERE status = 'pago'"
explicar "pedidos-status-pagina-1"  "SELECT * FROM pedidos WHERE status = 'pago' ORDER BY criado_em DESC, id DESC LIMIT 20 OFFSET 0"
explicar "pedidos-status-pagina-1000" "SELECT * FROM pedidos WHERE status = 'pago' ORDER BY criado_em DESC, id DESC LIMIT 20 OFFSET 19980"
explicar "busca-cadeira"            "SELECT * FROM produtos WHERE nome ILIKE '%' || 'cadeira' || '%' ORDER BY nome, id LIMIT 20"
explicar "busca-modelo-12"          "SELECT * FROM produtos WHERE nome ILIKE '%' || 'modelo 12' || '%' ORDER BY nome, id LIMIT 20"
explicar "vendas-por-dia-7-dias"    "SELECT p.id AS pedido_id, p.criado_em, p.observacoes, i.quantidade, i.preco_unitario_centavos FROM pedidos p JOIN itens_pedido i ON i.pedido_id = p.id WHERE p.criado_em::date BETWEEN '2024-03-01' AND '2024-03-07' AND p.status <> 'cancelado'"
explicar "top-produtos-10"          "SELECT pr.id, pr.nome, pr.categoria, sum(i.quantidade) AS unidades, sum(i.quantidade * i.preco_unitario_centavos) AS receita_centavos FROM itens_pedido i JOIN pedidos p ON p.id = i.pedido_id JOIN produtos pr ON pr.id = i.produto_id WHERE p.status <> 'cancelado' GROUP BY pr.id, pr.nome, pr.categoria ORDER BY receita_centavos DESC, pr.id LIMIT 10"

echo
echo "Diagnóstico salvo em ${PASTA}/"
echo "Commite com: git add ${PASTA} && git commit -m \"docs(diagnostico): coleta ${COMMIT}\""
