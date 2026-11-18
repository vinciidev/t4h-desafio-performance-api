-- 06-indice-pedidos-status-criado-em.sql
-- Hipótese H06: listar pedidos por status (WHERE status = $1 ORDER BY criado_em DESC, id DESC
-- LIMIT/OFFSET) varria pedidos inteira e ordenava a cada chamada
-- (diagnostico/20261116-164440-1e48069/02-explain-pedidos-status-pagina-1.txt e -pagina-1000.txt).
-- O índice composto entrega as linhas já ordenadas dentro de cada status.
-- Experimento: experimentos.md, mudança 06.
CREATE INDEX pedidos_status_criado_em_idx ON pedidos (status, criado_em DESC, id DESC);
