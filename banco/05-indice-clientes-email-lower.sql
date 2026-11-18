-- 05-indice-clientes-email-lower.sql
-- Hipótese H04: buscar cliente por e-mail (WHERE lower(email) = lower($1)) varria
-- clientes inteira (diagnostico/20261116-164440-1e48069/02-explain-clientes-email.txt).
-- Índice de expressão: só é usado porque a consulta aplica exatamente lower(email).
-- Experimento: experimentos.md, mudança 04.
CREATE INDEX clientes_email_lower_idx ON clientes (lower(email));
