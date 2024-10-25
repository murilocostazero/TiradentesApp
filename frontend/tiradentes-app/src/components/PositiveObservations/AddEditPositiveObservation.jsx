import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const AddEditPositiveObservation = ({ onClose, onAdd, isLoading }) => {
    const [observation, setObservation] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Adicionar FO+
                </h2>

                {/* Caixa de texto para a observação */}
                <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="Digite a observação positiva aqui..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                />

                <div className="flex justify-between">
                    {
                        isLoading ?
                            <LoadingSpinner /> :
                            <>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setObservation('');
                                        onClose();
                                    }}>
                                    Cancelar
                                </button>

                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => onAdd(observation)}>
                                    Salvar
                                </button>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddEditPositiveObservation