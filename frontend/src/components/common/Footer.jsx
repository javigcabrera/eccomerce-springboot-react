import React from "react";
import "../../style/footer.css";
import { NavLink } from "react-router-dom";

const Footer=()=>{
    return (
        <footer className="footer">
            {/* CONTENEDOR DE ENLACES DEL FOOTER */}
            <div className="footer-links">
                <ul>
                    {/* ENLACES A DIFERENTES SECCIONES UTILIZANDO NavLink */}
                    <NavLink to={"/"}>About Us</NavLink>
                    <NavLink to={"/"}>Contactanos</NavLink>
                    <NavLink to={"/"}>Terms & Condiciones</NavLink>
                    <NavLink to={"/"}>Politica Privacidad</NavLink>
                    <NavLink to={"/"}>FAQs</NavLink>
                </ul>
            </div>
            {/* CONTENEDOR DE INFORMACIÓN ADICIONAL DEL FOOTER */}
            <div className="footer-info">
                <p>Bazar Pepe</p>
            </div>
        </footer>
    );
};

export default Footer;