import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosIntance';
import { FaSchool } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineEditNote } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import School from '../../components/School/School';
// import Documents from '../../components/Documents/Documents';
import Classroom from '../../components/Classroom/Classroom';
import Student from '../../components/Student/Student';
import NoDataLoaded from '../../components/NoDataLoaded/NoDataLoaded';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState('School');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedStudentSearch, setSelectedStudentSearch] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const selectedNavbarStudent = async (student) => {
    await setSelectedStudentSearch(student);
    handleMenuClick('Student');
  }

  useEffect(() => {
    getUserInfo();
    return () => { };
  }, []);

  const handleSelectedSchool = async (school) => {
    setLoading(true);
    //Put lastSelectedSchool API call
    try {
      const response = await axiosInstance.put(`/lastSelectedSchool/${userInfo._id}`, {
        lastSelectedSchool: school._id
      });

      if (response.status === 404 || response.status === 500) {
        setError(response.data.message);
      } else {
        setSelectedSchool(school);
        getUserInfo();
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('Um erro inesperado aconteceu. Tente novamente.');
      }
    }
    setLoading(false);
  }

  // Função para atualizar a opção selecionada no menu
  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Navbar userInfo={userInfo} selectedNavbarStudent={selectedNavbarStudent} />
      {
        !userInfo ?
          <NoDataLoaded /> :
          <div className="flex h-screen">
            {/* Menu Lateral */}
            <div className="w-1/6 h-full bg-gray-100 p-4">
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
                  className={`cursor-pointer p-2 flex justify-between items-center ${selectedOption === 'Classroom' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                  onClick={() => handleMenuClick('Classroom')}
                >
                  Turmas
                  <FaPeopleGroup
                    size={22}
                    className={`${selectedOption === 'Classroom' ? 'text-slate-50' : 'text-primary opacity-50'}`} />
                </li>
                <li
                  className={`cursor-pointer p-2 flex justify-between items-center ${selectedOption === 'Student' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                  onClick={() => handleMenuClick('Student')}
                >
                  Alunos
                  <PiStudentFill
                    size={22}
                    className={`${selectedOption === 'Student' ? 'text-slate-50' : 'text-primary opacity-50'}`} />
                </li>
                
                {/* Adicione mais opções conforme necessário */}
              </ul>
            </div>

            {/* Área Central */}
            <div className="flex-grow p-6 bg-white">
              {
                selectedOption === 'School' && userInfo ?
                  <School
                    userInfo={userInfo}
                    selectedSchool={selectedSchool}
                    handleSelectedSchool={handleSelectedSchool}
                    loading={loading} />
                  :
                  selectedOption === 'Classroom' ?
                    <Classroom userInfo={userInfo} />
                    :
                    selectedOption === 'Student' ?
                      <Student userInfo={userInfo} selectedStudentSearch={selectedStudentSearch} /> : <div />
              }
            </div>
          </div>
      }
    </>
  )
}

export default Home