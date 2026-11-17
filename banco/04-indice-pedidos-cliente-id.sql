-- 04-indice-pedidos-cliente-id.sql
-- Hipótese H02b: buscar os pedidos de um cliente (WHERE cliente_id = $1) varria
-- pedidos inteira (diagnostico/20261116-164440-1e48069/02-explain-pedidos-do-cliente.txt).
-- Experimento: experimentos.md, mudança 02b.
CREATE INDEX pedidos_cliente_id_idx ON pedidos (cliente_id);
