-- 07-indice-pedidos-criado-em.sql
-- Hipótese H12: o relatório vendas-por-dia filtra por dia (WHERE criado_em::date BETWEEN ...) e o
-- plano varre pedidos inteira (Parallel Seq Scan, ~495 mil linhas descartadas, ~20 mil blocos;
-- diagnostico/20261118-014212-a8050f5/02-explain-vendas-por-dia-7-dias.txt). Com o cast na coluna,
-- nenhum índice em criado_em poderia ser usado; a rota passa a filtrar por intervalo
-- (criado_em >= início e criado_em < fim + 1 dia), que devolve as mesmas linhas.
-- Experimento: experimentos.md, mudança 12.
CREATE INDEX pedidos_criado_em_idx ON pedidos (criado_em);
