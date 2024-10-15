const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom.model');
const { authenticateToken } = require('../utilities');

// Buscar uma turma por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const classItem = await Classroom.findById(req.params.id).populate('school');
        if (!classItem) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        res.json(classItem);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar a turma', error });
    }
});

// Buscar todas as turmas de uma escola
router.get('/school/:schoolId', authenticateToken, async (req, res) => {
    try {
        const classes = await Classroom.find({ school: req.params.schoolId });
        if (classes.length === 0) {
            return res.status(404).json({ message: 'Nenhuma turma encontrada para esta escola' });
        }
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as turmas da escola', error });
    }
});

// Criar uma nova turma
router.post('/', authenticateToken, async (req, res) => {
    const { shift, grade, className, school, totalStudents } = req.body;

    if (!shift || !grade || !className || !school) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios' });
    }

    try {
        const newClassroom = new Classroom({
            shift,
            grade,
            className,
            school,
            totalStudents
        });

        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar a turma', error });
    }
});

// Editar os dados de uma turma
router.put('/:id', authenticateToken, async (req, res) => {
    const { shift, grade, className, totalStudents } = req.body;

    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            { shift, grade, className, totalStudents },
            { new: true }
        );

        if (!updatedClassroom) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }

        res.json(updatedClassroom);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar a turma', error });
    }
});

// Deletar uma turma
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
        if (!deletedClassroom) {
            return res.status(404).json({ message: 'Turma não encontrada' });
        }
        res.json({ message: 'Turma deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar a turma', error });
    }
});

module.exports = router;
