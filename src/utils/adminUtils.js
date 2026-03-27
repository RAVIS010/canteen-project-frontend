/**
 * Utility to map role IDs to pretty names
 */
export const getRoleDisplay = (role) => {
    if (!role) return 'USER';
    const r = role.toLowerCase();
    if (r === 'admin') return 'SYSTEM ADMIN';
    if (r === 'sub-admin') return 'SUB ADMIN';
    if (r === 'canteen-manager') return 'CANTEEN MANAGER';
    if (r === 'user' || r === 'canteen') return 'CANTEEN STAFF';
    if (r === 'mess') return 'MESS STAFF';
    if (r.startsWith('cps-staff-')) {
        const unit = r.replace('cps-staff-', '').replace(/-/g, ' ').toUpperCase();
        return `CPS STAFF - ${unit}`;
    }
    if (r.startsWith('cps-manager-')) {
        const unit = r.replace('cps-manager-', '').replace(/-/g, ' ').toUpperCase();
        return `CPS MANAGER - ${unit}`;
    }
    return role.toUpperCase();
};

/**
 * Utility to format location names
 */
export const formatLocation = (loc) => {
    if (!loc) return 'N/A';
    const normalized = loc.toLowerCase().trim();
    const mapping = {
        'canteen 1': 'S Block',
        'four corner': 'Fourth Corner',
        'fourth corner': 'Fourth Corner',
        's-block': 'S Block',
        's black': 'S Block',
        'unit 3': 'Unit 3',
        'unit-3': 'Unit 3',
        'unit 3 fabeats': 'Unit 3 Fabeats',
        'unit-3 fabeats': 'Unit 3 Fabeats',
        'unit 1 yummy tummy': 'Unit-1 Yummy Tummy',
        'unit-1 yummy tummy': 'Unit-1 Yummy Tummy',
        'yummy tummy': 'Unit-1 Yummy Tummy',
        'central mess': 'Central Mess',
        'bakery': 'Bakery'
    };
    return mapping[normalized] || loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
