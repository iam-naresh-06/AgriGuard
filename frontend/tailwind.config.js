/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                agri: {
                    primary: '#10B981', // Emerald 500
                    secondary: '#059669', // Emerald 600
                    dark: '#064E3B', // Emerald 900
                    light: '#D1FAE5', // Emerald 100
                    warning: '#F59E0B', // Amber 500
                    danger: '#EF4444', // Red 500
                    water: '#3B82F6', // Blue 500
                }
            }
        },
    },
    plugins: [],
}
