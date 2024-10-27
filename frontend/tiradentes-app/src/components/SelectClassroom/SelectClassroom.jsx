import React from 'react';
import { IoMdClose } from 'react-icons/io';

const SelectClassroom = ({
    selectedStudentsClass,
    openSearchClass,
    showSearchClassroom,
    searchQuery,
    handleSearchQuery,
    filteredStudentsClass,
    handleSelectClass
}) => {
    return (
        <>
            <div className='justify-between flex flex-row'>

                <div className='flex items-center'>
                    <button
                        onClick={() => openSearchClass()}
                        className={`border-2 mr-4 border-red-500 bg-gray-800 text-red-500 font-bold rounded-md px-4 py-2 hover:bg-gray-700`}>
                        {
                            !showSearchClassroom ? 'Mudar de turma' : 'Cancelar'
                        }
                    </button>
                    {
                        selectedStudentsClass ?
                            <span className='font-bold mr-2'>Selecionado: {selectedStudentsClass.grade}º ano {selectedStudentsClass.className}</span> :
                            <span>Nenhuma turma selecionada</span>
                    }
                </div>

                {
                    !showSearchClassroom ?
                        <div /> :
                        <div className='flex items-center bg-white shadow-lg rounded-md p-2 max-w-80'>
                            <input
                                placeholder='Buscar turma'
                                value={searchQuery}
                                onChange={(e) => handleSearchQuery(e.target.value)}
                                className='w-full focus:outline-none bg-transparent' />
                            <IoMdClose className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' onClick={() => handleSearchQuery('')} />
                        </div>
                }
            </div>

            {
                !showSearchClassroom ?
                    <div /> :
                    <div className='flex flex-col justify-start min-h-36'>
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
        </>
    )
}

export default SelectClassroom