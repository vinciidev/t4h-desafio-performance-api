const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'loja',
  database: process.env.DB_NAME || 'loja',
};

// Pool de conexões em vez de uma conexão nova por consulta: no PostgreSQL cada
// conexão é um processo novo no servidor, e /clientes/:id/pedidos abria 16-17
// por requisição (diagnostico/20261116-164528-*-contar-clientes-42-pedidos.txt).
// Tamanho do pool: ver experimentos.md, mudança 01.
const pool = new Pool({ ...config, max: 20 });

// Sem este ouvinte, um erro em conexão ociosa derruba o processo Node.
pool.on('error', (erro) => {
  console.error('erro em conexão ociosa do pool:', erro.message);
});

async function consultar(sql, parametros = []) {
  const resultado = await pool.query(sql, parametros);
  return resultado.rows;
}

module.exports = { consultar };
