import { Link, useNavigate } from 'react-router-dom';
import { Layout, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
                                <Layout className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">GruhaBuddy</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Login</Link>
                                <Link to="/register" className="bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
