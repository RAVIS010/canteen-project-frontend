export const formatLocation = (loc) => {
    if (!loc) return 'N/A';
    const str = String(loc);
    const normalized = str.toLowerCase().trim();
    const mapping = {
        'canteen 1': 'S Block',
        'four corner': 'Fourth Corner',
        'fourth corner': 'Fourth Corner',
        's-block': 'S Block',
        's black': 'S Block',
        'unit 3': 'Unit 3',
        'unit 3 fabeats': 'Unit 3 Fabeats',
        'central mess': 'Central Mess',
        'bakery': 'Bakery',
        'yummy tummy': 'Yummy Tummy',
        'rvs mess': 'Rvs Mess'
    };
    return mapping[normalized] || normalized.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
