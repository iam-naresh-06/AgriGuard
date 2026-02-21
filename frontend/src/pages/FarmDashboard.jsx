import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Sprout, AlertTriangle, CheckCircle, Activity, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={color} size={24} />
            </div>
        </div>
    </div>
);

const FarmDashboard = () => {
    const [recentAlerts, setRecentAlerts] = useState([]);

    useEffect(() => {
        const fetchDetections = async () => {
            try {
                // Fetch real data from backend
                const res = await axios.get('http://localhost:8080/api/diseases');
                // Sort by timestamp desc and take latest 5
                const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
                setRecentAlerts(sorted);
            } catch (err) {
                console.error("Error fetching alerts:", err);
                // Fallback to mock if backend is down, or just show empty
            }
        };

        fetchDetections();

        // Optional: Poll every 10 seconds for updates
        const interval = setInterval(fetchDetections, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farm Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Real-time crop health monitoring</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Active Alerts"
                        value="3"
                        icon={AlertTriangle}
                        color="text-red-600"
                        bg="bg-red-50 dark:bg-red-900/20"
                    />
                    <StatCard
                        title="Healthy Crops"
                        value="92%"
                        icon={CheckCircle}
                        color="text-agri-primary"
                        bg="bg-agri-light dark:bg-agri-dark/20"
                    />
                    <StatCard
                        title="Crops Monitored"
                        value="1,240"
                        icon={Sprout}
                        color="text-agri-secondary"
                        bg="bg-green-50 dark:bg-green-900/20"
                    />
                    <StatCard
                        title="Sensors Active"
                        value="12"
                        icon={Activity}
                        color="text-blue-600"
                        bg="bg-blue-50 dark:bg-blue-900/20"
                    />
                </div>

                {/* Recent Alerts Table */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Detections</h2>
                        <Link to="/scan" className="flex items-center gap-2 px-4 py-2 bg-agri-primary hover:bg-agri-secondary text-white rounded-lg transition-colors">
                            <Camera size={18} />
                            Scan New
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crop</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Condition</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recentAlerts.map((alert) => (
                                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-agri-light dark:bg-agri-dark/30 rounded-lg text-agri-secondary">
                                                    <Sprout size={20} />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{alert.cropName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alert.diseaseName === 'Healthy'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {alert.diseaseName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {(alert.confidenceScore * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {format(new Date(alert.timestamp), 'MMM d, HH:mm')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{alert.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FarmDashboard;
