import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import DevelopedBy from '../../components/DevelopedBy/DevelopedBy';
import axiosInstance from '../../utils/axiosIntance';
import { validateEmail } from '../../utils/helper';
import StatusBar from '../../components/StatusBar/StatusBar';

const SingUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [statusBar, setStatusBar] = useState({
    message: '',
    type: '',
    isVisible: false,
});

  const navigate = useNavigate();

  const showStatusBar = (message, type) => {
    setStatusBar({
        message,
        type,
        isVisible: true,
    });
};

const hideStatusBar = () => {
    setStatusBar((prev) => ({
        ...prev,
        isVisible: false,
    }));
};

  const handleSingUp = async (e) => {
    e.preventDefault();

    if (!name) {
      showStatusBar('Por favor, insira um nome.', 'error');
      return;
    }

    if (!selectedRank) {
      showStatusBar('Por favor, escolha um Posto/Graduação.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showStatusBar('Por favor, insira um email válido.', 'error');
      return;
    }

    if (!password) {
      showStatusBar('Por favor, insira uma senha.', 'error');
      return;
    }

    //SingUp API call
    try {
      const response = await axiosInstance.post('/create-account', {
        name: name,
        rank: selectedRank,
        email: email,
        password: password
      });

      console.log(response);

      if (response.data && response.data.error) {
        showStatusBar(response.data.error, 'error');
        return
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }

    } catch (error) {
      console.log(error)
      showStatusBar('Um erro inesperado aconteceu. Tente novamente.', 'error');
    }
  }

  const handleRankChange = (event) => {
    setSelectedRank(event.target.value);
  };

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSingUp}>
            <h4 className='text-2xl mb-7'>Cadastro</h4>

            <input
              type='text'
              placeholder='Nome de guerra'
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className='mb-4'>
              <select
                id="rank"
                name="ranks"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={selectedRank}
                onChange={handleRankChange}
              >
                <option value="" disabled selected>Posto/Graduação</option>
                <option value="soldado">Soldado</option>
                <option value="cabo">Cabo</option>
                <option value="sargento">Sargento</option>
                <option value="subtenente">Subtenente</option>
                <option value="tenente">Tenente</option>
                <option value="capitão">Capitão</option>
                <option value="major">Major</option>
                <option value="tenentecoronel">Ten. Coronel</option>
                <option value="coronel">Coronel</option>
              </select>
            </div>

            <input
              type='email'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type='submit' className='btn-primary'>Criar conta</button>

            <p className='text-sm text-center mt-4'>
              Já tem uma conta?{" "}
              <Link to='/login' className='font-medium text-primary underline'>
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <StatusBar
        message={statusBar.message}
        type={statusBar.type}
        isVisible={statusBar.isVisible}
        onClose={hideStatusBar}
      />
      <DevelopedBy />
    </>
  )
}

export default SingUp