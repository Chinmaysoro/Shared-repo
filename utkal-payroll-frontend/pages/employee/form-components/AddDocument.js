import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DesignationService, UserDocumentsService ,UserService, UploadService,CompanywiseDocumentService } from '../../../redux/services/feathers/rest.app';
import { getUser } from '../../../redux/helpers/user';
import TokenService from '../../../redux/services/token.service';
import { userDocumentSchema } from '../../../redux/helpers/validations';
import getConfig from 'next/config';
const AddDocument = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [educationalDetails, setEducationalDetails] = useState([]);
    const [fileUploadValue, setFileUploadValues] = useState("");
    const [documentPreview, setDocumentPreview] = useState(null);
    const [extensionError, setExtensionError] = useState('');
    const [allDocumentTypeList, setallDocumentTypeList] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [documentValues, setDocumentValues] = useState({
        file: '',
        companywiseDocumentsId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentValues({ ...documentValues, [name]: value });
    };
    const handleDocumentUpload = (e) => {
        const file = e.target.files[0];
        const fileName = file.name.replace(/ /g, '_');
        const fileExtension = fileName.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'JPG' || fileExtension === 'jpeg' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'PNG') {
        if (file) {
            setDocumentPreview(URL.createObjectURL(file));
        }
    }else{
        setIsLoading(false);
        setExtensionError('Currently only jpg and png file are allowed.');
    }
    };

    const handleFileInput = (e, type) => {
        setExtensionError('');
        const file = e.target.files[0];
        const fileName = file.name.replace(/ /g, '_');
        const fileExtension = fileName.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'JPG' || fileExtension === 'jpeg' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'PNG') {
            let formData = new FormData();
            formData.append('uri', file);
            setIsLoading(true);
            UploadService.create(formData, {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
                    'content-type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    setFileUploadValues(res.originalName);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setExtensionError('Currently only jpg and png file are allowed.');
        }
    };
    const fetchAllDocumentTypes =  async (value) => {
        await CompanywiseDocumentService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallDocumentTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const addUpdateDocument = (values) => {
        if (userData?.user?.companyId) {
            if (props?.documentValues !== null) {
                const data = {
                    userId: props.empId,
                    companywiseDocumentsId: values?.companywiseDocumentsId,
                  };
                  if(values?.title){
                    data['title'] = values?.title
                  }
                  if (fileUploadValue !== '') {
                    data.file = fileUploadValue;
                  }
                setLoader(true);
                UserDocumentsService.patch(
                    values?._id,
                    {
                        ...data
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Document updated successfully.');
                        props?.setVisible();
                        props?.fetchAllDocuments();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = {
                    file: fileUploadValue,
                    companywiseDocumentsId: values?.companywiseDocumentsId,
                };
                if(values?.title){
                    data['title'] = values?.title
                }
                Object.assign(data, {companyId: userData?.user?.companyId});
                Object.assign(data, {userId: props.empId});
                setLoader(true);
                UserDocumentsService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Document created successfully.');
                        props?.setVisible();
                        props?.fetchAllDocuments();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.documentValues !== null) {
            setDocumentValues({ ...documentValues, ...props?.documentValues });
        }
        fetchAllDocumentTypes();
    }, []);

    return (
        <Formik
            enableReinitialize
            validationSchema={userDocumentSchema}
            initialValues={documentValues}
            onSubmit={addUpdateDocument}
        >
            {({ formik, errors, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="companywiseDocumentsId" className="form-label">
                                    Type of document
                                </label>
                                <Field as="select" name="companywiseDocumentsId" id="companywiseDocumentsId"  className="form-control">
                                        <option value="" label="Select document type" />
                                        {allDocumentTypeList.map((documentType, index) => (
                                            <option key={`key-${index}`} value={documentType._id}>
                                                {documentType.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="companywiseDocumentsId" component="div" className="error" />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="companywiseDocumentsId" className="form-label">
                                    Document title
                                </label>
                                <Field type="text" name="title" id="title" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="university" className="form-label">
                                    File
                                </label>
                                <input
                                    type="file"
                                    name="aadharFile"
                                    className="form-control"
                                    onChange={(event) => {
                                        handleDocumentUpload(event);
                                        handleFileInput(event);
                                    }}
                                />
                                 {/* <ErrorMessage name="file" component="div" className="error" /> */}
                                <span className='text-danger'>{extensionError}</span>
                                <div className="row">
                                 <div className="col-md-4">
                                 <div className="img-prev-box mt-3" style={{'height':'200px'}}>
                                {documentPreview ? (
                                    <img src={documentPreview} alt="Document Preview" className="preview-image" />
                                ) : documentValues?.file ? (
                                    <img src={`https://dd7tft2brxkdw.cloudfront.net/${documentValues?.file ? documentValues?.file : null}`} alt="user Preview" className="preview-image" />
                                ) : (
                                    <img src={`${contextPath}/layout/images/no-image.jpg`} className="w-100 mt-6"></img>
                                )}
                                </div>
                                </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-6">
                            <button className="btn btn-primary ml-0" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddDocument;
