// import '../styles/loader.css';

// export default function Loader() {
//     return (
//         <div className="prism-container">
//             <div className="prism">
//                 <div className="front"></div>
//                 <div className="back"></div>
//                 <div className="right"></div>
//                 <div className="left"></div>
//                 <div className="top"></div>
//                 <div className="bottom"></div>
//             </div>
//         </div>
//     )
// }


import React from 'react';
import '../styles/loader.css';

export default function Loader() {
    return (
        <div className="dots-container">
            <div className="dots-loader">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
}