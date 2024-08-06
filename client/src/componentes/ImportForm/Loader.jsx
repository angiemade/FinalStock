import React from "react";
import "./Loader.css";  // Asegúrate de que el nombre del archivo y la extensión sean correctos

const Loader = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
    </div>
  );
};


export default Loader;