import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            await register(name, email, password);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h1>Register</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;