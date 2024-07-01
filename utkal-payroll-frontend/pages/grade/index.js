import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddGrade from './AddGrade';
import { GradeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const GradeComponent = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [gradeValues, setGradeValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [gradeList, setGradeList] = useState([]);
    const [totalGrade, setTotalGrade] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [viewType, setViewType] = useState('list'); // Initial view type is 'list'
    const handleViewToggle = (e) => {
        setViewType(viewType === 'list' ? 'card' : 'list');
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setGradeValues(data);
    };

    const fetchAllGrade = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            GradeService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    setGradeList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalGrade(res.total);
                    setLoader(false);

                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteGrade = (values) => {
        setLoader(true);
        GradeService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Grade deleted successfully.');
                fetchAllGrade();
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
        fetchAllGrade();
    }, [offset]);
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Grade</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Grade</li>
                            </ul>
                        </div>

                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Grade', true, null)}>
                                <i className="pi pi-plus"></i> Add Grade
                            </button>
                            <div className="view-toggle">
                                <label>
                                    <button title="list view" onClick={handleViewToggle} className={viewType === 'list' ? 'btn btn-light filter-toggle-btn t-active' : 'btn btn-light filter-toggle-btn'}>
                                        <i className="pi pi-list"></i>
                                    </button>{' '}
                                </label>
                                <label>
                                    <button title="card view" onClick={handleViewToggle} className={viewType === 'card' ? 'btn btn-light filter-toggle-btn t-active' : 'btn btn-light filter-toggle-btn'}>
                                        <i className="pi pi-th-large"></i>
                                    </button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddGrade setVisible={() => setVisible(false)} gradeValues={gradeValues} fetchAllGrade={fetchAllGrade} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        {viewType === 'list' ? (
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Grade Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gradeList && gradeList?.length > 0 ? (
                                        gradeList?.map((grade, index) => (
                                            <tr key={`key-${index}`}>
                                                <td>{grade?.name}</td>
                                                <td>
                                                    <button className="btn btn-primary" type="button" onClick={() => openModal('Update Grade', true, grade)}>
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-warning" type="button" onClick={() => deleteGrade(grade)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="alert alert-success text-center" role="alert">
                                                    No grade found!!!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="row cardView mt-3">
                                {gradeList && gradeList?.length > 0 ? (
                                    gradeList?.map((grade, index) => (
                                        <div className="col-md-3 mb-3">
                                            <div className="card dash-widget pb-2 pt-3" key={`key-${index}`}>
                                                <div className="card-header">
                                                    <p>{grade?.name}</p>
                                                </div>
                                                <div className='mt-3'>
                                                    <button className="btn-outline-delete" onClick={() => deleteGrade(grade)}  > <i className="pi pi-trash" style={{ marginRight: "6px" }}></i>Delete</button>
                                                    <button className="btn-outline-edit" onClick={() => openModal('Update Grade', true, grade)}>  <i className="pi pi-pencil" style={{ marginRight: "4px" }}></i> Edit</button>

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="alert alert-success text-center" role="alert">
                                        No grade found!!!
                                    </div>
                                )}
                            </div>
                        )}

                        {totalGrade > 10 ? (
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

export default GradeComponent;

