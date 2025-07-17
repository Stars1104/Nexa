import { useCallback } fromreact';
import { toast } fromsonner';

export const useSafeToast = () => {
    const safeToast = useCallback((type: success' | error' |warning' | 'info, message: string, delay: number =100        setTimeout(() => {
            switch (type)[object Object]              case 'success':
                    toast.success(message);
                    break;
                case 'error':
                    toast.error(message);
                    break;
                case 'warning':
                    toast.warning(message);
                    break;
                case 'info':
                    toast.info(message);
                    break;
                default:
                    toast(message);
            }
        }, delay);
    }, []);

    return [object Object]        success: (message: string, delay?: number) => safeToast(success', message, delay),
        error: (message: string, delay?: number) => safeToast('error', message, delay),
        warning: (message: string, delay?: number) => safeToast(warning', message, delay),
        info: (message: string, delay?: number) => safeToast('info', message, delay),
    };
}; 