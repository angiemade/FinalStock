import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import backgroundImage from '../../assets/home.png';
import './home.css'

export default function Home() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleCerrarSesion = async () => {
        try {
            await axios.post('http://localhost:3001/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Navbar */}
            <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                <div className="d-flex">
                    <DropdownButton id="dropdown-tabaco" title="Tabaco para pipa" variant="light" className="mx-2">
                        <Dropdown.Item onClick={() => handleNavigation('/tabaco')}>Tabaco para pipa</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNavigation('/tabacolist')}>Lista de Tabacos</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton id="dropdown-papeles" title="Papelillos" variant="light" className="mx-2">
                        <Dropdown.Item onClick={() => handleNavigation('/lillos')}>Papelillos</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNavigation('/papeleslist')}>Lista de Papeles</Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton id="dropdown-filtros" title="Filtros" variant="light" className="mx-2">
                        <Dropdown.Item onClick={() => handleNavigation('/filtros')}>Filtros</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNavigation('/filtroslist')}>Lista de Filtros</Dropdown.Item>
                    </DropdownButton>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="dropdown-toggle-hidden-arrow" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>Usuario</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleCerrarSesion} className="btnCerrarSesion">
                            Cerrar sesión
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Logo and text */}
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <img src={backgroundImage} alt="Mr. Vulpini" className="img-fluid" style={{ maxWidth: '50%', height: 'auto' }} />
            </div>
        </div>
    );
}
