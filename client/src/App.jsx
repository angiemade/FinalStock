import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './componentes/Login/Login';
import Home from './componentes/Home/Home';
import HomeU from './componentes/HomeU/HomeU';
import Tabaco from './componentes/Tabaco/Tabaco';
import Lillos from './componentes/Papeles/Lillos';
import Filtro from './componentes/Filtros/Filtro';
import PapelesList from './componentes/Lista/PapelesList';
import TabacoList from './componentes/Lista/TabacoList';
import FiltrosList from './componentes/Lista/FiltrosList';

function App() {
 
  return (
    <>
       <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/homeu" element={<HomeU/>} />
                <Route path="/tabaco" element={<Tabaco/>} />
                <Route path="/lillos" element={<Lillos/>} />
                <Route path="/filtros" element={<Filtro/>} />
                <Route path="/papeleslist" element={<PapelesList/>} />
                <Route path="/tabacolist" element={<TabacoList/>} />
                <Route path="/filtroslist" element={<FiltrosList/>} />
                


            </Routes>
        </Router>
    </>
  )
}

export default App
