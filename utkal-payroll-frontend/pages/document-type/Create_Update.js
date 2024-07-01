import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { documentTypeSchema } from '../../redux/helpers/validations';
import { CompanywiseDocumentService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddDepartmentComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [documentTypeValues, setDocumentTypeValues] = useState({
        name: '',
        mandatory:false
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentTypeValues({ ...documentTypeValues, [name]: value });
    };

    const addUpdateDocument = (values) => {
        if (userData?.user?.companyId) {
            if (props?.documentTypeValues !== null) {
                const data = {
                    name: values?.name,
                    mandatory: values?.mandatory ? values?.mandatory : false,
                };
                setLoader(true);
                CompanywiseDocumentService.patch(
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
                        toast.success('Document type updated successfully.');
                        props?.setVisible();
                        props?.fetchAllDocumentType();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                CompanywiseDocumentService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Document type created successfully.');
                        props?.setVisible();
                        props?.fetchAllDocumentType();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.documentTypeValues !== null) {
            setDocumentTypeValues({ ...documentTypeValues, ...props?.documentTypeValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={documentTypeValues} validationSchema={documentTypeSchema} onSubmit={addUpdateDocument}>
            {({ errors, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Document Name
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                      
                            <div className="col-md-4">
                                <label htmlFor="mandatory" className="form-label w-100">
                                Is mandatory
                                    <Field type="checkbox"  name="mandatory" id="mandatory" className="ml-3 mt-2" />
                                </label>
                            </div>
                            <div className="col-md-8"></div>
                        <div>
                            <button className="btn btn-primary ml-3" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddDepartmentComponent;
