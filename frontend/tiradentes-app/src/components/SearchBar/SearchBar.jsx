import React, { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ searchQuery, handleSearchChange, filteredStudents, onClearSearch, showDropdown, selectedNavbarStudent }) => {


    return (
        <div className="relative w-80">
            <div className="flex items-center px-4 bg-slate-100 rounded-md">
                <input
                    type="text"
                    placeholder="Pesquisar aluno"
                    className="w-full text-xs bg-transparent py-[11px] outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {searchQuery && (
                    <IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" onClick={onClearSearch} />
                )}
                <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" />
            </div>

            {showDropdown && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div 
                                key={student._id} 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    selectedNavbarStudent(student);
                                    onClearSearch();
                                }}>
                                <label>{student.fullName}</label>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 px-4 py-2">Nenhum aluno encontrado</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar