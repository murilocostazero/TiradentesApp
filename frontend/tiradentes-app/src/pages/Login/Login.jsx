import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import DevelopedBy from '../../components/DevelopedBy/DevelopedBy'
import axiosInstance from '../../utils/axiosIntance'
import StatusBar from '../../components/StatusBar/StatusBar'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [statusBar, setStatusBar] = useState({
        message: '',
        type: '',
        isVisible: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            showStatusBar('Insira um email válido', 'error');
            return;
        }

        if (!password) {
            showStatusBar('Senha inválida', 'error');
            return;
        }

        setIsLoading(true);
        //Login API call
        try {
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password
            }, {
                timeout: 10000, // 10 segundos
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard', { replace: true });
            } else if (response.data && response.data.error) {
                showStatusBar(response.data.message, 'error');
            }
        } catch (error) {
            console.log(error)
            if(error.code == 'ERR_NETWORK'){
                showStatusBar('Verifique sua conexão com a internet', 'error');
            }
            else if (error.response.data.message) {
                showStatusBar(error.response.data.message, 'error');
            } else {
                showStatusBar('Um erro inesperado aconteceu. Tente novamente.', 'error');
            }
        }
        setIsLoading(false);
    }

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

    return (
        <>
            <Navbar />

            <div className='flex items-center justify-center mt-28'>
                <div className='w-96 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleLogin}>
                        <h4 className='text-2xl mb-7'>Login</h4>

                        <input
                            type='email'
                            placeholder='Email'
                            className='input-box'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                        {
                            isLoading ?
                            <LoadingSpinner /> : 
                            <button type='submit' className='btn-primary'>Login</button>
                        }

                        <p className='text-sm text-center mt-4'>
                            Ainda não tem cadastro?{" "}
                            <Link to='/singup' className='font-medium text-primary underline'>
                                Criar uma conta
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

export default Login