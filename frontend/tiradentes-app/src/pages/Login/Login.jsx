import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import DevelopedBy from '../../components/DevelopedBy/DevelopedBy'
import axiosInstance from '../../utils/axiosIntance'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Por favor, insira um email válido.');
            return;
        }

        if (!password) {
            setError('Senha inválida');
            return;
        }

        setError('');

        //Login API call
        try {
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            } else if (response.data && response.data.error) {
                setError(response.data.message);
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError('Um erro inesperado aconteceu. Tente novamente.');
            }
        }
    }

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

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <button type='submit' className='btn-primary'>Login</button>

                        <p className='text-sm text-center mt-4'>
                            Ainda não tem cadastro?{" "}
                            <Link to='/singup' className='font-medium text-primary underline'>
                                Criar uma conta
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <DevelopedBy />
        </>
    )
}

export default Login