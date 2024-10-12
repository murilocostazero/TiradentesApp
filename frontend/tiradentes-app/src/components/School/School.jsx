import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaCheck } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosIntance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './School.css';

const School = ({ userInfo, selectedSchool, handleSelectedSchool, loading }) => {
  const [schools, setSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [editingSchool, setEditingSchool] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState(null);

  const [deletingSchool, setDeletingSchool] = useState(null); // Armazena a escola em processo de exclusão
  const [deleteTimeoutId, setDeleteTimeoutId] = useState(null); // Armazena o timeout

  const [errorLabel, setErrorLabel] = useState('');

  const getSchools = async () => {
    try {
      const response = await axiosInstance.get(`/school/team/${userInfo._id}`);
      if (response.data) {
        setSchools(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSchools();
  }, []);

  // Função para adicionar uma nova escola
  const addSchool = async () => {
    if (!newSchoolName || !newAddress || !newPhoneNumber) {
      setErrorLabel('Todos os campos são obrigatórios');
    } else {

      //API call
      try {
        const response = await axiosInstance.post(`/school/${userInfo._id}`, {
          name: newSchoolName,
          address: newAddress,
          phoneNumber: newPhoneNumber
        });

        if (response.status === 400 || response.status === 500) {
          setError(response.data.message)
        } else {
          getSchools();
        }
      } catch (error) {
        console.log(error)
        setError('Um erro inesperado aconteceu. Tente novamente.');
      }

      clearFields();
      setShowModal(false); // Fecha a modal após adicionar
    }
  };

  const handleDelete = (schoolId) => {
    // Ativa o status de exclusão para a escola
    setDeletingSchool(schoolId);

    // Define o timeout para deletar a escola após 5 segundos
    const timeoutId = setTimeout(() => {
      deleteSchool(schoolId); // Chama a função para deletar a escola após o tempo
      setDeletingSchool(null); // Reseta o status de exclusão
    }, 5000); // 5 segundos para cancelar a ação

    setDeleteTimeoutId(timeoutId); // Armazena o ID do timeout para poder cancelar
  };

  const cancelDelete = () => {
    clearTimeout(deleteTimeoutId); // Cancela o timeout
    setDeletingSchool(null); // Reseta o status de exclusão
  };

  const deleteSchool = async (schoolId) => {
    //API call
    try {
      const response = await axiosInstance.delete(`/school/${schoolId}`);

      if (response.status === 400 || response.status === 500) {
        setError(response.data.message)
      } else {
        getSchools();
      }
    } catch (error) {
      console.log(error)
      setError('Um erro inesperado aconteceu. Tente novamente.');
    }
  }

  const editSchool = (school) => {
    setEditingSchool(true);
    setShowModal(true);
    setNewSchoolName(school.name);
    setNewAddress(school.address);
    setNewPhoneNumber(school.phoneNumber);
    setSchoolToEdit(school);
  }

  const saveSchoolModifications = async () => {
    if (!newSchoolName || !newAddress || !newPhoneNumber) {
      setError('Todos os campos são obrigatórios.');
    } else {
      //API call
      try {
        const response = await axiosInstance.put(`/school/${schoolToEdit._id}`, {
          name: newSchoolName,
          address: newAddress,
          phoneNumber: newPhoneNumber
        });

        if (response.status === 400 || response.status === 500) {
          setError(response.data.message)
        } else {
          setEditingSchool(false);
          setShowModal(false);
          getSchools();
          clearFields();
        }
      } catch (error) {
        console.log(error)
        setError('Um erro inesperado aconteceu. Tente novamente.');
      }
    }
  }

  const clearFields = () => {
    setNewSchoolName('');
    setNewAddress('');
    setNewPhoneNumber('');
    setErrorLabel('');
  }

  return (
    <div className="relative w-full h-full">
      {/* Botão para adicionar nova escola */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        <FaPlus size={22} />
      </button>

      {/* Modal para adicionar nova escola */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">{editingSchool ? 'Alterar escola' : 'Adicionar Nova Escola'}</h2>

            <input
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
              placeholder="Digite o nome da escola"
            />

            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
              placeholder="Endereço da escola"
            />

            <input
              type="text"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
              placeholder="Telefone de contato"
            />

            {errorLabel && <p className='text-red-500 text-xs pb-1'>{errorLabel}</p>}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  clearFields();
                  setShowModal(false);
                }}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={editingSchool ? saveSchoolModifications : addSchool}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                {editingSchool ? 'Salvar alterações' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de escolas */}
      <div className="mt-4">
        {schools.map((school, index) => (
          <div
            key={index}
            className={`p-4 border rounded mb-2 flex justify-between items-center ${userInfo.lastSelectedSchool === school._id ? 'bg-blue-100' : 'bg-white'
              }`}
          >
            <span>{school.name}</span>
            <div className="flex items-center">
              {
                loading ?
                  <LoadingSpinner />
                  :
                  !deletingSchool ?
                    <>
                      <button
                        onClick={() => handleSelectedSchool(school)}
                        className={`mr-2 p-2 ${userInfo.lastSelectedSchool === school._id ? 'bg-green-500' : 'bg-gray-200'
                          } text-white rounded`}
                      >
                        Selecionar
                      </button>
                      <button
                        onClick={() => editSchool(school)}
                        className="mr-2 p-2 bg-yellow-500 text-white rounded"
                      >
                        <FaEdit />
                      </button>
                    </>
                    :
                    <div />
              }

              {deletingSchool === school._id ? (
                <div className="delete-wrapper rounded-lg p-1">
                  <div className="circle"></div>
                  <button onClick={cancelDelete} className="btn btn-warning rounded-md text-orange-500 font-medium ml-1">Desfazer</button>
                </div>
              ) : (
                <button
                  onClick={() => handleDelete(school._id)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default School;