import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { companySchema } from '../../redux/helpers/validations';
import { CompanyService } from '../../redux/services/feathers/rest.app';

const AddChildCompany = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [companyValues, setCompanyValues] = useState({
        name: '',
        email: '',
        website: '',
        phone: '',
        about: ''
    });
    const [locationArr, setLocationArr] = useState(['']);
    const [divisionArr, setDivisionArr] = useState(['']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyValues({ ...companyValues, [name]: value });
    };

    const addLocationInput = () => {
        setLocationArr((prev) => {
            return [...prev, ''];
        });
    };
    const removeLocationInput = (index) => {
        setLocationArr((prev) => {
            const mutatableTextBox = [...prev];
            mutatableTextBox.splice(index, 1);
            return mutatableTextBox;
        });
    };
    const handleLocationChange = (e) => {
        e.preventDefault();
        const index = e.target.id;
        setLocationArr((s) => {
            const newArr = s.slice();
            newArr[index] = e.target.value;
            return newArr;
        });
    };

    const addDivisionInput = () => {
        setDivisionArr((prev) => {
            return [...prev, ''];
        });
    };
    const removeDivisionInput = (index) => {
        setDivisionArr((prev) => {
            const mutatableTextBox = [...prev];
            mutatableTextBox.splice(index, 1);
            return mutatableTextBox;
        });
    };
    const handleDivisionChange = (e) => {
        e.preventDefault();
        const index = e.target.id;
        setDivisionArr((s) => {
            const newArr = s.slice();
            newArr[index] = e.target.value;
            return newArr;
        });
    };

    const addUpdateCompany = (values) => {
        const data = {
            name: values?.name,
            email: values?.email,
            website: values?.website,
            phone: values?.phone,
            about: values?.about,
            parentId: props?.parentCompanyId
        };
        if (locationArr?.length > 0) {
            data['location'] = locationArr;
        }
        if (divisionArr?.length > 0) {
            data['division'] = divisionArr;
        }
        if (props?.companyValues !== null) {
            setLoader(true);
            CompanyService.patch(
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
                    toast.success('Company updated successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                    props?.fetchChildCompanyList();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            setLoader(true);
            CompanyService.create(
                { ...data },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Company created successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                    props?.fetchChildCompanyList();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (props?.companyValues !== null) {
            setCompanyValues({ ...companyValues, ...props?.companyValues });
            if (props?.companyValues?.location?.length > 0) {
                setLocationArr(props?.companyValues?.location);
            }
            if (props?.companyValues?.division?.length > 0) {
                setDivisionArr(props?.companyValues?.division);
            }
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={companyValues} validationSchema={companySchema} onSubmit={addUpdateCompany}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Company name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="email" className="form-label">
                                    Company email*
                                </label>
                                <Field type="email" className="form-control pt-2" name="email" id="email" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.email}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="website" className="form-label">
                                    Company website*
                                </label>
                                <Field type="text" className="form-control pt-2" name="website" id="website" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.website}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="phone" className="form-label">
                                    Company phone*
                                </label>
                                <Field type="number" className="form-control pt-2" name="phone" id="phone" onKeyUp={handleChange} min={0} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.phone}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="about" className="form-label">
                                    About company
                                </label>
                                <Field type="text" className="form-control pt-2" name="about" id="about" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.about}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="about" className="form-label">
                                    Location
                                </label>
                                {locationArr.map((item, i) => {
                                    return (
                                        <div style={{ display: 'flex' }} key={`location${i}`}>
                                            <Field name="location" className="form-control pt-2" onChange={handleLocationChange} value={item} id={i} type="text" />
                                            {i === 0 ? (
                                                <button type="button" className="btn btn-primary" onClick={addLocationInput}>
                                                    <i className="pi pi-plus"></i>
                                                </button>
                                            ) : null}
                                            {i > 0 ? (
                                                <button type="button" className="btn btn-danger" onClick={() => removeLocationInput(i)}>
                                                    <i className="pi pi-minus"></i>
                                                </button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="about" className="form-label">
                                    Business Unit/ Division
                                </label>
                                {divisionArr.map((item, i) => {
                                    return (
                                        <div style={{ display: 'flex' }} key={`division${i}`}>
                                            <Field name="businessUnit" className="form-control pt-2" onChange={handleDivisionChange} value={item} id={i} type="text" />
                                            {i === 0 ? (
                                                <button type="button" className="btn btn-info" onClick={addDivisionInput}>
                                                    <i className="pi pi-plus"></i>
                                                </button>
                                            ) : null}
                                            {i > 0 ? (
                                                <button type="button" className="btn btn-danger" onClick={() => removeDivisionInput(i)}>
                                                    <i className="pi pi-minus"></i>
                                                </button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddChildCompany;
