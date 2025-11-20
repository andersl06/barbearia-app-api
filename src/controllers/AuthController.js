const supabase = require('../config/supabaseClient');

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  // Cria o usuário lá no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } } // Guarda o nome também
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ msg: 'Usuário criado!', user: data.user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Faz login no Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: 'Email ou senha errados' });

  return res.json({ token: data.session.access_token, user: data.user });
};