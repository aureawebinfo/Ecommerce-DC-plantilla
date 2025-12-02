'use client'
import { createContext, useState, useContext, useEffect } from 'react'

const DEBUG = false
const API_URL = !DEBUG ? "https://ecommerce-dc-plantilla.onrender.com/api" : 'http://localhost:8000/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Solo en el cliente
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,  // Django usa 'username'
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.user?.id || data.id,
          username: data.user?.username || data.username,
          email: data.user?.email || data.email,
          first_name: data.user?.first_name || data.first_name,
          last_name: data.user?.last_name || data.last_name,
          nombre: `${data.user?.first_name || data.first_name} ${data.user?.last_name || data.last_name}`.trim()
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error en el login' };
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔐 Iniciando registro...', userData);

      // Datos CORRECTOS que espera Django - BASADO EN LA PRUEBA EXITOSA
      const registrationData = {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.confirmPassword, // ✅ Campo corregido
        first_name: userData.nombre.split(' ')[0] || userData.nombre,
        last_name: userData.nombre.split(' ').slice(1).join(' ') || '',
      };

      console.log('📤 Enviando al backend:', registrationData);

      const response = await fetch(`${API_URL}/usuarios/registro/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('📥 Status recibido:', response.status);

      const data = await response.json();
      console.log('📨 Respuesta del backend:', data);

      if (response.status === 201) { // ✅ 201 = Created (éxito)
        console.log('✅ Registro exitoso en base de datos');

        // Crear objeto usuario basado en la respuesta
        const newUser = {
          id: data.id || Date.now(), // El backend puede no devolver ID inmediatamente
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          nombre: `${data.first_name} ${data.last_name}`.trim() || data.username
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true };
      } else {
        console.log('❌ Error del backend:', data);
        // Manejar errores específicos
        const errorMessage =
          data.password_confirm?.[0] ||
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          data.non_field_errors?.[0] ||
          'Error en el registro';

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log('💥 Error de conexión:', error);
      return {
        success: false,
        error: 'No se puede conectar al servidor. Verifica que esté ejecutándose.'
      };
    }
  };

  const logout = () => {
    // Llamar al endpoint de logout del backend
    fetch(`${API_URL}/usuarios/logout/`, {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error)

    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}