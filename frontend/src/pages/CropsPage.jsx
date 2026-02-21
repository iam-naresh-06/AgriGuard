import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Plus, Sprout, MapPin, Calendar, Trash2, Edit2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const CropsPage = () => {
    const [crops, setCrops] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cropType: '',
        variety: '',
        plantingDate: '',
        areaSize: '',
        location: '',
        status: 'HEALTHY'
    });

    const fetchCrops = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/crops');
            setCrops(res.data);
        } catch (err) {
            console.error("Error fetching crops:", err);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                plantingDate: formData.plantingDate || new Date().toISOString().split('T')[0]
            };
            const res = await axios.post('http://localhost:8080/api/crops', payload);
            setCrops([...crops, res.data]);
            setShowAddModal(false);
            setFormData({ name: '', cropType: '', variety: '', plantingDate: '', areaSize: '', location: '', status: 'HEALTHY' });
        } catch (err) {
            console.error("Error saving crop:", err);
            alert("Failed to save crop.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this crop?')) {
            try {
                await axios.delete(`http://localhost:8080/api/crops/${id}`);
                setCrops(crops.filter(c => c.id !== id));
            } catch (err) {
                console.error("Error deleting crop:", err);
                alert("Failed to delete crop.");
            }
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crop Management</h1>
                        <p className="text-gray-500 dark:text-gray-400">Track and manage your farm's crops</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-secondary transition-colors"
                    >
                        <Plus size={20} />
                        Add New Crop
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((crop) => (
                        <div key={crop.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-agri-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-agri-light dark:bg-agri-dark/30 rounded-lg text-agri-secondary">
                                        <Sprout size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{crop.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{crop.cropType} &bull; {crop.variety}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${crop.status === 'HEALTHY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    crop.status === 'AT_RISK' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {crop.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span>Planted: {format(new Date(crop.plantingDate), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{crop.location}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(crop.id)}
                                    className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Crop Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Crop</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field Name / ID</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-primary/50 outline-none" placeholder="e.g. North Field" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Type</label>
                                        <input required name="cropType" value={formData.cropType} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" placeholder="e.g. Corn" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variety</label>
                                        <input name="variety" value={formData.variety} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" placeholder="Optional" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Planting Date</label>
                                        <input required type="date" name="plantingDate" value={formData.plantingDate} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                        <input name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" placeholder="e.g. Sector A" />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-secondary">Save Crop</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CropsPage;
