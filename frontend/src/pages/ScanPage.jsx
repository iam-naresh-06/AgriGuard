import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Upload, Camera, Check, X, Loader } from 'lucide-react';
import axios from 'axios';

const ScanPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Replace with your actual backend URL
            const response = await axios.post('http://localhost:8080/api/diseases/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Upload success:", response.data);

            // Wait for WebSocket update or poll? 
            // For now, we just show "Processing..." and maybe the initial pending state.
            // In a real app, we'd listen to the WS subscription for this specific ID.

            setTimeout(() => {
                setResult({
                    status: 'CONFIRMED',
                    diseaseName: 'Analyzing...', // The WS would update this
                    cropName: 'Processing...',
                    confidence: 0.0
                });
            }, 1000);

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scan Crop</h1>
                    <p className="text-gray-500 dark:text-gray-400">Upload a leaf image to detect diseases</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                    {preview ? (
                        <div className="space-y-4">
                            <img src={preview} alt="Preview" className="mx-auto w-full max-h-64 object-contain rounded-lg" />

                            {result ? (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg animate-fade-in">
                                    <h3 className="text-lg font-semibold text-agri-dark dark:text-white">Analysis Started</h3>
                                    <p className="text-agri-secondary">Check Dashboard for results shortly.</p>
                                </div>
                            ) : (
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => { setSelectedFile(null); setPreview(null); }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-agri-primary text-white rounded-lg hover:bg-agri-secondary disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {uploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                                        Analyze
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 hover:border-agri-primary transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-agri-light dark:bg-agri-dark/30 rounded-full text-agri-primary">
                                    <Camera size={32} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ScanPage;
