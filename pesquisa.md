# Pesquisa: o que a literatura e o mercado dizem, problema por problema

Este arquivo reúne a pesquisa por problema, com as alternativas, o que cada uma custa e o que foi feito neste repositório. O raciocínio e os resultados estão no [artigo](artigo/artigo.md); as medições, em [`experimentos.md`](experimentos.md); o que não foi testado, em [`proximos-testes.md`](proximos-testes.md); e as evidências de diagnóstico, em [`diagnostico/`](diagnostico/README.md). Os números [N] seguem as referências do artigo.

**Como ler "fato" e "opinião":** o que está entre aspas ou atribuído a uma fonte é fato daquela fonte; frases marcadas "leitura minha" são opinião e não foram testadas.

## 1. Conexão nova por consulta

| Fonte | Tipo | O que diz | Limite para este caso |
|---|---|---|---|
| PostgreSQL 16, *How Connections Are Established* [1] | documentação oficial | um processo supervisor cria um processo de backend a cada conexão | descreve o mecanismo, sem medir o custo |
| node-postgres, *Pooling* [2] | documentação do driver | recomenda pool em aplicações web; o handshake de uma conexão nova "pode levar 20–30 ms" | não informa o tamanho ideal |
| HikariCP, *About Pool Sizing* [3] | mercado | pools pequenos, perto de núcleos × 2 + discos, calibrados sob carga | é para a JVM; vale como ponto de partida |
| Percona, Camargos [4] | mercado (benchmark) | com 56 clientes a conexão direta teve ~2,5× a vazão do PgBouncer; com 150+ clientes o pooler passou a ajudar | é pooler **externo**; o pool deste trabalho fica dentro da API |
| GitLab, Peterse (2017) [21] | caso de empresa | PgBouncer em modo transação baixou as conexões ativas de algumas centenas para 10–20 e o `max_connections` de 3.000 para 300; CPU do primário de ~70% para 10–20% (junto com balanceamento de leitura) | escala muito maior; não isola o efeito do pool; transação exige abrir mão de *prepared statements* |
| [Microsoft Azure, Savjani (2019)](https://azure.microsoft.com/en-us/blog/performance-best-practices-for-using-azure-database-for-postgresql-connection-pooling/) | caso de fornecedor | com abertura de conexão a cada transação (pgbench, escala 5, 2 vCores), PgBouncer deu 4× de vazão (texto do autor) | benchmark sintético de fornecedor, não citado no artigo |

**Alternativas e custo:** pool na API (sem serviço novo; risco de pool pequeno enfileirar); PgBouncer (mais um container; restringe recursos de sessão; a fonte [4] indica perda em escala pequena).
**Feito:** pool de 20 conexões na API (01c): vazão 1,8 → 2,0 req/s, p95 no ruído. **Não aplicado:** PgBouncer (ficha em `proximos-testes.md`).
**Leitura minha:** com 20 usuários virtuais e o banco já saturado, o pool tinha pouco a ganhar; o resultado é coerente com [4].

## 2. Consultas em laço (N+1)

| Fonte | Tipo | O que diz | Limite |
|---|---|---|---|
| Chen et al., ICSE 2014 [5] | acadêmica | *one-by-one processing* ("repeatedly performs similar database operations in loops"); corrigi-lo reduziu o tempo de resposta em 20–32% em 4 de 9 suítes de um sistema aberto e em 69% num industrial; nas demais, sem efeito significativo ("not all anti-patterns are worth fixing") | ORM em Java, não SQL direto |
| Sentry, McKerlie (2020) [6] | caso de mercado | mediana de uma página de 3,41 s para 290 ms | sem detalhe de amostragem |
| Laravel Cloud, Guimarães e Beggs (2026) [22] | caso de empresa | média de uma rota de 907 para 354 ms e p95 de 1,44 s para 624 ms (≈100 para ≈50 consultas por requisição) corrigindo N+1, dados redundantes e carga adiada, ao longo de um mês | mudanças somadas; não isola o N+1 |

**Alternativas e custo:** 3 consultas fixas com `ANY` (sem custo extra; exige manter a ordem e os tipos do contrato); `json_agg` no banco (risco ao formato de datas do contrato).
**Feito:** 3 consultas fixas (03): rota `pedidos-do-cliente` p95 2356,8 → 1190,3 ms (-49%); p95 geral no ruído. **Não aplicado:** `json_agg`.

## 3. Chaves estrangeiras e filtros sem índice

| Fonte | Tipo | O que diz | Limite |
|---|---|---|---|
| PostgreSQL 16, *Constraints* [7] | documentação | declarar uma chave estrangeira não cria índice | — |
| PostgreSQL 16, *Indexes on Expressions* [8] | documentação | índice de expressão serve a consultas com a mesma expressão, ao custo de calculá-la a cada escrita | — |
| PostgreSQL 16, *Indexes and ORDER BY* [9] | documentação | um índice pode entregar linhas ordenadas e, com `ORDER BY ... LIMIT`, ler só as primeiras | — |
| Render, Fritz (2024) [12] | caso de mercado | `DELETE` de 19 s para 342 ms ao indexar as chaves estrangeiras | é outra operação; vale pelo mecanismo |
| Datadog, Noveljic e Chen (2026) [20] | caso de empresa | índice alinhado ao predicado (`org_id`, `dbms`) levou a latência média de mais de 300 ms a 38 µs; o custo do nó caiu de 317.000 para 104,9 | ambiente maior; mesmo mecanismo do índice composto deste trabalho |
| Winand [10] | referência técnica | o `OFFSET` obriga a buscar as linhas puladas; o *keyset* filtra pelo último valor visto | — |
| PostgreSQL Wiki, *Slow Counting* [11] | documentação | contar com exatidão é caro por causa do MVCC | — |

**Alternativas e custo:** um índice por coluna filtrada (4,7 a 21 MB cada; escrita mais lenta); composto com a ordenação (06); paginação por *keyset* (não testada, muda o contrato da paginação).
**Feito:** 02a, 02b, 04 e 06. Evidência de plano antes e depois em [`diagnostico/comparativo-planos.md`](diagnostico/comparativo-planos.md): por exemplo `itens-do-pedido` de 200,765 para 0,106 ms e `pedidos-status-pagina-1` de 245,200 para 0,107 ms.
**Achado do diagnóstico:** a página 1000 caiu de 779,429 para 32,490 ms, mas ainda lê 20.101 blocos: o índice não elimina o custo do `OFFSET`. Isso sustenta a ficha de *keyset* em `proximos-testes.md`.

## 4. Rotas que continuam lentas (não aplicadas)

| Fonte | Tipo | O que diz | Limite |
|---|---|---|---|
| PostgreSQL 16, *pg_trgm* [17] | documentação | índices trigrama suportam `LIKE`/`ILIKE` sem âncora à esquerda; padrão sem trigramas extraíveis degenera em varredura do índice inteiro | — |
| PostgreSQL 16, *Materialized Views* [18] | documentação | guarda o resultado como tabela; leitura mais rápida, dados defasados até o refresh | pode alterar o que a rota devolve |
| PostgreSQL 16, *REFRESH MATERIALIZED VIEW* [19] | documentação | o refresh substitui o conteúdo; sem `CONCURRENTLY` pode bloquear leituras; com ele exige índice único | — |

**Evidência do diagnóstico:** `top-produtos` 3.654,548 → 2.766,131 ms e `vendas-por-dia` 878,755 → 124,510 ms (ainda com varredura sequencial em `pedidos`); `busca-produtos` em torno de 20–27 ms por varredura de `produtos`. Depois, `vendas-por-dia` e `top-produtos` foram reescritas (mudanças 12a e 12b em [`experimentos.md`](experimentos.md)); as fichas do que ficou por testar estão em [`proximos-testes.md`](proximos-testes.md).

## 5. Recursos e método de medição

| Fonte | Tipo | O que diz | Limite |
|---|---|---|---|
| Docker, *Resource constraints* [16] | documentação | `--cpus` limita a CPU; por padrão, em estouro de memória o kernel mata processos do container | — |
| k6, *Open and closed models* [14] | documentação | no modelo fechado a carga cai quando o sistema desacelera | — |
| Schroeder et al., NSDI 2006 [15] | acadêmica | "a vast difference in behavior between open and closed models" | — |
| Dean e Barroso, CACM 2013 [13] | acadêmica | episódios de alta latência, irrelevantes em sistemas moderados, "may come to dominate overall service performance at large scale" | o argumento é para muitos servidores por requisição |

**Alternativas e custo:** reduzir os limites da API (-10% de CPU e -17% de memória reservados); mais CPU ao banco (sobe a conta).
**Feito:** API a 0,35 CPU e 128 MiB (11d), sem OOM (pico de 99,1 MiB); 0,25 CPU piorou as rotas leves (11b). A CPU por requisição caiu de 555,8 para 85,3 ms no banco e de 44,5 para 17,7 ms na API (seção "CPU gasta por requisição" de [`analise/saida/resumo.md`](analise/saida/resumo.md)).

## O que não encontrei

- **Caso de empresa com redução medida do custo de instância** depois de otimizar consultas: as buscas devolveram relatos individuais com números que não consegui verificar (que não usei) e posts de empresas que medem latência, não custo. O custo aqui é medido por reserva de recursos e CPU por requisição.
- **Fonte acadêmica sobre indexação em PostgreSQL:** as fontes de índice são documentação oficial e casos de mercado; a evidência acadêmica do trabalho é sobre N+1 [5], latência de cauda [13] e modelos de carga [15].
