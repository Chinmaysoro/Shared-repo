import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import SimpleModal from '../components/Modal';
import AddPayGroup from './AddPayGroup';
import { toast } from 'react-toastify';
import { PayGroupService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const AddPayGroupComponent = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [componentList, setComponentList] = useState([]);
    const [totalComponent, setTotalComponent] = useState(0);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(dept);
    };

    const fetchAll = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            PayGroupService.find({
                query: {
                    companyId: userData?.user?.companyId,
                    $skip: offset,
                    $limit: perPage,
                    $sort: { createdAt: -1 },
                    $populate: [
                        {
                            path: 'components', // The keyName want to populate
                            model: 'salaryComponent', // The Mongoose model name
                            populate: {
                                path: 'component', // The keyName want to populate
                                model: 'salaryComponent' // The Mongoose model name
                            }
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setComponentList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalComponent(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteComponent = (values) => {
        setLoader(true);
        PayGroupService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Component deleted successfully.');
                fetchAll();
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
        fetchAll();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Pay Group</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Pay Group</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Pay-Group', true, null)}>
                                <i className="pi pi-plus"></i> Add Pay-Group
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddPayGroup setVisible={() => setVisible(false)} componentValues={componentValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Pay Group Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentList && componentList?.length > 0 ? (
                                    componentList?.map((component, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">
                                                <Link href={`/pay-group/[payGroupId]`} as={`/pay-group/${component?._id}`}>
                                                    {component?.name || 'N?A'}
                                                </Link>
                                            </th>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Component', true, component)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteComponent(component)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No Pay-Group found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalComponent > 10 ? (
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

export default AddPayGroupComponent;
