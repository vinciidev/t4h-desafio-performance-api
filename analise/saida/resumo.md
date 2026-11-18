# Resumo das medições

> Gerado por `analise/resumir.js` em 2026-11-18T04:32:30.796Z a partir de 39 pastas de `resultados/`. Não editar à mão: rode o script de novo.

Valores: **mediana** das execuções de cada rótulo, com a faixa (mínimo–máximo) entre parênteses. Base de comparação: `00-linha-de-base-B`. Parâmetros da base: VUS=20, DURAÇÃO=60s, SEMENTE=undefined.

## Geral

| Rótulo | Exec. | req/s | Δ base | Δ anterior | p95 (ms) | Δ base | Δ anterior | p50 (ms) | p99 (ms) | Erros (%) |
|---|---|---|---|---|---|---|---|---|---|---|
| `00-linha-de-base` | 3 | 1,5 (1,3–1,6) | -14% | — | 45762,9 (42965,7–48595,4) | +26% | — | 2359,9 | 52174,5 | 0,00 |
| `01-pool-10` | 3 | 1,7 (1,3–1,8) | -2% | +14% | 46024,5 (37295,2–47107,8) | +26% ⚠︎ | +1% ⚠︎ | 3053,6 | 54285,9 | 0,00 |
| `01b-pool-5` | 3 | 1,7 (1,3–1,8) | -3% | -1% | 49659,9 (46702,3–59138,1) | +36% | +8% ⚠︎ | 3554,3 | 59989,2 | 2,40 |
| `01c-pool-20` | 3 | 1,7 (1,6–1,9) | -6% | -4% | 34834,8 (33631,8–37567,2) | -4% ⚠︎ | -30% | 2442,7 | 42274,4 | 0,79 |
| `02a-indice-itens-pedido-pedido-id` | 3 | 3,7 (3,7–4,0) | +109% | +124% | 19608,7 (17052,3–21086,1) | -46% | -44% | 1821,5 | 36172,1 | 0,00 |
| `02b-indice-pedidos-cliente-id` | 3 | 4,1 (4,0–4,3) | +130% | +10% | 21803,9 (21285,7–22689,7) | -40% | +11% | 1287,5 | 37028,2 | 0,35 |
| `03-pedidos-cliente-sem-n-mais-1` | 3 | 2,8 (2,2–3,8) | +60% | -31% | 29114,5 (23450,3–40204,2) | -20% ⚠︎ | +34% | 933,2 | 47988,3 | 0,44 |
| `00-linha-de-base-B` | 3 | 1,8 (1,8–1,8) | — | -37% | 36404,2 (35229,9–39105,5) | — | +25% ⚠︎ | 2307,5 | 45158,9 | 0,75 |
| `01c-pool-20-B` | 3 | 2,0 (1,9–2,1) | +13% | +13% | 32815,2 (28093,1–36401,9) | -10% ⚠︎ | -10% ⚠︎ | 2050,7 | 43114,6 | 0,00 |
| `02a-indice-itens-pedido-pedido-id-B` | 3 | 3,8 (2,8–4,4) | +116% | +91% | 22465,4 (18073,5–29623,1) | -38% | -32% ⚠︎ | 1748,3 | 30186,8 | 0,00 |
| `02b-indice-pedidos-cliente-id-B` | 3 | 4,8 (4,3–4,9) | +171% | +25% | 18516,3 (16942,5–24697,2) | -49% | -18% ⚠︎ | 1011,8 | 37856,4 | 0,00 |
| `03-pedidos-cliente-sem-n-mais-1-B` | 3 | 4,3 (4,2–5,7) | +141% | -11% | 20597,2 (16132,9–21874,5) | -43% | +11% ⚠︎ | 788,8 | 38788,0 | 0,30 |
| `04-indice-clientes-email-lower-B` | 3 | 5,2 (5,2–5,8) | +195% | +23% | 15888,0 (14548,6–19359,7) | -56% | -23% ⚠︎ | 491,5 | 30976,4 | 0,24 |

⚠︎ = as faixas mínimo–máximo das execuções se sobrepõem: a diferença pode estar dentro do ruído.

## Recursos (mediana das médias durante a carga)

| Rótulo | CPU api (%)  | Mem api (MiB) | Limite api | CPU banco (%)  | Mem banco (MiB) | Limite banco |
|---|---|---|---|---|---|---|
| `00-linha-de-base` | 7,5 | 28,6 | 0,50 CPU / 256 MiB | 98,3 | 389,0 | 1,00 CPU / 512 MiB |
| `01-pool-10` | 8,1 | 32,2 | 0,50 CPU / 256 MiB | 95,2 | 409,2 | 1,00 CPU / 512 MiB |
| `01b-pool-5` | 6,5 | 26,9 | 0,50 CPU / 256 MiB | 96,5 | 408,8 | 1,00 CPU / 512 MiB |
| `01c-pool-20` | 7,2 | 33,8 | 0,50 CPU / 256 MiB | 95,9 | 398,8 | 1,00 CPU / 512 MiB |
| `02a-indice-itens-pedido-pedido-id` | 11,1 | 50,0 | 0,50 CPU / 256 MiB | 99,2 | 402,3 | 1,00 CPU / 512 MiB |
| `02b-indice-pedidos-cliente-id` | 13,1 | 63,6 | 0,50 CPU / 256 MiB | 96,4 | 403,1 | 1,00 CPU / 512 MiB |
| `03-pedidos-cliente-sem-n-mais-1` | 12,6 | 58,8 | 0,50 CPU / 256 MiB | 97,7 | 401,0 | 1,00 CPU / 512 MiB |
| `00-linha-de-base-B` | 7,8 | 29,1 | 0,50 CPU / 256 MiB | 97,4 | 402,0 | 1,00 CPU / 512 MiB |
| `01c-pool-20-B` | 7,1 | 39,9 | 0,50 CPU / 256 MiB | 97,9 | 398,7 | 1,00 CPU / 512 MiB |
| `02a-indice-itens-pedido-pedido-id-B` | 13,4 | 58,4 | 0,50 CPU / 256 MiB | 97,5 | 403,4 | 1,00 CPU / 512 MiB |
| `02b-indice-pedidos-cliente-id-B` | 14,6 | 62,4 | 0,50 CPU / 256 MiB | 96,9 | 406,2 | 1,00 CPU / 512 MiB |
| `03-pedidos-cliente-sem-n-mais-1-B` | 13,1 | 69,8 | 0,50 CPU / 256 MiB | 97,9 | 412,2 | 1,00 CPU / 512 MiB |
| `04-indice-clientes-email-lower-B` | 16,0 | 66,7 | 0,50 CPU / 256 MiB | 97,3 | 403,7 | 1,00 CPU / 512 MiB |

CPU: 100% = 1 CPU inteira (convenção do `docker stats`). Um container perto do próprio limite de CPU está saturado.

## p95 por rota (ms)

| Rótulo | cliente | pedidos-do-cliente | cliente-por-email | pedidos-por-status | busca-produtos | vendas-por-dia | top-produtos |
|---|---|---|---|---|---|---|---|
| `00-linha-de-base` | 1090,7 | 52183,8 | 4597,0 | 30521,2 | 2402,7 | 25135,8 | 36802,5 |
| `01-pool-10` | 2209,7 | 54590,1 | 6883,1 | 18107,7 | 3485,2 | 15759,7 | 26693,5 |
| `01b-pool-5` | 3812,4 | 59989,4 | 5022,1 | 10317,9 | 3910,0 | 9069,9 | 28406,7 |
| `01c-pool-20` | 673,2 | 39999,5 | 3693,6 | 31951,8 | 2673,0 | 25743,2 | 60003,5 |
| `02a-indice-itens-pedido-pedido-id` | 485,1 | 8095,9 | 3411,3 | 20975,3 | 1890,3 | 33715,2 | 57586,2 |
| `02b-indice-pedidos-cliente-id` | 424,7 | 2593,5 | 3441,5 | 24493,3 | 1958,7 | 34146,0 | 58474,7 |
| `03-pedidos-cliente-sem-n-mais-1` | 778,8 | 1290,3 | 3911,8 | 39883,1 | 2368,1 | 44575,1 | 58117,0 |
| `00-linha-de-base-B` | 942,5 | 44132,7 | 4187,7 | 27094,6 | 1996,5 | 22729,2 | 60001,0 |
| `01c-pool-20-B` | 504,0 | 39291,9 | 3385,8 | 40614,2 | 1299,0 | 19287,4 | 45200,5 |
| `02a-indice-itens-pedido-pedido-id-B` | 605,7 | 9404,4 | 2408,4 | 25550,4 | 1745,8 | 30083,1 | 37966,7 |
| `02b-indice-pedidos-cliente-id-B` | 813,5 | 2356,8 | 2677,8 | 17440,7 | 1424,3 | 31543,7 | 43666,0 |
| `03-pedidos-cliente-sem-n-mais-1-B` | 823,4 | 1190,3 | 3211,4 | 21796,8 | 2216,5 | 36243,3 | 56623,3 |
| `04-indice-clientes-email-lower-B` | 467,1 | 1041,0 | 674,8 | 17694,3 | 1356,4 | 31067,9 | 56551,0 |

Rotas lentas têm poucas requisições por execução: o p95 por rota oscila mais que o geral.

## Execuções por rótulo

- `00-linha-de-base` (commit ?): [20261116-163843-00-linha-de-base](../../resultados/20261116-163843-00-linha-de-base/resumo.txt) · [20261116-164039-00-linha-de-base](../../resultados/20261116-164039-00-linha-de-base/resumo.txt) · [20261116-164228-00-linha-de-base](../../resultados/20261116-164228-00-linha-de-base/resumo.txt)
- `01-pool-10` (commit ?): [20261116-171626-01-pool-10](../../resultados/20261116-171626-01-pool-10/resumo.txt) · [20261116-171832-01-pool-10](../../resultados/20261116-171832-01-pool-10/resumo.txt) · [20261116-172015-01-pool-10](../../resultados/20261116-172015-01-pool-10/resumo.txt)
- `01b-pool-5` (commit ?): [20261116-172308-01b-pool-5](../../resultados/20261116-172308-01b-pool-5/resumo.txt) · [20261116-172449-01b-pool-5](../../resultados/20261116-172449-01b-pool-5/resumo.txt) · [20261116-172632-01b-pool-5](../../resultados/20261116-172632-01b-pool-5/resumo.txt)
- `01c-pool-20` (commit ?): [20261116-172911-01c-pool-20](../../resultados/20261116-172911-01c-pool-20/resumo.txt) · [20261116-173101-01c-pool-20](../../resultados/20261116-173101-01c-pool-20/resumo.txt) · [20261116-173246-01c-pool-20](../../resultados/20261116-173246-01c-pool-20/resumo.txt)
- `02a-indice-itens-pedido-pedido-id` (commit ?): [20261116-230525-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230525-02a-indice-itens-pedido-pedido-id/resumo.txt) · [20261116-230722-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230722-02a-indice-itens-pedido-pedido-id/resumo.txt) · [20261116-230917-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230917-02a-indice-itens-pedido-pedido-id/resumo.txt)
- `02b-indice-pedidos-cliente-id` (commit ?): [20261116-231411-02b-indice-pedidos-cliente-id](../../resultados/20261116-231411-02b-indice-pedidos-cliente-id/resumo.txt) · [20261116-231609-02b-indice-pedidos-cliente-id](../../resultados/20261116-231609-02b-indice-pedidos-cliente-id/resumo.txt) · [20261116-231801-02b-indice-pedidos-cliente-id](../../resultados/20261116-231801-02b-indice-pedidos-cliente-id/resumo.txt)
- `03-pedidos-cliente-sem-n-mais-1` (commit ?): [20261116-233459-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233459-03-pedidos-cliente-sem-n-mais-1/resumo.txt) · [20261116-233700-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233700-03-pedidos-cliente-sem-n-mais-1/resumo.txt) · [20261116-233931-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233931-03-pedidos-cliente-sem-n-mais-1/resumo.txt)
- `00-linha-de-base-B` (commit 3e2a6c9): [20261117-234931-00-linha-de-base-B](../../resultados/20261117-234931-00-linha-de-base-B/resumo.txt) · [20261117-235149-00-linha-de-base-B](../../resultados/20261117-235149-00-linha-de-base-B/resumo.txt) · [20261117-235352-00-linha-de-base-B](../../resultados/20261117-235352-00-linha-de-base-B/resumo.txt)
- `01c-pool-20-B` (commit e538f71): [20261117-235903-01c-pool-20-B](../../resultados/20261117-235903-01c-pool-20-B/resumo.txt) · [20261118-000102-01c-pool-20-B](../../resultados/20261118-000102-01c-pool-20-B/resumo.txt) · [20261118-000259-01c-pool-20-B](../../resultados/20261118-000259-01c-pool-20-B/resumo.txt)
- `02a-indice-itens-pedido-pedido-id-B` (commit 7b68209): [20261118-002526-02a-indice-itens-pedido-pedido-id-B](../../resultados/20261118-002526-02a-indice-itens-pedido-pedido-id-B/resumo.txt) · [20261118-002729-02a-indice-itens-pedido-pedido-id-B](../../resultados/20261118-002729-02a-indice-itens-pedido-pedido-id-B/resumo.txt) · [20261118-002924-02a-indice-itens-pedido-pedido-id-B](../../resultados/20261118-002924-02a-indice-itens-pedido-pedido-id-B/resumo.txt)
- `02b-indice-pedidos-cliente-id-B` (commit 6ac55d3): [20261118-003225-02b-indice-pedidos-cliente-id-B](../../resultados/20261118-003225-02b-indice-pedidos-cliente-id-B/resumo.txt) · [20261118-003412-02b-indice-pedidos-cliente-id-B](../../resultados/20261118-003412-02b-indice-pedidos-cliente-id-B/resumo.txt) · [20261118-003558-02b-indice-pedidos-cliente-id-B](../../resultados/20261118-003558-02b-indice-pedidos-cliente-id-B/resumo.txt)
- `03-pedidos-cliente-sem-n-mais-1-B` (commit 014d4dc): [20261118-010222-03-pedidos-cliente-sem-n-mais-1-B](../../resultados/20261118-010222-03-pedidos-cliente-sem-n-mais-1-B/resumo.txt) · [20261118-010425-03-pedidos-cliente-sem-n-mais-1-B](../../resultados/20261118-010425-03-pedidos-cliente-sem-n-mais-1-B/resumo.txt) · [20261118-010621-03-pedidos-cliente-sem-n-mais-1-B](../../resultados/20261118-010621-03-pedidos-cliente-sem-n-mais-1-B/resumo.txt)
- `04-indice-clientes-email-lower-B` (commit ef8d217): [20261118-012627-04-indice-clientes-email-lower-B](../../resultados/20261118-012627-04-indice-clientes-email-lower-B/resumo.txt) · [20261118-012814-04-indice-clientes-email-lower-B](../../resultados/20261118-012814-04-indice-clientes-email-lower-B/resumo.txt) · [20261118-013006-04-indice-clientes-email-lower-B](../../resultados/20261118-013006-04-indice-clientes-email-lower-B/resumo.txt)

## Avisos

- `00-linha-de-base`: arquivos sem commit (ou sem git) em: 20261116-163843-00-linha-de-base, 20261116-164039-00-linha-de-base, 20261116-164228-00-linha-de-base
- `00-linha-de-base`: contrato não mantido em: 20261116-163843-00-linha-de-base (ausente), 20261116-164039-00-linha-de-base (ausente), 20261116-164228-00-linha-de-base (ausente)
- `00-linha-de-base`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `01-pool-10`: arquivos sem commit (ou sem git) em: 20261116-171626-01-pool-10, 20261116-171832-01-pool-10, 20261116-172015-01-pool-10
- `01-pool-10`: contrato não mantido em: 20261116-171626-01-pool-10 (ausente), 20261116-171832-01-pool-10 (ausente), 20261116-172015-01-pool-10 (ausente)
- `01-pool-10`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `01b-pool-5`: arquivos sem commit (ou sem git) em: 20261116-172308-01b-pool-5, 20261116-172449-01b-pool-5, 20261116-172632-01b-pool-5
- `01b-pool-5`: contrato não mantido em: 20261116-172308-01b-pool-5 (ausente), 20261116-172449-01b-pool-5 (ausente), 20261116-172632-01b-pool-5 (ausente)
- `01b-pool-5`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `01c-pool-20`: arquivos sem commit (ou sem git) em: 20261116-172911-01c-pool-20, 20261116-173101-01c-pool-20, 20261116-173246-01c-pool-20
- `01c-pool-20`: contrato não mantido em: 20261116-172911-01c-pool-20 (ausente), 20261116-173101-01c-pool-20 (ausente), 20261116-173246-01c-pool-20 (ausente)
- `01c-pool-20`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `02a-indice-itens-pedido-pedido-id`: arquivos sem commit (ou sem git) em: 20261116-230525-02a-indice-itens-pedido-pedido-id, 20261116-230722-02a-indice-itens-pedido-pedido-id, 20261116-230917-02a-indice-itens-pedido-pedido-id
- `02a-indice-itens-pedido-pedido-id`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `02b-indice-pedidos-cliente-id`: arquivos sem commit (ou sem git) em: 20261116-231411-02b-indice-pedidos-cliente-id, 20261116-231609-02b-indice-pedidos-cliente-id, 20261116-231801-02b-indice-pedidos-cliente-id
- `02b-indice-pedidos-cliente-id`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `03-pedidos-cliente-sem-n-mais-1`: arquivos sem commit (ou sem git) em: 20261116-233459-03-pedidos-cliente-sem-n-mais-1, 20261116-233700-03-pedidos-cliente-sem-n-mais-1, 20261116-233931-03-pedidos-cliente-sem-n-mais-1
- `03-pedidos-cliente-sem-n-mais-1`: parâmetros de carga diferentes da base ({} vs {"vus":"20","duracao":"60s"}): comparação inválida
- `00-linha-de-base-B`: arquivos sem commit (ou sem git) em: 20261117-234931-00-linha-de-base-B, 20261117-235149-00-linha-de-base-B, 20261117-235352-00-linha-de-base-B
- `01c-pool-20-B`: arquivos sem commit (ou sem git) em: 20261117-235903-01c-pool-20-B, 20261118-000102-01c-pool-20-B, 20261118-000259-01c-pool-20-B
- `02a-indice-itens-pedido-pedido-id-B`: arquivos sem commit (ou sem git) em: 20261118-002526-02a-indice-itens-pedido-pedido-id-B, 20261118-002729-02a-indice-itens-pedido-pedido-id-B, 20261118-002924-02a-indice-itens-pedido-pedido-id-B
- `02b-indice-pedidos-cliente-id-B`: arquivos sem commit (ou sem git) em: 20261118-003225-02b-indice-pedidos-cliente-id-B, 20261118-003412-02b-indice-pedidos-cliente-id-B, 20261118-003558-02b-indice-pedidos-cliente-id-B
- `03-pedidos-cliente-sem-n-mais-1-B`: arquivos sem commit (ou sem git) em: 20261118-010222-03-pedidos-cliente-sem-n-mais-1-B, 20261118-010425-03-pedidos-cliente-sem-n-mais-1-B, 20261118-010621-03-pedidos-cliente-sem-n-mais-1-B
- `04-indice-clientes-email-lower-B`: arquivos sem commit (ou sem git) em: 20261118-012627-04-indice-clientes-email-lower-B, 20261118-012814-04-indice-clientes-email-lower-B, 20261118-013006-04-indice-clientes-email-lower-B
