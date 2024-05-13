// import React from 'react';

// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     onChangePage: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onChangePage }) => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//     }

//     return (
//         <nav>
//             <ul className="pagination">
//                 {pageNumbers.map(number => (
//                     <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
//                         <button onClick={() => onChangePage(number)} className="page-link">
//                             {number}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </nav>
//     );
// };

// export default Pagination;
