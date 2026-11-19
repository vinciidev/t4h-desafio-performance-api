# Resumo das medições

> Gerado por `analise/resumir.js` em 2026-11-19T02:55:24.545Z a partir de 66 pastas de `resultados/`. Não editar à mão: rode o script de novo.

Valores: **mediana** das execuções de cada rótulo, com a faixa (mínimo–máximo) entre parênteses. Base de comparação: `00-linha-de-base`. Parâmetros da base: VUS=undefined, DURAÇÃO=undefined, SEMENTE=undefined.

## Geral

| Rótulo | Exec. | req/s | Δ base | Δ anterior | p95 (ms) | Δ base | Δ anterior | p50 (ms) | p99 (ms) | Erros (%) |
|---|---|---|---|---|---|---|---|---|---|---|
| `00-linha-de-base` | 3 | 1,5 (1,3–1,6) | — | — | 45762,9 (42965,7–48595,4) | — | — | 2359,9 | 52174,5 | 0,00 |
| `01-pool-10` | 3 | 1,7 (1,3–1,8) | +14% | +14% | 46024,5 (37295,2–47107,8) | +1% ⚠︎ | +1% ⚠︎ | 3053,6 | 54285,9 | 0,00 |
| `01b-pool-5` | 3 | 1,7 (1,3–1,8) | +13% | -1% | 49659,9 (46702,3–59138,1) | +9% ⚠︎ | +8% ⚠︎ | 3554,3 | 59989,2 | 2,40 |
| `01c-pool-20` | 3 | 1,7 (1,6–1,9) | +8% | -4% | 34834,8 (33631,8–37567,2) | -24% | -30% | 2442,7 | 42274,4 | 0,79 |
| `02a-indice-itens-pedido-pedido-id` | 3 | 3,7 (3,7–4,0) | +143% | +124% | 19608,7 (17052,3–21086,1) | -57% | -44% | 1821,5 | 36172,1 | 0,00 |
| `02b-indice-pedidos-cliente-id` | 3 | 4,1 (4,0–4,3) | +167% | +10% | 21803,9 (21285,7–22689,7) | -52% | +11% | 1287,5 | 37028,2 | 0,35 |
| `03-pedidos-cliente-sem-n-mais-1` | 3 | 2,8 (2,2–3,8) | +85% | -31% | 29114,5 (23450,3–40204,2) | -36% | +34% | 933,2 | 47988,3 | 0,44 |
| `00-linha-de-base-B` | 3 | 1,8 (1,8–1,8) | +16% | -37% | 36404,2 (35229,9–39105,5) | -20% | +25% ⚠︎ | 2307,5 | 45158,9 | 0,75 |
| `01c-pool-20-B` | 3 | 2,0 (1,9–2,1) | +31% | +13% | 32815,2 (28093,1–36401,9) | -28% | -10% ⚠︎ | 2050,7 | 43114,6 | 0,00 |
| `02a-indice-itens-pedido-pedido-id-B` | 3 | 3,8 (2,8–4,4) | +151% | +91% | 22465,4 (18073,5–29623,1) | -51% | -32% ⚠︎ | 1748,3 | 30186,8 | 0,00 |
| `02b-indice-pedidos-cliente-id-B` | 3 | 4,8 (4,3–4,9) | +214% | +25% | 18516,3 (16942,5–24697,2) | -60% | -18% ⚠︎ | 1011,8 | 37856,4 | 0,00 |
| `03-pedidos-cliente-sem-n-mais-1-B` | 3 | 4,3 (4,2–5,7) | +179% | -11% | 20597,2 (16132,9–21874,5) | -55% | +11% ⚠︎ | 788,8 | 38788,0 | 0,30 |
| `04-indice-clientes-email-lower-B` | 3 | 5,2 (5,2–5,8) | +242% | +23% | 15888,0 (14548,6–19359,7) | -65% | -23% ⚠︎ | 491,5 | 30976,4 | 0,24 |
| `06-indice-pedidos-status-B` | 3 | 10,1 (10,0–10,3) | +563% | +94% | 11116,4 (10275,6–13107,1) | -76% | -30% | 393,6 | 25184,9 | 0,00 |
| `11a-api-cpu-035-B` | 3 | 11,2 (9,6–11,6) | +635% | +11% | 9071,3 (9052,2–10004,0) | -80% | -18% | 382,1 | 18309,1 | 0,00 |
| `11b-api-cpu-025-B` | 3 | 11,1 (10,3–11,6) | +627% | -1% | 9210,7 (8318,8–10235,9) | -80% | +2% ⚠︎ | 487,5 | 18194,4 | 0,00 |
| `11c-api-mem-128-B` | 3 | 11,4 (10,3–11,5) | +645% | +2% | 8209,5 (8115,0–9553,0) | -82% | -11% ⚠︎ | 503,4 | 17319,7 | 0,00 |
| `11d-api-cpu-035-mem-128-B` | 3 | 11,5 (9,4–12,1) | +654% | +1% | 9920,2 (8689,4–12183,3) | -78% | +21% ⚠︎ | 382,7 | 18970,1 | 0,00 |
| `12-controle-B` | 3 | 6,6 (4,5–6,9) | +336% | -42% | 13737,2 (11303,3–22105,3) | -70% | +38% ⚠︎ | 816,7 | 28064,7 | 0,00 |
| `12a-vendas-por-dia-indice-B` | 3 | 5,6 (1,7–7,5) | +268% | -16% | 14462,4 (8216,2–55254,4) | -68% ⚠︎ | +5% ⚠︎ | 579,1 | 36797,9 | 0,40 |
| `12b-top-produtos-reescrita-B` | 3 | 15,1 (12,9–17,0) | +892% | +170% | 5120,6 (3985,4–6190,6) | -89% | -65% | 396,4 | 16175,6 | 0,00 |
| `12c-controle-sem-top-produtos-B` | 3 | 12,2 (9,3–12,4) | +703% | -19% | 7955,6 (7262,1–9239,8) | -83% | +55% | 401,3 | 19283,0 | 0,00 |

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
| `06-indice-pedidos-status-B` | 20,0 | 67,3 | 0,50 CPU / 256 MiB | 96,8 | 429,4 | 1,00 CPU / 512 MiB |
| `11a-api-cpu-035-B` | 18,7 | 71,4 | 0,35 CPU / 256 MiB | 94,6 | 423,5 | 1,00 CPU / 512 MiB |
| `11b-api-cpu-025-B` | 17,6 | 65,5 | 0,25 CPU / 256 MiB | 96,5 | 432,5 | 1,00 CPU / 512 MiB |
| `11c-api-mem-128-B` | 18,2 | 67,8 | 0,25 CPU / 128 MiB | 97,3 | 432,2 | 1,00 CPU / 512 MiB |
| `11d-api-cpu-035-mem-128-B` | 20,4 | 63,4 | 0,35 CPU / 128 MiB | 98,2 | 426,4 | 1,00 CPU / 512 MiB |
| `12-controle-B` | 23,6 | 60,4 | 0,35 CPU / 128 MiB | 95,0 | 427,6 | 1,00 CPU / 512 MiB |
| `12a-vendas-por-dia-indice-B` | 20,7 | 48,8 | 0,35 CPU / 128 MiB | 97,7 | 415,1 | 1,00 CPU / 512 MiB |
| `12b-top-produtos-reescrita-B` | 24,9 | 55,7 | 0,35 CPU / 128 MiB | 94,2 | 429,2 | 1,00 CPU / 512 MiB |
| `12c-controle-sem-top-produtos-B` | 21,3 | 57,4 | 0,35 CPU / 128 MiB | 90,7 | 423,2 | 1,00 CPU / 512 MiB |

CPU: 100% = 1 CPU inteira (convenção do `docker stats`). Um container perto do próprio limite de CPU está saturado.

## CPU gasta por requisição (ms de CPU por requisição)

| Rótulo | api (ms/req) | banco (ms/req) | Δ banco vs base |
|---|---|---|---|
| `00-linha-de-base` | 54,4 | 645,5 | — |
| `01-pool-10` | 47,9 | 548,9 | -15% |
| `01b-pool-5` | 39,0 | 547,5 | -15% |
| `01c-pool-20` | 43,5 | 570,5 | -12% |
| `02a-indice-itens-pedido-pedido-id` | 27,8 | 260,4 | -60% |
| `02b-indice-pedidos-cliente-id` | 32,2 | 233,5 | -64% |
| `03-pedidos-cliente-sem-n-mais-1` | 45,3 | 347,4 | -46% |
| `00-linha-de-base-B` | 44,5 | 555,8 | -14% |
| `01c-pool-20-B` | 33,1 | 456,3 | -29% |
| `02a-indice-itens-pedido-pedido-id-B` | 30,2 | 220,1 | -66% |
| `02b-indice-pedidos-cliente-id-B` | 31,6 | 201,1 | -69% |
| `03-pedidos-cliente-sem-n-mais-1-B` | 30,8 | 228,8 | -65% |
| `04-indice-clientes-email-lower-B` | 30,9 | 184,0 | -71% |
| `06-indice-pedidos-status-B` | 20,1 | 95,7 | -85% |
| `11a-api-cpu-035-B` | 18,1 | 84,3 | -87% |
| `11b-api-cpu-025-B` | 15,9 | 88,0 | -86% |
| `11c-api-mem-128-B` | 15,8 | 85,6 | -87% |
| `11d-api-cpu-035-mem-128-B` | 17,7 | 85,3 | -87% |
| `12-controle-B` | 38,7 | 140,8 | -78% |
| `12a-vendas-por-dia-indice-B` | 48,1 | 168,8 | -74% |
| `12b-top-produtos-reescrita-B` | 14,7 | 64,6 | -90% |
| `12c-controle-sem-top-produtos-B` | 17,1 | 74,0 | -89% |

Calculado por execução como (CPU média ÷ 100) ÷ req/s × 1000 e depois mediana. É uma aproximação: o CPU vem do `docker stats` amostrado durante a carga. Mostra quanto trabalho de CPU cada requisição custa; é a medida de "mais barato de rodar" quando o limite de CPU está saturado.

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
| `06-indice-pedidos-status-B` | 381,1 | 887,5 | 680,2 | 12914,7 | 1240,2 | 18182,2 | 36842,7 |
| `11a-api-cpu-035-B` | 492,3 | 1002,0 | 993,5 | 12006,3 | 1379,8 | 14061,7 | 28670,2 |
| `11b-api-cpu-025-B` | 1239,1 | 1811,2 | 1109,1 | 11441,1 | 1603,7 | 13528,9 | 29367,4 |
| `11c-api-mem-128-B` | 1203,2 | 2612,9 | 1226,7 | 12200,6 | 2079,3 | 15760,0 | 27582,2 |
| `11d-api-cpu-035-mem-128-B` | 486,5 | 997,7 | 955,5 | 12453,0 | 1156,1 | 14381,9 | 37176,8 |
| `12-controle-B` | 2716,8 | 4484,4 | 2405,5 | 17309,4 | 4143,9 | 20466,5 | 48644,4 |
| `12a-vendas-por-dia-indice-B` | 1977,1 | 3828,9 | 3636,5 | 33356,4 | 3231,0 | 18222,2 | 42536,3 |
| `12b-top-produtos-reescrita-B` | 812,9 | 1306,1 | 1056,9 | 11670,4 | 1223,5 | 7892,6 | 24783,8 |
| `12c-controle-sem-top-produtos-B` | 820,5 | 1610,8 | 1002,5 | 14873,4 | 1598,2 | 13162,7 | 28849,9 |

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
- `06-indice-pedidos-status-B` (commit a8050f5): [20261118-013722-06-indice-pedidos-status-B](../../resultados/20261118-013722-06-indice-pedidos-status-B/resumo.txt) · [20261118-013859-06-indice-pedidos-status-B](../../resultados/20261118-013859-06-indice-pedidos-status-B/resumo.txt) · [20261118-014038-06-indice-pedidos-status-B](../../resultados/20261118-014038-06-indice-pedidos-status-B/resumo.txt)
- `11a-api-cpu-035-B` (commit 01b97c9): [20261118-065626-11a-api-cpu-035-B](../../resultados/20261118-065626-11a-api-cpu-035-B/resumo.txt) · [20261118-065809-11a-api-cpu-035-B](../../resultados/20261118-065809-11a-api-cpu-035-B/resumo.txt) · [20261118-065953-11a-api-cpu-035-B](../../resultados/20261118-065953-11a-api-cpu-035-B/resumo.txt)
- `11b-api-cpu-025-B` (commit c8d9c74): [20261118-070317-11b-api-cpu-025-B](../../resultados/20261118-070317-11b-api-cpu-025-B/resumo.txt) · [20261118-070457-11b-api-cpu-025-B](../../resultados/20261118-070457-11b-api-cpu-025-B/resumo.txt) · [20261118-070640-11b-api-cpu-025-B](../../resultados/20261118-070640-11b-api-cpu-025-B/resumo.txt)
- `11c-api-mem-128-B` (commit d50aaa0): [20261118-071003-11c-api-mem-128-B](../../resultados/20261118-071003-11c-api-mem-128-B/resumo.txt) · [20261118-071142-11c-api-mem-128-B](../../resultados/20261118-071142-11c-api-mem-128-B/resumo.txt) · [20261118-071323-11c-api-mem-128-B](../../resultados/20261118-071323-11c-api-mem-128-B/resumo.txt)
- `11d-api-cpu-035-mem-128-B` (commit 97e48c0): [20261118-071632-11d-api-cpu-035-mem-128-B](../../resultados/20261118-071632-11d-api-cpu-035-mem-128-B/resumo.txt) · [20261118-071809-11d-api-cpu-035-mem-128-B](../../resultados/20261118-071809-11d-api-cpu-035-mem-128-B/resumo.txt) · [20261118-071948-11d-api-cpu-035-mem-128-B](../../resultados/20261118-071948-11d-api-cpu-035-mem-128-B/resumo.txt)
- `12-controle-B` (commit 29f1ac2): [20261118-195014-12-controle-B](../../resultados/20261118-195014-12-controle-B/resumo.txt) · [20261118-195208-12-controle-B](../../resultados/20261118-195208-12-controle-B/resumo.txt) · [20261118-195419-12-controle-B](../../resultados/20261118-195419-12-controle-B/resumo.txt)
- `12a-vendas-por-dia-indice-B` (commit 7001f29): [20261118-195723-12a-vendas-por-dia-indice-B](../../resultados/20261118-195723-12a-vendas-por-dia-indice-B/resumo.txt) · [20261118-195939-12a-vendas-por-dia-indice-B](../../resultados/20261118-195939-12a-vendas-por-dia-indice-B/resumo.txt) · [20261118-200233-12a-vendas-por-dia-indice-B](../../resultados/20261118-200233-12a-vendas-por-dia-indice-B/resumo.txt)
- `12b-top-produtos-reescrita-B` (commit 9bb0f72): [20261118-234331-12b-top-produtos-reescrita-B](../../resultados/20261118-234331-12b-top-produtos-reescrita-B/resumo.txt) · [20261118-234508-12b-top-produtos-reescrita-B](../../resultados/20261118-234508-12b-top-produtos-reescrita-B/resumo.txt) · [20261118-234642-12b-top-produtos-reescrita-B](../../resultados/20261118-234642-12b-top-produtos-reescrita-B/resumo.txt)
- `12c-controle-sem-top-produtos-B` (commit 7001f29): [20261118-235003-12c-controle-sem-top-produtos-B](../../resultados/20261118-235003-12c-controle-sem-top-produtos-B/resumo.txt) · [20261118-235208-12c-controle-sem-top-produtos-B](../../resultados/20261118-235208-12c-controle-sem-top-produtos-B/resumo.txt) · [20261118-235350-12c-controle-sem-top-produtos-B](../../resultados/20261118-235350-12c-controle-sem-top-produtos-B/resumo.txt)

## Avisos

- `00-linha-de-base`: arquivos sem commit (ou sem git) em: 20261116-163843-00-linha-de-base, 20261116-164039-00-linha-de-base, 20261116-164228-00-linha-de-base
- `01-pool-10`: arquivos sem commit (ou sem git) em: 20261116-171626-01-pool-10, 20261116-171832-01-pool-10, 20261116-172015-01-pool-10
- `01-pool-10`: contrato não mantido em: 20261116-171626-01-pool-10 (ausente), 20261116-171832-01-pool-10 (ausente), 20261116-172015-01-pool-10 (ausente)
- `01b-pool-5`: arquivos sem commit (ou sem git) em: 20261116-172308-01b-pool-5, 20261116-172449-01b-pool-5, 20261116-172632-01b-pool-5
- `01b-pool-5`: contrato não mantido em: 20261116-172308-01b-pool-5 (ausente), 20261116-172449-01b-pool-5 (ausente), 20261116-172632-01b-pool-5 (ausente)
- `01c-pool-20`: arquivos sem commit (ou sem git) em: 20261116-172911-01c-pool-20, 20261116-173101-01c-pool-20, 20261116-173246-01c-pool-20
- `01c-pool-20`: contrato não mantido em: 20261116-172911-01c-pool-20 (ausente), 20261116-173101-01c-pool-20 (ausente), 20261116-173246-01c-pool-20 (ausente)
- `02a-indice-itens-pedido-pedido-id`: arquivos sem commit (ou sem git) em: 20261116-230525-02a-indice-itens-pedido-pedido-id, 20261116-230722-02a-indice-itens-pedido-pedido-id, 20261116-230917-02a-indice-itens-pedido-pedido-id
- `02b-indice-pedidos-cliente-id`: arquivos sem commit (ou sem git) em: 20261116-231411-02b-indice-pedidos-cliente-id, 20261116-231609-02b-indice-pedidos-cliente-id, 20261116-231801-02b-indice-pedidos-cliente-id
- `03-pedidos-cliente-sem-n-mais-1`: arquivos sem commit (ou sem git) em: 20261116-233459-03-pedidos-cliente-sem-n-mais-1, 20261116-233700-03-pedidos-cliente-sem-n-mais-1, 20261116-233931-03-pedidos-cliente-sem-n-mais-1
- `00-linha-de-base-B`: arquivos sem commit (ou sem git) em: 20261117-234931-00-linha-de-base-B, 20261117-235149-00-linha-de-base-B, 20261117-235352-00-linha-de-base-B
- `00-linha-de-base-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `01c-pool-20-B`: arquivos sem commit (ou sem git) em: 20261117-235903-01c-pool-20-B, 20261118-000102-01c-pool-20-B, 20261118-000259-01c-pool-20-B
- `01c-pool-20-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `02a-indice-itens-pedido-pedido-id-B`: arquivos sem commit (ou sem git) em: 20261118-002526-02a-indice-itens-pedido-pedido-id-B, 20261118-002729-02a-indice-itens-pedido-pedido-id-B, 20261118-002924-02a-indice-itens-pedido-pedido-id-B
- `02a-indice-itens-pedido-pedido-id-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `02b-indice-pedidos-cliente-id-B`: arquivos sem commit (ou sem git) em: 20261118-003225-02b-indice-pedidos-cliente-id-B, 20261118-003412-02b-indice-pedidos-cliente-id-B, 20261118-003558-02b-indice-pedidos-cliente-id-B
- `02b-indice-pedidos-cliente-id-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `03-pedidos-cliente-sem-n-mais-1-B`: arquivos sem commit (ou sem git) em: 20261118-010222-03-pedidos-cliente-sem-n-mais-1-B, 20261118-010425-03-pedidos-cliente-sem-n-mais-1-B, 20261118-010621-03-pedidos-cliente-sem-n-mais-1-B
- `03-pedidos-cliente-sem-n-mais-1-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `04-indice-clientes-email-lower-B`: arquivos sem commit (ou sem git) em: 20261118-012627-04-indice-clientes-email-lower-B, 20261118-012814-04-indice-clientes-email-lower-B, 20261118-013006-04-indice-clientes-email-lower-B
- `04-indice-clientes-email-lower-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `06-indice-pedidos-status-B`: arquivos sem commit (ou sem git) em: 20261118-013722-06-indice-pedidos-status-B, 20261118-013859-06-indice-pedidos-status-B, 20261118-014038-06-indice-pedidos-status-B
- `06-indice-pedidos-status-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `11a-api-cpu-035-B`: arquivos sem commit (ou sem git) em: 20261118-065626-11a-api-cpu-035-B, 20261118-065809-11a-api-cpu-035-B, 20261118-065953-11a-api-cpu-035-B
- `11a-api-cpu-035-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `11b-api-cpu-025-B`: arquivos sem commit (ou sem git) em: 20261118-070317-11b-api-cpu-025-B, 20261118-070457-11b-api-cpu-025-B, 20261118-070640-11b-api-cpu-025-B
- `11b-api-cpu-025-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `11c-api-mem-128-B`: arquivos sem commit (ou sem git) em: 20261118-071003-11c-api-mem-128-B, 20261118-071142-11c-api-mem-128-B, 20261118-071323-11c-api-mem-128-B
- `11c-api-mem-128-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `11d-api-cpu-035-mem-128-B`: arquivos sem commit (ou sem git) em: 20261118-071632-11d-api-cpu-035-mem-128-B, 20261118-071809-11d-api-cpu-035-mem-128-B, 20261118-071948-11d-api-cpu-035-mem-128-B
- `11d-api-cpu-035-mem-128-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `12-controle-B`: arquivos sem commit (ou sem git) em: 20261118-195014-12-controle-B, 20261118-195208-12-controle-B, 20261118-195419-12-controle-B
- `12-controle-B`: contrato não mantido em: 20261118-195014-12-controle-B (ausente), 20261118-195208-12-controle-B (ausente), 20261118-195419-12-controle-B (ausente)
- `12-controle-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `12a-vendas-por-dia-indice-B`: arquivos sem commit (ou sem git) em: 20261118-195723-12a-vendas-por-dia-indice-B, 20261118-195939-12a-vendas-por-dia-indice-B, 20261118-200233-12a-vendas-por-dia-indice-B
- `12a-vendas-por-dia-indice-B`: contrato não mantido em: 20261118-195723-12a-vendas-por-dia-indice-B (ausente), 20261118-195939-12a-vendas-por-dia-indice-B (ausente), 20261118-200233-12a-vendas-por-dia-indice-B (ausente)
- `12a-vendas-por-dia-indice-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `12b-top-produtos-reescrita-B`: arquivos sem commit (ou sem git) em: 20261118-234331-12b-top-produtos-reescrita-B, 20261118-234508-12b-top-produtos-reescrita-B, 20261118-234642-12b-top-produtos-reescrita-B
- `12b-top-produtos-reescrita-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
- `12c-controle-sem-top-produtos-B`: arquivos sem commit (ou sem git) em: 20261118-235003-12c-controle-sem-top-produtos-B, 20261118-235208-12c-controle-sem-top-produtos-B, 20261118-235350-12c-controle-sem-top-produtos-B
- `12c-controle-sem-top-produtos-B`: parâmetros de carga diferentes da base ({"vus":"20","duracao":"60s"} vs {}): comparação inválida
