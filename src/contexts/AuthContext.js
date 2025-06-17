import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

// 创建认证上下文
const AuthContext = createContext();

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取当前认证状态
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      setLoading(false);

      // 如果未认证且不在登录页，重定向到登录页
      if (!authStatus && location.pathname !== '/login') {
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  // 登录函数
  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      setIsAuthenticated(true);
      // 不要自动 navigate('/')，让页面自己跳转
      return result; // 返回真实的登录结果对象
    } catch (error) {
      return false;
    }
  };

  // 登出函数
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // 提供上下文值
  const value = {
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义hook，方便使用认证上下文
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 