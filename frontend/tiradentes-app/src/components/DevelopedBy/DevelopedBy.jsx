import React from 'react';
import { PiFishSimpleBold } from 'react-icons/pi';

const DevelopedBy = () => {
    return (
        <div class="w-full bottom-0 left-0 flex items-center justify-center bg-gradient-to-t from-transparent to-white py-4">
            <p class="text-gray-500 text-sm opacity-70 flex items-center">
                Desenvolvido por <a href="https://www.instagram.com/murilocostazero/" target="_blank" class="font-semibold ml-1 text-gray-500 hover:underline">Murilo</a>
                <PiFishSimpleBold size={18} className='text-gray-500 opacity-70 ml-0.5' />
            </p>
        </div>

    )
}

export default DevelopedBy;