# Diagnóstico

Evidências que sustentam cada conclusão do artigo. Nada aqui é editado à mão: cada arquivo é a saída de um comando, com data e commit no nome ou no cabeçalho.

| Script | O que gera |
|---|---|
| [`coletar.sh`](coletar.sh) | Pasta `<data>-<commit>/` com ambiente e parâmetros do PostgreSQL, tamanhos e índices das tabelas, e o plano de execução (`EXPLAIN (ANALYZE, BUFFERS)`) de cada consulta das rotas |
| [`contar-consultas.sh`](contar-consultas.sh) | Quantas conexões e transações **uma** requisição abre no banco |

Rodar com a carga parada, a partir da raiz do repositório:

```bash
diagnostico/coletar.sh
diagnostico/contar-consultas.sh /clientes/42/pedidos
```

## Índice das evidências

<!-- Uma linha por evidência citada no artigo ou no experimentos.md. -->

| Arquivo | O que mostra | Usado em |
|---|---|---|
| [`comparativo-planos.md`](comparativo-planos.md) | Tempo, nós de leitura, linhas descartadas e blocos lidos de **cada consulta em 5 coletas** (antes e depois de cada índice), gerado por `analise/planos.js` | Artigo, seção 2; `experimentos.md` |
| [`20261116-164440-1e48069/`](20261116-164440-1e48069/) | **Linha de base (máquina A):** ambiente, parâmetros do PostgreSQL, tamanhos e índices das tabelas e o plano de cada consulta | Artigo, seção 2 |
| [`20261116-164528-1e48069-contar-clientes-42-pedidos.txt`](20261116-164528-1e48069-contar-clientes-42-pedidos.txt) | `GET /clientes/42/pedidos` abre 16–17 conexões (uma por consulta, sem pool) | Artigo, seção 2 (conexão nova por consulta e N+1) |
| [`20261116-164721-1e48069-contar-clientes-42.txt`](20261116-164721-1e48069-contar-clientes-42.txt) | `GET /clientes/42` abre 1 conexão (o controle da contagem anterior) | Artigo, seção 2 |
| [`20261116-230426-7b68209/`](20261116-230426-7b68209/) | Planos depois do índice em `itens_pedido(pedido_id)` (02a, máquina A) | `experimentos.md` (02a) |
| [`20261116-231322-6ac55d3/`](20261116-231322-6ac55d3/) | Planos depois do índice em `pedidos(cliente_id)` (02b, máquina A) | `experimentos.md` (02b) |
| [`20261118-013158-ef8d217/`](20261118-013158-ef8d217/) | Planos depois do índice `lower(email)` (04, máquina B) | `experimentos.md` (04) |
| [`20261118-014212-a8050f5/`](20261118-014212-a8050f5/) | Planos depois do índice composto de status (06, máquina B) | Artigo, seções 2 e 5; `experimentos.md` (06) |
