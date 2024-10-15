const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { authenticateToken } = require('../utilities');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.json({ data: 'Olá mundo!' });
});

// Rota de criação de conta
router.post('/create-account', async (req, res) => {
    const { name, rank, email, password } = req.body;

    if (!name) {
        return res.status(400).json({ error: true, message: 'Nome é um campo obrigatório' });
    }

    if (!rank) {
        return res.status(400).json({ error: true, message: 'Patente é um campo obrigatório' });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: 'Email é um campo obrigatório' });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: 'Senha é um campo obrigatório' });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.json({ error: true, message: 'Usuário já cadastrado' });
    }

    const user = new User({
        name,
        rank,
        email,
        password
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3600m'
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Cadastro completo'
    });
});

router.put('/lastSelectedSchool/:id', async (req, res) => {
    const { lastSelectedSchool } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { lastSelectedSchool: lastSelectedSchool },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ err: true, message: 'Email é um campo obrigatório' });
    }

    if (!password) {
        return res.status(400).json({ err: true, message: 'Senha é um campo obrigatório' });
    }

    const userInfo = await User.findOne({email: email});
    
    if(!userInfo){
        return res.status(400).json({message: 'Usuário não encontrado'});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '3600m'
        });

        return res.json({
            error: false,
            message: 'Login completo',
            email,
            accessToken
        });
    } else {
        return res.json({
            error: true,
            message: 'Credenciais inválidas'
        });
    }
});

router.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });
    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: ''
    });
});

module.exports = router;