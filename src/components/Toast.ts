import { useToast } from '../context/ToastContext';

export const useSuccessToast = () => {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'success');
};

export const useErrorToast = () => {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'error');
};

export const useWarningToast = () => {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'warning');
};

export const useInfoToast = () => {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'info');
}; 