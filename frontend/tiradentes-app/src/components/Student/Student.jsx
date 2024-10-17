import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import axiosInstance from '../../utils/axiosIntance';
import StatusBar from '../StatusBar/StatusBar';
import { stringToDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Student = ({ userInfo }) => {

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentsClass, setSelectedStudentsClass] = useState(null);
  const [showSearchClassroom, setShowSearchClassroom] = useState(false);
  const [statusBar, setStatusBar] = useState({
    message: '',
    type: '',
    isVisible: false,
  });
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState(''); // Nome completo
  const [dateOfBirth, setDateOfBirth] = useState(''); // Data de nascimento
  const [cpf, setCpf] = useState(''); // CPF
  const [gender, setGender] = useState(''); // Sexo (Masculino/Feminino)
  const [address, setAddress] = useState(''); // Endereço
  const [contact, setContact] = useState(''); // Contato do aluno
  const [guardianName, setGuardianName] = useState(''); // Nome do responsável
  const [guardianContact, setGuardianContact] = useState(''); // Contato do responsável
  const [behavior, setBehavior] = useState('regular'); // Comportamento (excelente, bom, regular, ruim, péssimo)
  const [positiveFacts, setPositiveFacts] = useState([]); // Fatos observados positivamente (fo+)
  const [photoUrl, setPhotoUrl] = useState(''); // URL da foto do aluno
  const [classroomId, setClassroomId] = useState(''); // ID da turma do aluno

  useEffect(() => {
    getClassrooms();
  }, []);

  const getClassrooms = async () => {
    try {
      const response = await axiosInstance.get(`/classroom/school/${userInfo.lastSelectedSchool}`);
      if (response.status >= 400 && response.status <= 500) {
        showStatusBar('Nenhuma turma encontrada', 'error');
      } else {
        setClassrooms(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filteredStudentsClass = classrooms.filter((classroom) =>
    classroom.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudents = async () => {
    console.log('XABLAU, LINEUZINHO')
  }

  // Função para adicionar um novo aluno
  const addStudent = async () => {
    if (!fullName || !dateOfBirth || !cpf || !gender || !address || !contact || !guardianName || !guardianContact || !selectedStudentsClass) {
      showStatusBar('Todos os campos são obrigatórios', 'error');
    } else {
      const newDateOfBirth = stringToDate(dateOfBirth);
      setLoading(true);
      //API call
      try {
        const response = await axiosInstance.post(`/student`, {
          fullName,
          dateOfBirth: newDateOfBirth,
          cpf,
          gender,
          address,
          contact,
          guardianName,
          guardianContact,
          classroomId: selectedStudentsClass._id
        }, {
          timeout: 10000 //10 segundos
        });

        if (response.status >= 400 && response.status <= 500) {
          showStatusBar(response.data.message, 'error');
        } else {
          showStatusBar('Aluno cadastrado com sucesso', 'success');
          getStudents();
        }
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          showStatusBar('Verifique sua conexão com a internet e tente novamente.', 'error');
        } else {
          showStatusBar('Um erro inesperado aconteceu. Tente novamente.', 'error');
        }
      }

      setLoading(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSearchQuery('');
    setFullName('');
    setDateOfBirth('');
    setCpf('');
    setGender('');
    setAddress('');
    setContact('');
    setGuardianName('');
    setGuardianContact('');
    setShowModal(false);
  }

  const handleSelectClass = (classroom) => {
    // console.log(classroom)
    setSelectedStudentsClass(classroom);
    setShowSearchClassroom(false);
  }

  const openSearchClass = () => {
    setShowSearchClassroom(true)
  }

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
    <div className="relative w-full h-full">
      {/* ----------------------------------MODAL--------------------------------- */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3  h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editingStudent ? 'Alterar aluno' : 'Adicionar novo aluno'}</h2>

            <label>
              Nome completo do aluno<input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border p-2 w-full mb-4 rounded-md"
                placeholder="Ex.: Yago Martins Da Silva"
              />
            </label>

            <label>
              Data de nascimento
              <InputMask
                mask="99/99/9999"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                }}
                placeholder="DD/MM/AAAA"
                className="border p-2 w-full mb-4 rounded-md"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </label>

            <label>
              CPF do aluno
              <InputMask
                mask="999.999.999-99"
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                }}
                placeholder="000.111.222-33"
                className="border p-2 w-full mb-4 rounded-md"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </label>

            <label>
              Gênero
              <div className='mb-2'>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className='p-2'
                >
                  <option value=''>Selecione o Gênero</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </label>

            <label className='mt-2'>
              Endereço
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 w-full mb-4 rounded-md"
                placeholder="Ex.: Rua São Francisco, sn, Guanabara, Colinas-Ma"
              />
            </label>

            <label className='mt-2'>
              Contato
              <InputMask
                mask="(99)99999-9999"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                }}
                placeholder="(99)98122-3344"
                className="border p-2 w-full mb-4 rounded-md"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </label>

            <label className='mt-2'>
              Nome do responsável
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="border p-2 w-full mb-4 rounded-md"
                placeholder="Ex.: Maria Augusta Pereira Gonçalves"
              />
            </label>

            <label className='mt-2'>
              Contato do responsável
              <InputMask
                mask="(99)99999-9999"
                value={guardianContact}
                onChange={(e) => {
                  setGuardianContact(e.target.value);
                }}
                placeholder="(99)98122-3344"
                className="border p-2 w-full mb-4 rounded-md"
              >
                {(inputProps) => <input {...inputProps} type="text" />}
              </InputMask>
            </label>


            {/* Exibir turma selecionada */}
            {selectedStudentsClass && (
              <div className="mb-4 mt-2">
                <p><strong>Turma Selecionada:</strong> {`${selectedStudentsClass.grade}º ano ${selectedStudentsClass.className}`}</p>
              </div>
            )}
            <div className="flex justify-end">
              {
                loading ?
                  <LoadingSpinner /> :
                  <>
                    <button
                      onClick={() => handleCloseModal()}
                      className="mr-2 px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => addStudent()}
                      className="px-4 py-2 bg-primary text-white rounded"
                    >
                      {editingStudent ? 'Salvar alterações' : 'Adicionar'}
                    </button>
                  </>
              }
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------MODAL-------------------------------- */}

      <div className='justify-end flex flex-row'>
        <div className='flex items-center mr-4'>
          {
            selectedStudentsClass ?
              <span className='font-bold mr-2'>Selecionado: {selectedStudentsClass.grade}º ano {selectedStudentsClass.className}</span> :
              <span>Nenhuma turma selecionada</span>
          }
        </div>
        <button
          onClick={openSearchClass}
          className={`text-white p-2 rounded-md shadow-lg ${selectedStudentsClass ? 'bg-green-700' : 'bg-slate-300'}`}>
          {selectedStudentsClass ? 'Mudar de turma' : 'Escolher turma'}
        </button>
      </div>

      {
        !showSearchClassroom ?
          <div /> :
          <div className='flex flex-col items-center justify-start min-h-36'>
            <div className='flex items-center bg-white shadow-lg rounded-md p-2 max-w-80'>
              <input
                placeholder='Buscar turma'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full focus:outline-none bg-transparent' />
              <IoMdClose className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' onClick={() => setSearchQuery('')} />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto">
              {filteredStudentsClass.length > 0 ? (
                filteredStudentsClass.map((classroom) => (
                  <div
                    key={classroom._id}
                    className={`p-4 text-center min-w-40 border rounded cursor-pointer hover:bg-blue-100 ${selectedStudentsClass?._id === classroom._id ? 'bg-blue-200' : ''
                      }`}
                    onClick={() => handleSelectClass(classroom)}
                  >
                    {classroom.grade}º ano {classroom.className}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma turma encontrada</p>
              )}
            </div>
          </div>
      }



      <button
        disabled={selectedStudentsClass ? false : true}
        onClick={() => setShowModal(true)}
        className={`fixed bottom-4 right-4 ${selectedStudentsClass ? 'bg-blue-500' : 'bg-slate-200'} text-white p-4 rounded-full shadow-lg`}>
        <FaPlus size={22} />
      </button>

      <StatusBar
        message={statusBar.message}
        type={statusBar.type}
        isVisible={statusBar.isVisible}
        onClose={hideStatusBar}
      />

    </div>
  )
}

export default Student