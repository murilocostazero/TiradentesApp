import React, { useState, useEffect } from 'react';
import { MdArrowBack } from "react-icons/md";
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { dateToString } from '../../utils/helper';
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosIntance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import InputMask from 'react-input-mask';
import SelectClassroom from '../SelectClassroom/SelectClassroom';
import IncidentList from '../IncidentList/IncidentList';
import PositiveObservations from '../PositiveObservations/PositiveObservations';
import StudentPdf from './StudentPdf';

const SelectedStudent = ({ deselectStudent, student, classrooms, selectedStudentsClass, getStudent, userInfo }) => {

    const [fullName, setFullName] = useState(student.fullName);
    const [contact, setContact] = useState(student.contact);
    const [cpf, setCpf] = useState(student.cpf);
    const [dateOfBirth, setDateOfBirth] = useState(dateToString(student.dateOfBirth));
    const [guardianName, setGuardianName] = useState(student.guardianName);
    const [guardianContact, setGuardianContact] = useState(student.guardianContact);
    const [behavior, setBehavior] = useState(student.behavior);
    const [address, setAddress] = useState(student.address);
    const [gender, setGender] = useState(student.gender);
    const [positiveFacts, setPositiveFacts] = useState(student.positiveFacts || []);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [hasNewPhoto, setHasNewPhoto] = useState(false);

    const [statusBar, setStatusBar] = useState({ message: '', type: '', isVisible: false });
    const [loadingSaveStudent, setLoadingSaveStudent] = useState(false);
    const [loadingChangeClass, setLoadingChangeClass] = useState(false);
    const [loadingGetPhoto, setLoadingGetPhoto] = useState(false);
    const [showSearchClassroom, setShowSearchClassroom] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (student.photoUrl) {
            getProfilePicture();
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png'];

        // Verifica se o arquivo é jpg ou png
        if (!validTypes.includes(file.type)) {
            showStatusBar('Apenas arquivos JPG ou PNG são permitidos.', 'error');
            return;
        }

        // Verifica se o arquivo tem até 2MB
        if (file.size > 2 * 1024 * 1024) { // 2MB em bytes
            showStatusBar('O tamanho do arquivo deve ser de no máximo 2MB.', 'error');
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setHasNewPhoto(true);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            const response = await axiosInstance.put(
                `/student/${student._id}/upload-photo`, // Rota de upload configurada no backend com multer
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            showStatusBar('Sucesso ao enviar foto', 'success');
            setHasNewPhoto(false);
            setPreview('');

            getProfilePicture();
        } catch (error) {
            console.error('Error uploading photo:', error);
            showStatusBar('Falha ao enviar a foto', 'error');
        }
    };

    const getProfilePicture = async () => {
        setLoadingGetPhoto(true);
        try {
            const response = await axiosInstance.get(`/student/${student._id}/photo`, {
                responseType: 'blob' // para tratar a imagem como um arquivo blob
            }, {
                timeout: 10000
            });
            const imageURL = URL.createObjectURL(response.data);
            setSelectedFile(imageURL);
            setPreview(imageURL)
        } catch (error) {
            console.error("Erro ao carregar a foto do aluno:", error);
            showStatusBar('Erro ao carregar foto de perfil', 'error')
        }
        setLoadingGetPhoto(false);
    }

    const editStudent = async () => {
        if (!fullName || !contact || !cpf || !dateOfBirth || !guardianName || !guardianContact || !address || !gender || !behavior) {
            showStatusBar('Nenhum dos campos deve ficar vazio', 'error');
        } else {
            setLoadingSaveStudent(true);
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
                } else {
                    getStudent(student._id);
                }
            } catch (error) {
                console.error('Erro ao atualizar os dados do aluno:', error);
                showStatusBar('Houve um problema ao atualizar os dados do aluno. Tente novamente.', 'error');
            }
            setLoadingSaveStudent(false);
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

    const openSearchClass = () => {
        setShowSearchClassroom(!showSearchClassroom)
    }

    const filteredStudentsClass = classrooms.filter((classroom) =>
        classroom.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectClass = async (selectedClassroom) => {
        setLoadingChangeClass(true);
        try {
            const response = await axiosInstance.put(`/student/change-classroom/${student._id}`, {
                newClassroomId: selectedClassroom._id
            }, {
                timeout: 10000, // 10 segundos
            });

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                setShowSearchClassroom(false);
                getStudent(student._id);
            }
        } catch (error) {
            console.error('Erro ao atualizar os dados do aluno:', error);
            showStatusBar('Houve um problema ao atualizar os dados do aluno. Tente novamente.', 'error');
        }
        setLoadingChangeClass(false);
    }

    return (
        <div className='w-full h-full'>
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md">
                {/* Seta de Voltar e Nome do Aluno */}
                <div className="w-full flex items-center justify-between">
                    <MdArrowBack
                        className="text-slate-500 hover:text-primary cursor-pointer"
                        fontSize={20}
                        onClick={() => deselectStudent()}
                    />
                    <span className="ml-4 font-bold text-lg">{student.fullName.toUpperCase()}</span>

                    <StudentPdf student={student} />
                </div>
            </div>


            {/* Corpo do Conteúdo: Foto e Informações Pessoais */}
            {
                loadingSaveStudent ?
                    <LoadingSpinner /> :
                    <div className="flex space-x-6 mt-8 mb-8">
                        <div className="relative w-32 h-32">
                            <label className="cursor-pointer" htmlFor="photo-upload">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-300 border border-gray-400 flex items-center justify-center">
                                    {
                                        loadingGetPhoto ?
                                            <LoadingSpinner /> :
                                            preview ?
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                :
                                                <span className="text-gray-500">No Photo</span>

                                    }
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 rounded-full p-1">
                                    <FaCamera className="text-white text-sm" />
                                </div>
                            </label>

                            <input
                                type="file"
                                id="photo-upload"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {
                                selectedFile && hasNewPhoto ?
                                    <button
                                        onClick={handleUpload}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Fazer upload
                                    </button> :
                                    <div />
                            }
                        </div>

                        {/* Informações Pessoais (Inputs Editáveis) */}
                        <div className="flex-1 bg-white p-4 rounded-md shadow-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nome</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
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

            {/* Trocar de turma */}
            {
                loadingChangeClass ?
                    <LoadingSpinner /> :
                    <SelectClassroom
                        selectedStudentsClass={selectedStudentsClass}
                        openSearchClass={() => openSearchClass()}
                        showSearchClassroom={showSearchClassroom}
                        searchQuery={searchQuery}
                        handleSearchQuery={(e) => setSearchQuery(e)}
                        filteredStudentsClass={filteredStudentsClass}
                        handleSelectClass={(selectedClassroom) => handleSelectClass(selectedClassroom)}
                    />
            }

            <IncidentList student={student} userInfo={userInfo} />

            <PositiveObservations student={student} getStudent={getStudent} />

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