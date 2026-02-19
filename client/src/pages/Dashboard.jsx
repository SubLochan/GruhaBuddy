import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Sparkles, Image as ImageIcon, Loader, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [roomType, setRoomType] = useState('living room');
    const [style, setStyle] = useState('modern');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const API_URL = 'http://localhost:5000';

    useEffect(() => {
        if (user.id) {
            fetchRooms();
        }
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/design/user/${user.id}`);
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', user.id);
        formData.append('roomType', roomType);
        formData.append('style', style);

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/design/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert('Upload Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (roomId) => {
        setGenerating(roomId);
        try {
            await axios.post(`${API_URL}/api/design/generate`, { roomId });
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert('Generation Failed');
        } finally {
            setGenerating(null);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/\\/g, '/');
        return `${API_URL}/${cleanPath}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">My Design Gallery</h2>
                        <p className="text-gray-500 mt-1">Manage your room scans and generated designs.</p>
                    </div>
                    <button onClick={fetchRooms} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                {/* Upload Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" /> Start New Design
                    </h3>
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Left Column: Inputs */}
                        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                <div className="relative">
                                    <select
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-gray-50 transition-all"
                                    >
                                        <option value="living room">Living Room</option>
                                        <option value="bedroom">Bedroom</option>
                                        <option value="kitchen">Kitchen</option>
                                        <option value="office">Office</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Aesthetic Style</label>
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-gray-50 transition-all"
                                >
                                    <option value="modern">Modern</option>
                                    <option value="minimalist">Minimalist</option>
                                    <option value="bohemian">Bohemian</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="traditional">Traditional</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Room Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input onChange={handleFileChange} type="file" className="sr-only" accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        {file && <p className="text-sm font-semibold text-green-600 mt-2">Selected: {file.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Action */}
                        <div className="md:col-span-4 flex items-end">
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-all transform hover:-translate-y-1 ${loading || !file
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader className="animate-spin h-5 w-5" /> Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Sparkles className="h-5 w-5" /> Generate Magic
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={room._id}
                            className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow rounded-2xl border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-64 w-full">
                                {!room.generatedDesign ? (
                                    <img src={getImageUrl(room.originalImage)} alt="Original" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="relative h-full w-full group">
                                        <img src={getImageUrl(room.generatedDesign)} alt="Generated" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <a href={getImageUrl(room.generatedDesign)} download target="_blank" className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors">
                                                <Download className="w-5 h-5" />
                                            </a>
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-medium">
                                            AI Generated
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 capitalize">{room.roomType}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{room.stylePreference} Style</p>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                        {new Date(room.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50">
                                    {!room.generatedDesign ? (
                                        <button
                                            onClick={() => handleGenerate(room._id)}
                                            disabled={generating === room._id}
                                            className="w-full flex items-center justify-center px-4 py-2.5 border border-primary-200 text-sm font-medium rounded-xl text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors shadow-sm"
                                        >
                                            {generating === room._id ? <Loader className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4 text-primary-600" />}
                                            Generate Design
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">
                                            <Sparkles className="mr-2 h-4 w-4" /> Design Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No designs created yet</h3>
                            <p className="text-gray-500 mt-1">Upload a photo to get started with your first design.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
