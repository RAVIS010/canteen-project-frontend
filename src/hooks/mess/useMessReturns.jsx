import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export const useMessReturns = ({ globalProductionUnit, refreshDashboardData }) => {
    const [returnItems, setReturnItems] = useState([]);
    const [returnAcceptMsg, setReturnAcceptMsg] = useState('');
    const [showReturnSuccess, setShowReturnSuccess] = useState(false);

    const handleAcceptReturn = useCallback(async (id) => {
        const returnedItem = returnItems.find(item => item.id === id);

        try {
            await api.put(`/transfers/${id}/status`, { status: 'Accepted' });

            if (returnedItem) {
                setReturnAcceptMsg(`Return Accepted: ${returnedItem.qty} ${returnedItem.item}(s) from ${returnedItem.from}`);
                setShowReturnSuccess(true);
            }
            refreshDashboardData(globalProductionUnit);
            setTimeout(() => {
                setReturnAcceptMsg('');
                setShowReturnSuccess(false);
            }, 4000);
        } catch (err) {
            console.error('Error accepting return:', err);
            toast.error("Connection error. Could not accept return.");
        }
    }, [returnItems, globalProductionUnit, refreshDashboardData]);

    return {
        returnItems, setReturnItems,
        returnAcceptMsg, setReturnAcceptMsg,
        showReturnSuccess, setShowReturnSuccess,
        handleAcceptReturn
    };
};
