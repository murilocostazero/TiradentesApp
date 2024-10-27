import React, { useState } from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onDelete, studentName }) => {
    const [confirmName, setConfirmName] = useState('');

    const handleDelete = () => {
        if (confirmName === studentName) {
            onDelete(); // Função para excluir o aluno
            onClose(); // Fecha a modal
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
                <p className="mb-4">
                    Você está prestes a excluir <strong className={studentName === confirmName ? 'text-green-600':'text-black'}>{studentName}</strong>. Essa ação não pode ser desfeita.
                </p>
                <p className="mb-4">Para confirmar, digite o nome do aluno:</p>
                <input
                    type="text"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md px-4 py-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-4 py-2"
                    >
                        Prosseguir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
