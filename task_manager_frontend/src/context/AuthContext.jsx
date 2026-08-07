import {
    login as loginService,
    getCurrentUser,
} from "../services/authService";
import { createContext, useState } from "react";

const AuthContext = createContext();
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const isAuthenticated = user !== null;
    async function login(email, password) {
    const result = await loginService(email, password);
    localStorage.setItem(
        "access_token",
        result.access_token
    );
    const currentUser = await getCurrentUser();
    setUser(currentUser);
} 
useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        setAuthLoading(false);
        return;
    }

    async function loadUser() {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        }
        catch {
            localStorage.removeItem("access_token");
            setUser(null);
        }
        finally {
            setAuthLoading(false);
        }
    }
    loadUser();
}, []);
    function logout() {
        localStorage.removeItem("access_Token");
        setUser(null);
    }
    const value = {
        user,
        setUser,
        isAuthenticated,
        authLoading,
        login,
        logout
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;

