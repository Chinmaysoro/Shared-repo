import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { payGroupComponentSchema } from '../../redux/helpers/validations';
import { SalaryComponentService, PayGroupService } from '../../redux/services/feathers/rest.app';
import { componentSchema } from '../../redux/helpers/validations';
import { getUser } from '../../redux/helpers/user';

const FormulaComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const [paygroupDetail, setPayGroupDetail] = useState([]);
    const [totalPayGroup, setTotalPayGroup] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState({});
    const [selectedComponentType, setSelectedComponentType] = useState('formula');
    const [componentListArr, setComponentListArr] = useState([]);
    const [formulaNameState, setFormulaNameState] = useState('');
    const [formulaIdState, setFormulaIdState] = useState('');
    const [payGroupServiceId, setpayGroupServiceId] = useState('');

    const fetchPayGroupDetails = (payGroupId) => {
        if (userData?.user?.companyId) {
            PayGroupService.find({
                query: {
                    _id: payGroupId,
                    companyId: userData?.user?.companyId,
                    $populate: [
                        {
                            path: 'components',
                            model: 'salaryComponent', // The name of the Mongoose model for pastExperience
                            populate: {
                                path: 'component',
                                model: 'salaryComponent' // The name of the Mongoose model for designation
                            }
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setPayGroupDetail(res?.data);
                    setTotalPayGroup(res?.total);
                })
                .catch((error) => {
                    toast.error(error, toastSettings);
                });
        }
    };

    const handleSelectedFormula = (e, data) => {
        setFormulaNameState('');
        setFormulaIdState('');
        setSelectedComponent(data);
        const selectedIndex = paygroupDetail[0]?.components.findIndex((x) => x?.component?._id === data?.component?._id);
        if (selectedIndex !== -1) {
            const selectedComp = [];
            paygroupDetail[0]?.components?.map((item, index) => {
                if (selectedIndex > index) {
                    selectedComp.push(item?.component);
                }
            });
            setComponentListArr(selectedComp);
        }
        if (data?.type === 'formula') {
            replaceIdsWithNames(data?.formula, data?.type);
        }
        if (data?.type === 'fixed') {
            replaceIdsWithNames(data?.value, data?.type);
        }
    };

    const replaceIdsWithNames = (data, type) => {
        if (type === 'formula') {
            return paygroupDetail[0]?.components.reduce((updatedFormula, component) => {
                const idRegex = new RegExp(`\\b${component.component._id}\\b`, 'g');
                setFormulaNameState(updatedFormula.replace(idRegex, component.component.name));
                setSelectedComponentType(type);
                return updatedFormula.replace(idRegex, component.component.name);
            }, data);
        }
        if (type === 'fixed') {
            setFormulaNameState(data);
            setSelectedComponentType(type);
            return data;
        }
    };

    const handleChageFormula = (id, name) => {
        setFormulaNameState(formulaNameState + name);
        setFormulaIdState(formulaIdState + (id !== '' ? id : name));
    };

    const handleDeleteFormula = () => {
        setFormulaNameState('');
        setFormulaIdState('');
    };
    const handleBackFormula = () => {
        if(formulaNameState == ''|| formulaIdState == ''){
            return;
        };
        setFormulaNameState(formulaNameState.toString().slice(0, -1));
        setFormulaIdState(formulaIdState.toString().slice(0, -1));
    };

    const handleSelectedComponentType = (data) => {
        setSelectedComponentType(data);
        setFormulaNameState('');
        setFormulaIdState('');
    };

    const submitPaycomponentForm = () => {
        if (paygroupDetail[0]?.components?.length === 0) {
            toast.error('Please update order of component!');
        } else if (formulaNameState === '') {
            toast.error('Please enter formula!');
        } else {
            const components = [];
            paygroupDetail[0]?.components?.map((item, index) => {
                if (item?.component?._id === selectedComponent?.component?._id) {
                    if (selectedComponentType === 'formula') {
                        components.push({
                            component: item?.component?._id,
                            formula: formulaIdState,
                            type: selectedComponentType
                        });
                    }
                    if (selectedComponentType === 'fixed') {
                        components.push({
                            component: item?.component?._id,
                            value: parseInt(formulaNameState),
                            type: selectedComponentType
                        });
                    }
                } else {
                    if (item?.type === 'formula') {
                        components.push({
                            component: item?.component?._id,
                            formula: item?.formula,
                            type: item?.type
                        });
                    }
                    if (item?.type === 'fixed') {
                        components.push({
                            component: item?.component?._id,
                            value: item?.value,
                            type: item?.type
                        });
                    } else {
                        components.push({
                            component: item?.component?._id
                        });
                    }
                }
            });

            const uniqueArray = components.reduce((acc, item) => {
                if (!acc.some((el) => el.component === item.component)) {
                    acc.push(item);
                }
                return acc;
            }, []);

            const formData = {
                components: uniqueArray
            };
            setIsLoading(true);
            PayGroupService.patch(
                payGroupServiceId,
                {
                    ...formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setIsLoading(false);
                    toast.success('Pay component updated successfully.');
                    setFormulaNameState('');
                    setFormulaIdState('');
                    fetchPayGroupDetails(payGroupServiceId);
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error.message);
                });
        }
    };

    const fetchData = () => {
        fetchPayGroupDetails(props?.parentPayGroupId);
        setpayGroupServiceId(props?.parentPayGroupId);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="frmula-type d-flex">
                        <button type="button" class="btn">
                            Define : <b>{selectedComponent?.component?.name}</b>
                        </button>
                        <button type="button" class="btn">
                            Component Type : <b>{selectedComponentType}</b>
                        </button>
                        <button type="button" class="btn btn-warning" onClick={() => handleSelectedComponentType('formula')}>
                            Formula
                        </button>
                        <button type="button" class="btn btn-primary" onClick={() => handleSelectedComponentType('fixed')}>
                            Fixed value
                        </button>
                    </div>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <div className="formula-card component-sec mh-582">
                        {paygroupDetail && paygroupDetail?.length > 0 && paygroupDetail[0]?.components?.length > 0
                            ? paygroupDetail[0]?.components?.map((data) => {
                                  return (
                                      <div className="col-md-6" key={data?.component?._id}>
                                          <input name="basic" type="radio" className="form-check-input" onChange={(e) => handleSelectedFormula(e, data)} value={data} />
                                          &nbsp;{data?.component?.name}
                                      </div>
                                  );
                              })
                            : 'No component found'}
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="formula-card">
                        <h4 className="formula-title pb-2">
                            <b>Components</b>
                        </h4>
                        {componentListArr && componentListArr?.length > 0
                            ? componentListArr?.map((data) => {
                                  return (
                                      <button className="btn" key={data?._id} onClick={() => handleChageFormula(data?._id, data?.name)}>
                                          {data?.name}
                                      </button>
                                  );
                              })
                            : null}
                    </div>
                    <div className="formula-card">
                        <h4 className="formula-title pb-2">
                            {' '}
                            <b>Payroll Tag</b>
                        </h4>
                        <button className="btn" onClick={() => handleChageFormula('', 'CTC')}>
                            CTC
                        </button>
                        {/* <button className="btn" onClick={() => handleChageFormula('', 'Basic')}>
                            Basic
                        </button> */}
                    </div>
                    <textarea className="form-control" rows={4} placeholder="Formula" defaultValue={formulaNameState} readOnly />
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="formula-card formula-card-calculator">
                        <h4 className="formula-title pb-2 pl-2">Calculator</h4>
                        <ul className="cal-sec">
                            <li onClick={() => handleChageFormula('', '7')}>7</li>
                            <li onClick={() => handleChageFormula('', '8')}>8</li>
                            <li onClick={() => handleChageFormula('', '9')}>9</li>
                            <li className="b-none" onClick={() => handleChageFormula('', '<')}>
                                {'<'}
                            </li>
                            <li onClick={() => handleChageFormula('', '4')}>4</li>
                            <li onClick={() => handleChageFormula('', '5')}>5</li>
                            <li onClick={() => handleChageFormula('', '6')}>6</li>
                            <li className="b-none" onClick={() => handleChageFormula('', '>')}>
                                {'>'}
                            </li>
                            <li onClick={() => handleChageFormula('', '1')}>1</li>
                            <li onClick={() => handleChageFormula('', '2')}>2</li>
                            <li onClick={() => handleChageFormula('', '3')}>3</li>
                            <li className="b-none" onClick={() => handleChageFormula('', '/')}>
                                {'/'}
                            </li>
                            <li onClick={() => handleChageFormula('', '0')}>0</li>
                            <li onClick={() => handleChageFormula('', '.')} className="b-none">
                                .
                            </li>
                            <li onClick={() => handleChageFormula('', '+')} className="b-none">
                                +
                            </li>
                            {/* <li onClick={()=> handleChageFormula("", "/")} className="b-none">'</li> */}
                            <li onClick={() => handleChageFormula('', '-')} className="b-none">
                                -
                            </li>
                            <li onClick={() => handleChageFormula('', '*')} className="b-none">
                                X
                            </li>
                            {/* <li onClick={()=> handleChageFormula("", "0")} className="b-none">0</li> */}
                            {/* <li onClick={()=> handleChageFormula("", "=")} className="b-none">=</li> */}
                            <li onClick={() => handleChageFormula('', '(')} className="b-none">
                                {'('}
                            </li>
                            <li onClick={() => handleChageFormula('', ')')} className="b-none">
                                {')'}
                            </li>
                            <li className="b-none" onClick={() => handleDeleteFormula()}>
                                CLS
                            </li>
                            <li className="b-none" onClick={() => handleBackFormula()}>
                                DEL
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-primary" onClick={submitPaycomponentForm}>
                        Save
                    </button>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-md-12">
                    <div className="formula-card"></div>
                </div>
            </div> */}
        </div>
    );
};

export default FormulaComponent;
