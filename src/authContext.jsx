import React, {createContext ,useState , useEffect ,useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Here you can check for existing auth state, e.g., from localStorage or an API
        const userId = localStorage.getItem("userId"); // Replace with actual auth check
        if (userId) {
            setCurrentUser(userId); // Replace with actual user data
        }
    }   , []);

    const value = {
        currentUser,
        setCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;