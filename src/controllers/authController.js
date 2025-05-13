const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.utilisateur.create({
      data: {
        username,
        password: hashedPassword,
        role
      }
    });
    res.status(201).json({ message: 'Utilisateur enregistré', user });
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l’enregistrement' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.utilisateur.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    res.json({ message: 'Connexion réussie', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};
