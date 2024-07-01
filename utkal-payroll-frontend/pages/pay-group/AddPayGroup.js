import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { addPaygroupSchema } from '../../redux/helpers/validations';
import { PayGroupService, SalaryComponentService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import getConfig from 'next/config';

const AddPaygroupModal = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalSalaryComponent, setTotalSalaryComponent] = useState(0);
    const [componentValues, setComponentValues] = useState({});
    const [salaryComponentOrder, setSalaryComponentOrder] = useState([]);
    const [selectedSalaryComponent, setSelectedSalaryComponent] = useState([]);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = [...salaryComponentOrder];
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);

        setSalaryComponentOrder(newItems);
    };

    const handleSelectedComponent = (e, data) => {
        setSelectedSalaryComponent((prev) => [...prev, { component: data?._id }]);
    };

    const fetchSalaryComponents = () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            SalaryComponentService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setSalaryComponentList(res.data);
                    setSalaryComponentOrder(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalSalaryComponent(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const addUpdateComponent = (values) => {
        const data = {
            name: values?.name,
            description: values?.description,
            components: selectedSalaryComponent
        };
        if (userData?.user?.companyId) {
            if (props?.componentValues !== null) {
                setLoader(true);
                PayGroupService.patch(
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
                        toast.success('Paygroup updated successfully.');
                        props?.setVisible();
                        props?.fetchAll();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                if (selectedSalaryComponent.length > 0) {
                    const payGroupdata = data;
                    Object.assign(payGroupdata, { companyId: userData?.user?.companyId });
                    setLoader(true);
                    PayGroupService.create(
                        { ...payGroupdata },
                        {
                            headers: {
                                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                            }
                        }
                    )
                        .then((res) => {
                            setLoader(false);
                            toast.success('Paygroup created successfully.');
                            props?.setVisible();
                            props?.fetchAll();
                        })
                        .catch((error) => {
                            setLoader(false);
                            toast.error(error.message);
                        });
                } else {
                    toast.error('Please select at least one component');
                }
            }
        }
    };

    useEffect(() => {
        fetchSalaryComponents();
        if (props?.componentValues !== null) {
            setComponentValues({ ...componentValues, ...props?.componentValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={componentValues} validationSchema={addPaygroupSchema} onSubmit={addUpdateComponent}>
            {({ errors, touched }) => (
                <Form>
                    <div>
                        <div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Pay-Group Name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="description" className="form-label">
                                    Description*
                                </label>
                                <Field type="text" className="form-control pt-2" name="description" id="description" />
                                {errors.description && touched.description ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.description}</small>
                                    </p>
                                ) : null}
                            </div>
                            {componentValues?.components?.length && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="description" className="form-label">
                                        Selected Components
                                    </label>
                                    <table className="table table-bordered">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Sl No.</th>
                                                <th scope="col">Component Order</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {componentValues?.components?.length > 0 &&
                                                componentValues?.components?.map((data, index) => {
                                                    return (
                                                        <tr>
                                                            <th scope="col">{index + 1}</th>
                                                            <td scope="col">{data?.component?.name}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="mb-2 mt-4 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Select component to be added* (Drag to change order)
                                </label>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {salaryComponentOrder.map((data, index) => (
                                                    <Draggable key={data._id} draggableId={data._id} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="trag-item">
                                                                <input type="checkbox" className="mr-2 d-checkbox" onChange={(e) => handleSelectedComponent(e, data)} />
                                                                <span>{data.name}</span>
                                                                <img src={`${contextPath}/layout/images/drag_indicator.svg`} alt="search-icon" className="float-right" />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </div>
                        <div className="mt-4">
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

export default AddPaygroupModal;
