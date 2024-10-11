import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaCheck } from 'react-icons/fa';

const School = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [editingSchool, setEditingSchool] = useState(null);
  const [editName, setEditName] = useState('');

  // Função para adicionar uma nova escola
  const addSchool = () => {
    if (newSchoolName.trim() === '') return;
    setSchools([...schools, { name: newSchoolName }]);
    setNewSchoolName('');
    setShowModal(false); // Fecha a modal após adicionar
  };

  // Função para selecionar uma escola
  const selectSchool = (school) => {
    setSelectedSchool(school);
  };

  // Função para iniciar edição da escola
  const editSchool = (school) => {
    setEditingSchool(school);
    setEditName(school.name); // Preenche o campo de edição com o nome da escola atual
  };

  // Função para salvar a edição da escola
  const saveSchool = (school) => {
    setSchools(
      schools.map((s) => (s === school ? { ...s, name: editName } : s))
    );
    setEditingSchool(null);
  };

  // Função para remover uma escola
  const removeSchool = (school) => {
    setSchools(schools.filter((s) => s !== school));
  };

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
            <h2 className="text-lg font-semibold mb-4">Adicionar Nova Escola</h2>
            <input
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Digite o nome da escola"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                    setNewSchoolName('');
                    setShowModal(false);
                }}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addSchool}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Adicionar
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
            className={`p-4 border rounded mb-2 flex justify-between items-center ${
              selectedSchool === school ? 'bg-blue-100' : 'bg-white'
            }`}
          >
            {editingSchool === school ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2"
              />
            ) : (
              <span>{school.name}</span>
            )}
            <div className="flex items-center">
              <button
                onClick={() => selectSchool(school)}
                className={`mr-2 p-2 ${
                  selectedSchool === school ? 'bg-green-500' : 'bg-gray-200'
                } text-white rounded`}
              >
                <FaCheck />
              </button>
              {editingSchool === school ? (
                <button
                  onClick={() => saveSchool(school)}
                  className="mr-2 p-2 bg-blue-500 text-white rounded"
                >
                  <FaSave />
                </button>
              ) : (
                <button
                  onClick={() => editSchool(school)}
                  className="mr-2 p-2 bg-yellow-500 text-white rounded"
                >
                  <FaEdit />
                </button>
              )}
              <button
                onClick={() => removeSchool(school)}
                className="p-2 bg-red-500 text-white rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default School;