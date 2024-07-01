import React, { useState, useEffect } from 'react';
import getConfig from 'next/config';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { documentSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../redux/helpers/user';
import { UserDocumentsService, CompanywiseDocumentService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';
import AddDocument from './AddDocument';
import SimpleModal from '../../components/Modal';
const DocumentForm = ({ onSubmit, handleFileInput, initialValues, empId }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [panPreview, setPanPreview] = useState(null);
    const [aadharPreview, setAadharPreview] = useState(null);
    const [voterPreview, setVoterPreview] = useState(null);
    const [documentValues, setdocumentValues] = useState({});
    const [drivingLicencePreview, setDrivingLicencePreview] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [otherPreview, setOtherPreview] = useState(null);
    const [documentList, setDocumentList] = useState([]);
    const [fileSizes, setFileSizes] = useState({});
    const [title, setTitle] = useState('');
    useEffect(() => {
        fetchAllDocuments();
    }, []);

    const openModal = (type, val, data) => {
        if (data != null) {
            const formattedDept = { ...data }; 
        
// Create a new object to avoid modifying the original object
            formattedDept.companywiseDocumentsId = formattedDept?.companywiseDocumentsId?._id;
            setVisible(val);
            setTitle(type);
            setdocumentValues(formattedDept);
        } else {
            setVisible(val);
            setTitle(type);
            setdocumentValues(data);
        }
    };

    const fetchAllDocuments = async () => {
        if (empId) {
            setLoader(true);
            UserDocumentsService.find({
                query: { companyId: userData?.user?.companyId, userId: empId,$populate: ['companywiseDocumentsId'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    // console.log(res?.data);
                    //const documentTypes = res?.data;
                    setDocumentList(res?.data);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const deleteDocument = async (education) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const response = await UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const educationalDetails = response?.data[0]?.educationalDetails || [];
            const updatedEducationalDetails = educationalDetails.filter((detail) => detail._id !== education?._id);
            UserService.patch(
                empId,
                {
                    educationalDetails: updatedEducationalDetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Education removed successfully.');
                    setVisible();
                    fetchAllEducation();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    const handledrivingLicenceUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDrivingLicencePreview(URL.createObjectURL(file));
        }
    };
    // const handleOtherUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setOtherPreview(URL.createObjectURL(file));
    //     }
    // };

    const fetchUserDetails = async () => {
        if (empId) {
            setLoader(true);
            UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setUserDetails(res?.data[0]);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'file' ? e.target.files[0] : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue
        }));
    };
    function getFileIcon(filename) {
        const extension = filename.split('.').pop();
        switch (extension) {
          case 'jpg':
            return <img src={`${contextPath}/layout/images/jpg-file.png`} alt="jpg" />;
            case 'jpeg':
            return <img src={`${contextPath}/layout/images/jpg-file.png`} alt="jpg" />;
          case 'png':
            return <img src={`${contextPath}/layout/images/png-file.png`} alt="png" />;
            case 'PNG':
            return <img src={`${contextPath}/layout/images/png-file.png`} alt="png" />;
          case 'pdf':
            return <img src={`${contextPath}/layout/images/pdf-file.png`} alt="pdf" />;
          default:
            return <img src={`${contextPath}/layout/images/default-file.png`} alt="default" />;
        }
      }
    //   useEffect(() => {
    //     // Function to fetch file size based on the document's file URL
    //     const getFileSize = async (fileURL) => {
    //       try {
    //         const response = await fetch(fileURL);
    //         console.log(response,'::::::::::::response')
    //         if (response.ok) {
    //           const fileSize = response.headers.get('content-length');
    //           return fileSize;
    //         }
    //         return 'Error fetching file size';
    //       } catch (error) {
    //         return 'Error fetching file size';
    //       }
    //     };
    
    //     // Fetch file sizes for all documents in documentList
    //     const fetchFileSizes = async () => {
    //       const sizes = {};
    //       for (const document of documentList) {
    //         if (document?.file) {
    //           const size = await getFileSize(`https://dd7tft2brxkdw.cloudfront.net/${document.file}`);
    //           sizes[document.file] = size;
    //         }
    //       }
    //       setFileSizes(sizes);
    //     };
    
    //     fetchFileSizes();
    //   }, [documentList]);
    return (
        <div>
            <div className="emp_header">
                <h5>Documents</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Document', true, null)}>
                        Add Document
                    </button>
                    <div></div>
                </div>
            </div>

            <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={<AddDocument setVisible={() => setVisible(false)} documentValues={documentValues} fetchAllDocuments={fetchAllDocuments} onSubmit={onSubmit} empId={empId} />}
            ></SimpleModal>

            <div className="education-detail mt-3">
                {documentList && documentList?.length > 0 ? (
                    documentList?.map((document, index) => (
                        <div className="education-card position-relative mb-2">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mb-0">{document?.companywiseDocumentsId?.name}</h5>
                                    <p><small className='text-secondary'>{document?.title}</small></p>
                                    <p className="d-flex">
                                    {getFileIcon(document?.file)}
                                    {/* <span className="ml-3">{fileSizes[document?.file]} bytes</span> */}
                                        <span className="ml-3">{document?.file} </span>
                                        <span></span>{' '}
                                        <div className="ml-3">
                                            {' '}
                                            <a href={`https://dd7tft2brxkdw.cloudfront.net/${document?.file ? document?.file : null}`} target="_blank" title="View file">
                                                <i class="pi pi-eye" style={{ fontSize: '18px' }}></i>
                                            </a>{' '}
                                            <a href={`https://dd7tft2brxkdw.cloudfront.net/${document?.file ? document?.file : null}`} target="_blank" download={document?.file ? document?.file : ''} className="ml-3" title="Download file">
                                                <i class="pi pi-download" style={{ fontSize: '16px' }}></i>
                                            </a>
                                        </div>
                                    </p>

                                    {/* <img src={`https://dd7tft2brxkdw.cloudfront.net/${document?.file ? document?.file  : null}`} alt="user Preview" className="preview-image" /> */}
                                    <div className="mt-3 education-action">
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Document', true, document)}>
                                            {' '}
                                            <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : loader ? (
                    <div className="alert alert-info text-center" role="alert">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                    </div>
                ) : (
                    <div className="alert alert-success text-center" role="alert">
                        No document found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentForm;
