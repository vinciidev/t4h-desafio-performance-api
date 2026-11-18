# API da loja: com o banco saturado, índices certos e limites justos deram 6 vezes mais vazão

## 1. Resumo

Uma API de loja (Node.js e PostgreSQL) ficava lenta sob carga: o banco usava 97% de um CPU e a API, 8%. Diagnostiquei quatro causas com `EXPLAIN` e contagem de consultas e apliquei sete mudanças, uma por commit, cada uma medida três vezes e sem alterar nenhuma resposta. A vazão (requisições por segundo) foi de 1,8 para 11,5 e o p95 (tempo abaixo do qual ficam 95% das respostas) de 36.404 para 9.920 ms. Quase tudo veio de dois índices; o pool de conexões e a correção do N+1 mexeram pouco no geral.

## 2. Contexto e diagnóstico

A aplicação tem sete rotas de leitura sobre 100 mil clientes, 20 mil produtos, 500 mil pedidos e 1,5 milhão de itens; a API roda com 0,5 CPU e 256 MB, o banco com 1 CPU e 512 MB. Gravei o contrato (as 42 respostas que não podem mudar) e medi a linha de base três vezes com `scripts/medir.sh`: 1,8 req/s, p95 de 36.404,2 ms, 0,75% de erros ([1](../resultados/20261117-234931-00-linha-de-base-B) [2](../resultados/20261117-235149-00-linha-de-base-B) [3](../resultados/20261117-235352-00-linha-de-base-B)). O banco ficou em 97,4% de CPU e a API em 7,8%: o gargalo é o PostgreSQL, não o Node.

Usei `EXPLAIN ANALYZE` (o plano que o banco executou, com tempo real) e a contagem de conexões por requisição. Evidências em `diagnostico/`:

Hipótese de causa:

- **Conexão nova por consulta:** `GET /clientes/42/pedidos` abriu 16–17 conexões; `/clientes/42`, 1 ([contagem](../diagnostico/20261116-164528-1e48069-contar-clientes-42-pedidos.txt), [contagem](../diagnostico/20261116-164721-1e48069-contar-clientes-42.txt)).
- **Consultas em laço (N+1):** na mesma rota, uma consulta por pedido e por item, em vez de um número fixo.
- **Chaves estrangeiras sem índice:** itens de um pedido, 200,765 ms ([plano](../diagnostico/20261116-164440-1e48069/02-explain-itens-do-pedido.txt)); pedidos de um cliente, 108,279 ms ([plano](../diagnostico/20261116-164440-1e48069/02-explain-pedidos-do-cliente.txt)), ambos por varredura da tabela inteira.
- **Filtros sem índice:** e-mail, 76,386 ms ([plano](../diagnostico/20261116-164440-1e48069/02-explain-clientes-email.txt)); listagem por status, 245,2 ms na página 1 e 779,4 ms na 1000, ordenando em disco ([página 1000](../diagnostico/20261116-164440-1e48069/02-explain-pedidos-status-pagina-1000.txt)).

Esses planos vêm da primeira máquina; o plano não depende dela, mas os tempos isolados valem só como indicação.

## 3. Estado da arte

### Reaproveitar conexões

No PostgreSQL, cada conexão nova faz o supervisor criar um processo de backend [1]. O `node-postgres` recomenda pool (conexões reaproveitadas) em apps web e cita 20–30 ms só no handshake [2]. O HikariCP defende pools pequenos, perto de núcleos × 2 + discos, e manda testar sob carga [3]. Contraponto de mercado: com 56 clientes, a conexão direta teve cerca de 2,5 vezes a vazão do PgBouncer, um pooler externo [4]. O nosso pool fica dentro da API.

### Eliminar consultas em laço

Chen et al. descrevem o *one-by-one processing*, que "repeatedly performs similar database operations in loops" [5], a estrutura do nosso N+1. Corrigi-lo cortou o tempo de resposta em 20% a 32% em 4 de 9 suítes de um sistema aberto e em 69% num industrial; nas demais, sem efeito significativo: "not all anti-patterns are worth fixing" [5]. É sobre ORM em Java, não SQL direto. Um caso de mercado reporta mediana de 3,41 s para 290 ms numa página [6].

### Indexar o que a consulta filtra

Declarar chave estrangeira não cria índice [7]; índice de expressão serve a consultas com a mesma expressão, ao custo de calculá-la a cada escrita [8]; um índice pode entregar linhas já ordenadas e, com `ORDER BY ... LIMIT`, ler só as primeiras [9]. O `OFFSET` obriga a buscar as linhas puladas [10], e contagem exata é cara por causa do MVCC [11]. Um `DELETE` caiu de 19 s para 342 ms ao indexar chaves estrangeiras [12]; é outra operação, vale pelo mecanismo.

### Medir e limitar recursos

Latência alta, irrelevante em sistemas pequenos, "may come to dominate overall service performance at large scale" [13]; o argumento é para muitos servidores por requisição, então o p95 aqui é escolha de método. O k6 usa modelo fechado, em que a carga cai quando o sistema desacelera [14], e há "a vast difference in behavior between open and closed models" [15]. O Docker limita CPU com `--cpus` e, sem memória, o kernel mata processos do container [16].

## 4. Alternativas consideradas

| Alternativa | Custo | Desempenho (máquina B) | Risco | Esforço |
|---|---|---|---|---|
| Pool na API (`max: 20`) | nenhum serviço novo | p95 -10% (ruído), vazão +13% | pool pequeno enfileira | baixo |
| PgBouncer | mais um container | não testado; pode piorar [4] | restringe recursos de sessão | médio |
| Índices B-tree | 4,7 a 21 MB cada; escrita mais lenta | vazão 2,0→3,8 (02a), 5,2→10,1 (06) | não é usado se a expressão difere | baixo |
| 3 consultas fixas no N+1 | nenhum | rota-alvo -49%; geral no ruído | ordem e tipos do contrato | médio |
| `json_agg` no banco | nenhum | não testado | formato de data pode quebrar o contrato | médio |
| Reduzir limites da API | -10% CPU, -17% memória reservados | geral no ruído; 0,25 CPU piora rotas leves | OOM, fila | baixo |
| Mais CPU ao banco | sobe a conta | não testado | contraria "mais barato" | baixo |

Descartei o PgBouncer porque soma um serviço e a fonte que li mostra perda em escala pequena [4]; o `json_agg` porque o formato de data pode quebrar o contrato; mais CPU ao banco porque trata o sintoma pagando mais. Fiquei com um índice por commit, cada um casando com o que a consulta filtra e ordena, para atribuir cada ganho a uma causa, e com três consultas fixas com `ANY` no N+1, porque mantêm a ordem exata do contrato.

## 5. Solução escolhida e por quê

Reduzi o trabalho do banco antes de mexer em recursos, porque ele estava a 97% de CPU e a API a 8%. A ordem foi: pool (afeta todas as rotas), índices, N+1 (o ganho depende de cada consulta já ser barata) e, por último, limites. Cada mudança foi um commit, com banco recriado e contrato conferido antes de cada execução.

O argumento é mecanismo mais número. Na mudança 06, o plano da página 1 passou de varredura com ordenação (245,2 ms) para leitura do índice sem ordenar (0,107 ms) ([plano depois](../diagnostico/20261118-014212-a8050f5/02-explain-pedidos-status-pagina-1.txt)) e a vazão dobrou (5,2 → 10,1 req/s, faixas separadas).

**Na prática (opinião minha, não testada):** (1) começar pelo `EXPLAIN` das listagens e filtros mais usados; (2) em produção, criar índice sem travar escritas pede `CREATE INDEX CONCURRENTLY`, que não testei; (3) medir o custo de escrita antes de acumular índices; (4) cortar recursos só com p95 **por rota**: aqui, 0,25 CPU parecia seguro no p95 geral e piorou as rotas leves.

## 6. Experimento e resultado

Máquina B, base `00-linha-de-base-B`; medianas de 3 execuções; contrato mantido em todas. CPU % e MiB: API / banco.

| Mudança | Hipótese | p95 (ms) | req/s | CPU · MiB | Pastas | Conclusão |
|---|---|---|---|---|---|---|
| 00 base | — | 36404,2 | 1,8 | 7,8 · 29 / 97,4 · 402 | [1](../resultados/20261117-234931-00-linha-de-base-B) [2](../resultados/20261117-235149-00-linha-de-base-B) [3](../resultados/20261117-235352-00-linha-de-base-B) | ponto de partida |
| 01c pool 20 | sem fila por conexão | → 32815,2 | → 2,0 | 7,1 · 40 / 97,9 · 399 | [1](../resultados/20261117-235903-01c-pool-20-B) [2](../resultados/20261118-000102-01c-pool-20-B) [3](../resultados/20261118-000259-01c-pool-20-B) | p95 no ruído; vazão +13% |
| 02a índice itens | tira varredura | → 22465,4 | → 3,8 | 13,4 · 58 / 97,5 · 403 | [1](../resultados/20261118-002526-02a-indice-itens-pedido-pedido-id-B) [2](../resultados/20261118-002729-02a-indice-itens-pedido-pedido-id-B) [3](../resultados/20261118-002924-02a-indice-itens-pedido-pedido-id-B) | vazão +91% |
| 02b índice pedidos | idem | → 18516,3 | → 4,8 | 14,6 · 62 / 96,9 · 406 | [1](../resultados/20261118-003225-02b-indice-pedidos-cliente-id-B) [2](../resultados/20261118-003412-02b-indice-pedidos-cliente-id-B) [3](../resultados/20261118-003558-02b-indice-pedidos-cliente-id-B) | rota-alvo -75%; geral no ruído |
| 03 N+1 | menos idas ao banco | → 20597,2 | → 4,3 | 13,1 · 70 / 97,9 · 412 | [1](../resultados/20261118-010222-03-pedidos-cliente-sem-n-mais-1-B) [2](../resultados/20261118-010425-03-pedidos-cliente-sem-n-mais-1-B) [3](../resultados/20261118-010621-03-pedidos-cliente-sem-n-mais-1-B) | rota-alvo -49%; geral no ruído |
| 04 `lower(email)` | tira varredura | → 15888,0 | → 5,2 | 16,0 · 67 / 97,3 · 404 | [1](../resultados/20261118-012627-04-indice-clientes-email-lower-B) [2](../resultados/20261118-012814-04-indice-clientes-email-lower-B) [3](../resultados/20261118-013006-04-indice-clientes-email-lower-B) | rota-alvo -79%; geral no ruído |
| 06 status composto | filtro e ordem no índice | → 11116,4 | → 10,1 | 20,0 · 67 / 96,8 · 429 | [1](../resultados/20261118-013722-06-indice-pedidos-status-B) [2](../resultados/20261118-013859-06-indice-pedidos-status-B) [3](../resultados/20261118-014038-06-indice-pedidos-status-B) | vazão +94%, p95 -30% |
| 11 API 0,35 CPU, 128 MiB | limite maior que o uso | → 9920,2 | → 11,5 | 20,4 · 63 / 98,2 · 426 | [1](../resultados/20261118-071632-11d-api-cpu-035-mem-128-B) [2](../resultados/20261118-071809-11d-api-cpu-035-mem-128-B) [3](../resultados/20261118-071948-11d-api-cpu-035-mem-128-B) | no ruído; reserva menor |

![p95 mediano por mudança, em milissegundos, na máquina B](img/p95-por-mudanca.svg)

No total, a vazão subiu 6,5 vezes e o p95 caiu 73%, quase tudo pelos índices 02a e 06. O que não funcionou: o pool mexeu pouco; o N+1 melhorou só a rota-alvo; e 0,25 CPU deixou `cliente` e `pedidos-do-cliente` de 492,3 e 1002,0 para 1239,1 e 1811,2 ms de p95, sem mudar o agregado (série 11b). Com 0,35 CPU e 128 MiB voltaram a 486,5 e 997,7 ms (série 11d), sem OOM (pico de 99,1 MiB). Detalhes: [`experimentos.md`](../experimentos.md).

## 7. Limites e testes futuros

- **Modelo fechado:** o k6 reduz a carga quando a API desacelera [14][15], então o p95 pode subestimar o pior caso. Não testei carga aberta.
- **Ambiente:** a RAM livre do host variou de 851 a 2.397 MB entre séries, com plano de energia "Equilibrado". As séries 04, 06 e 11a começaram com menos de 1 GB livre; não verifiquei o efeito.
- **Duas máquinas:** a primeira serve só de histórico (lá a série 03 foi inconclusiva); os planos de 02a, 02b e 03 vêm dela.
- **Escrita não medida:** o teste só lê; os índices ocupam de 4,7 a 21 MB e deixam INSERT e UPDATE mais lentos.
- **Poucas execuções:** 3 por série; faixas sobrepostas foram tratadas como ruído.
- **O que derrubaria a conclusão:** outro hardware com as faixas de 02a e 06 sobrepostas, ou carga aberta em que o p95 piora.
- **Próximo gargalo:** `vendas-por-dia` e `top-produtos` (p95 acima de 14 s). Ver [ideias não testadas](../proximos-testes.md).

## 8. Referências

1. PostgreSQL Global Development Group. *How Connections Are Established* (PostgreSQL 16). https://www.postgresql.org/docs/16/connect-estab.html. Acesso em 13/11/2026.
2. node-postgres. *Pooling*. https://node-postgres.com/features/pooling. Acesso em 13/11/2026.
3. HikariCP. *About Pool Sizing*. https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing. Acesso em 13/11/2026.
4. Camargos, F. L. (Percona). *Scaling PostgreSQL with PgBouncer: You May Need a Connection Pooler Sooner Than You Expect*. 27/06/2018. https://www.percona.com/blog/scaling-postgresql-with-pgbouncer-you-may-need-a-connection-pooler-sooner-than-you-expect/. Acesso em 13/11/2026.
5. Chen, T.-H.; Shang, W.; Jiang, Z. M.; Hassan, A. E.; Nasser, M.; Flora, P. *Detecting performance anti-patterns for applications developed using object-relational mapping*. ICSE 2014. https://doi.org/10.1145/2568225.2568259. Acesso em 17/11/2026.
6. McKerlie, A. (Sentry). *Finding and Fixing Django N+1 Problems*. 14/09/2020. https://blog.sentry.io/finding-and-fixing-django-n-1-problems/. Acesso em 13/11/2026.
7. PostgreSQL Global Development Group. *Constraints* (PostgreSQL 16, seção 5.4). https://www.postgresql.org/docs/16/ddl-constraints.html. Acesso em 13/11/2026.
8. PostgreSQL Global Development Group. *Indexes on Expressions* (PostgreSQL 16). https://www.postgresql.org/docs/16/indexes-expressional.html. Acesso em 17/11/2026.
9. PostgreSQL Global Development Group. *Indexes and ORDER BY* (PostgreSQL 16). https://www.postgresql.org/docs/16/indexes-ordering.html. Acesso em 13/11/2026.
10. Winand, M. *We need tool support for keyset pagination*. https://use-the-index-luke.com/no-offset. Acesso em 13/11/2026.
11. PostgreSQL Wiki. *Slow Counting*. https://wiki.postgresql.org/wiki/Slow_Counting. Acesso em 13/11/2026.
12. Fritz, E. (Render). *Fix a top cause of slow queries in PostgreSQL (no slow query log needed)*. 12/12/2024. https://render.com/blog/postgresql-top-cause-slow-queries. Acesso em 13/11/2026.
13. Dean, J.; Barroso, L. A. *The Tail at Scale*. Communications of the ACM 56(2), 2013. https://doi.org/10.1145/2408776.2408794. Acesso em 17/11/2026.
14. Grafana k6. *Open and closed models*. https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/. Acesso em 13/11/2026.
15. Schroeder, B.; Wierman, A.; Harchol-Balter, M. *Open Versus Closed: A Cautionary Tale*. NSDI 2006. https://www.usenix.org/conference/nsdi-06/open-versus-closed-cautionary-tale. Acesso em 17/11/2026.
16. Docker. *Resource constraints*. https://docs.docker.com/engine/containers/resource_constraints/. Acesso em 13/11/2026.

## 9. Uso de IA

Usei o Claude Code para ler o código da API, levantar hipóteses, rodar as medições e os diagnósticos, consolidar resultados e redigir este texto e o `experimentos.md`. Os números saem de `resultados/` via `analise/resumir.js`, sem digitação. Os resumos das fontes vieram de leitura automatizada (os PDFs dos artigos foram lidos por extração de texto pela IA); antes de enviar, o autor deve reabrir as fontes e conferir as frases citadas. A escolha das hipóteses, os descartes e a revisão final são do autor.
