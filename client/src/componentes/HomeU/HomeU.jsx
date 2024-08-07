import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import backgroundImage from '../../assets/homeu.png';
import '../Home/home.css'; // Asegúrate de importar tu archivo CSS

export default function HomeU() {
    const navigate = useNavigate();

    const handleTabacoClick = () => {
        navigate('/tabaco');
    };
    const handlePapelesUClick = () => {
        navigate('/lillos');
    };
    const handleFitrosUClick = () => {
        navigate('/filtros');
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
                    <Button variant="light" onClick={handleTabacoClick} className="mx-2">
                        Tabaco para pipa
                    </Button>
                    <Button variant="light" onClick={handlePapelesUClick} className="mx-2">
                        Papelillos
                    </Button>
                    <Button variant="light" onClick={handleFitrosUClick} className="mx-2">
                        Filtros
                    </Button>
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
