import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/logo-cmt.png';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import axiosInstance from '../../utils/axiosIntance';

const Navbar = ({ userInfo, selectedNavbarStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setShowDropdown(true);  // Mostra o dropdown quando o usuário digita
      const filtered = students.filter((student) =>
        student.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setShowDropdown(false); // Oculta o dropdown se a barra de pesquisa estiver vazia
      setFilteredStudents([]);
    }
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/student/students`);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  const onClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setFilteredStudents([]);
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Gestor Disciplinar</h2>

      {
        !userInfo ?
          <img src={logo} alt="Logo do CMT" className='h-12 w-26' />
          :
          <>  
            {
              // loading ?
              //   <span>Carregando alunos...</span> :
              //   <SearchBar
              //     searchQuery={searchQuery}
              //     handleSearchChange={(e) => handleSearchChange(e)}
              //     onClearSearch={onClearSearch}
              //     filteredStudents={filteredStudents}
              //     showDropdown={showDropdown}
              //     selectedNavbarStudent={selectedNavbarStudent}
              //   />
            }
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </>
      }
    </div>
  )
}

export default Navbar;