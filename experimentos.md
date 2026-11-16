# Experimentos

Uma linha por ideia **aplicada**. Ideias pesquisadas e não testadas estão em [proximos-testes.md](proximos-testes.md).

- **Parâmetros de carga em todas as medições:** `VUS=20`, `DURACAO=60s`, `SEMENTE=42` (padrão do `scripts/medir.sh`) <!-- ajustar se escolher outros -->
- **Máquina:** <!-- CPU, RAM, sistema, versão do Docker -->
- **Como ler:** cada valor é a **mediana** de 3 execuções, com a faixa (mínimo–máximo) entre parênteses. Os números foram consolidados por [`analise/resumir.js`](analise/resumir.js) a partir de `resultados/`, sem digitação manual; a tabela completa está em [`analise/saida/resumo.md`](analise/saida/resumo.md).
- **"Antes"** de cada linha: indicado na coluna. `00` = linha de base; `NN` = mudança anterior.
- **Status:** ✅ aplicada e medida · ➖ aplicada, sem ganho · ❌ aplicada, piorou (revertida)

| # | Mudança (commit) | Hipótese | Fonte | Antes | p95 antes → depois | req/s antes → depois | CPU / memória (API · banco) | Pastas de resultados | Status | Conclusão |
|---|---|---|---|---|---|---|---|---|---|---|
| 00 | Linha de base (`abc1234`) | — | — | — | — | — | — | [1](resultados/...) · [2](resultados/...) · [3](resultados/...) | — | Ponto de partida |
| 01 | | | | 00 | | | | | | |

## Notas por experimento

### 01 · <título>
- **Hipótese:** mudar X deve reduzir Y da rota Z, porque W.
- **Evidência que motivou:** [diagnostico/...](diagnostico/...)
- **O que foi feito:** commit `...` (um parágrafo curto).
- **Contrato:** mantido (ver `contrato.txt` das pastas).
- **Resultado e leitura:** o que mudou, se está acima do ruído, e **por que** (mecanismo).
- **O que surpreendeu / próximo gargalo revelado:**
