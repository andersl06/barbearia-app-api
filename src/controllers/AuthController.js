const supabase = require('../config/supabaseClient');

exports.register = async (req, res) => {
  // 1. Pegamos todos os campos que o documento pede 
  const { name, email, password, cpf, phone, gender, role, slug, barbershop_id } = req.body;

  try {
    // 2. Criamos o usuário no Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Aqui salvamos os dados extras do usuário (Metadados)
        data: {
          name,
          cpf,
          phone,
          gender,
          role: role || 'client', // Padrão é cliente se não for informado
          slug,
          barbershop_id,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 3. Retornamos exatamente o formato que o doc pede (token + user) [cite: 94]
    // O Supabase já retorna o token na sessão se o "Auto Confirm" estiver ligado no painel
    const session = data.session; 
    
    return res.status(201).json({
      token: session ? session.access_token : null, // Retorna o token
      user: {
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata // Espalha os dados extras (nome, cpf, etc) na resposta
      }
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: "E-mail ou senha incorretos" });
  }

  return res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata
    }
  });
};