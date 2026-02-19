import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Layout } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('user', JSON.stringify({ id: res.data.userId, name: res.data.name }));
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Login Failed');
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Visual */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-primary-900/20 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2727&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Interior Design"
                />
                <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
                    <h2 className="text-4xl font-bold mb-4">Design without limits.</h2>
                    <p className="text-lg text-white/80 max-w-md">Join thousands of homeowners creating their dream spaces with GruhaBuddy AI.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8">
                            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                                <Layout className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl text-gray-900">GruhaBuddy</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-gray-600">Please enter your details to sign in.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            Sign in
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                                Sign up for free
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
