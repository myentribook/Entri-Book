

import React from 'react';
import '../styles/loader.css';

export default function Loader() {
    return (
        <div className="dots-container">
            <div className="dots-loader">
                <svg className="dot" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
                    {/* Step 1: Main 'e' curve */}
                    <path
                        className="e-stroke"
                        d="M 82 132 L 182 74 A 78 78 0 1 0 184 152"
                    />

                    {/* Step 2: Bottom-right arrow / G corner */}
                    <path
                        className="g-bar"
                        d="M 142 152 L 192 152 L 192 206"
                    />
                </svg>
            </div>
        </div>
    );
}