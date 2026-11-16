#!/usr/bin/env bash
# Conta quantas conexões (sessões) e transações uma única requisição abre no PostgreSQL.
# Serve para provar o padrão "uma conexão nova por consulta" e o N+1.
#
#   diagnostico/contar-consultas.sh /clientes/42/pedidos
#   REPETICOES=5 diagnostico/contar-consultas.sh "/pedidos?status=pago&pagina=3"
#
# Como funciona: lê pg_stat_database (sessions, xact_commit) antes e depois da requisição.
# As leituras do próprio psql também contam, então o script calibra primeiro com /saude
# (rota que não toca no banco) e desconta essa diferença.
#
# Limites (declarar se citar o resultado):
# - Outras atividades no banco ao mesmo tempo (autovacuum, outra carga) somam ruído:
#   rode com a carga parada e veja se as repetições batem.
# - Conexão que continua aberta (pool) só publica as estatísticas depois de ficar ociosa
#   por alguns segundos; por isso a espera (ESPERA, padrão 12 s) antes da segunda leitura.
# - Em transação única com várias consultas, xact_commit conta 1; aqui a API original
#   faz uma transação por consulta, então xact_commit ≈ número de consultas.

set -euo pipefail
cd "$(dirname "$0")/.."

CAMINHO="${1:-}"
if [[ -z "$CAMINHO" || "${CAMINHO:0:1}" != "/" ]]; then
  echo "uso: diagnostico/contar-consultas.sh /caminho?da=rota" >&2
  exit 2
fi

PORTA_API="${PORTA_API:-3000}"
REPETICOES="${REPETICOES:-3}"
ESPERA="${ESPERA:-12}"
URL_BASE="http://127.0.0.1:${PORTA_API}"

if ! curl -fsS "${URL_BASE}/saude" >/dev/null 2>&1; then
  echo "A API não respondeu em ${URL_BASE}/saude. Suba tudo com: docker compose up -d --build" >&2
  exit 1
fi

estatisticas() {
  docker compose exec -T banco psql -U loja -d loja -X -tA -F ' ' \
    -c "SELECT sessions, xact_commit + xact_rollback FROM pg_stat_database WHERE datname = 'loja';"
}

# Mede um caminho: imprime "sessoes transacoes tempo_s bytes"
medir() {
  local caminho="$1" antes depois s0 t0 s1 t1 saida
  sleep "$ESPERA"
  antes="$(estatisticas)"; read -r s0 t0 <<<"$antes"
  saida="$(curl -sS -o /dev/null -w '%{time_total} %{size_download} %{http_code}' "${URL_BASE}${caminho}")"
  sleep "$ESPERA"
  depois="$(estatisticas)"; read -r s1 t1 <<<"$depois"
  echo "$((s1 - s0)) $((t1 - t0)) ${saida}"
}

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo sem-git)"
NOME="$(echo "$CAMINHO" | tr -c 'A-Za-z0-9' '-' | sed 's/-\{2,\}/-/g; s/^-//; s/-$//')"
ARQUIVO="diagnostico/$(date +%Y%m%d-%H%M%S)-${COMMIT}-contar-${NOME}.txt"
mkdir -p diagnostico

echo "Calibrando com /saude e medindo ${CAMINHO} (${REPETICOES}x, ~$((ESPERA * 2 * (REPETICOES + 1)))s)..."

read -r cal_s cal_t _ _ _ <<<"$(medir /saude)"

{
  echo "rota: ${CAMINHO}"
  echo "data: $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "commit: ${COMMIT}"
  echo "método: delta de pg_stat_database (sessions, xact_commit + xact_rollback) em torno de 1 requisição,"
  echo "        descontada a calibração com /saude (sessões=${cal_s}, transações=${cal_t})."
  echo
  printf '%-10s %-16s %-16s %-12s %-10s %-6s\n' "execução" "conexões_novas" "transações" "tempo_s" "bytes" "http"
  for i in $(seq 1 "$REPETICOES"); do
    read -r s t tempo bytes http <<<"$(medir "$CAMINHO")"
    printf '%-10s %-16s %-16s %-12s %-10s %-6s\n' "$i" "$((s - cal_s))" "$((t - cal_t))" "$tempo" "$bytes" "$http"
  done
} | tee "$ARQUIVO"

echo
echo "Salvo em ${ARQUIVO}"
