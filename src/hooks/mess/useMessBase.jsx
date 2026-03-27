import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

export const useMessBase = ({ adminProductionUnits, adminCanteens }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentDate, setCurrentDate] = useState('');

    const userName = localStorage.getItem('name') || 'Sumit';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const dateObj = new Date();
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        setCurrentDate(dateObj.toLocaleDateString(undefined, options));
    }, []);

    const [productionUnitsList, setProductionUnitsList] = useState(() => {
        if (adminProductionUnits && adminProductionUnits.length > 0) return adminProductionUnits.map(u => u.name);
        try {
            const saved = localStorage.getItem('cms_production_units') || localStorage.getItem('adminProductionUnits');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(u => u.name || u);
            }
        } catch (e) { }
        return [];
    });

    const [canteensList, setCanteensList] = useState(() => {
        if (adminCanteens && adminCanteens.length > 0) return adminCanteens;
        try {
            const saved = localStorage.getItem('cms_canteens') || localStorage.getItem('adminCanteens');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) { }
        return [];
    });

    const [globalProductionUnit, setGlobalProductionUnit] = useState(() => {
        if (location.state?.selectedUnit) {
            localStorage.setItem('lastSelectedUnit', location.state.selectedUnit);
            return location.state.selectedUnit;
        }
        const savedUnit = localStorage.getItem('lastSelectedUnit');
        if (savedUnit) return savedUnit;
        return productionUnitsList[0] || 'CENTRAL MESS';
    });

    useEffect(() => {
        if (globalProductionUnit) {
            localStorage.setItem('lastSelectedUnit', globalProductionUnit);
        }
    }, [globalProductionUnit]);

    const formatLocation = useCallback((loc) => {
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
    }, []);

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
            'token',
            'role',
            'name',
            'sessionId',
            'canteenName',
            'assignedCanteens',
            'lastSelectedUnit'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        navigate('/login');
    };

    const [masterCategories, setMasterCategories] = useState([]);
    const [masterProducts, setMasterProducts] = useState([]);

    const fetchAdminProductData = useCallback(async () => {
        try {
            const [catData, prodData] = await Promise.all([
                api.get('/categories'),
                api.get('/products')
            ]);
            if (Array.isArray(catData)) setMasterCategories(catData);
            if (Array.isArray(prodData)) setMasterProducts(prodData);
        } catch (err) {
            console.error('Failed to fetch admin product data:', err);
        }
    }, []);

    return {
        currentTime, currentDate,
        userName,
        productionUnitsList, setProductionUnitsList,
        canteensList, setCanteensList,
        globalProductionUnit, setGlobalProductionUnit,
        formatLocation,
        handleLogout,
        masterCategories, setMasterCategories,
        masterProducts, setMasterProducts,
        fetchAdminProductData
    };
};
