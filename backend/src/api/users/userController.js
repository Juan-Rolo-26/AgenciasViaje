const users = [
  {
    id: "1",
    name: "Valentina Romero",
    email: "vale@topotours.com"
  }
];

async function listUsers(req, res, next) {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function signup(req, res, next) {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: "Nombre y email son obligatorios" });
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const user = users.find((item) => item.email === email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({
      message: "Login exitoso",
      user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  signup,
  login
};
