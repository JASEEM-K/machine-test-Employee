import React, { createContext, useContext, useState, useEffect } from "react";
// import toast from "react-hot-toast";

type User = {
    _id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    token: string;
};

type SelectType = User | null;

type contextValue = {
    user: SelectType;
    setUser: (text: SelectType) => void;
    logout: () => void;
};

const AuthContext = createContext<contextValue>({
    user: null,
    setUser: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<SelectType | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            } catch (error) {
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    // Save user to localStorage when user changes
    const handleSetUser = (userData: SelectType) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-[#28282B] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error();
    }
    return context;
}
