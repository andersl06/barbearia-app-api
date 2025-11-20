const express = require('express');
const routes = express.Router();
const AuthController = require('../controllers/AuthController');

// Rota de Teste (só para ver se o servidor responde)
routes.get('/', (req, res) => {
  return res.json({ message: 'Servidor rodando!' });
});

// Rotas de Autenticação
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

module.exports = routes;