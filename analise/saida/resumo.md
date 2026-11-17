# Resumo das medições

> Gerado por `analise/resumir.js` em 2026-11-17T02:41:42.306Z a partir de 21 pastas de `resultados/`. Não editar à mão: rode o script de novo.

Valores: **mediana** das execuções de cada rótulo, com a faixa (mínimo–máximo) entre parênteses. Base de comparação: `00-linha-de-base`. Parâmetros da base: VUS=20, DURAÇÃO=60s, SEMENTE=undefined.

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

Rotas lentas têm poucas requisições por execução: o p95 por rota oscila mais que o geral.

## Execuções por rótulo

- `00-linha-de-base` (commit ab12125): [20261116-163843-00-linha-de-base](../../resultados/20261116-163843-00-linha-de-base/resumo.txt) · [20261116-164039-00-linha-de-base](../../resultados/20261116-164039-00-linha-de-base/resumo.txt) · [20261116-164228-00-linha-de-base](../../resultados/20261116-164228-00-linha-de-base/resumo.txt)
- `01-pool-10` (commit 264c066): [20261116-171626-01-pool-10](../../resultados/20261116-171626-01-pool-10/resumo.txt) · [20261116-171832-01-pool-10](../../resultados/20261116-171832-01-pool-10/resumo.txt) · [20261116-172015-01-pool-10](../../resultados/20261116-172015-01-pool-10/resumo.txt)
- `01b-pool-5` (commit b6013c1): [20261116-172308-01b-pool-5](../../resultados/20261116-172308-01b-pool-5/resumo.txt) · [20261116-172449-01b-pool-5](../../resultados/20261116-172449-01b-pool-5/resumo.txt) · [20261116-172632-01b-pool-5](../../resultados/20261116-172632-01b-pool-5/resumo.txt)
- `01c-pool-20` (commit 7da713d): [20261116-172911-01c-pool-20](../../resultados/20261116-172911-01c-pool-20/resumo.txt) · [20261116-173101-01c-pool-20](../../resultados/20261116-173101-01c-pool-20/resumo.txt) · [20261116-173246-01c-pool-20](../../resultados/20261116-173246-01c-pool-20/resumo.txt)
- `02a-indice-itens-pedido-pedido-id` (commit ad71f47, 02a4c54, 10c0723): [20261116-230525-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230525-02a-indice-itens-pedido-pedido-id/resumo.txt) · [20261116-230722-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230722-02a-indice-itens-pedido-pedido-id/resumo.txt) · [20261116-230917-02a-indice-itens-pedido-pedido-id](../../resultados/20261116-230917-02a-indice-itens-pedido-pedido-id/resumo.txt)
- `02b-indice-pedidos-cliente-id` (commit 07c5de8, d33d97c, b519b29): [20261116-231411-02b-indice-pedidos-cliente-id](../../resultados/20261116-231411-02b-indice-pedidos-cliente-id/resumo.txt) · [20261116-231609-02b-indice-pedidos-cliente-id](../../resultados/20261116-231609-02b-indice-pedidos-cliente-id/resumo.txt) · [20261116-231801-02b-indice-pedidos-cliente-id](../../resultados/20261116-231801-02b-indice-pedidos-cliente-id/resumo.txt)
- `03-pedidos-cliente-sem-n-mais-1` (commit 014d4dc, 2546c27, efdb276): [20261116-233459-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233459-03-pedidos-cliente-sem-n-mais-1/resumo.txt) · [20261116-233700-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233700-03-pedidos-cliente-sem-n-mais-1/resumo.txt) · [20261116-233931-03-pedidos-cliente-sem-n-mais-1](../../resultados/20261116-233931-03-pedidos-cliente-sem-n-mais-1/resumo.txt)

## Avisos

- `00-linha-de-base`: arquivos sem commit (ou sem git) em: 20261116-163843-00-linha-de-base, 20261116-164039-00-linha-de-base, 20261116-164228-00-linha-de-base
- `01-pool-10`: arquivos sem commit (ou sem git) em: 20261116-171626-01-pool-10, 20261116-171832-01-pool-10, 20261116-172015-01-pool-10
- `01-pool-10`: contrato não mantido em: 20261116-171626-01-pool-10 (ausente), 20261116-171832-01-pool-10 (ausente), 20261116-172015-01-pool-10 (ausente)
- `01b-pool-5`: arquivos sem commit (ou sem git) em: 20261116-172308-01b-pool-5, 20261116-172449-01b-pool-5, 20261116-172632-01b-pool-5
- `01b-pool-5`: contrato não mantido em: 20261116-172308-01b-pool-5 (ausente), 20261116-172449-01b-pool-5 (ausente), 20261116-172632-01b-pool-5 (ausente)
- `01c-pool-20`: arquivos sem commit (ou sem git) em: 20261116-172911-01c-pool-20, 20261116-173101-01c-pool-20, 20261116-173246-01c-pool-20
- `01c-pool-20`: contrato não mantido em: 20261116-172911-01c-pool-20 (ausente), 20261116-173101-01c-pool-20 (ausente), 20261116-173246-01c-pool-20 (ausente)
- `02a-indice-itens-pedido-pedido-id`: execuções em commits diferentes: ad71f47, 02a4c54, 10c0723
- `02a-indice-itens-pedido-pedido-id`: arquivos sem commit (ou sem git) em: 20261116-230525-02a-indice-itens-pedido-pedido-id, 20261116-230722-02a-indice-itens-pedido-pedido-id, 20261116-230917-02a-indice-itens-pedido-pedido-id
- `02b-indice-pedidos-cliente-id`: execuções em commits diferentes: 07c5de8, d33d97c, b519b29
- `02b-indice-pedidos-cliente-id`: arquivos sem commit (ou sem git) em: 20261116-231411-02b-indice-pedidos-cliente-id, 20261116-231609-02b-indice-pedidos-cliente-id, 20261116-231801-02b-indice-pedidos-cliente-id
- `03-pedidos-cliente-sem-n-mais-1`: execuções em commits diferentes: 014d4dc, 2546c27, efdb276
- `03-pedidos-cliente-sem-n-mais-1`: arquivos sem commit (ou sem git) em: 20261116-233459-03-pedidos-cliente-sem-n-mais-1, 20261116-233700-03-pedidos-cliente-sem-n-mais-1, 20261116-233931-03-pedidos-cliente-sem-n-mais-1
