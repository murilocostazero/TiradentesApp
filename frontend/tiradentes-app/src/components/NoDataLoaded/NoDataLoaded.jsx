import React from 'react';
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { TbReload } from "react-icons/tb";

const NoDataLoaded = () => {
    return (
        <div className='flex justify-center items-center flex-col text-slate-600 mt-4 w-full'>
            <RiSignalWifiErrorFill fontSize={32} />
            Verifique sua conexão com a internet e tente novamente.

            <button
                className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 flex items-center"
                onClick={() => window.location.reload()} // Atualiza a página
            >
                Tentar novamente
                <TbReload fontSize={20} className='ml-2' />
            </button>
        </div>
    )
}

export default NoDataLoaded