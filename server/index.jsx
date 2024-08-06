const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'FinalStock'
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión con la base de datos:', err);
        return;
    }
    console.log('Conectado con la base de datos.');
});

// Registro de usuarios
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        if (results.length > 0) {
            return res.status(409).json({ msg: 'El nombre de usuario ya existe' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.query('INSERT INTO usuarios (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            return res.status(201).json(result);
        });
    });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        if (results.length > 0) {
            const user = results[0];
            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {
                const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token, role: user.role_id });
            } else {
                return res.status(401).json({ msg: 'Credenciales incorrectas' });
            }
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    });
});

// Cerrar sesión
app.post('/logout', (req, res) => {
    res.json({ msg: 'Sesión cerrada' });
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
/////////////////////////////////////////////////////////////TABACOS///////////////////////////////////////////////////////////////////
// CRUD de productos (tabacos)
app.get('/searchProductos', authenticateToken, (req, res) => {
    const { query } = req.query;
    db.query(
        'SELECT * FROM productos WHERE codigo LIKE ? OR nombre LIKE ? OR precioventa LIKE ? OR preciocompra LIKE ? OR stock LIKE ?', 
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            return res.json(results);
        }
    );
});

// MOSTRAR TABACOS
app.get('/productos', authenticateToken, (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.json(results);
    });
});

// CREAR TABACOS
app.post('/createProducto', authenticateToken, (req, res) => {
    const { codigo, nombre, precioventa, preciocompra, stock, stock_sistema } = req.body;
    db.query('INSERT INTO productos (codigo, nombre, precioventa, preciocompra, stock, stock_sistema) VALUES (?, ?, ?, ?, ?, ?)', [codigo, nombre, precioventa, preciocompra, stock, stock_sistema], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(201).json(result);
    });
});

// MODIFICAR TABACOS
app.put('/updateProducto', authenticateToken, (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock, stock_sistema } = req.body;
    db.query('UPDATE productos SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ?, stock_sistema = ? WHERE id = ?', [codigo, nombre, precioventa, preciocompra, stock, stock_sistema, id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});

// ELIMINAR TABACOS
app.delete('/deleteProducto/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});


// Controlador de actualización de producto
const updateProducto = async (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock } = req.body;
    try {
        await db.query('UPDATE productos SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ?, ultima_modificacion = NOW() WHERE id = ?',
            [codigo, nombre, precioventa, preciocompra, stock, id]);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};


/////////////////////////////////////////////////////////////LILLOS///////////////////////////////////////////////////////////////////
// Agregar una ruta de búsqueda para productos (papeles en este caso)
app.get('/searchPapeles', authenticateToken, (req, res) => {
    const { query } = req.query;
    db.query(
        'SELECT * FROM papeles WHERE codigo LIKE ? OR nombre LIKE ? OR precioventa LIKE ? OR preciocompra LIKE ? OR stock LIKE ? OR stock_sistema LIKE ?', 
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            return res.json(results);
        }
    );
});

// MOSTRAR LILLOS
app.get('/papeles', authenticateToken, (req, res) => {
    db.query('SELECT * FROM papeles', (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.json(results);
    });
});

// CREAR LILLOS
app.post('/createPapeles', authenticateToken, (req, res) => {
    const { codigo, nombre, precioventa, preciocompra, stock, stock_sistema } = req.body;
    db.query('INSERT INTO papeles (codigo, nombre, precioventa, preciocompra, stock, stock_sistema) VALUES (?, ?, ?, ?, ?, ?)', 
    [codigo, nombre, precioventa, preciocompra, stock, stock_sistema], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(201).json(result);
    });
});

// MODIFICAR LILLOS
app.put('/updatePapeles', authenticateToken, (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock, stock_sistema } = req.body;
    db.query('UPDATE papeles SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ?, stock_sistema = ?, ultima_modificacion = NOW() WHERE id = ?', 
    [codigo, nombre, precioventa, preciocompra, stock, stock_sistema, id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});

// ELIMINAR LILLOS
app.delete('/deletePapeles/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM papeles WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});



const updatePapeles = async (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock } = req.body;
    try {
        await db.query('UPDATE papeles SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ?, ultima_modificacion = NOW() WHERE id = ?',
            [codigo, nombre, precioventa, preciocompra, stock, id]);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};


/////////////////////////////////////////////////////////////FILTROS///////////////////////////////////////////////////////////////////// 
//Ruta de búsqueda para filtros
app.get('/searchFiltros', authenticateToken, (req, res) => {
    const { query } = req.query;
    const searchQuery = `%${query}%`;
    db.query(
        'SELECT * FROM filtros WHERE codigo LIKE ? OR nombre LIKE ? OR precioventa LIKE ? OR preciocompra LIKE ? OR stock LIKE ?', 
        [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            return res.json(results);
        }
    );
});

//MOSTRAR FILTROS
app.get('/filtros', authenticateToken, (req, res) => {
    db.query('SELECT * FROM filtros', (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.json(results);
    });
});

//CREAR FILTROS
app.post('/createFiltros', authenticateToken, (req, res) => {
    const { codigo, nombre, precioventa, preciocompra, stock } = req.body;
    db.query('INSERT INTO filtros (codigo, nombre, precioventa, preciocompra, stock) VALUES (?, ?, ?, ?, ?)', [codigo, nombre, precioventa, preciocompra, stock], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(201).json(result);
    });
});

//MODIFICAR FILTROS
app.put('/updateFiltros', authenticateToken, (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock } = req.body;
    db.query('UPDATE filtros SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ? WHERE id = ?', [codigo, nombre, precioventa, preciocompra, stock, id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});

//ELIMINAR FILTROS
app.delete('/deleteFiltros/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM filtros WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.status(200).json(result);
    });
});


// Controlador de actualización de producto
const updateFiltros = async (req, res) => {
    const { id, codigo, nombre, precioventa, preciocompra, stock } = req.body;
    try {
        await db.query('UPDATE filtros SET codigo = ?, nombre = ?, precioventa = ?, preciocompra = ?, stock = ?, ultima_modificacion = NOW() WHERE id = ?',
            [codigo, nombre, precioventa, preciocompra, stock, id]);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};






// Configuración del puerto
app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});
