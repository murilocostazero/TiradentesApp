const express = require('express');
const router = express.Router();
const Incident = require('../models/incident.model'); // Modelo de Incident
const { authenticateToken } = require('../utilities');

// 1. Rota que busca todas as ocorrências de um aluno
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const incidents = await Incident.find({ student: studentId });
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching incidents' });
  }
});

// 2. Rota que busca uma ocorrência por id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching incident' });
  }
});

// 3. Rota que cria uma ocorrência (POST)
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, student, severity, type, date, createdBy, resolved, resolution } = req.body;
  
    // Verificar campos obrigatórios
    if (!title || !description || !student || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    } 

    if(!date) return res.status(400).json({ error: 'Missing date' });

    if(!createdBy) return res.status(400).json({ error: 'Missing createdBy' });
  
    try {
      const newIncident = new Incident(req.body);
      const savedIncident = await newIncident.save();
      res.status(201).json(savedIncident);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error creating incident' });
    }
  });
  
  // 4. Rota que altera uma ocorrência (PUT)
  router.put('/:id', authenticateToken, async (req, res) => {
    const { title, description, student, severity, type, date, resolved, resolution } = req.body;
  
    // Verificar campos obrigatórios
    if (!title || !description || !student || !type || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const { id } = req.params;
      const updatedIncident = await Incident.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedIncident) {
        return res.status(404).json({ message: 'Incident not found' });
      }
  
      res.status(200).json(updatedIncident);
    } catch (error) {
      res.status(500).json({ error: 'Error updating incident' });
    }
  });  

// 5. Rota que deleta uma ocorrência
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIncident = await Incident.findByIdAndDelete(id);
    if (!deletedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting incident' });
  }
});

module.exports = router;