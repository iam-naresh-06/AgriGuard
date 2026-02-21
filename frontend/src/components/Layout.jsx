import { LayoutDashboard, CloudRain, Camera, Settings, Menu, Sun, Moon, Sprout } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={clsx(
            "flex items-center px-4 py-3 rounded-lg transition-all duration-300 overflow-hidden whitespace-nowrap",
            // Mobile (Default): Left aligned, no hover effect needed for alignment
            // Desktop (md): Centered (collapsed), Left aligned on hover (expanded)
            "justify-start md:justify-center md:group-hover:justify-start",
            active
                ? "bg-agri-primary text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        )}
    >
        <div className="min-w-[24px] flex justify-center">
            <Icon size={24} />
        </div>
        <span className="font-medium transition-all duration-300 origin-left ml-3 w-auto opacity-100 md:ml-0 md:w-0 md:opacity-0 md:group-hover:ml-3 md:group-hover:w-auto md:group-hover:opacity-100">
            {label}
        </span>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [location]);


    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-200">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
                    "transform transition-transform duration-300 ease-in-out",
                    // Mobile: Full width or standard width? Standard usually better.
                    "w-64",
                    // Desktop: Collapsed to 20, expand on hover
                    "md:w-20 md:hover:w-64 group peer",
                    // Transform logic
                    !isSidebarOpen && "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex items-center h-16 border-b border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 justify-start px-6 md:justify-center md:px-0 md:group-hover:justify-start md:group-hover:px-6">
                    <div className="min-w-[32px] flex justify-center text-agri-primary">
                        <Sprout size={32} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-agri-primary to-agri-secondary bg-clip-text text-transparent whitespace-nowrap transition-all duration-300 origin-left ml-3 w-auto opacity-100 md:ml-0 md:w-0 md:opacity-0 md:group-hover:ml-3 md:group-hover:w-auto md:group-hover:opacity-100">
                        AgriGuard
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={Sprout}
                        label="My Crops"
                        path="/crops"
                        active={location.pathname === '/crops'}
                    />
                    <SidebarItem
                        icon={Camera}
                        label="Scan Crop"
                        path="/scan"
                        active={location.pathname === '/scan'}
                    />
                    <SidebarItem
                        icon={CloudRain}
                        label="Weather"
                        path="/weather"
                        active={location.pathname === '/weather'}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        active={location.pathname === '/settings'}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            {/* Use 'peer-hover' to detect sidebar state */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-20 md:peer-hover:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-200">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Menu size={24} />
                    </button>


                    <div className="flex items-center space-x-4 ml-auto">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200">
                            <span className="text-sm font-bold">A</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
