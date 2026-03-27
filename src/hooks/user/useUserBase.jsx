import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export const useUserBase = ({ externalTab, adminCanteen, adminCanteens, adminProductionUnits }) => {
    const navigate = useNavigate();
    const [activeTabInternal, setActiveTabInternal] = useState('billing');
    const activeTab = externalTab || activeTabInternal;

    const setActiveTab = useCallback((tab) => {
        if (!externalTab) setActiveTabInternal(tab);
    }, [externalTab]);

    const userName = localStorage.getItem('name') || 'Sumit';
    const userCanteen = adminCanteen || localStorage.getItem('canteenName') || 'Canteen 1';

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const normalizeCanteen = useCallback((name) => {
        if (!name) return '';
        let n = name.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
        const aliasMap = {
            'four corner': 'fourth corner',
            'fourth corner': 'fourth corner',
            's block': 's block',
            'canteen 1': 's block',
            'unit 1': 's block',
            'unit 3': 'unit 3',
            'unit 3 fabeats': 'unit 3 fabeats',
            'unit 3fabeats': 'unit 3 fabeats',
            'unit 1 yummy tummy': 'yummy tummy',
            'yummy tummy': 'yummy tummy',
            'central mess': 'central mess',
            'bakery': 'bakery',
            'rvs canteen': 'rvs canteen',
        };
        n = n.replace(/^unit\s*-?\s*\d+\s+(yummy tummy.*)$/, '$1');
        n = n.replace(/^unit\s*-?\s*(\d+)\s+fabeats$/, 'unit $1 fabeats');
        return aliasMap[n] || n;
    }, []);

    const assignedCanteens = useMemo(() => {
        const results = new Set();
        if (adminCanteen) results.add(normalizeCanteen(adminCanteen));
        
        try {
            const saved = localStorage.getItem('assignedCanteens');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) parsed.forEach(c => results.add(normalizeCanteen(c)));
            }
        } catch (e) { }

        if (userCanteen) {
            results.add(normalizeCanteen(userCanteen));
            if (userCanteen.includes(' & ')) {
                userCanteen.split(' & ').forEach(c => results.add(normalizeCanteen(c.trim())));
            }
        }
        return [...results];
    }, [adminCanteen, userCanteen, normalizeCanteen]);

    const locations = useMemo(() => {
        if (adminCanteens && adminCanteens.length > 0) return adminCanteens;
        try {
            const saved = localStorage.getItem('cms_canteens') || localStorage.getItem('adminCanteens');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) { }
        return ['S Block', 'Fourth Corner', 'Unit 3', 'Unit 3 Fabeats'];
    }, [adminCanteens]);

    const productionUnits = useMemo(() => {
        if (adminProductionUnits && adminProductionUnits.length > 0) return adminProductionUnits.map(u => u.name || u);
        try {
            const saved = localStorage.getItem('cms_production_units') || localStorage.getItem('adminProductionUnits');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(u => u.name || u);
            }
        } catch (e) { }
        return ['S Block', 'Fourth Corner', 'Unit 3', 'Unit 3 Fabeats'];
    }, [adminProductionUnits]);

    const handleLogout = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await api.post('/logout', { sessionId });
            } catch (e) {
                console.error('Logout error:', e);
            }
        }

        const keysToRemove = [
            'token', 'role', 'name', 'sessionId', 'canteenName', 'assignedCanteens', 'lastSelectedUnit'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        navigate('/login');
    };

    return {
        activeTab, setActiveTab,
        userName, userCanteen,
        assignedCanteens, locations, productionUnits,
        normalizeCanteen, handleLogout,
        showNotifications, setShowNotifications,
        notificationRef
    };
};
