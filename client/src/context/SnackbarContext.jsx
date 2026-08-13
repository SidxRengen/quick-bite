import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SnackbarContext = createContext(null);
const icons = { success: "✓", error: "!", info: "i" };

export function SnackbarProvider({ children }) {
  const [snackbars, setSnackbars] = useState([]);
  const timers = useRef(new Map());

  const dismissSnackbar = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setSnackbars((current) => current.filter((snackbar) => snackbar.id !== id));
  }, []);

  const showSnackbar = useCallback(
    (message, options = {}) => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random()}`;
      const snackbar = { id, message, variant: options.variant || "info" };

      setSnackbars((current) => [...current.slice(-2), snackbar]);
      const timer = setTimeout(
        () => dismissSnackbar(id),
        options.duration || 4200,
      );
      timers.current.set(id, timer);
    },
    [dismissSnackbar],
  );

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    [],
  );

  const value = useMemo(
    () => ({ showSnackbar, dismissSnackbar }),
    [dismissSnackbar, showSnackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <div className="snackbar-stack" aria-live="polite" aria-atomic="false">
        {snackbars.map((snackbar) => (
          <div
            className={`snackbar ${snackbar.variant}`}
            role={snackbar.variant === "error" ? "alert" : "status"}
            key={snackbar.id}
          >
            <span className="snackbar-icon" aria-hidden="true">
              {icons[snackbar.variant] || icons.info}
            </span>
            <span>{snackbar.message}</span>
            <button
              type="button"
              onClick={() => dismissSnackbar(snackbar.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  return context;
}
