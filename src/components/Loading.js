import LoadingSpinner from "./LoadingSpinner";

const Loading = ({text}) => {
    return (
        <main className="l-loading">
            <div className="slider-transition">
                <div className="loading-spinner">
                    <LoadingSpinner/>
                    <p className="loading-spinner__text">
                        {text}<br />잠시만 기다려주세요...
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Loading;