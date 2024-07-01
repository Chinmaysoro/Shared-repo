import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getUser } from '../../redux/helpers/user';
import { addShiftRotationPolicies } from '../../redux/helpers/validations';
import TokenService from '../../redux/services/token.service';
import { CompanyShiftsService, ShiftPolicyService } from '../../redux/services/feathers/rest.app';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const ShiftRotationPolicy = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [formValues, setFormValues] = useState({
        policyName: '',
        rotationStartDay: '',
        rotationFrequency: ''
    });
    const [companyShiftList, setCompanyShiftList] = useState([]);
    const [availableShifts, setAvailableShifts] = useState([]);
    const [selectedShifts, setSelectedShifts] = useState([]);
    const [shiftRotationPattern, setShiftRotationPattern] = useState([]);
    const [propsData, setPropsData] = useState({});

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = [...selectedShifts];
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);

        setSelectedShifts(newItems);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        if (name === 'rotationFrequency') {
            const shifts = [...selectedShifts];
            const newShift = shifts?.map((item, index) => {
                return Array?.from({ length: value }, () => item);
            });
            const mergedArr =
                newShift?.length > 0 &&
                newShift?.reduce(function (prev, next, currentIndex, newShift) {
                    return prev.concat(next);
                });
            setShiftRotationPattern(mergedArr);
        }
    };

    const fetchCompanyShifts = () => {
        const queryData = {
            $sort: { createdAt: -1 },
            companyId: userData?.user?.companyId
        };
        CompanyShiftsService.find({
            query: queryData,
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            },
            query: {
                companyId: userData?.user?.companyId
            }
        })
            .then((res) => {
                setCompanyShiftList(res?.data);
                setAvailableShifts(res?.data);
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };

    const addSelectedShift = (data) => {
        setSelectedShifts([...selectedShifts, { ...data }]);
    };

    const removeSelectedShift = (data, index) => {
        setSelectedShifts([...selectedShifts?.slice(0, index), ...selectedShifts?.slice(index + 1)]);
    };

    const addUpdateShiftRotationPolicy = (values) => {
        const companyShiftIds = selectedShifts?.length > 0 && selectedShifts.map((data) => data._id);
        const requestData = {
            policyName: values?.policyName,
            rotationStartDay: values?.rotationStartDay,
            rotationFrequency: values?.rotationFrequency,
            companyShiftId: companyShiftIds
        };
        //console.log(values, '::::::::::form submit values', requestData);
        if (props?.formValues !== null) {
            setLoader(true);
            ShiftPolicyService.patch(
                propsData?._id,
                {
                    ...requestData
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Shift rotation rolicy updated successfully.');
                    props?.setVisible();
                    props?.fetchAllShiftRatationPolicy();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            if (selectedShifts?.length === 0) {
                toast.error('Please select shifts!');
            } else {
                const data = requestData;
                Object.assign(data, { companyId: userData?.user?.companyId });
                setLoader(true);
                ShiftPolicyService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Shift rotation rolicy created successfully.');
                        props?.setVisible();
                        props?.fetchAllShiftRatationPolicy();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        fetchCompanyShifts();
        if (props?.formValues !== null) {
            //console.log(props?.formValues, '::::::::props data');

            const data = {
                policyName: props?.formValues?.policyName,
                rotationStartDay: props?.formValues?.rotationStartDay,
                rotationFrequency: props?.formValues?.rotationFrequency
                //companyShiftId: companyShiftIds
            };
            console.log(data, '::::::::data');
            setFormValues({ ...formValues, ...data });
            setPropsData(props?.formValues);
            setSelectedShifts(props?.formValues?.companyShiftId?.length > 0 ? props?.formValues?.companyShiftId : []);
            const companyShiftIds = props?.formValues?.companyShiftId?.length > 0 && props?.formValues?.companyShiftId?.map((data) => data._id);

            const shifts = [...props?.formValues?.companyShiftId];
            const newShift = shifts?.map((item, index) => {
                return Array?.from({ length: props?.formValues?.rotationFrequency }, () => item);
            });
            const mergedArr =
                newShift?.length > 0 &&
                newShift?.reduce(function (prev, next, currentIndex, newShift) {
                    return prev.concat(next);
                });
            setShiftRotationPattern(mergedArr);
        }
    }, []);

    return (
        <div className="">
            <Formik enableReinitialize initialValues={formValues} validationSchema={addShiftRotationPolicies} onSubmit={addUpdateShiftRotationPolicy}>
                {({ errors, touched }) => (
                    <Form>
                        <div className="row">
                            <div className="col-md-3 text-right">
                                <label htmlFor="policyName" className="form-label">
                                    Policy Name*
                                </label>
                            </div>
                            <div className="col-md-5">
                                <Field type="text" className="form-control" name="policyName" id="policyName" />
                                {errors.policyName && touched.policyName ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.policyName}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-3 text-right">
                                <div className="form-group pt-3">
                                    <label className="form-label">Select Shift</label>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Available Shift</h5>
                                        <div className="shift-sel-section">
                                            <ul>
                                                {availableShifts && availableShifts?.length > 0 ? (
                                                    availableShifts?.map((data, index) => {
                                                        return (
                                                            <li className="gen-shift" key={index}>
                                                                {data?.name}
                                                                <i className="pi pi-plus" style={{ float: 'right', cursor: 'pointer' }} onClick={() => addSelectedShift(data)}></i>
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <li>No Shift Found</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Selected Shift</h5>
                                        <div className="shift-sel-section">
                                            <DragDropContext onDragEnd={handleDragEnd}>
                                                <Droppable droppableId="droppable">
                                                    {(provided) => (
                                                        <ul ref={provided.innerRef} {...provided.droppableProps}>
                                                            {selectedShifts.map((item, index) => (
                                                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                                                    {(provided) => (
                                                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`gen-shift trag-item`}>
                                                                            {item?.name}
                                                                            <i className="pi pi-minus" style={{ float: 'right', cursor: 'pointer' }} onClick={() => removeSelectedShift(item, index)}></i>
                                                                        </li>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </ul>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-3 text-right">
                                <label htmlFor="rotationStartDay" className="form-label">
                                    Rotation Shift Day*
                                </label>
                            </div>
                            <div className="col-md-4">
                                <Field name="rotationStartDay" id="rotationStartDay" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']?.map((data, index) => (
                                        <option key={data} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </Field>
                                {errors.rotationStartDay && touched.rotationStartDay ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.rotationStartDay}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-3 text-right">
                                <label htmlFor="rotationFrequency" className="form-label">
                                    Rotation Frequency*
                                </label>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Field type="number" className="form-control" name="rotationFrequency" id="rotationFrequency" onKeyUp={handleChange} />
                                    {errors.rotationFrequency && touched.rotationFrequency ? (
                                        <p className="text-danger text-monospace mt-2">
                                            <small>{errors.rotationFrequency}</small>
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-3 text-right">
                                <div className="form-group pt-3">
                                    <label className="form-label">Shift Rotation Pattern</label>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <ul className="shift-item">
                                    {shiftRotationPattern && shiftRotationPattern?.length > 0 ? (
                                        shiftRotationPattern?.map((data, index) => {
                                            return (
                                                <li key={index} className="gen-shift">
                                                    {data?.name ? data?.name?.substr(0, 3) : null}
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="ns-shift">WO</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="ns-shift">WO</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="ns-shift">WO</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="ns-shift">WO</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="gen-shift">GEN</li>

                                            {/* <li className="gs-shift">GS1</li>
                                            <li className="ms-shift">MS</li>
                                            <li className="gen-shift">GEN</li>
                                            <li className="ns-shift">NS</li>
                                            <li className="m-shift">M</li> */}
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div className="col-md-12">
                                <button className="btn btn-primary" type="submit">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ShiftRotationPolicy;
