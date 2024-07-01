import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TokenService from '../../redux/services/token.service';
import { gradeSchema } from '../../redux/helpers/validations';
import { GradeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AssignManualShift = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [shiftValues, setShiftValues] = useState({
        name: ''
    });
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);

    const handleSelectAllChange = (event) => {
      const isChecked = event.target.checked;
      setSelectAllChecked(isChecked);
      setSelectedDays(isChecked ? staticDays.map(day => day.id) : []);
    };

    const handleDayCheckboxChange = (event, id) => {
      const isChecked = event.target.checked;
      let updatedSelectedDays = [...selectedDays];
      if (isChecked) {
        updatedSelectedDays.push(id);
      } else {
        updatedSelectedDays = updatedSelectedDays.filter(dayId => dayId !== id);
      }
      setSelectedDays(updatedSelectedDays);
      setSelectAllChecked(updatedSelectedDays.length === staticDays.length);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShiftValues({ ...shiftValues, [name]: value });
    };

    const staticDays = [
        { id: 1, name: '01/2/2024 (Friday)' },
        { id: 2, name: '02/2/2024 (Monday)' },
        { id: 3, name: '03/2/2024 (Saturday)' },
        { id: 3, name: '04/2/2024 (Thrusday)' },
        { id: 3, name: '05/2/2024 (Wedensday)' },
        { id: 3, name: '06/2/2024 (Tuesday)' },
        { id: 3, name: '07/2/2024 (Monday)' }
    ];

    useEffect(() => {

    }, []);

    return (
        <Formik enableReinitialize initialValues={shiftValues} validationSchema={gradeSchema} onSubmit={null}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="row">
                            <div className="col-md-6 mt-2">
                                <label className="form-label w-100">
                                    From <span className='text-danger'>*</span>
                                    <Field type="date" name="from_date" className="form-control" />
                                    {/* <ErrorMessage name="dob" component="div" className="error" /> */}
                                </label>
                            </div>
                            <div className="col-md-6 mt-2">
                                <label className="form-label w-100">
                                    To <span className='text-danger'>*</span>
                                    <Field type="date" name="to_date" className="form-control" />
                                    {/* <ErrorMessage name="dob" component="div" className="error" /> */}
                                </label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <label className='w-100 ml-2 mt-2 mb-4'>
                                    <input
                                        style={{ marginRight: '10px' }}
                                        type="checkbox"
                                        checked={selectAllChecked}
                                        onChange={handleSelectAllChange}
                                    />
                                    Select all
                                </label>
                                <table className="table table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Action</th>
                                            <th scope="col">Day</th>
                                            <th scope="col">Shift</th>
                                            <th scope="col">Weekly off</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staticDays.map(day => (
                                            <tr key={day.id}>
                                                <td style={{ padding: '10px', border: 'none' }} className='text-center'>
                                                    <label className='w-100'>
                                                        <input
                                                            style={{ marginRight: '10px' }}
                                                            type="checkbox"
                                                            checked={selectedDays.includes(day.id)}
                                                            onChange={(e) => handleDayCheckboxChange(e, day.id)}
                                                        />
                                                    </label>
                                                </td>
                                                <td style={{ padding: '10px', border: 'none' }}>
                                                    {day.name}
                                                </td>
                                                <td style={{ padding: '10px', border: 'none' }}>
                                                    <select className='form-control c-select' style={{ height: '27px' }}>
                                                        <option>HH (09:30 - 16:20)</option>
                                                        <option>HH (07:00 - 18:00)</option>
                                                        <option>HH (05:10 - 14:30)</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '10px', border: 'none' }}>
                                                    <select className='form-control c-select' style={{ height: '27px' }}>
                                                        <option>Yes</option>
                                                        <option>No</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default AssignManualShift;
