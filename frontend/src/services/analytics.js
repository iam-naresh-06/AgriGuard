export const getViolationsByDay = (violations) => {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const counts = violations.reduce((acc, v) => {
        const date = v.timestamp.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    return last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: counts[date] || 0
    }));
};

export const getViolationsByType = (violations) => {
    const counts = violations.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(counts).map(type => ({
        name: type.replace(/_/g, ' '),
        value: counts[type]
    }));
};

export const getViolationsByTime = (violations) => {
    const timeSlots = {
        'Morning (6-12)': 0,
        'Afternoon (12-18)': 0,
        'Evening (18-24)': 0,
        'Night (0-6)': 0
    };

    violations.forEach(v => {
        const hour = new Date(v.timestamp).getHours();
        if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)']++;
        else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)']++;
        else if (hour >= 18 && hour < 24) timeSlots['Evening (18-24)']++;
        else timeSlots['Night (0-6)']++;
    });

    return Object.keys(timeSlots).map(slot => ({
        name: slot,
        count: timeSlots[slot]
    }));
};
