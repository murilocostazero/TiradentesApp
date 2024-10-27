const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const Classroom = require('../models/classroom.model');
const { authenticateToken } = require('../utilities');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Rota 1: Buscar 1 aluno por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o aluno', error });
    }
});

// Rota 2: Adicionar 1 aluno e incrementar o total de alunos da turma escolhida
router.post('/', authenticateToken, async (req, res) => {
    console.log(req.body)
    try {
        const { fullName, dateOfBirth, cpf, gender, address, contact, guardianName, guardianContact, classroomId } = req.body;

        const newStudent = new Student({
            fullName,
            dateOfBirth,
            cpf,
            gender,
            address,
            contact,
            guardianName,
            guardianContact,
            classroom: classroomId
        });

        const savedStudent = await newStudent.save();

        // Incrementa o total de alunos da turma
        await Classroom.findByIdAndUpdate(classroomId, { $inc: { totalStudents: 1 } });

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar o aluno', error });
    }
});

// Rota 3: Editar os dados de 1 aluno (não é possível alterar a turma)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { fullName, dateOfBirth, cpf, gender, address, contact, guardianName, guardianContact, behavior } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            fullName,
            dateOfBirth,
            cpf,
            gender,
            address,
            contact,
            guardianName,
            guardianContact,
            behavior
        }, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar o aluno', error });
    }
});

// Rota 4: Remover 1 aluno e decrementar o total de alunos da turma
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        // Decrementa o total de alunos da turma
        await Classroom.findByIdAndUpdate(student.classroom, { $inc: { totalStudents: -1 } });

        res.json({ message: 'Aluno removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover o aluno', error });
    }
});

// Rota 5: Trocar o aluno de turma
router.put('/change-classroom/:id', authenticateToken, async (req, res) => {
    try {
        const { newClassroomId } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        const oldClassroomId = student.classroom;

        // Atualiza a turma do aluno
        student.classroom = newClassroomId;
        await student.save();

        // Decrementa o total de alunos da turma anterior
        await Classroom.findByIdAndUpdate(oldClassroomId, { $inc: { totalStudents: -1 } });

        // Incrementa o total de alunos da nova turma
        await Classroom.findByIdAndUpdate(newClassroomId, { $inc: { totalStudents: 1 } });

        res.json({ message: 'Turma do aluno alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao trocar a turma do aluno', error });
    }
});

// Rota 6: Mudar o comportamento de um aluno
router.put('/change-behavior/:id', authenticateToken, async (req, res) => {
    try {
        const { behavior } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { behavior }, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao alterar o comportamento do aluno', error });
    }
});

// Rota 7: Adicionar um fo+ ao aluno
router.put('/add-po/:id', authenticateToken, async (req, res) => {
    try {
        const { positiveObservation } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        student.positiveObservations.push(positiveObservation);
        await student.save();

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar o fo+ ao aluno', error });
    }
});

// Exclui uma positiveObservation por ID
router.put('/remove-po/:studentId/:poId', async (req, res) => {
    try {
        const { studentId, poId } = req.params;

        // Encontrar o aluno e remover a observação pelo ID
        const student = await Student.findByIdAndUpdate(
            studentId,
            { $pull: { positiveObservations: { _id: poId } } }, // Remove a observação com o _id correspondente
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Positive observation removed successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error removing positive observation', error });
    }
});


// Rota 9: Buscar todos os alunos de uma turma
router.get('/classroom/:classroomId', authenticateToken, async (req, res) => {
    try {
        const students = await Student.find({ classroom: req.params.classroomId }).sort({ fullName: 1 });

        if (students.length === 0) {
            return res.status(200).json([]);
        }

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os alunos da turma', error });
    }
});

//-------------------------------------------------- IMAGE ---------------------------
// Configurando o armazenamento de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // pasta onde a imagem será armazenada
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // nome único
    }
});

// Limite de 2MB para imagens
const upload = multer({ storage: storage, limits: { fileSize: 2000000 } });

// Rota para fazer upload da foto do aluno
router.put('/:id/upload-photo', authenticateToken, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: true, message: 'Nenhuma foto foi enviada.' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    try {
        // Encontre o aluno pelo ID
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: true, message: 'Aluno não encontrado' });
        }

        // Se o aluno já tiver uma foto, exclua-a
        if (student.photoUrl) {
            const oldPhotoPath = path.join(__dirname, '..', 'uploads', student.photoUrl.split('/').pop());
            fs.unlink(oldPhotoPath, (err) => {
                if (err) {
                    console.error("Erro ao excluir a foto anterior:", err);
                }
            });
        }


        // Atualiza a URL da nova foto no banco de dados
        const photoUrl = `/uploads/${req.file.filename}`;
        student.photoUrl = photoUrl;
        await student.save();

        res.json({ photoUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Erro ao atualizar o aluno com a foto.' });
    }
});

router.get('/:id/photo', authenticateToken, async (req, res, next) => {
    try {
        // Define o timeout de 10 segundos
        req.setTimeout(10000, () => {
            const err = new Error('Tempo limite da requisição excedido');
            err.status = 503;
            next(err);
        });

        // Buscar o aluno pelo ID
        const student = await Student.findById(req.params.id);

        if (!student || !student.photoUrl) {
            return res.status(404).json({ error: true, message: 'Foto não encontrada' });
        }

        // Caminho absoluto para a foto
        const photoPath = path.join(__dirname, '..', student.photoUrl);

        // Enviar a imagem como resposta
        res.sendFile(photoPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Erro ao buscar a foto' });
    }
});

module.exports = router;