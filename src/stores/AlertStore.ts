import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface Alert {
  message: string;
  type: AlertType;
  open: boolean;
  duration?: number;
  autoClose: boolean; // Whether alert should auto-close
}

class AlertStore {
  alert: Alert = {
    message: '',
    type: AlertType.INFO,
    open: false,
    duration: 6000, // default duration in ms
    autoClose: false // default to not auto-close
  };

  constructor() {
    makeAutoObservable(this);
  }

  showAlert(message: string, type: AlertType, options: { duration?: number, autoClose?: boolean } = {}) {
    // Set default values based on alert type
    let autoClose = type === AlertType.SUCCESS;
    let duration = autoClose ? 7000 : 6000;

    // Override defaults with provided options if any
    if (options.autoClose !== undefined) autoClose = options.autoClose;
    if (options.duration !== undefined) duration = options.duration;

    this.alert = {
      message,
      type,
      open: true,
      duration,
      autoClose
    };
  }

  hideAlert() {
    this.alert = {
      ...this.alert,
      open: false
    };
  }

  // Convenience methods for different alert types
  showSuccess(message: string, options?: { duration?: number, autoClose?: boolean }) {
    this.showAlert(message, AlertType.SUCCESS, {
      duration: 7000,
      autoClose: true,
      ...options
    });
  }

  showError(message: string, options?: { duration?: number, autoClose?: boolean }) {
    this.showAlert(message, AlertType.ERROR, {
      autoClose: false,
      ...options
    });
  }

  showInfo(message: string, options?: { duration?: number, autoClose?: boolean }) {
    this.showAlert(message, AlertType.INFO, {
      autoClose: false,
      ...options
    });
  }

  showWarning(message: string, options?: { duration?: number, autoClose?: boolean }) {
    this.showAlert(message, AlertType.WARNING, {
      autoClose: false,
      ...options
    });
  }
}

const alertStoreContext = createContext(new AlertStore());
export const useAlertStore = () => {
  return useContext(alertStoreContext);
};
