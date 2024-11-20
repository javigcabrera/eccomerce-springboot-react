import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA REALIZAR PETICIONES A LA API
import '../../style/register.css'; // ESTILOS PARA LA PÁGINA DE LOGIN

const LoginPage = () => {
    // ESTADO PARA GESTIONAR LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        email: '',        // CAMPO PARA EL EMAIL
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
            // ENVÍA LOS DATOS DEL FORMULARIO A LA API PARA INICIAR SESIÓN
            const response = await ApiService.loginUser(formData);
            if (response.status === 200) {
                setMessage("Se ha iniciado sesión con éxito");
                
                // GUARDA EL TOKEN Y EL ROL DEL USUARIO EN LOCALSTORAGE
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                
                // REDIRIGE A LA PÁGINA DE PERFIL DESPUÉS DE 4 SEGUNDOS
                setTimeout(() => {
                    navigate("/profile");
                }, 4000);
            }
        } catch (error) {
            // SI HAY UN ERROR, MUESTRA EL MENSAJE AL USUARIO
            setMessage(error.response?.data.message || error.message || "No se ha podido iniciar sesión");
        }
    };

    return (
        <div className="register-page">
            <h2>Login</h2>
            {/* MUESTRA MENSAJES SI EXISTEN */}
            {message && <p className="message">{message}</p>}
            
            {/* FORMULARIO DE LOGIN */}
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
                <button type="submit">Iniciar Sesión</button>

                {/* ENLACE A LA PÁGINA DE REGISTRO SI NO TIENES UNA CUENTA */}
                <p className="register-link">
                    ¿Aún no tienes una cuenta? <a href="/register">Registro</a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
