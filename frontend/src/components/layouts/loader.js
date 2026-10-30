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

import React, { useState } from 'react';
import '../styles/loader.css';

export default function Loader({ initialLoading = true }) {
    // JavaScript state to control loader visibility programmatically
    const [isLoading, setIsLoading] = useState(initialLoading);

    // Optional: Example function to hide the loader via JS logic
    const hideLoader = () => {
        setIsLoading(false);
    };

    // Optional: Example function to show the loader via JS logic
    const showLoader = () => {
        setIsLoading(true);
    };

    // If loading is false, the loader component is not rendered
    if (!isLoading) return null;

    return (
        <div className="dots-container" id="dotsLoader">
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