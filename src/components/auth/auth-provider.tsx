import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'FELLOW';
    isFinanceDept: boolean;
    departmentId?: string;
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {

                const { data, error } = apiClient.get('/auth/session');

                if (data && !error) {
                    setUser(data as User);
                } else {
                    const hasSession = localStorage.getItem('mockSession');

                    if (hasSession) {
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        setUser({
                            id: 'user_1',
                            name: 'John Doe',
                            email: 'john@example.com',
                            role: 'ADMIN',
                            isFinanceDept: false,
                            departmentId: 'dept_1',
                        });
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {

            const { data, error } = apiClient.post('/auth/login', {
                data: { email, password }
            });

            if (data && !error) {
                setUser(data as User);
            } else {

                await new Promise(resolve => setTimeout(resolve, 1000));

                if (email && password) {
                    setUser({
                        id: 'user_1',
                        name: 'John Doe',
                        email: email,
                        role: 'ADMIN',
                        isFinanceDept: false,
                        departmentId: 'dept_1',
                    });
                    localStorage.setItem('mockSession', 'true');
                } else {
                    throw new Error('Invalid credentials');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            apiClient.post('/auth/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('mockSession');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;