require('dotenv').config();
const express = require('express');
const routes = require('./src/routes/routes');

const app = express();

app.use(express.json());
app.use('/api', routes); // Adiciona o prefixo /api antes de todas as rotas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});