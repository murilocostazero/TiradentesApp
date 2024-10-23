import React, { useState, useEffect } from 'react';
import AddEditIncident from './AddEditIncident';
import axiosInstance from '../../utils/axiosIntance';
import { dateToString, severityToPT, typeToPT } from '../../utils/helper';
import { MdModeEdit, MdDeleteForever  } from "react-icons/md";

const IncidentList = ({ student, userInfo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        getIncidents();
    }, []);

    const getIncidents = async () => {
        try {
            const response = await axiosInstance.get(`/incident/student/${student._id}`);
            if (response.status >= 400 && response.status <= 500) {
                showStatusBar('Nenhuma ocorrência encontrada', 'error');
            } else {
                setIncidents(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditIncident = () => {
        setEditMode(true);
        setIsModalOpen(true);
    }

    const onClose = () => {
        setIsModalOpen(false);
        getIncidents();
    }

    return (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md">
            {
                isModalOpen ?
                    <AddEditIncident
                        onClose={() => onClose()}
                        onSave={() => { }}
                        editMode={editMode}
                        student={student}
                        userInfo={userInfo} /> :
                    <div />
            }
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-lg font-semibold">Ocorrências</h2>
                <button
                    className='bg-primary text-white font-semibold rounded-md p-2'
                    onClick={() => setIsModalOpen(true)}>Nova ocorrência</button>
            </div>

            {
                !incidents ?
                    <span>Carregando...</span> :

                    incidents.length > 0 ? (
                        <div className="space-y-4">
                            {/* Ocorrências */}
                            {incidents.map((incident, index) => (
                                <div 
                                    className='mt-1 flex flex-row shadow-md p-2 rounded-md cursor-pointer hover:bg-blue-200' 
                                    onClick={() => handleEditIncident()}>
                                    <div className={`w-2 ${incident.type == 'behavior' ? 'bg-red-400' : incident.type == 'health' ? 'bg-yellow-400' : 'bg-green-400'} rounded-md mr-2`}></div>
                                    <div className='w-full'>
                                        <h3 className="font-medium text-gray-700">{incident.title}</h3>
                                        <ul key={incident._id} className="text-gray-600">
                                            {incident.description}
                                        </ul>
                                        <div className='mt-2 flex flex-row justify-between'>
                                            <div>
                                                <button
                                                    disabled={true}
                                                    className={`p-2 rounded-md ${incident.severity == 'neutral' ?
                                                        'bg-blue-500' :
                                                        incident.severity == 'mild' ?
                                                            'bg-green-500' :
                                                            incident.severity == 'moderate' ?
                                                                'bg-yellow-500' :
                                                                incident.severity == 'serious' ?
                                                                    'bg-orange-500' :
                                                                    'bg-red-500'
                                                        } text-white font-semibold mr-1`}>
                                                    {severityToPT(incident.severity)}
                                                </button>
                                                <button disabled={true} className='p-2 rounded-md bg-green-400 text-white font-semibold mr-1'>
                                                    {typeToPT(incident.type)}
                                                </button>
                                            </div>
                                            <button disabled={true} className='p-2 rounded-md text-slate-900 font-semibold'>
                                                {dateToString(incident.date)}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) :
                        <p className="text-gray-500">Nenhuma ocorrência registrada.</p>
            }
        </div>
    )
}

export default IncidentList