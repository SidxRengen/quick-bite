import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useSnackbar } from '../context/SnackbarContext.jsx';

export function useMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showSnackbar } = useSnackbar();

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await api.menu());
    } catch (requestError) {
      setError(requestError.message);
      showSnackbar(requestError.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => { loadMenu(); }, [loadMenu]);

  return { items, loading, error, reload: loadMenu };
}
