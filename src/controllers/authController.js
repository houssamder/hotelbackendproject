const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();


exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isadmin:  false,
      },
    });

    res.status(201).json({ message: 'Client enregistré', client });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erreur lors de l’enregistrement du client' });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      return res.status(401).json({ error: 'Client not found' });
    }

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        isadmin: client.isadmin,
        createdAt: client.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};
