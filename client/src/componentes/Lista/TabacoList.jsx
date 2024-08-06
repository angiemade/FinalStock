import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const TabacoList = () => {
    const [tabacos, setTabacos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [precioventa, setPrecioVenta] = useState('');
    const [preciocompra, setPrecioCompra] = useState('');
    const [stock, setStock] = useState('');
    const [stockSistema, setStockSistema] = useState('');
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentTabacoId, setCurrentTabacoId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTabacos();
    }, []);

    const fetchTabacos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTabacos(response.data);
        } catch (error) {
            console.error('Error al obtener los tabacos:', error);
        }
    };

    const agregarTabaco = async () => {
        try {
            await axios.post('http://localhost:3001/createProducto', { codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTabacos();
            limpiarCampos();
        } catch (error) {
            console.error('Error al agregar el tabaco:', error);
        }
    };

    const actualizarTabaco = async () => {
        try {
            await axios.put('http://localhost:3001/updateProducto', { id: currentTabacoId, codigo, nombre, precioventa, preciocompra, stock, stock_sistema: stockSistema }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTabacos();
            limpiarCampos();
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar el tabaco:', error);
        }
    };

    const eliminarTabaco = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deleteProducto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTabacos();
        } catch (error) {
            console.error('Error al eliminar el tabaco:', error);
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

    const iniciarEdicion = (tabaco) => {
        setCodigo(tabaco.codigo);
        setNombre(tabaco.nombre);
        setPrecioVenta(tabaco.precioventa);
        setPrecioCompra(tabaco.preciocompra);
        setStock(tabaco.stock);
        setStockSistema(tabaco.stock_sistema);
        setCurrentTabacoId(tabaco.id);
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

    const filteredTabacos = tabacos.filter((tabaco) =>
        tabaco.nombre.toLowerCase().includes(search.toLowerCase()) ||
        tabaco.codigo.toLowerCase().includes(search.toLowerCase()) ||
        tabaco.precioventa.toString().toLowerCase().includes(search.toLowerCase()) ||
        tabaco.preciocompra.toString().toLowerCase().includes(search.toLowerCase()) ||
        tabaco.stock.toString().toLowerCase().includes(search.toLowerCase()) ||
        tabaco.stock_sistema.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                    <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <h1 className="my-4">Lista Tabacos</h1>
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
                    <button className="btn btn-primary" onClick={actualizarTabaco}>Actualizar Tabaco</button>
                ) : (
                    <button className="btn btn-primary" onClick={agregarTabaco}>Agregar Tabaco</button>
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
                    {filteredTabacos.map(tabaco => (
                        <tr key={tabaco.id} className={tabaco.stock <= 5 ? 'table-danger' : ''}> {/* Aplicar clase de Bootstrap */}
                            <td>{tabaco.codigo}</td>
                            <td>{tabaco.nombre}</td>
                            <td>{tabaco.precioventa}</td>
                            <td>{tabaco.preciocompra}</td>
                            <td>{tabaco.stock}</td>
                            <td>{tabaco.stock_sistema}</td>
                            <td>{tabaco.stock - tabaco.stock_sistema}</td> {/* Calcular y mostrar el número de ajuste */}
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicion(tabaco)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarTabaco(tabaco.id)}><i className="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabacoList;
