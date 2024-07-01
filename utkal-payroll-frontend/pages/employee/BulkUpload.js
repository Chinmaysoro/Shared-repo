import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { userActions } from '../../redux/actions/user.actions';
import { userService } from '../../redux/services/user.service';
import TokenService from '../../redux/services/token.service';
import { toast } from 'react-toastify';

    let fileName;
    let fileExtension;
    let fileOriginalName;

const BulkUpload = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [bulkUploadFile, setBulkUploadFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const instructions = [
        'Upload csv file only.',
        'Use only DD-MM-YYYY format for date.',
        'Remove spaces in email and use 10 digits for mobile number.',
        'Keep Company name, Department and Designation consistent with the initial input.'
    ];

    const handleFileInput = async (e) => {
        const file = e.target.files[0];

        // if(!file){
        //     toast('WARNING: Please upload a file', {
        //         position:"top-center",
        //         hideProgressBar: false,
        //         autoClose: 3000,
        //         type: 'warning',
        //         theme:"dark"
        //     });
        //     return;
        // }

        fileName = file?.name.replace(/ /g, '_');
        fileExtension = fileName.split('.').pop();
        fileOriginalName = fileName.slice(0, fileName.indexOf('.'));
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
        } else{
        let formData = new FormData();
            formData.append('file', e.target.files[0]);
            console.log("The dataaa:-",formData);
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
            // return;
        };
        // if (fileExtension != 'csv') {
        //     toast('WARNING: Please import csv file only',
        //     {
        //         position:"top-center",
        //         hideProgressBar: false,
        //         autoClose: 3000,
        //         type: 'warning',
        //         theme:"dark"
        //     });
        //     return;
        // }
        setLoader(true);
        const uploadResult = axios({
            method: 'post',
            url: `http://localhost:3030/v1/bulk-registration`,
            // url: `${process.env.baseURL}/v1/bulk-registration`,
            data: bulkUploadFile,
            headers: {
            Authorization: 'Bearer ' + TokenService.getLocalAccessToken(),
            'content-type': 'multipart/form-data'
        }
        })
        .then((response) => {
            // console.log("response:-", response);
            //handle success
            setLoader(false);
            toast.success(`Voila!!! ${response.data.message}`);
            props.setVisible();
            props.fetchAllEmployee();
            // console.log(response);
        })
        .catch((error) => {
            //handle error
            setLoader(false);
            if(error.response.data.message=="Multipart: Boundary not found"){
            toast(`Error!!! Invalid/No file uploaded`,
            {
                position:"top-right",
                hideProgressBar: false,
                autoClose: 3000,
                type: 'error',
                theme:"dark"
            });
            return;
        }
        if(error.response.data.message=="Cannot read property '_id' of null"){
            toast(`Empty file / Duplicate data present in file`,
            {
                position:"top-center",
                hideProgressBar: false,
                autoClose: 3000,
                type: 'error',
                theme:"dark"
            });
            return;
        }
        toast(error.response.data.message,
            {
                position:"bottom-center",
                hideProgressBar: false,
                autoClose: 5000,
                type: 'error',
                theme:"dark"
            });
            // console.log(error);
            // return;`
        });
    };

    // console.log("XYZ:",bulkUploadFile);

    return (
        <React.Fragment>
            <h5 className="text-info">Instructions for bulk data upload:-</h5>
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
                <a href={`${process.env.baseURL}/v1/download-sample-csv`} download className='text-success'>
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

export default BulkUpload;
