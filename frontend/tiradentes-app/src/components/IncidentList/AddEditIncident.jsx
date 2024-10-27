import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosIntance';
import { dateToString, stringToDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import InputMask from 'react-input-mask';

export default function AddEditIncident({
    onClose,
    onSave,
    editMode,
    student,
    userInfo,
    incident
}) {
    // States para os inputs da ocorrência
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('behavior'); // 'behavior' ou 'neutral'
    const [severity, setSeverity] = useState('moderate'); // leve, moderada, grave, gravíssima
    const [date, setDate] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isResolved, setIsResolved] = useState(false);
    const [resolution, setResolution] = useState('');

    useEffect(() => {
        console.log(incident)
        if (incident) {
            setTitle(incident.title);
            setDescription(incident.description);
            setType(incident.type);
            setSeverity(incident.severity);
            setDate(dateToString(incident.date));
            setIsResolved(incident.resolved);
            setResolution(incident.resolution);
        }
    }, []);

    // Função para limpar os campos e fechar a modal
    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setType('behavior');
        setSeverity('moderate');
        setDate('');
        onClose(); // Fecha a modal
    };

    const verifyEmptyFields = () => {
        if (!editMode) {
            if (!title || !description || !type || !severity || !date) {
                showStatusBar('Todos os campos são obrigatórios', 'error');
            } else {
                handleSave();
            }
        } else {
            if (!title || !description || !type || !severity || !date || !resolution) {
                showStatusBar('Todos os campos são obrigatórios', 'error');
            } else {
                handleEdit();
            }
        }
    }

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
                createdBy: userInfo._id,
                resolved: isResolved,
                resolution: resolution
            }, {
                timeout: 10000
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
        setLoading(true);
        //API call
        try {
            const response = await axiosInstance.put(`/incident/${incident._id}`, {
                title: title,
                description: description,
                student: student._id,
                severity: severity,
                type: type,
                date: stringToDate(date),
                createdBy: userInfo._id,
                resolved: isResolved,
                resolution: resolution
            }, {
                timeout: 10000
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

    const handleResolved = () => {
        setIsResolved(!isResolved)
    }

    const handleRemove = async () => {
        try {
            const response = await axiosInstance.delete(`/incident/${incident._id}`, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                onClose();
            }
        } catch (error) {
            console.log(error)
            if (error.code == 'ERR_NETWORK') {
                showStatusBar('Verifique sua conexão com a internet', 'error');
            } else {
                showStatusBar('Um erro inesperado aconteceu. Tente novamente.', 'error');
            }
        }
    }

    const switchOptions = [
        {
            label: <span className='text-white'>Não resolvido</span>,
            value: false,
            selectedBackgroundColor: "#cf2d3b",
        },
        {
            label: <span className='text-white'>Resolvido</span>,
            value: true,
            selectedBackgroundColor: "#1a7a33"
        }
    ]

    const initialSelectedIndex = switchOptions.findIndex(({ value }) => value === false);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[40%] shadow-lg h-[80vh] overflow-y-auto">
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
                <label>
                    Data
                    <InputMask
                        mask="99/99/9999"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                        }}
                        placeholder="DD/MM/AAAA"
                        className="border p-2 w-full mb-4 rounded-md"
                    />
                </label>

                <div className='mb-4'>
                    <label>Status</label>
                    <select
                        value={isResolved}
                        onChange={(e) => setIsResolved(e.target.value)}
                        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value={true}>Resolvido</option>
                        <option value={false}>Não resolvido</option>
                    </select>
                </div>

                <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Resolução"
                    rows={4}
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                                    Fechar
                                </button>
                                {
                                    !editMode ?
                                        <div /> :
                                        <button
                                            onClick={handleRemove}
                                            className="px-4 py-2 bg-gray-300 hover:bg-red-500 hover:text-white rounded"
                                        >
                                            Deletar
                                        </button>
                                }
                                <button
                                    onClick={verifyEmptyFields}
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