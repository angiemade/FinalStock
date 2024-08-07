import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from "../../hook/useForm.jsx";
import Loader from "../ImportForm/Loader.jsx";
import Message from "../ImportForm/Message.jsx";
import { BsSend } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import './Tabaco.css'

const Crud = () => {
    const [productos, setProductos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [precioventa, setPrecioVenta] = useState('');
    const [preciocompra, setPrecioCompra] = useState('');
    const [stock, setStock] = useState('');
    const [search, setSearch] = useState(''); // Campo de búsqueda
    const [editing, setEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [ultimaModificacion, setUltimaModificacion] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const searchProductos = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/searchProductos?query=${search}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al buscar los productos:', error);
        }
    };

    useEffect(() => {
        if (search) {
            searchProductos();
        } else {
            fetchProductos();
        }
    }, [search]);

    const agregarProducto = async () => {
        try {
            await axios.post('http://localhost:3001/createProducto', { codigo, nombre, precioventa, preciocompra, stock }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchProductos();
            limpiarCampos();
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    const actualizarProducto = async () => {
        try {
            await axios.put('http://localhost:3001/updateProducto', { id: currentProductId, codigo, nombre, precioventa, preciocompra, stock }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchProductos();
            limpiarCampos();
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deleteProducto/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchProductos();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const limpiarCampos = () => {
        setCodigo('');
        setNombre('');
        setPrecioVenta('');
        setPrecioCompra('');
        setStock('');
        setUltimaModificacion('');
    };

    const iniciarEdicion = (producto) => {
        setCodigo(producto.codigo);
        setNombre(producto.nombre);
        setPrecioVenta(producto.precioventa);
        setPrecioCompra(producto.preciocompra);
        setStock(producto.stock);
        setUltimaModificacion(producto.ultima_modificacion);
        setCurrentProductId(producto.id);
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

    /*form para mandar*/
    const initialForm = {
        name: "",
        comments: "",
    };

    const validationsForm = (form) => {
        let errors = {};
        let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        let regexComments = /^.{1,255}$/;

        if (!form.name.trim()) {
            errors.name = "El campo 'Nombre' es requerido";
        } else if (!regexName.test(form.name.trim())) {
            errors.name = "El campo 'Nombre' sólo acepta letras y espacios en blanco";
        }

        if (!form.comments.trim()) {
            errors.comments = "El campo 'Comentarios' es requerido";
        } else if (!regexComments.test(form.comments.trim())) {
            errors.comments =
                "El campo 'Comentarios' no debe exceder los 255 caracteres";
        }

        return errors;
    };

    let styles = {
        fontWeight: "bold",
        color: "#dc3545",
    };

    const ContactForm = () => {
        const {
            form,
            errors,
            loading,
            response,
            handleChange,
            handleBlur,
            handleSubmit,
        } = useForm(initialForm, validationsForm);

        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-end mt-2">
                    <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                        <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                    </button>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Comentar el estado del trabajo</h2>
                        <form onSubmit={handleSubmit} className="d-flex flex-column">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Escribe tu nombre"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={form.name}
                                    required
                                />
                                {errors.name && <p style={styles}>{errors.name}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comments" className="form-label">Notas</label>
                                <textarea
                                    className="form-control"
                                    id="comments"
                                    name="comments"
                                    placeholder="Escribe tus comentarios"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={form.comments}
                                    required
                                    style={{ resize: "none" }} // Prevent textarea resizing
                                    rows="4" // Set a default height
                                ></textarea>
                                {errors.comments && <p style={styles}>{errors.comments}</p>}
                            </div>
                            <button type="submit" className="btn btn-dark mt-3">
                                <BsSend /> Enviar
                            </button>
                            {loading && <Loader />}
                            {response && (
                                <Message msg="Los datos han sido enviados" bgColor="#198754" />
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    };
    /*form para mandar*/

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(search.toLowerCase()) ||
        producto.precioventa.toString().toLowerCase().includes(search.toLowerCase()) ||
        producto.preciocompra.toString().toLowerCase().includes(search.toLowerCase()) ||
        producto.stock.toString().toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="container">
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                    <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                </button>
    
            </div>
            <h1 className="my-4">Tabacos de Pipa</h1>
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
                {editing ? (
                    <button className="btn btn-primary" onClick={actualizarProducto}>Actualizar Producto</button>
                ) : (
                    <button className="btn btn-primary" onClick={agregarProducto}>Agregar Producto</button>
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
                        <th>Última Modificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProductos.map(producto => (
                        <tr key={producto.id} className={producto.stock <= 5 ? 'table-danger' : ''}>
                            {/* Añadir clase 'table-danger' si el stock es menor o igual a 5 */}
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.precioventa}</td>
                            <td>{producto.preciocompra}</td>
                            <td>{producto.stock}</td>
                            <td>{new Date(producto.ultima_modificacion).toLocaleString()}</td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicion(producto)}><i class="bi bi-pencil"></i></button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <ContactForm /> */}
        </div>
    );
}

const CrudU = () => {
    const [productos, setProductos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [precioventa, setPrecioVenta] = useState('');
    const [preciocompra, setPrecioCompra] = useState('');
    const [stock, setStock] = useState('');
    const [search, setSearch] = useState(''); // Campo de búsqueda
    const [editing, setEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/productos', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const actualizarProducto = async () => {
        try {
            await axios.put('http://localhost:3001/updateProducto', { id: currentProductId, codigo, nombre, precioventa, preciocompra, stock }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchProductos();
            limpiarCampos();
            setEditing(false);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const limpiarCampos = () => {
        setCodigo('');
        setNombre('');
        setPrecioVenta('');
        setPrecioCompra('');
        setStock('');
    };

    const iniciarEdicion = (producto) => {
        setCodigo(producto.codigo);
        setNombre(producto.nombre);
        setPrecioVenta(producto.precioventa);
        setPrecioCompra(producto.preciocompra);
        setStock(producto.stock);
        setCurrentProductId(producto.id);
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

    const initialForm = {
        name: "",
        comments: "",
    };

    const validationsForm = (form) => {
        let errors = {};
        let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        let regexComments = /^.{1,255}$/;

        if (!form.name.trim()) {
            errors.name = "El campo 'Nombre' es requerido";
        } else if (!regexName.test(form.name.trim())) {
            errors.name = "El campo 'Nombre' sólo acepta letras y espacios en blanco";
        }

        if (!form.comments.trim()) {
            errors.comments = "El campo 'Comentarios' es requerido";
        } else if (!regexComments.test(form.comments.trim())) {
            errors.comments = "El campo 'Comentarios' no debe exceder los 255 caracteres";
        }

        return errors;
    };

    let styles = {
        fontWeight: "bold",
        color: "#dc3545",
    };

    const ContactForm = () => {
        const {
            form,
            errors,
            loading,
            response,
            handleChange,
            handleBlur,
            handleSubmit,
        } = useForm(initialForm, validationsForm);

        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-end mt-2">
                    <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                        <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                    </button>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Comentar el estado del trabajo</h2>
                        <form onSubmit={handleSubmit} className="d-flex flex-column">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Escribe tu nombre"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={form.name}
                                    required
                                />
                                {errors.name && <p style={styles}>{errors.name}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comments" className="form-label">Notas</label>
                                <textarea
                                    className="form-control"
                                    id="comments"
                                    name="comments"
                                    placeholder="Escribe tus comentarios"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={form.comments}
                                    required
                                    style={{ resize: "none" }} // Prevent textarea resizing
                                    rows="4" // Set a default height
                                ></textarea>
                                {errors.comments && <p style={styles}>{errors.comments}</p>}
                            </div>
                            <button type="submit" className="btn btn-dark mt-3">
                                <BsSend /> Enviar
                            </button>
                            {loading && <Loader />}
                            {response && (
                                <Message msg="Los datos han sido enviados" bgColor="#198754" />
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(search.toLowerCase()) ||
        producto.precioventa.toString().toLowerCase().includes(search.toLowerCase()) ||
        producto.preciocompra.toString().toLowerCase().includes(search.toLowerCase()) ||
        producto.stock.toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-light" onClick={handlebtnAtrasClick}>
                    <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <h1 className="my-4">Tabacos de Pipa</h1>
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
                    readOnly
                    style={{ backgroundColor: '#e9ecef' }}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    readOnly
                    style={{ backgroundColor: '#e9ecef' }}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Precio Venta"
                    value={precioventa}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    readOnly
                    style={{ backgroundColor: '#e9ecef' }}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Precio Compra"
                    value={preciocompra}
                    onChange={(e) => setPrecioCompra(e.target.value)}
                    readOnly
                    style={{ backgroundColor: '#e9ecef' }}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />

                {editing ? (
                    <button className="btn btn-primary" onClick={actualizarProducto}>Actualizar Stock</button>
                ) : (
                    <button className="btn btn-primary" onClick={() => setEditing(false)}>Cancelar</button>
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProductos.map(producto => (
                        <tr key={producto.id} className={producto.stock <= 5 ? 'table-danger' : ''}>
                            {/* Añadir clase 'table-danger' si el stock es menor o igual a 5 */}
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.precioventa}</td>
                            <td>{producto.preciocompra}</td>
                            <td>{producto.stock}</td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicion(producto)}>Editar Stock</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ContactForm />
        </div>
    );
};



const Tabaco = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    if (role === '1') {
        return <Crud />;
    } else if (role === '2') {
        return <CrudU />;
    } else {
        return <div>No tienes acceso a esta página.</div>;
    }
};

export default Tabaco;