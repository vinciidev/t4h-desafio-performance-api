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
| | | |
