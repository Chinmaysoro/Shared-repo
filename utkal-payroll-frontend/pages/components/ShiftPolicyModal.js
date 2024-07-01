import React, { useContext, useState } from 'react';
import { Dialog } from 'primereact/dialog';

const SimpleModal = (props) => {
    return (
        <Dialog header={props.title} visible={props?.visible} onHide={props.setVisible} style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            {props?.body}
        </Dialog>
    );
};

export default SimpleModal;
