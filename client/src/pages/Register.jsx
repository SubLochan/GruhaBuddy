import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            alert('Registration Successful');
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Registration Failed');
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Visual */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-black/60 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2892&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-80"
                    alt="Interior Design"
                />
                <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
                    <h2 className="text-4xl font-bold mb-4">Start your journey.</h2>
                    <p className="text-lg text-white/80 max-w-md">Create account to access AI-powered design tools and save your favorite concepts.</p>
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
                        <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
                        <p className="mt-2 text-gray-600">Enter your details to get started.</p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center">
                            <input id="terms" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                                I agree to the <a href="#" className="text-primary-600 hover:text-primary-500">Terms</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-gray-900 hover:text-gray-700">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
