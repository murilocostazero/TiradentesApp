import React, { useState, useEffect } from 'react';
import { MdArrowBack } from "react-icons/md";
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { dateToString } from '../../utils/helper';
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosIntance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import InputMask from 'react-input-mask';

const SelectedStudent = ({ deselectStudent, student, classrooms, selectedStudentsClass }) => {

    const [fullName, setName] = useState(student.fullName);
    const [contact, setContact] = useState(student.contact);
    const [cpf, setCpf] = useState(student.cpf);
    const [dateOfBirth, setDateOfBirth] = useState(dateToString(student.dateOfBirth));
    const [guardianName, setResponsible] = useState(student.guardianName);
    const [guardianContact, setGuardianContact] = useState(student.guardianContact);
    const [behavior, setBehavior] = useState(student.behavior);
    const [address, setAddress] = useState(student.address);
    const [gender, setGender] = useState(student.gender);
    const [occurrences, setOccurrences] = useState(student.occurrences || []);
    const [positiveFacts, setPositiveFacts] = useState(student.positiveFacts || []);

    const [statusBar, setStatusBar] = useState({ message: '', type: '', isVisible: false });
    const [loadingSaveStudent, setSaveStudent] = useState(false);

    useEffect(() => {
        console.log(classrooms)
    }, []);

    const editStudent = async () => {
        if (!fullName || !contact || !cpf || !dateOfBirth || !guardianName || !guardianContact || !address || !gender || !behavior) {
            showStatusBar('Nenhum dos campos deve ficar vazio', 'error');
        } else {
            setSaveStudent(true);
            try {
                const response = await axiosInstance.put(`/student/${student._id}`, {
                    fullName: fullName,
                    contact: contact,
                    cpf: cpf,
                    dateOfBirth: dateOfBirth,
                    guardianName: guardianName,
                    guardianContact: guardianContact,
                    address: address,
                    gender: gender,
                    behavior: behavior,
                }, {
                    timeout: 10000, // 10 segundos
                });

                if (response.status >= 400 && response.status <= 500) {
                    showStatusBar(response.data.message, 'error');
                    // BUSCAR O ALUNO NOVAMENTE E PREENCHER OS CAMPOS
                }
            } catch (error) {
                console.error('Erro ao atualizar os dados do aluno:', error);
                showStatusBar('Houve um problema ao atualizar os dados do aluno. Tente novamente.', 'error');
            }
            setSaveStudent(false);
        }
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

    return (
        <div className='w-full h-full'>
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md">
                {/* Seta de Voltar e Nome do Aluno */}
                <div className="flex items-center">
                    <MdArrowBack
                        className="text-slate-500 hover:text-primary cursor-pointer"
                        fontSize={20}
                        onClick={() => deselectStudent()}
                    />
                    <span className="ml-4 font-bold text-lg">{student.fullName.toUpperCase()}</span>
                </div>

                {/* Turma e Botão "Trocar de Turma" */}
                <div className="flex items-center gap-2">
                    <span className="text-black font-bold">
                        {`${selectedStudentsClass.grade}º ano ${selectedStudentsClass.className}`}
                    </span>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded transition"
                        onClick={() => { }}
                    >
                        Trocar de turma
                    </button>
                </div>
            </div>


            {/* Corpo do Conteúdo: Foto e Informações Pessoais */}
            {
                loadingSaveStudent ?
                    <LoadingSpinner /> :
                    <div className="flex space-x-6 mt-8">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-300">
                            {/* Simula a imagem do perfil */}
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Foto do Aluno"
                                className="w-full h-full object-cover"
                            />

                            {/* Gradiente na parte inferior */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>

                            {/* Botão de câmera */}
                            <button
                                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                                onClick={() => alert('Trocar foto')}
                            >
                                <FaCamera className="text-black text-lg" />
                            </button>
                        </div>

                        {/* Informações Pessoais (Inputs Editáveis) */}
                        <div className="flex-1 bg-white p-4 rounded-md shadow-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nome</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Contato</label>
                                    <InputMask
                                        mask="(99)99999-9999"
                                        value={contact}
                                        onChange={(e) => {
                                            setContact(e.target.value);
                                        }}
                                        placeholder="(99)98122-3344"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {(inputProps) => <input {...inputProps} type="text" />}
                                    </InputMask>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">CPF</label>
                                    <InputMask
                                        mask="999.999.999-99"
                                        value={cpf}
                                        onChange={(e) => {
                                            setCpf(e.target.value);
                                        }}
                                        placeholder="000.111.222-33"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {(inputProps) => <input {...inputProps} type="text" />}
                                    </InputMask>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Data de nascimento</label>
                                    <InputMask
                                        mask="99/99/9999"
                                        value={dateOfBirth}
                                        onChange={(e) => {
                                            setDateOfBirth(e.target.value);
                                        }}
                                        placeholder="DD/MM/AAAA"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {(inputProps) => <input {...inputProps} type="text" />}
                                    </InputMask>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Responsável</label>
                                    <input
                                        type="text"
                                        value={guardianName}
                                        onChange={(e) => setResponsible(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Contato do responsável</label>
                                    <InputMask
                                        mask="(99)99999-9999"
                                        value={guardianContact}
                                        onChange={(e) => {
                                            setGuardianContact(e.target.value);
                                        }}
                                        placeholder="(99)98122-3344"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {(inputProps) => <input {...inputProps} type="text" />}
                                    </InputMask>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Endereço</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Gênero</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                        <option value="other">Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Comportamento</label>
                                    <select
                                        value={behavior}
                                        onChange={(e) => setBehavior(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Excellent">Excelente</option>
                                        <option value="Good">Bom</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Bad">Ruim</option>
                                        <option value="Terrible">Péssimo</option>
                                    </select>
                                </div>
                                <button
                                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition"
                                    onClick={() => editStudent()}
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
            }

            {/* Ocorrências e Fo+ */}
            <div className="mt-6 bg-white p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Ocorrências e Fo+</h2>

                {occurrences.length > 0 || positiveFacts.length > 0 ? (
                    <div className="space-y-4">
                        {/* Ocorrências */}
                        <div>
                            <h3 className="font-medium text-gray-700">Ocorrências</h3>
                            <ul className="list-disc ml-5">
                                {occurrences.map((occurrence, index) => (
                                    <li key={index} className="text-gray-600">
                                        {occurrence}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fatos Positivos */}
                        <div>
                            <h3 className="font-medium text-gray-700">Fo+</h3>
                            <ul className="list-disc ml-5">
                                {positiveFacts.map((fact, index) => (
                                    <li key={index} className="text-gray-600">
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Nenhuma ocorrência ou fato positivo registrado.</p>
                )}
            </div>
            <StatusBar
                message={statusBar.message}
                type={statusBar.type}
                isVisible={statusBar.isVisible}
                onClose={hideStatusBar}
            />
        </div>
    )
}

export default SelectedStudent