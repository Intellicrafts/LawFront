/**
 * @deprecated Use the global ToastContext instead.
 * This file re-exports the main Toast component for backward compatibility.
 * 
 * Components should use:
 *   import { useToast } from '../../context/ToastContext';
 *   const { showSuccess, showError } = useToast();
 */
export { default } from '../Toast';