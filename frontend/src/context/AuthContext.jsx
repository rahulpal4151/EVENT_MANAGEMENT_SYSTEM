import { useState, useEffect } from 'react';
import { AuthContext } from './authContextValue';

// 2. Provider component jo poore app ko wrap karega
export const AuthProvider = ({ children }) => {
    
    // State initialize karte waqt pehle localStorage check karein
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Jab bhi 'user' state change ho (Login ya Logout par), localStorage ko automatically update karein
    useEffect(() => {
        if (user) {
            // Login hone par details save karein
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            // Logout hone par details hata dein
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};