import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { userActions } from '../../redux/actions/user.actions';
import { AttendanceBulkUploadService } from '../../redux/services/user.service';
import TokenService from '../../redux/services/token.service';
import { toast } from 'react-toastify';

const AttendanceBulkUpload = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [bulkUploadFile, setBulkUploadFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const instructions = ['Use DD-MM-YYYY date format.'];

    const handleFileInput = async (e) => {
        const file = e.target.files[0];
        const fileName = file?.name.replace(/ /g, '_');
        const fileExtension = fileName.split('.').pop();
        const fileOriginalName = fileName.slice(0, fileName.indexOf('.'));
        if (fileExtension != 'csv') {
            toast('WARNING: Please import csv file only',
            {
                position:"top-center",
                hideProgressBar: false,
                autoClose: 3000,
                type: 'warning',
                theme:"dark"
            });
            return;
        } else {
            let formData = new FormData();
            formData.append('file', file);
            setBulkUploadFile(formData);
        }
    };

    const submitBulkUpload = async () => {
        if(!bulkUploadFile){
            toast.warning("WARNING: Upload a file with proper format",
            {
                position:"top-right",
                hideProgressBar: false,
                autoClose: 3000,
                type: 'warning',
                theme:"dark"
            }
            );
            // console.log(bulkUploadFile);
            return;
        };
        setLoader(true);
        const uploadResult = await axios({
            method: 'post',
            url: `http://localhost:3030/v1/bulk-upload-attendance`,
            // url: `${process.env.baseURL}/v1/bulk-upload-attendance`,
            data: bulkUploadFile,
            headers: {
                Authorization: 'Bearer ' + TokenService.getLocalAccessToken(),
                'content-type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log("response:-", response);
                //handle success
                setLoader(false);
                toast.success(`Voila!!! ${response.data.message}`);
                // toast.success('Employee added successfully.');
                props.setVisible();
                props.fetchAllAttendance('');
            })
            .catch((error) => {
                //handle error
                setLoader(false);

                if(error.response.data.message){
                    console.log(error.response.data.message);
                }
                toast(error.response.data.message,
                    {
                        position:"bottom-center",
                        hideProgressBar: false,
                        autoClose: 5000,
                        type: 'error',
                        theme:"dark"
                    });
                    return;
                // console.log(error);
            });
    };

    return (
        <React.Fragment>
            <h5 className="text-info">Instructions for bulk upload:-</h5>
            <ul className="list-design">
                {instructions.map((data, i) => {
                    return (
                        <li key={i}>
                            <span className="text-danger">{data}</span>
                        </li>
                    );
                })}
            </ul>
            <div className="form-group">
                <label htmlFor="resumeLinkUpload">Upload File*</label> &nbsp;&nbsp;&nbsp;
                <a href={`${process.env.baseURL}/v1/download-attendance-csv`} download className='text-success'>
                    Download sample CSV
                </a>
                <input type="file" className="form-control " name="resumeLinkUpload" onChange={handleFileInput} />
            </div>
            <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={() => submitBulkUpload()}>
                    Submit {loader ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i> : null}
                </button>
            </div>
        </React.Fragment>
    );
};

export default AttendanceBulkUpload;
