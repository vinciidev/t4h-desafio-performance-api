# Próximos testes

Ideias que apareceram na pesquisa e **não foram testadas** aqui (por tempo ou porque o ambiente não permite). Nenhum resultado abaixo foi medido: o "ganho esperado" é uma hipótese, com a fonte que a sustenta. As evidências de diagnóstico são de antes das mudanças; cada ficha diz o que ainda precisaria ser confirmado.

---

### PgBouncer como pooler externo
- **Problema que ataca:** conexões da API ao banco. O diagnóstico mostrou uma conexão nova por consulta na versão original ([`/clientes/42/pedidos`](diagnostico/20261116-164528-1e48069-contar-clientes-42-pedidos.txt), [`/clientes/42`](diagnostico/20261116-164721-1e48069-contar-clientes-42.txt)); o pool dentro da API já resolveu essa parte (mudança 01c em [`experimentos.md`](experimentos.md)).
- **De onde veio:** [PgBouncer, Features](https://www.pgbouncer.org/features.html) (acesso em 16/11/2026), que descreve os modos *session*, *transaction* e *statement*; e [Percona, Scaling PostgreSQL with PgBouncer](https://www.percona.com/blog/scaling-postgresql-with-pgbouncer-you-may-need-a-connection-pooler-sooner-than-you-expect/) (acesso em 13/11/2026), que relata que, com poucos clientes, o pooler externo teve vazão menor que a conexão direta e só passou a ajudar com muitos clientes.
- **O que acredito que ganharia:** pouco com 20 usuários virtuais e uma única API. O benefício aparece quando muitas instâncias da API disputam as conexões do banco, o que este experimento não tem.
- **Por que não testei:** adiciona um serviço (custo de memória e de operação) e a própria fonte indica que, nesta escala, pode piorar.
- **Como testaria:** novo serviço no `docker-compose.yml`, API apontando para ele, rótulo `NN-pgbouncer`, comparando com a última mudança medida, com 3 execuções e o mesmo `VUS=20`. Repetiria com mais usuários virtuais (`VUS=100`, por exemplo) para ver se o cenário muda.
- **O que precisaria:** uma imagem do PgBouncer, ajuste de modo de pooling e de limites; cerca de meia hora de máquina.
- **Riscos e custos:** mais um componente para manter; o modo *transaction* restringe recursos de sessão do PostgreSQL (consultar a documentação antes de usar com `pg`).

### Log de requisição sem o corpo da resposta, com logger assíncrono
- **Problema que ataca:** CPU da API, que tem limite de 0,5 CPU. O `server.js` registra o corpo inteiro de cada resposta (leitura do código, hipótese H05). **Não foi diagnosticado com evidência em `diagnostico/`**, então ainda é suspeita.
- **De onde veio:** [Express, Performance Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html) (acesso em 13/11/2026), que diz que `console.log` é síncrono para terminal ou arquivo e recomenda um logger como o Pino; [Node.js, process I/O](https://nodejs.org/api/process.html#a-note-on-process-io) (acesso em 13/11/2026), segundo a qual pipes são assíncronos no POSIX e síncronos no Windows; [Pino, README](https://github.com/pinojs/pino) (acesso em 17/11/2026), que afirma baixo overhead segundo os benchmarks do próprio projeto (não conferidos por mim).
- **O que acredito que ganharia:** menos CPU da API por requisição ao deixar de serializar de novo o corpo de cada resposta. A parte "assíncrono" depende de para onde o stdout aponta dentro do container, e isso eu não verifiquei.
- **Por que não testei:** a API tinha CPU folgada nas medições feitas até agora (ver `recursos.txt` das pastas), então o gargalo era o banco, e a prioridade foi para ele.
- **Como testaria:** logar só método, URL, status e duração; rótulo `NN-log-sem-corpo`; medir CPU da API em `recursos.txt` e o tamanho do log (`docker compose logs api` antes e depois). Comparar com a última mudança medida.
- **O que precisaria:** editar `server.js`; meia hora.
- **Riscos e custos:** o log do corpo pode ser um requisito de auditoria numa loja real; manter método, URL, status e duração preserva a utilidade operacional. Não muda o contrato HTTP.

### Índice trigrama (`pg_trgm`) na busca de produtos
- **Problema que ataca:** `GET /produtos/busca?q=`, que usa `ILIKE '%termo%'` ([EXPLAIN da busca "cadeira"](diagnostico/20261116-164440-1e48069/02-explain-busca-cadeira.txt), [da busca "modelo 12"](diagnostico/20261116-164440-1e48069/02-explain-busca-modelo-12.txt)).
- **De onde veio:** [PostgreSQL 16, pg_trgm](https://www.postgresql.org/docs/16/pgtrgm.html) (acesso em 13/11/2026): índices GIN/GiST com trigramas suportam `LIKE`/`ILIKE` sem âncora à esquerda, o que a B-tree não faz; padrões sem trigramas extraíveis degeneram em varredura do índice inteiro.
- **O que acredito que ganharia:** pouco. A tabela tem 20 mil linhas e os termos da carga casam com muitas linhas, que ainda precisam ser ordenadas por `nome, id`. É candidato honesto a "aplicada, sem ganho".
- **Por que não testei:** ganho esperado pequeno e a extensão `pg_trgm` exige `CREATE EXTENSION` no banco.
- **Como testaria:** `banco/NN-indice-trigrama-produtos.sql` com `CREATE EXTENSION pg_trgm` e índice GIN em `nome`; EXPLAIN antes e depois para ver se o planejador usa o índice; 3 medições.
- **O que precisaria:** a extensão `pg_trgm` disponível na imagem `postgres:16.4` (não conferi; testaria com `CREATE EXTENSION`); cerca de 15 minutos.
- **Riscos e custos:** índice GIN é maior e deixa a escrita mais lenta. Busca textual (`tsvector`) mudaria a semântica do `ILIKE` e quebraria o contrato, por isso não é alternativa.

### `vendas-por-dia`: intervalo em vez de `::date`, índice em `criado_em`, sem `observacoes` e agregação no banco
- **Problema que ataca:** `GET /relatorios/vendas-por-dia`: a consulta aplica `criado_em::date` na coluna e traz `observacoes` sem usar ([EXPLAIN de 7 dias](diagnostico/20261116-164440-1e48069/02-explain-vendas-por-dia-7-dias.txt)); a soma por dia é feita em JavaScript.
- **De onde veio:** [PostgreSQL 16, Using EXPLAIN](https://www.postgresql.org/docs/16/using-explain.html) (acesso em 13/11/2026), como método de diagnóstico; [PostgreSQL 16, Indexes on Expressions](https://www.postgresql.org/docs/16/indexes-expressional.html) (acesso em 13/11/2026), que mostra que uma expressão só usa índice se o índice for sobre a mesma expressão. **Não encontrei uma fonte que afirme o efeito do cast em `date` sobre o uso do índice**: isso está só como hipótese, a confirmar no EXPLAIN.
- **O que acredito que ganharia:** menos linhas lidas e menos dados trafegados entre banco e API. São três mudanças distintas e devem ser medidas separadas.
- **Por que não testei:** é uma rota de 8% do tráfego pelo `teste-carga.js`, e o tempo foi para as mudanças de maior peso.
- **Como testaria:** (a) tirar `observacoes` do `SELECT`; (b) trocar o predicado por intervalo `criado_em >= $1 AND criado_em < ($2::date + 1)` com índice em `criado_em`; (c) `GROUP BY` no SQL. Um commit e um rótulo por mudança, contrato conferido em cada uma.
- **O que precisaria:** cuidado com tipos: `count` e `sum` voltam como string no `pg`, e o `dia` precisa sair igual a `toISOString().slice(0, 10)`.
- **Riscos e custos:** risco real ao contrato em (c); índice em `criado_em` custa espaço e escrita.

### `top-produtos`: visão materializada ou cache com validade
- **Problema que ataca:** `GET /relatorios/top-produtos` recalcula a agregação sobre os 1,5 milhão de itens a cada chamada ([EXPLAIN](diagnostico/20261116-164440-1e48069/02-explain-top-produtos-10.txt)). Pesa só 2% do tráfego, mas cada chamada segura a CPU do banco.
- **De onde veio:** [PostgreSQL 16, Materialized Views](https://www.postgresql.org/docs/16/rules-materializedviews.html) (acesso em 13/11/2026) e [REFRESH MATERIALIZED VIEW](https://www.postgresql.org/docs/16/sql-refreshmaterializedview.html) (acesso em 16/11/2026): o resultado fica guardado, mas os dados não estão atualizados até o refresh; o refresh substitui todo o conteúdo e, sem `CONCURRENTLY`, pode bloquear leituras.
- **O que acredito que ganharia:** a rota passaria a ser uma leitura de poucas linhas, e o banco ganharia folga para as outras rotas.
- **Por que não testei:** os dados mudariam de atualidade. Aqui são estáticos, então o contrato passaria, mas numa loja real a visão ficaria defasada. Prefiro declarar isso do que esconder.
- **Como testaria:** `banco/NN-top-produtos-materializada.sql`, rota lendo a visão, `REFRESH` ao subir; rótulo `NN-top-produtos-materializada`; comparar com a última mudança medida.
- **O que precisaria:** decidir quando atualizar a visão; um índice `UNIQUE` se quiser `CONCURRENTLY`.
- **Riscos e custos:** dado defasado; complexidade de operação do refresh.

### Parâmetros do PostgreSQL para um container de 1 CPU e 512 MB
- **Problema que ataca:** o banco usa configuração padrão em quase tudo ([`00-ambiente.txt`](diagnostico/20261116-164440-1e48069/00-ambiente.txt): `jit` ligado, `work_mem` 4 MB, `max_parallel_workers_per_gather` 2, `shared_buffers` 128 MB). Se os parâmetros atrapalham, só dá para dizer depois de medir.
- **De onde veio:** [PostgreSQL 16, Resource Consumption](https://www.postgresql.org/docs/16/runtime-config-resource.html) (acesso em 13/11/2026); [Query Planning](https://www.postgresql.org/docs/16/runtime-config-query.html) (acesso em 16/11/2026); [When to JIT?](https://www.postgresql.org/docs/16/jit-decision.html) (acesso em 13/11/2026), que diz que em consultas curtas o custo do JIT costuma superar a economia; [PGTune](https://pgtune.leopard.in.ua/) (acesso em 17/11/2026), que pede a memória do container e não explica as fórmulas; [PostgreSQL Wiki, Tuning Your PostgreSQL Server](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server) (acesso em 16/11/2026; última edição da página em 31/03/2021).
- **O que acredito que ganharia:** pode ser pequeno ou nulo depois que as consultas ganharam índice; os parâmetros importam mais para as consultas que ainda varrem tabelas grandes.
- **Por que não testei:** vem depois de consertar as consultas, e cada parâmetro precisa de sua própria série para não misturar efeitos.
- **Como testaria:** um parâmetro por vez via `-c` no `command` do serviço `banco` (por exemplo `jit=off`), 3 medições, comparar com a última mudança medida.
- **O que precisaria:** cerca de 10 minutos por parâmetro.
- **Riscos e custos:** aumentar memória além do limite de 512 MB faz o container ser encerrado por falta de memória.

### Índice composto `pedidos (cliente_id, criado_em DESC, id DESC)`
- **Problema que ataca:** `GET /clientes/:id/pedidos`. O índice simples em `cliente_id` (mudança 02b) resolveu a busca; o `ORDER BY criado_em DESC, id DESC` ainda é feito sobre as linhas do cliente ([EXPLAIN](diagnostico/20261116-164440-1e48069/02-explain-pedidos-do-cliente.txt)).
- **De onde veio:** [PostgreSQL 16, Indexes and ORDER BY](https://www.postgresql.org/docs/16/indexes-ordering.html) (acesso em 13/11/2026): um índice pode entregar as linhas já ordenadas e evitar o `sort`; [Multicolumn Indexes](https://www.postgresql.org/docs/16/indexes-multicolumn.html) (acesso em 17/11/2026), que recomenda usar índices com várias colunas "com parcimônia".
- **O que acredito que ganharia:** quase nada, porque a média é de cerca de 5 pedidos por cliente (500 mil pedidos para 100 mil clientes) e ordenar poucas linhas custa pouco. A distribuição real por cliente eu mediria com uma consulta de contagem, não de cabeça.
- **Por que não testei:** ganho esperado pequeno para o índice maior e a escrita mais lenta.
- **Como testaria:** `banco/NN-indice-pedidos-cliente-composto.sql`, trocando o índice simples pelo composto; 3 medições contra a última mudança medida.
- **O que precisaria:** cerca de 10 minutos.
- **Riscos e custos:** índice maior; mais escrita em `pedidos`.

### Paginação por cursor (*keyset*) em `/pedidos`
- **Problema que ataca:** `GET /pedidos?status=&pagina=` com `OFFSET` grande ([EXPLAIN da página 1000](diagnostico/20261116-164440-1e48069/02-explain-pedidos-status-pagina-1000.txt)).
- **De onde veio:** [Winand, We need tool support for keyset pagination](https://use-the-index-luke.com/no-offset) (acesso em 13/11/2026): com `OFFSET` o banco ainda precisa buscar as linhas puladas; a paginação por cursor filtra pelo último valor visto.
- **O que acredito que ganharia:** custo constante por página, sem crescer com o número da página.
- **Por que não testei:** **muda o contrato**: a rota recebe `pagina` numérica e a resposta traz `pagina` e `total`. Descartada por regra do desafio, não por falta de tempo.
- **Como testaria:** só numa versão da API em que a interface pudesse mudar, medindo à parte da linha principal.
- **O que precisaria:** autorização para mudar o contrato, o que o desafio não dá.
- **Riscos e custos:** quebra de clientes que usam `pagina`.

---

## Ficha modelo

### <Nome da ideia>
- **Problema que ataca:** <rota / recurso, com link para a evidência em `diagnostico/`>
- **De onde veio:** [Autor ou organização, título](link) (acesso em DD/MM/2026)
- **O que acredito que ganharia:** <efeito esperado e mecanismo, sem número inventado>
- **Por que não testei:** <tempo / precisa de infraestrutura X / mudaria o contrato>
- **Como testaria:** <mudança, rótulo, o que mediria, contra qual "antes">
- **O que precisaria:** <serviço, recurso, dado, tempo estimado>
- **Riscos e custos:** <operação, dinheiro, complexidade>
