import React, { useState, useContext } from "react"
import { useNavigate } from "react-router"
import { SessionContext, useLogin } from "../context/SessionContext"
import { useUsuario } from "../context/SessionContext";



const Login = () => {
    const navigate = useNavigate()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { setUserApp } = useUsuario();



    const login = useLogin()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email, password)

        fetch("http://localhost:3333/api/userApp/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Credenciales inválidas")
                return res.json()
            })
            .then(userApp => {

                login(userApp);

                navigate("/vacunas");
            })
            .catch(err => setError("Error en login: " + err.message))
    }


    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Iniciar sesión</h1>
                {error.length > 0 && <p className="error_message">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Ingresar mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Ingresar contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="login-btn-form">
                        Login
                    </button>
                    <p className="text-center mt-3 mb-0">
                        ¿No tenés cuenta?{" "}
                        <a href="/register" style={{ color: "#06385f", fontWeight: "bold" }}>
                            ¡Registrate!
                        </a>
                    </p>


                </form>
            </div>
        </div>
    )
}

export default Login
