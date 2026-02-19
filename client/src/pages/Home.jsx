import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layout, Palette, Armchair, MonitorSmartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden hero-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-100/50 border border-primary-200 text-primary-700 text-sm font-semibold mb-6">
                                Now with AI-Powered 3D Mockups
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                                Reimagine your <br />
                                <span className="gradient-text">Dream Space</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                GruhaBuddy combines advanced AI with professional interior design principles to transform your room photos into stunning, personalized living spaces in seconds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2">
                                    Get Started Free <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/demo" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-full font-semibold text-lg transition-all flex items-center gap-2">
                                    View Demo Gallery
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GruhaBuddy?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Experience the future of interior design with our cutting-edge features designed for modern living.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Sparkles className="w-6 h-6" />, title: "AI-Powered Magic", desc: "Upload a photo and let our AI generate multiple design variations instantly." },
                            { icon: <Palette className="w-6 h-6" />, title: "Personalized Styles", desc: "Choose from Modern, Bohemian, Minimalist, and cultural aesthetics to match your taste." },
                            { icon: <MonitorSmartphone className="w-6 h-6" />, title: "Real-time Visualization", desc: "See exactly how furniture and colors will look in your actual room dimensions." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Showcase (Placeholder for now) */}
            <section className="py-20 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Space <br /><span className="text-primary-400">In Seconds</span></h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Don't just imagine it. See it. Our advanced rendering engine understands depth, lighting, and spatial aesthetics to give you the most realistic preview possible.
                        </p>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <h4 className="text-4xl font-bold text-white">10k+</h4>
                                <p className="text-gray-400 text-sm">Designs Generated</p>
                            </div>
                            <div className="w-px bg-gray-700 mx-4"></div>
                            <div className="text-center">
                                <h4 className="text-4xl font-bold text-white">4.8/5</h4>
                                <p className="text-gray-400 text-sm">User Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <img
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Before and After"
                            className="rounded-lg shadow-2xl border-4 border-gray-800 transform rotate-2 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
