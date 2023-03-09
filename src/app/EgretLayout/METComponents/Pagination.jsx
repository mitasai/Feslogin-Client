import React, { Component } from "react";
import PropTypes from 'prop-types';

const propTypes = {
    items: PropTypes.array,
    onChangePage: PropTypes.func,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalElements: PropTypes.number.isRequired
}

const defaultProps = {
    initialPage: 1,
}

class Pagination extends Component {

    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.totalElements > 0) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.totalElements !== prevProps.totalElements) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var { items, pageSize, totalElements } = this.props;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(totalElements, page, pageSize);

        // update state
        this.setState({ pager: pager });
    }
    setPageClick(page) {
        var { items, pageSize, totalElements } = this.props;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(totalElements, page, pageSize);

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pager.currentPage);
    }
    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 5;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;
        if (!pager.pages || pager.pages.length <= 1) {
            // display when pager null
            return(
                <div className="text-center mb-5 z-10">
                    {/*------ Vể lại page đầu tiên ---------*/}
                    <button 
                        className={"btn btn-dark btn-move btn-lg mb-4 disabled"}
                    >
                        {'<<'}
                    {/* <img class="img-fluid" src="/assets/manage-type/left2.png" alt=""/> */}
                    </button>
                    {/*------ Lùi lại 1 page ---------*/}
                    <button 
                        className={"btn btn-dark btn-move btn-lg mb-4 disabled"}
                    >
                        {'<'}
                        {/* <img className="img-fluid" src="/assets/manage-type/left.png" alt="" /> */}
                    </button>
                    {/*------ Hiển thị các page ---------*/}
                    <button
                        className='btn btn-dark btn-move btn-lg mb-4 active'
                    >   
                        1
                    </button> 
                    {/*------ Tiến lên 1 page ---------*/}
                    <button 
                        className={"btn btn-dark btn-move btn-lg mb-4 disabled"}
                    >
                        {'>'}
                        {/* <img class="img-fluid" src="/assets/manage-type/right.png" alt="" /> */}
                    </button>
                    {/*------ Hiển thị page cuối ---------*/}
                    <button 
                        className={"btn btn-dark btn-move btn-lg mb-4 disabled"}
                    >
                        {'>>'}
                        {/* <img class="img-fluid" src="/assets/manage-type/right2.png" alt="" /> */}
                    </button>
                </div>
            )
        }

        return (
            <div className="text-center mb-5 z-10">
                {/*------ Vể lại page đầu tiên ---------*/}
                <button
                    className={ pager.currentPage === 1 ?
                        'btn btn-dark btn-move btn-lg mb-4 disabled' : 'btn btn-dark btn-move btn-lg mb-4'
                    }
                    onClick={() => this.setPageClick(1)}
                >
                    {'<<'}
                   {/* <img class="img-fluid" src="/assets/manage-type/left2.png" alt=""/> */}
                </button>
                {/*------ Lùi lại 1 page ---------*/}
                <button 
                    className={pager.currentPage === 1 ? 
                        'btn btn-dark btn-move btn-lg mb-4 disabled' : 'btn btn-dark btn-move btn-lg mb-4'}
                    onClick={() => this.setPageClick(pager.currentPage - 1)}
                >
                    {'<'}
                    {/* <img className="img-fluid" src="/assets/manage-type/left.png" alt="" /> */}
                </button>
                {/*------ Hiển thị các page ---------*/}
                {pager.pages.map((page, index) =>
                    <button 
                        key={index} 
                        className={pager.currentPage === page ? 
                            'btn btn-dark btn-move btn-lg mb-4 active': 'btn btn-dark btn-move btn-lg mb-4'}
                        onClick={() => this.setPageClick(page)}
                    >
                        {page}
                    </button>
                )}
                {/*------ Tiến lên 1 page ---------*/}
                <button 
                    className={pager.currentPage === pager.totalPages ? 
                        'btn btn-dark btn-move btn-lg mb-4 disabled' : 'btn btn-dark btn-move btn-lg mb-4'}
                    onClick={() => this.setPageClick(pager.currentPage + 1)}
                >
                    {'>'}
                    {/* <img class="img-fluid" src="/assets/manage-type/right.png" alt="" /> */}
                </button>
                {/*------ Hiển thị page cuối ---------*/}
                <button 
                    className={pager.currentPage === pager.totalPages ? 
                        'btn btn-dark btn-move btn-lg mb-4 disabled' : 'btn btn-dark btn-move btn-lg mb-4'}
                    onClick={() => this.setPageClick(pager.totalPages)}
                >
                    {'>>'}
                    {/* <img class="img-fluid" src="/assets/manage-type/right2.png" alt="" /> */}
                </button>
            </div>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;