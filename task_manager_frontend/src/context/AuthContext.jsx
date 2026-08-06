import { createContext, useState } from "react";

const AuthContext = createContext();
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const value = { user, setUser };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;

