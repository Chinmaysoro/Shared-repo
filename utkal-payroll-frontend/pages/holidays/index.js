import React, { useState, useEffect, createRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import SimpleModal from '../components/Modal';
import AddHolidays from './AddHolidays';
import { HolidayListService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const HolidayList = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [holidayValues, setHolidayValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [holidayList, setHolidayList] = useState([]);
    const [totalHoliday, setTotalHoliday] = useState(0);
    const calendar = React.createRef();
    const [events, setEvents] = useState([
        {
            title: 'Sample Event',
            start: new Date(2023, 8, 12, 10, 0), // January 1, 2023, 10:00 AM
            end: new Date(2023, 8, 12, 12, 0) // January 1, 2023, 12:00 PM
        }
    ]);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setHolidayValues(data);
    };

    const fetchAllHolidays = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            HolidayListService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    const holidayList = [];
                    if (res?.data?.length > 0) {
                        res?.data?.map((item) => {
                            holidayList.push({ title: item?.note, start: new Date(item?.attendanceDate), end: new Date(item?.attendanceDate), _id: item?._id, companyId: item?.companyId });
                        });
                    }
                    setHolidayList(res.data);
                    setEvents(holidayList);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalHoliday(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteHoliday = (values) => {
        setLoader(true);
        DesignationService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Holiday deleted successfully.');
                fetchAllHolidays();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAllHolidays();
    }, [offset]);

    const localizer = momentLocalizer(moment);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Holiday</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Holiday</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Designation', true, null)}>
                                <i className="pi pi-plus"></i> Add Holiday
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddHolidays setVisible={() => setVisible(false)} holidayValues={holidayValues} fetchAllHolidays={fetchAllHolidays} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    {/* <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Occasion</th>
                                    <th>Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidayList && holidayList?.length > 0 ? (
                                    holidayList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <td scope="row">{data?.note}</td>
                                            <td>{data?.attendanceDate ? moment(data?.attendanceDate).format('DD-MM-YYYY') : 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Holiday', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteHoliday(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No Occasion found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalHoliday > 10 ? (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : null}
                    </div> */}
                    <div className="col-md-12 col-sm-12">
                        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: 500 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayList;
