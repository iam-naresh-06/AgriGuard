import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { CloudRain, Sun, Wind, Droplets, MapPin, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

const WeatherCard = ({ title, value, unit, icon: Icon, color, bg }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {value} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
            </h3>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
            <Icon className={color} size={24} />
        </div>
    </div>
);

const ForecastDay = ({ day, temp, condition }) => {
    let Icon = Sun;
    let color = "text-yellow-500";

    if (condition === 'Rain') {
        Icon = CloudRain;
        color = "text-blue-500";
    } else if (condition === 'Cloudy') {
        Icon = CloudRain; // Using CloudRain as generic Cloud for now, or import Cloud
        color = "text-gray-500";
    }

    return (
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{day}</p>
            <Icon className={`${color} mb-2`} size={24} />
            <p className="font-bold text-gray-900 dark:text-white">{temp}°</p>
        </div>
    );
};

const WeatherDashboard = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Mock API Call
        // In real app: fetch(`https://api.openweathermap.org/data/2.5/weather?q=Coimbatore&appid=YOUR_API_KEY&units=metric`)
        const mockData = {
            location: 'Coimbatore, TN',
            temp: 28,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            rainfall: 0,
            forecast: [
                { day: 'Mon', temp: 29, condition: 'Sun' },
                { day: 'Tue', temp: 27, condition: 'Cloudy' },
                { day: 'Wed', temp: 24, condition: 'Rain' },
                { day: 'Thu', temp: 26, condition: 'Sun' },
                { day: 'Fri', temp: 28, condition: 'Sun' },
            ]
        };
        setWeather(mockData);
    }, []);

    if (!weather) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weather Insights</h1>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <MapPin size={16} /> {weather.location} &bull; {format(new Date(), 'EEEE, d MMMM')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Updates</span>
                    </div>
                </div>

                {/* Main Weather Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                    <Sun size={48} className="text-yellow-300 animate-pulse" />
                                    <span className="text-6xl font-bold">{weather.temp}°</span>
                                </div>
                                <p className="text-xl font-medium opacity-90">{weather.condition}</p>
                                <p className="mt-4 text-sm opacity-75">Feels like {weather.temp + 2}° &bull; H: {weather.temp + 5}°  L: {weather.temp - 3}°</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full md:w-auto">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                                    <Droplets className="mx-auto mb-2 opacity-80" size={24} />
                                    <p className="text-sm opacity-70">Humidity</p>
                                    <p className="font-bold text-lg">{weather.humidity}%</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
                                    <Wind className="mx-auto mb-2 opacity-80" size={24} />
                                    <p className="text-sm opacity-70">Wind</p>
                                    <p className="font-bold text-lg">{weather.windSpeed} <span className="text-xs">km/h</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <WeatherCard
                            title="Precipitation"
                            value={weather.rainfall}
                            unit="mm"
                            icon={CloudRain}
                            color="text-blue-500"
                            bg="bg-blue-50 dark:bg-blue-900/20"
                        />
                        <WeatherCard
                            title="UV Index"
                            value="High"
                            unit="(7)"
                            icon={Sun}
                            color="text-orange-500"
                            bg="bg-orange-50 dark:bg-orange-900/20"
                        />
                    </div>
                </div>

                {/* 5-Day Forecast */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">5-Day Forecast</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {weather.forecast.map((day, idx) => (
                            <ForecastDay key={idx} {...day} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WeatherDashboard;
