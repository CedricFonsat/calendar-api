// app.js

const express = require('express');
const mongoose = require('mongoose');
const { mongodb } = require('./config');
const cors = require('cors');



const app = express();

// Configuration de la connexion à MongoDB
mongoose.connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB établie.');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
    process.exit(1);
  });

  app.use(cors({
    origin: 'http://127.0.0.1:5500'
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Définir le dossier contenant vos fichiers statiques (HTML, CSS, JS, etc.)
app.use(express.static('public'));

// Définition du modèle de données pour les événements
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
});
const Event = mongoose.model('Event', eventSchema);




// Définir la route pour afficher votre fichier HTML
app.get('/', (req, res) => {
  res.sendFile('/public/index.html');
});

// Routes pour le CRUD des événements
app.get('/events', (req, res) => {
  Event.find({})
    .then((events) => {
      res.json(events);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des événements :', error);
      res.sendStatus(500);
    });
});

app.post('/events', (req, res) => {
  const { title, description, start, end } = req.body;
  const event = new Event({ title, description, start, end });
  event.save()
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Erreur lors de la création de l\'événement :', error);
      res.sendStatus(500);
    });
});

app.put('/events/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, start, end } = req.body;
    Event.findByIdAndUpdate(id, { title, description, start, end })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de l\'événement :', error);
        res.sendStatus(500);
      });
  });
  
  app.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    Event.findByIdAndDelete(id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de l\'événement :', error);
        res.sendStatus(500);
      });
  });
  
  //...
  
  // Démarrage du serveur
  app.listen(3001, () => {
    console.log('Serveur démarré sur le port 3001.');
  });
  