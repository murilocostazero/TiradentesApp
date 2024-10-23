import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosIntance';
import { stringToDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import InputMask from 'react-input-mask';

export default function AddEditIncident({
    onClose,
    onSave,
    editMode,
    student,
    initialData = {},
    userInfo
}) {
    // States para os inputs da ocorrência
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('behavior'); // 'behavior' ou 'neutral'
    const [severity, setSeverity] = useState('moderate'); // leve, moderada, grave, gravíssima
    const [date, setDate] = useState('');
    const [isLoading, setLoading] = useState(false);

    // Carrega os dados iniciais se estiver em modo de edição
    useEffect(() => {
        if (editMode && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setType(initialData.type || 'behavior');
            setSeverity(initialData.severity || 'moderate');
            setDate(initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : '');
        }
    }, [editMode, initialData]);

    // Função para limpar os campos e fechar a modal
    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setType('behavior');
        setSeverity('moderate');
        setDate('');
        onClose(); // Fecha a modal
    };

    // Função chamada ao clicar em "Salvar Alterações"
    const handleSave = async () => {
        setLoading(true);
        //API call
        try {
            const response = await axiosInstance.post(`/incident`, {
                title: title,
                description: description,
                student: student._id,
                severity: severity,
                type: type,
                date: stringToDate(date),
                createdBy: userInfo._id
            });

            if (response.status >= 400 && response.status >= 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                handleCancel();
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleEdit = async () => {
        const incidentData = { title, description, type, severity, date };

        handleCancel();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    {editMode ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                </h2>

                {/* Input para o título */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Textarea para descrição */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                    rows={4}
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Select para tipo */}
                <label>
                    Natureza:
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="behavior">Comportamento</option>
                        <option value="health">Saúde</option>
                        <option value="other">Outra</option>
                    </select>
                </label>


                <label>
                    Gravidade:
                    {/* Select para gravidade (só mostra se for de comportamento) */}
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="neutral">Neutra</option>
                        <option value="mild">Leve</option>
                        <option value="moderate">Moderada</option>
                        <option value="serious">Grave</option>
                        <option value="critical">Gravíssima</option>
                    </select>

                </label>

                {/* Input para data */}
                <InputMask
                    mask="99/99/9999"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                    }}
                    placeholder="DD/MM/AAAA"
                    className="border p-2 w-full mb-4 rounded-md"
                />

                {/* Botões de ação */}
                <div className="flex justify-end space-x-3">
                    {
                        isLoading ?
                            <LoadingSpinner /> :
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={editMode ? handleEdit : handleSave}
                                    className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded"
                                >
                                    {editMode ? 'Salvar Alterações' : 'Adicionar'}
                                </button>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}