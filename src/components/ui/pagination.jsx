import React from 'react'
import Link from 'next/link'

const Pagination = () => {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="blog-pagi">
                <ul className="pagination">
                    <li className="page-item"><Link className="page-link active" href="/single-products">1</Link></li>
                    <li className="page-item"><Link className="page-link" href="/single-products">2</Link></li>
                    <li className="page-item"><Link className="page-link" href="/single-products">3</Link></li>
                    <li className="page-item">
                        <Link className="page-link" href="/single-products" aria-label="Next">
                            <span aria-hidden="true"><i className="bx bx-arrow-back bx-rotate-180" /></span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Pagination