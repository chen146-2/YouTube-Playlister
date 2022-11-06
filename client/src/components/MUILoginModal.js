import { useContext } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    boxShadow: 24,
};

export default function MUILoginModal() {
    const { auth } = useContext(AuthContext);

    function handleClose(event) {
        auth.hideModals();
    }
    let errorMsg="";
    if (auth.error && auth.isLoginModalOpen()) {
        errorMsg = auth.error.response.data.errorMessage;
    }
    return(
        <Modal
            open={true}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <header className="modal-north">
                        {errorMsg}
                    </header>
                    <Alert 
                        severity='error'
                        sx={{
                            fontSize: 28
                        }}
                    >
                        <AlertTitle sx={{fontSize:34}}>Error</AlertTitle>
                        <strong>{errorMsg}</strong>
                    </Alert>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handleClose}
                        >Close</button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}