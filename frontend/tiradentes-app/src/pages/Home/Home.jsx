import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosIntance';
import { FaSchool } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineEditNote } from "react-icons/md";
import School from '../../components/School/School';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState('School');

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  useEffect(() => {
    getUserInfo();
    return () => { };
  }, []);

  // Função para atualizar a opção selecionada no menu
  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="flex h-screen">
        {/* Menu Lateral */}
        <div className="w-1/6 bg-gray-100 p-4">
          <ul>
            <li
              className={`cursor-pointer p-2 ${selectedOption === 'School' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
              onClick={() => handleMenuClick('School')}
            >
              <div className='flex justify-between items-center'>
                Escola
                <FaSchool
                  size={22}
                  className={`${selectedOption === 'School' ? 'text-slate-50' : 'text-primary opacity-50'}`} />
              </div>
            </li>
            <li
              className={`cursor-pointer p-2 flex justify-between items-center ${selectedOption === 'Classes' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
              onClick={() => handleMenuClick('Classes')}
            >
              Turmas
              <FaPeopleGroup
                size={22}
                className={`${selectedOption === 'Classes' ? 'text-slate-50' : 'text-primary opacity-50'}`} />
            </li>
            <li
              className={`cursor-pointer p-2 flex justify-between items-center ${selectedOption === 'Incident' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
              onClick={() => handleMenuClick('Incident')}
            >
              Ocorrências
              <MdOutlineEditNote 
                size={22}
                className={`${selectedOption === 'Incident' ? 'text-slate-50' : 'text-primary opacity-50'}`} />
            </li>
            {/* Adicione mais opções conforme necessário */}
          </ul>
        </div>

        {/* Área Central */}
        <div className="flex-grow p-6 bg-white">
          {/* Conteúdo baseado na opção selecionada */}
          {selectedOption === 'School' && userInfo ? <School userInfo={userInfo} /> : <p>Carregando...</p>}
          {selectedOption === 'Classes' && <p>Informações sobre as Turmas...</p>}
          {selectedOption === 'Incident' && <p>Informações sobre Ocorrências...</p>}
          {/* Adicione o conteúdo para as outras opções aqui */}
        </div>
      </div>
    </>
  )
}

export default Home