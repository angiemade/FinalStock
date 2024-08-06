import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const PapelesList = () => {
    const [papeles, setPapeles] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [precioventa, setPrecioVenta] = useState('');
    const [preciocompra, setPrecioCompra] = useState('');
    const [stock, setStock] = useState('');
    const [stockSistema, setStockSistema] = useState('');
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentPapelId, setCurrentPapelId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPapeles();
    }, []);

    const fetchPapeles = async () => {
        try {
            const response = await axios.get('http://localhost:3001/papeles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPapeles(response.data);
        } catch (error) {
            console.error('Error al obtener los papeles:', error);
        }
    };

    const agregarPapel = async () => {
        try {
            await axios.post('http://localhost:3001/createPapeles', { codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPapeles();
            limpiarCampos();
        } catch (error) {
            console.error('Error al agregar el papel:', error);
        }
    };

    const actualizarPapel = async () => {
        try {
            await axios.put('http://localhost:3001/updatePapeles', { id: currentPapelId, codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPapeles();
            limpiarCampos();
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar el papel:', error);
        }
    };

    const eliminarPapel = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deletePapeles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPapeles();
        } catch (error) {
            console.error('Error al eliminar el papel:', error);
        }
    };

    const limpiarCampos = () => {
        setCodigo('');
        setNombre('');
        setPrecioVenta('');
        setPrecioCompra('');
        setStock('');
        setStockSistema('');
    };

    const iniciarEdicion = (papel) => {
        setCodigo(papel.codigo);
        setNombre(papel.nombre);
        setPrecioVenta(papel.precioventa);
        setPrecioCompra(papel.preciocompra);
        setStock(papel.stock);
        setStockSistema(papel.stock_sistema);
        setCurrentPapelId(papel.id);
        setEditing(true);
    };

    const handlebtnAtrasClick = () => {
        const role = localStorage.getItem('role');
        if (role === '1') {
            navigate('/home');
        } else if (role === '2') {
            navigate('/homeu');
        }
    };

    const filteredPapeles = papeles.filter((papel) =>
        papel.nombre.toLowerCase().includes(search.toLowerCase()) ||
        papel.codigo.toLowerCase().includes(search.toLowerCase()) ||
        papel.precioventa.toString().toLowerCase().includes(search.toLowerCase()) ||
        papel.preciocompra.toString().toLowerCase().includes(search.toLowerCase()) ||
        papel.stock.toString().toLowerCase().includes(search.toLowerCase()) ||
        papel.stock_sistema.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                    <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <h1 className="my-4">Lista Papeles</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Buscar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Código"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Precio Venta"
                    value={precioventa}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Precio Compra"
                    value={preciocompra}
                    onChange={(e) => setPrecioCompra(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Stock del Sistema"
                    value={stockSistema}
                    onChange={(e) => setStockSistema(e.target.value)}
                />
                {editing ? (
                    <button className="btn btn-primary" onClick={actualizarPapel}>Actualizar Papel</button>
                ) : (
                    <button className="btn btn-primary" onClick={agregarPapel}>Agregar Papel</button>
                )}
                <button className="btn btn-secondary ml-2" onClick={limpiarCampos}>Limpiar Campos</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Precio Venta</th>
                        <th>Precio Compra</th>
                        <th>Stock</th>
                        <th>Stock del Sistema</th>
                        <th>Número de Ajuste</th> {/* Columna para el número de ajuste */}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPapeles.map(papel => (
                        <tr key={papel.id} className={papel.stock <= 5 ? 'table-danger' : ''}> {/* Aplicar clase de Bootstrap */}
                            <td>{papel.codigo}</td>
                            <td>{papel.nombre}</td>
                            <td>{papel.precioventa}</td>
                            <td>{papel.preciocompra}</td>
                            <td>{papel.stock}</td>
                            <td>{papel.stock_sistema}</td>
                            <td>{papel.stock - papel.stock_sistema}</td> {/* Calcular y mostrar el número de ajuste */}
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicion(papel)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarPapel(papel.id)}><i className="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PapelesList;
