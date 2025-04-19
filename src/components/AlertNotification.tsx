import React from 'react';
import { observer } from 'mobx-react-lite';
import { Snackbar, Alert as MuiAlert, AlertProps } from '@mui/material';
import { 
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import RootStore from '../stores/RootStore';

// Custom Alert component based on MUI Alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertNotification: React.FC = observer(() => {
  const { alertStore } = RootStore;
  const { alert } = alertStore;
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    alertStore.hideAlert();
  };
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={alert.autoClose ? alert.duration : null}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={alert.type} 
        sx={{ width: '100%' }}
        iconMapping={{
          success: <SuccessIcon fontSize="inherit" />,
          error: <ErrorIcon fontSize="inherit" />,
          warning: <WarningIcon fontSize="inherit" />,
          info: <InfoIcon fontSize="inherit" />
        }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
});

export default AlertNotification;
