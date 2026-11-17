# Experimentos

Uma linha por ideia **aplicada**. Ideias pesquisadas e não testadas estão em [proximos-testes.md](proximos-testes.md).

- **Parâmetros de carga em todas as medições:** `VUS=20`, `DURACAO=60s`, `AQUECIMENTO=15s`, `SEMENTE=42` (padrão do `scripts/medir.sh`, fixados antes da linha de base e nunca mudados).
- **Máquina:** notebook com AMD Ryzen 5 7520U (8 threads), 7,3 GB de RAM, Windows 11 Pro, Docker Desktop 4.98.0 (engine 29.9.2, Compose v5.6.1); a VM do Docker enxerga 8 CPUs e 3,47 GiB. Limites dos containers: API 0,5 CPU / 256 MB, banco 1 CPU / 512 MB.
- **Como ler:** cada valor é a **mediana** de 3 execuções, com a faixa (mínimo–máximo) entre parênteses. Os números foram consolidados por [`analise/resumir.js`](analise/resumir.js) a partir de `resultados/`, sem digitação manual; a tabela completa está em [`analise/saida/resumo.md`](analise/saida/resumo.md).
- **"Antes"** de cada linha: indicado na coluna. `00` = linha de base; `NN` = mudança anterior.
- **Status:** ✅ aplicada e medida · ➖ aplicada, sem ganho · ❌ aplicada, piorou (revertida)
- **Ruído:** quando as faixas mínimo–máximo de duas séries se sobrepõem, a diferença é tratada como **dentro do ruído**.

| # | Mudança (commit) | Hipótese | Fonte | Antes | p95 (ms) antes → depois | req/s antes → depois | CPU % · memória MiB (API · banco) | Pastas de resultados | Status | Conclusão |
|---|---|---|---|---|---|---|---|---|---|---|
| 00 | Linha de base (`ab12125`) | — | — | — | 45762,9 (42965,7–48595,4) | 1,5 (1,3–1,6) | API 7,5 · 28,6 / banco 98,3 · 389,0 | [1](resultados/20261116-163843-00-linha-de-base) · [2](resultados/20261116-164039-00-linha-de-base) · [3](resultados/20261116-164228-00-linha-de-base) | — | Ponto de partida. Banco perto do teto de 1 CPU; API folgada |
| 01 | `pg.Pool` com `max: 10` (`264c066`) | H01 | [node-postgres: Pooling](https://node-postgres.com/features/pooling) | 00 | 45762,9 → 46024,5 (37295,2–47107,8) | 1,5 → 1,7 (1,3–1,8) | API 8,1 · 32,2 / banco 95,2 · 409,2 | [1](resultados/20261116-171626-01-pool-10) · [2](resultados/20261116-171832-01-pool-10) · [3](resultados/20261116-172015-01-pool-10) | ➖ | Dentro do ruído |
| 01b | `max: 5` (`b6013c1`) | H01 (tamanho) | [HikariCP: About Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) | 00 | 45762,9 → 49659,9 (46702,3–59138,1) | 1,5 → 1,7 (1,3–1,8) | API 6,5 · 26,9 / banco 96,5 · 408,8 | [1](resultados/20261116-172308-01b-pool-5) · [2](resultados/20261116-172449-01b-pool-5) · [3](resultados/20261116-172632-01b-pool-5) | ➖ | Dentro do ruído; erros na mediana 2,40% |
| 01c | `max: 20` (`7da713d`) | H01 (tamanho) | idem | 00 | 45762,9 → 34834,8 (33631,8–37567,2) | 1,5 → 1,7 (1,6–1,9) | API 7,2 · 33,8 / banco 95,9 · 398,8 | [1](resultados/20261116-172911-01c-pool-20) · [2](resultados/20261116-173101-01c-pool-20) · [3](resultados/20261116-173246-01c-pool-20) | ✅ | p95 -24% sobre a base, faixa fora da faixa da base. **Pool escolhido: 20** |

## Limitações conhecidas das medições (declaradas, não escondidas)

- **`contrato.txt` não existe nas séries 00 e 01.** O `scripts/medir.sh` não grava esse arquivo. O contrato foi conferido com `scripts/verificar-contrato.sh comparar` antes de cada série 01 (as 42 respostas iguais às gravadas), mas a saída ficou só no terminal, por isso o `resumir.js` mostra "contrato ausente" nessas séries. A partir da mudança 02, a saída da comparação é gravada como `contrato.txt` em cada pasta de medição. Na linha de base (00), o contrato foi *gravado*, não comparado.
- **"Arquivos alterados sem commit" no `contexto.txt` das séries 00 e 01.** O contador do `medir.sh` conta as pastas de resultados da própria série ainda sem commit. O código e os arquivos de configuração estavam commitados em todas as execuções (campo `commit` de cada `contexto.txt`). A partir da mudança 02, os resultados são commitados após cada execução e o contador começa em 0.
- **`medir.sh` no Git Bash do Windows** só funciona com `MSYS_NO_PATHCONV=1`; os scripts não foram alterados.
- **Poucas execuções:** 3 por série. O p95 por rota, em rotas de baixo peso, oscila muito entre execuções.

## Notas por experimento

### 01 · Pool de conexões (H01), com comparação de tamanho
- **Hipótese:** trocar um `Client` novo por consulta por um `pg.Pool` deve reduzir a latência de todas as rotas, sobretudo `/clientes/:id` e `/clientes/:id/pedidos`, porque cada consulta deixa de abrir uma conexão (um processo novo no PostgreSQL).
- **Evidência que motivou:** [`/clientes/42/pedidos` abre 16–17 conexões por requisição](diagnostico/20261116-164528-1e48069-contar-clientes-42-pedidos.txt); [`/clientes/42` abre 1](diagnostico/20261116-164721-1e48069-contar-clientes-42.txt).
- **O que foi feito:** `api/src/db.js` passou a usar um `Pool` compartilhado. Tamanho testado em três commits: 10, 5 e 20, 3 execuções cada, e o contrato conferido antes de cada série.
- **Contrato:** mantido nas três séries (ver limitação acima sobre o arquivo `contrato.txt`).
- **Resultado e leitura:** com pool de 10 e de 5, a diferença para a linha de base está dentro do ruído (faixas se sobrepõem). Com 20, o p95 geral caiu de 45.763 para 34.835 ms (-24%) e a faixa não toca a da linha de base. O banco continuou perto de 96% de CPU em todas as séries. **Leitura (hipótese, não verificada):** a carga tem 20 usuários virtuais; com pool de 20 nenhuma requisição espera conexão, e com pool menor as requisições formam fila. O ganho é pequeno porque o tempo está nas varreduras sem índice, não na conexão.
- **O que surpreendeu / próximo gargalo revelado:** o pool sozinho quase não moveu o resultado; o banco segue saturado. O gargalo seguinte são as chaves estrangeiras sem índice (H02).
