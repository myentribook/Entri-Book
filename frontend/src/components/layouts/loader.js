import '../styles/loader.css';

export default function Loader() {
    return (
        <div className="prism-container">
            <div className="prism">
                <div className="front"></div>
                <div className="back"></div>
                <div className="right"></div>
                <div className="left"></div>
                <div className="top"></div>
                <div className="bottom"></div>
            </div>
        </div>
    )
}