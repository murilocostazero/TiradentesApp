require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Conectar ao banco de dados
mongoose.connect(config.connectionString);

// Criar a aplicação express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));

// Importar as rotas
const userRoute = require('./routes/user.route');
const schoolRoute = require('./routes/school.route');
const classroom = require('./routes/classroom.route');
const student = require('./routes/student.route');

// Usar as rotas
app.use('/', userRoute);
app.use('/school', schoolRoute);
app.use('/classroom', classroom);
app.use('/student', student);

// Iniciar o servidor
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

module.exports = app;