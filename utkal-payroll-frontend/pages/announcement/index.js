import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddAnnouncement from './AddAnnouncement';
import { toast } from 'react-toastify';
import { AnnouncementService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const CompanyScreen = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [announcementValues, setAnnouncementValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [announcementList, setAnnouncementList] = useState([]);
    const [totalAnnouncement, setTotalAnnouncement] = useState(0);

    // const openModal = (type, val, data) => {
    //     setVisible(val);
    //     setTitle(type);
    //     setAnnouncementValues(data);
    // };
    const openModal = (type,val, data) => {
        if (data != null) {
            const formattedDept = { ...data }; // Create a new object to avoid modifying the original object
            const date = new Date(formattedDept.announcementDate);
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const yyyy = date.getFullYear();
            const newFormattedDate = `${yyyy}-${mm}-${dd}`;
            formattedDept.announcementDate = newFormattedDate;
            setVisible(val);
            setTitle(type);
            setAnnouncementValues(formattedDept);
        } else {
            setVisible(val);
            setTitle(type);
            setAnnouncementValues(data);
        }

    };
    const dateFormat = (date1) =>{
        const date = new Date(date1);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        const newFormattedDate = `${dd}-${mm}-${yyyy}`;
        return newFormattedDate;
    }
    const fetchAllAnnouncement = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            AnnouncementService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setAnnouncementList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalAnnouncement(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteAnnouncement = (values) => {
        setLoader(true);
        AnnouncementService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Announcement deleted successfully.');
                fetchAllAnnouncement();
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
        fetchAllAnnouncement();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Announcements</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item active">Announcement</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Announcement', true, null)}>
                                <i className="pi pi-plus"></i> Add Announcement
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddAnnouncement setVisible={() => setVisible(false)} announcementValues={announcementValues} fetchAllAnnouncement={fetchAllAnnouncement} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Date</th>
                                    <th scope="col">Announcement Note</th>
                                 
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcementList && announcementList?.length > 0 ? (
                                    announcementList?.map((announcement, index) => (
                                        <tr key={`key-${index}`}>
                                                <td>{dateFormat(announcement?.announcementDate)}</td>
                                            <td>{announcement?.note}</td>
                                        
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Announcement', true, announcement)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteAnnouncement(announcement)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No announcement found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalAnnouncement > 10 ? (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyScreen;
