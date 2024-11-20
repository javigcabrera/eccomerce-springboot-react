import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA REALIZAR PETICIONES A LA API
import '../../style/register.css'; // ESTILOS PARA LA PÁGINA DE REGISTRO

const RegisterPage = () => {

    // ESTADO PARA GESTIONAR LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        email: '',        // CAMPO PARA EL EMAIL
        name: '',         // CAMPO PARA EL NOMBRE
        phoneNumber: '',  // CAMPO PARA EL NÚMERO DE TELÉFONO
        password: ''      // CAMPO PARA LA CONTRASEÑA
    });

    // ESTADO PARA MOSTRAR MENSAJES AL USUARIO
    const [message, setMessage] = useState(null);

    // HOOK PARA NAVEGAR ENTRE PÁGINAS
    const navigate = useNavigate();
    

    // ACTUALIZA LOS DATOS DEL FORMULARIO CUANDO EL USUARIO ESCRIBE EN LOS CAMPOS
    const handleChange = (e) => {
        const { name, value } = e.target; // OBTIENE EL NOMBRE Y VALOR DEL CAMPO
        setFormData({ ...formData, [name]: value }); // ACTUALIZA EL ESTADO formData
    };

    // ENVÍA EL FORMULARIO AL SERVIDOR CUANDO SE HACE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            // ENVÍA LOS DATOS DEL FORMULARIO A LA API PARA REGISTRAR UN NUEVO USUARIO
            const response = await ApiService.registerUser(formData);
            if (response.status === 200) {
                setMessage("Usuario registrado con éxito");
                // REDIRIGE A LA PÁGINA DE LOGIN DESPUÉS DE 4 SEGUNDOS
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
        } catch (error) {
            // OBTENEMOS EL MENSAJE DEL ERROR DEL BACKEND
            const errorMessage = error.response?.data.message || error.message || "No se ha podido registrar al usuario";
    
            // DETECTAMOS SI EL ERROR ES DE DUPLICADO Y LO PERSONALIZAMOS
            if (errorMessage.includes("Duplicate entry")) {
                setMessage("El correo ya existe, intenta con otro.");
            } else {
                setMessage(errorMessage); // MOSTRAMOS EL MENSAJE ORIGINAL SI NO ES DUPLICADO
            }
        }
    };
    

    return (
        <div className="register-page">
            <h2>Registro</h2>
            {/* MUESTRA MENSAJES SI EXISTEN */}
            {message && <p className="message">{message}</p>}
            
            {/* FORMULARIO DE REGISTRO */}
            <form onSubmit={handleSubmit}>
                {/* CAMPO PARA EL EMAIL */}
                <label>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />

                {/* CAMPO PARA EL NOMBRE */}
                <label>Nombre:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                {/* CAMPO PARA EL NÚMERO DE TELÉFONO */}
                <label>Número Teléfono:</label>
                <input 
                    type="text" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                />

                {/* CAMPO PARA LA CONTRASEÑA */}
                <label>Password:</label>
                <input 
                    type="password" 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />

                {/* BOTÓN PARA ENVIAR EL FORMULARIO */}
                <button type="submit">Registrar</button>

                {/* ENLACE A LA PÁGINA DE LOGIN SI YA TIENES UNA CUENTA */}
                <p className="register-link">
                    Ya tienes una cuenta? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
