import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



const AuthContext = createContext(null);

export const AppProvider = ({ children }) => {

    const [user , setUser] = useState(null);
    const [isAuthenticated , setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const token = localStorage.getItem('token');
        const userConnected = localStorage.getItem('user');
        const laundry = localStorage.getItem('laundry');
        
        if(!token || !userConnected){
            setIsAuthenticated(false);
            //window.location.href = 'http://localhost:3000/login';
            setLoading(false);
            return;
        } else {
            setIsAuthenticated(true);
            setUser(JSON.parse(userConnected));
        }
        setLoading(false);
    }, [])

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('laundry');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = 'http://localhost:3000/login';
    }



    return (
        <AuthContext.Provider value={{ user, setUser, logout , isAuthenticated, setIsAuthenticated }}>
            {
                !loading ? children : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            border: '4px solid #e0e0e0',
                            borderTop: '4px solid #4f46e5',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )
            }
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


