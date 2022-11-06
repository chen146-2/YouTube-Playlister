import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    boxShadow: 24,
};

export default function MUILoginModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleClose(event) {
        auth.hideModals();
    }
    let errorMsg="";
    if (auth.error) {
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
                    <div className='modal-center'>
                        <div className='modal-center-content'>
                            {errorMsg}
                        </div>
                    </div>
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