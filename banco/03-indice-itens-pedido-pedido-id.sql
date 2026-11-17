-- 03-indice-itens-pedido-pedido-id.sql
-- Hipótese H02a: buscar os itens de um pedido (WHERE pedido_id = $1) varria
-- itens_pedido inteira (diagnostico/20261116-164440-1e48069/02-explain-itens-do-pedido.txt).
-- Experimento: experimentos.md, mudança 02a.
CREATE INDEX itens_pedido_pedido_id_idx ON itens_pedido (pedido_id);
