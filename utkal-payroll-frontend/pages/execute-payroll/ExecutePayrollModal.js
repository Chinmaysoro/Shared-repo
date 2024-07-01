import React from 'react';

const ExecutePayroll = (props) => {
    return (
        <div>
            <p style={{ textAlign: 'center' }} className="text-danger">
                <i className="pi pi-info-circle" style={{ fontSize: '5em' }}></i>
            </p>
            <p style={{fontSize:"20px"}}>
                Please ensure all employee attendance records are finalized and accurate before proceeding with payroll processing. Any discrepancies or missing data in attendance may affect the payroll calculations. Verify all attendance records to
                ensure accurate and error-free payroll processing.
            </p>
        </div>
    );
};

export default ExecutePayroll;
