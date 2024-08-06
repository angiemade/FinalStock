import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const FiltrosList = () => {
    const [filtros, setFiltros] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [precioventa, setPrecioVenta] = useState('');
    const [preciocompra, setPrecioCompra] = useState('');
    const [stock, setStock] = useState('');
    const [stockSistema, setStockSistema] = useState('');
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentFiltroId, setCurrentFiltroId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFiltros();
    }, []);

    const fetchFiltros = async () => {
        try {
            const response = await axios.get('http://localhost:3001/filtros', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFiltros(response.data);
        } catch (error) {
            console.error('Error al obtener los filtros:', error);
        }
    };

    const agregarFiltro = async () => {
        try {
            await axios.post('http://localhost:3001/createFiltros', { codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchFiltros();
            limpiarCampos();
        } catch (error) {
            console.error('Error al agregar el filtro:', error);
        }
    };

    const actualizarFiltro = async () => {
        try {
            await axios.put('http://localhost:3001/updateFiltros', { id: currentFiltroId, codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchFiltros();
            limpiarCampos();
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar el filtro:', error);
        }
    };

    const eliminarFiltro = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deleteFiltros/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchFiltros();
        } catch (error) {
            console.error('Error al eliminar el filtro:', error);
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

    const iniciarEdicion = (filtro) => {
        setCodigo(filtro.codigo);
        setNombre(filtro.nombre);
        setPrecioVenta(filtro.precioventa);
        setPrecioCompra(filtro.preciocompra);
        setStock(filtro.stock);
        setStockSistema(filtro.stock_sistema);
        setCurrentFiltroId(filtro.id);
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

    const filteredFiltros = filtros.filter((filtro) =>
        filtro.nombre.toLowerCase().includes(search.toLowerCase()) ||
        filtro.codigo.toLowerCase().includes(search.toLowerCase()) ||
        filtro.precioventa.toString().toLowerCase().includes(search.toLowerCase()) ||
        filtro.preciocompra.toString().toLowerCase().includes(search.toLowerCase()) ||
        filtro.stock.toString().toLowerCase().includes(search.toLowerCase()) ||
        filtro.stock_sistema.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                    <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <h1 className="my-4">Lista de Filtros</h1>
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
                    <button className="btn btn-primary" onClick={actualizarFiltro}>Actualizar Filtro</button>
                ) : (
                    <button className="btn btn-primary" onClick={agregarFiltro}>Agregar Filtro</button>
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
                    {filteredFiltros.map(filtro => (
                        <tr key={filtro.id} className={filtro.stock <= 5 ? 'table-danger' : ''}> {/* Aplicar clase de Bootstrap */}
                            <td>{filtro.codigo}</td>
                            <td>{filtro.nombre}</td>
                            <td>{filtro.precioventa}</td>
                            <td>{filtro.preciocompra}</td>
                            <td>{filtro.stock}</td>
                            <td>{filtro.stock_sistema}</td>
                            <td>{filtro.stock - filtro.stock_sistema}</td> {/* Calcular y mostrar el número de ajuste */}
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicion(filtro)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarFiltro(filtro.id)}><i className="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FiltrosList;
