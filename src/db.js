// db.js
const { Client } = require('pg');

// Crée une instance de client pour se connecter à la base de données PostgreSQL
const client = new Client({
  user: 'postgres', // nom d'utilisateur PostgreSQL
  host: 'localhost', // hôte local
  database: 'hotel_db', // nom de ta base de données
  password: 'salah123', // mot de passe de l'utilisateur postgres
  port: 5432, // port par défaut
});

client.connect()
  .then(() => console.log('Connexion à PostgreSQL réussie !'))
  .catch(err => console.error('Erreur de connexion', err.stack));

module.exports = client;
