
import { useState } from 'react';
import api from '../utils/api';
import { Upload, Cpu, Save, Loader } from 'lucide-react';

const DesignStudio = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [roomType, setRoomType] = useState('Living Room');
    const [style, setStyle] = useState('Modern');
    const [budget, setBudget] = useState('10000');
    const [loading, setLoading] = useState(false);
    const [generatedDesign, setGeneratedDesign] = useState(null);
    const [roomId, setRoomId] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async () => {
        if (!file) return alert('Please select an image first');
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('roomType', roomType);
        formData.append('dimensions', JSON.stringify({ width: 0, height: 0 })); // Mock dimensions for now

        try {
            const res = await api.post('/rooms', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRoomId(res.data._id);
            alert('Room uploaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!roomId) return alert('Please upload a room first');
        setLoading(true);
        try {
            const res = await api.post('/designs/generate', {
                roomId,
                style,
                budget,
                prompt: `${style} style ${roomType} design with budget ${budget}`
            });
            setGeneratedDesign(res.data);
        } catch (err) {
            console.error(err);
            alert('Design generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Design Studio</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizer Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px] flex items-center justify-center bg-grid-slate-50 relative">
                        {preview ? (
                            <img
                                src={generatedDesign ? generatedDesign.generatedImagePath : preview}
                                alt="Room Preview"
                                className="w-full h-full object-contain max-h-[600px]"
                            />
                        ) : (
                            <div className="text-center p-10">
                                <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="text-purple-600" size={40} />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900">Upload your room photo</h3>
                                <p className="text-gray-500 mt-2">Supports JPG, PNG (Max 5MB)</p>
                                <label className="mt-6 inline-block">
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    <span className="cursor-pointer bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                                        Select Image
                                    </span>
                                </label>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <Loader className="animate-spin text-purple-600 mb-4" size={48} />
                                <p className="text-lg font-medium text-purple-600 animate-pulse">AI is working its magic...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Cpu className="text-purple-600" /> Design Configuration
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option>Living Room</option>
                                <option>Bedroom</option>
                                <option>Kitchen</option>
                                <option>Bathroom</option>
                                <option>Office</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option>Modern</option>
                                <option>Contemporary</option>
                                <option>Minimalist</option>
                                <option>Industrial</option>
                                <option>Scandinavian</option>
                                <option>Bohemian</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit (USD)</label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            {!roomId ? (
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    <Save size={18} /> Upload Room
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2"
                                >
                                    <Cpu size={18} /> Generate Design
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignStudio;
