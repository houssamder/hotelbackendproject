const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        isadmin: false, 
      },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createClient = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const client = await prisma.client.create({
      data: { name, email, phone }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du client' });
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { name, email, phone }
    });
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la suppression' });
  }
};
