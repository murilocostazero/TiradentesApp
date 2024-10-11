import React, { useState } from 'react';
import logo from '../../assets/images/logo-cmt.png';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  const handleSearch = () => {

  }

  const onClearSearch = () => {
    setSearchQuery('');
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Gestor Disciplinar</h2>

      {
        !userInfo ?
          <img src={logo} alt="Logo do CMT" className='h-12 w-26' />
          :
          <>
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                setSearchQuery(target.value)
              }}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </>
      }
    </div>
  )
}

export default Navbar;