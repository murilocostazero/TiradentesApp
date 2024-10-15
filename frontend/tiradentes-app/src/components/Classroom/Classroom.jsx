import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import './Classroom.css'; // Estilizações específicas
import axiosInstance from '../../utils/axiosIntance';
import StatusBar from '../StatusBar/StatusBar';

const Classrooms = ({ userInfo }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [grade, setGrade] = useState(0);
    const [className, setClassName] = useState('');
    const [shift, setShift] = useState('vespertino');

    const [tempDeletedClassroom, setTempDeletedClassroom] = useState(null);
    const [isUndoVisible, setIsUndoVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [statusBar, setStatusBar] = useState({
        message: '',
        type: '',
        isVisible: false,
    });

    useEffect(() => {
        getClassrooms();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const showStatusBar = (message, type) => {
        setStatusBar({
            message,
            type,
            isVisible: true,
        });
    };

    const hideStatusBar = () => {
        setStatusBar((prev) => ({
            ...prev,
            isVisible: false,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setGrade(0);
        setClassName('');
        setShift('');
    };

    const getClassrooms = async () => {
        try {
            const response = await axiosInstance.get(`/classroom/school/${userInfo.lastSelectedSchool}`);
            if (response.status === 404 || response.status === 500) {
                showStatusBar('Nenhuma turma encontrada', 'error');
            } else {
                setClassrooms(response.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Função para adicionar uma nova turma
    const addClassroom = async () => {
        //API call
        try {
            const response = await axiosInstance.post(`/classroom`, {
                shift: shift === 'matutino' ? 'morning' : 'afternoon',
                grade: grade,
                className: className,
                school: userInfo.lastSelectedSchool
            });

            if (response.status === 400 || response.status === 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                getClassrooms();
            }
        } catch (error) {
            console.log(error)
            showStatusBar('Um erro inesperado aconteceu. Tente novamente.', 'error');
        }
        closeModal();
    };

    const handleAddOrEditClassroom = async () => {
        if (isEditing) {
            // Aqui você edita a turma através da API
            // fetch(`/api/classrooms/${selectedClassroom.id}`, {method: 'PUT', body: selectedClassroom})
        } else {
            // Aqui você cria a turma através da API
            // fetch('/api/classrooms', {method: 'POST', body: {shift, grade, className, totalStudents}})

            if (!grade || !className || !shift) {
                showStatusBar('Todos os campos são obrigatórios.', 'error');
            } else if (Number.isInteger(grade)) {
                showStatusBar('Série/ano deve ser um número inteiro', 'error');
            } else {
                addClassroom();
            }
        }
    };

    const handleDeleteClassroom = (id) => {
        const classroomToDelete = classrooms.find(cls => cls.id === id);
        setTempDeletedClassroom(classroomToDelete);
        setClassrooms(classrooms.filter(cls => cls.id !== id));
        setIsUndoVisible(true);
        const timeout = setTimeout(() => {
            // Aqui você deleta permanentemente a turma da API
            // fetch(`/api/classrooms/${id}`, { method: 'DELETE' });
            setTempDeletedClassroom(null);
            setIsUndoVisible(false);
        }, 5000);
        setTimeoutId(timeout);
    };

    const handleUndoDelete = () => {
        setClassrooms([...classrooms, tempDeletedClassroom]);
        setTempDeletedClassroom(null);
        setIsUndoVisible(false);
        clearTimeout(timeoutId);
    };

    const handleEditClassroom = (classroom) => {
        setSelectedClassroom(classroom);
        setIsEditing(true);
        openModal();
    };

    return (
        <div>
            <h2>Turmas da escola selecionada</h2>
            <div className="classroom-container flex">
                <div className="grid grid-cols-4 gap-4">
                    {classrooms.map((classroom) => (
                        <div key={classroom._id} className="classroom-item">
                            <h3 className='font-bold'>{classroom.grade}º ANO {classroom.className.toUpperCase()}</h3>
                            <p>Turno: {classroom.shift === 'morning' ? 'matutino' : 'vespertino'}</p>
                            <p>Total de alunos: {classroom.totalStudents}</p>
                            <div className="actions">
                                <button onClick={() => handleEditClassroom(classroom)} className="edit-btn">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeleteClassroom(classroom.id)} className="delete-btn">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={openModal} className="add-btn fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg">
                    <FaPlus size={22} />
                </button>

                {isUndoVisible && (
                    <div className="undo-container">
                        <p>Turma removida</p>
                        <button onClick={handleUndoDelete} className="undo-btn">
                            <FaUndo /> Desfazer
                        </button>
                        <div className="countdown-circle"></div>
                    </div>
                )}

                {/* Modal para adicionar nova escola */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Alterar turma' : 'Adicionar nova turma'}</h2>

                            <div className='mb-2 border-2 rounded-md p-2'>
                                <label>Série/Ano
                                    <input
                                        type="number"
                                        placeholder='Ex.: 6, 7, 8...'
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        required
                                        className='w-full focus:outline-none'
                                    />
                                </label>
                            </div>

                            <div className='mb-2 border-2 rounded-md p-2'>
                                <label>Turma
                                    <input
                                        type="text"
                                        placeholder='Ex.: A, B, C...'
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        required
                                        className='w-full focus:outline-none'
                                    />
                                </label>
                            </div>

                            <div className='mb-2 border-2 rounded-md p-2'>
                                <label>Turno
                                    <select
                                        value={shift}
                                        onChange={(e) => setShift(e.target.value)}
                                        required
                                        className='w-full'
                                    >
                                        <option value="" disabled>Clique para escolher</option>
                                        <option value="matutino">Matutino</option>
                                        <option value="vespertino">Vespertino</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        closeModal();
                                    }}
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddOrEditClassroom}
                                    className="px-4 py-2 bg-primary text-white rounded"
                                >
                                    {isEditing ? 'Salvar alterações' : 'Adicionar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <StatusBar
                message={statusBar.message}
                type={statusBar.type}
                isVisible={statusBar.isVisible}
                onClose={hideStatusBar}
            />
        </div>
    );
};

export default Classrooms;
