import React, { useState, useEffect } from 'react';
import AddEditPositiveObservation from './AddEditPositiveObservation';
import axiosInstance from '../../utils/axiosIntance';
import { dateToString } from '../../utils/helper';
import { MdDeleteForever } from "react-icons/md";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const PositiveObservations = ({ student, getStudent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [positiveObservations, setPositiveObservations] = useState([]);
    const [selectedObservationId, setSelectedObservationId] = useState('');

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (student) {
            setPositiveObservations(student.positiveObservations);
        }
    }, [student]);

    const onRemove = async (observation) => {
        setSelectedObservationId(observation._id);

        setIsLoading(true);
        //API call
        try {
            const response = await axiosInstance.put(`/student/remove-po/${student._id}/${observation._id}`, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status >= 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                getStudent(student._id);
            }
        } catch (error) {
            console.log(error)
            if (error.code == 'ERR_NETWORK') {
                showStatusBar('Verifique sua conexão com a internet', 'error');
            }
        }
        setIsLoading(false);
    }

    const handleSaveNew = async (observation) => {
        setIsLoading(true);
        //API call
        try {
            const response = await axiosInstance.put(`/student/add-po/${student._id}`, {
                positiveObservation: {
                    observation: observation
                }
            }, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status >= 500) {
                showStatusBar(response.data.message, 'error');
            } else {
                getStudent(student._id);
                handleClose();
            }
        } catch (error) {
            console.log(error);
            if (error.code == 'ERR_NETWORK') {
                showStatusBar('Verifique sua conexão com a internet', 'error');
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="mt-6 bg-white p-4 rounded-md">
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-lg font-semibold">FO+</h2>
                <button
                    className='bg-primary text-white font-semibold rounded-md p-2'
                    onClick={() => setIsModalOpen(true)}>Novo FO+</button>
            </div>

            {
                !isModalOpen ?
                    <div /> :
                    <AddEditPositiveObservation
                        onClose={handleClose}
                        onAdd={(observation) => handleSaveNew(observation)}
                        isLoading={isLoading} />
            }

            {
                !positiveObservations ?
                    <span>Carregando...</span> :

                    positiveObservations.length > 0 ? (
                        <div className="space-y-4">
                            {/* Ocorrências */}
                            {positiveObservations.map((observation, index) => (
                                <div
                                    className='mt-1 flex flex-row justify-between items-center shadow-md p-2 rounded-md cursor-default hover:bg-blue-200'>
                                    <label>{`${observation.observation} no dia ${dateToString(observation.createdAt)}`}</label>
                                    {
                                        observation._id == selectedObservationId ?
                                            <LoadingSpinner /> :
                                            <MdDeleteForever
                                                fontSize={24}
                                                className='text-slate-500 cursor-pointer hover:text-red-500'
                                                onClick={() => onRemove(observation)} />
                                    }
                                </div>

                            ))}
                        </div>
                    ) :
                        <p className="text-gray-500">Nenhuma ocorrência registrada.</p>
            }
        </div>
    )
}

export default PositiveObservations