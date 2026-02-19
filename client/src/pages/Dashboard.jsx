import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Image, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/rooms/${id}`);
        setRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-medium">
        Loading Projects...
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">My Design Projects</h1>
        <Link
          to="/design-studio"
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
        >
          <Plus size={22} /> New Project
        </Link>
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Image className="text-purple-600" size={36} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            No rooms uploaded yet
          </h3>
          <p className="mt-3 text-gray-500 mb-8">
            Start your journey by redesigning your first room.
          </p>
          <Link
            to="/design-studio"
            className="text-purple-600 font-medium hover:text-purple-800"
          >
            Go to Design Studio &rarr;
          </Link>
        </div>
      ) : (
        /* Grid of Rooms */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 border border-gray-200 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`http://localhost:5000/${room.imagePath}`}
                  alt="Room"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6">
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="bg-red-500/90 p-3 rounded-full text-white hover:bg-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {room.roomType || 'Untitled Room'}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded on {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;