const express = require('express');
const router = express.Router();
const School = require('../models/school.model'); // Certifique-se de importar o modelo de School
const { authenticateToken } = require('../utilities');
const { default: mongoose } = require('mongoose');

// Buscar uma escola por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const school = await School.findById(req.params.id).populate('team');
        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada' });
        }
        res.json(school);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar escola', error });
    }
});

// Remover uma escola
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada' });
        }
        res.json({ message: 'Escola removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover escola', error });
    }
});

// Adicionar uma nova escola
router.post('/', authenticateToken, async (req, res) => {
    const { name, address, phoneNumber, team } = req.body;

    if (!name || !address || !phoneNumber) {
        return res.status(400).json({ message: 'Nome, endereço e telefone são obrigatórios' });
    }

    try {
        // Adicionar o usuário logado automaticamente à equipe de direção
        const userId = req.user._id; // ID do usuário autenticado
        // Converte o userId para ObjectId, se necessário
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const newSchool = new School({
            name,
            address,
            phoneNumber,
            team: [userObjectId, ...(Array.isArray(team) ? team : [])], // Garante que equipeDirecao seja um array
        });

        await newSchool.save();
        res.status(201).json({ message: 'Escola criada com sucesso', school: newSchool });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erro ao criar escola', error });
    }
});


// Alterar uma escola
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, address, phoneNumber } = req.body;

    try {
        const school = await School.findByIdAndUpdate(
            req.params.id,
            { name, address, phoneNumber },
            { new: true }
        );

        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada' });
        }

        res.json({ message: 'Escola atualizada com sucesso', school });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar escola', error });
    }
});

// Buscar todas as escolas em que o usuário está na equipe de direção
router.get('/team/:userId', authenticateToken, async (req, res) => {
    try {
        const schools = await School.find({ team: req.params.userId });
        if (schools.length === 0) {
            return res.status(404).json({ message: 'Nenhuma escola encontrada para este usuário' });
        }
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar escolas para o usuário', error });
    }
});

module.exports = router;