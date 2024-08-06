import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import loginBackground from '../../assets/login.png'; // Asegúrate de que la ruta sea correcta

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isRegister) {
            Axios.get('http://localhost:3001/roles').then(response => {
                setRoles(response.data);
            }).catch(error => {
                console.error('Error fetching roles:', error);
            });
        }
    }, [isRegister]);

    const handleAuth = async () => {
        try {
            if (isRegister) {
                const response = await Axios.post('http://localhost:3001/register', {
                    username,
                    password,
                    role
                });
                Swal.fire({
                    title: 'Registro Exitoso',
                    text: 'Usuario registrado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsRegister(false);
                setUsername('');
                setPassword('');
                setRole('');
            } else {
                const response = await Axios.post('http://localhost:3001/login', {
                    username,
                    password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                Swal.fire({
                    title: 'Login Exitoso',
                    text: 'Has iniciado sesión correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                if (response.data.role === 1) {
                    navigate('/home');
                } else if (response.data.role === 2) {
                    navigate('/homeu');
                }
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            Swal.fire('Error', error.response?.data?.msg || 'Error desconocido', 'error');
        }
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100" 
            style={{ 
                backgroundImage: `url(${loginBackground})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div 
                className="card p-4" 
                style={{ 
                    width: '300px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Fondo completamente transparente
                    color: 'white', // Texto en blanco
                    marginTop: '-150px', // Ajusta la posición vertical del contenedor
                    border: 'none', // Opcional: elimina el borde de la tarjeta
                }}
            >
                <h2 className="mb-3">{isRegister ? 'Registro' : 'Login'}</h2>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }} />
                </div>
                {isRegister && (
                    <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}>
                            <option value="" disabled>Selecciona un rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button 
                    className="btn w-100" 
                    onClick={handleAuth} 
                    style={{ backgroundColor: 'white', color: 'black' }} // Ajusta el estilo del botón
                >
                    {isRegister ? 'Registrar' : 'Iniciar Sesión'}
                </button>
                <button className="btn btn-link mt-2 w-100" onClick={() => setIsRegister(!isRegister)} style={{ color: 'white' }}>
                    {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
                </button>
            </div>
        </div>
    );
};

export default Login;
