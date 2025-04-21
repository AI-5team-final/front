const LogoutButton = ({ onClick, className = "" }) => {
    return (
        <button onClick={onClick} className={`btn-logout ${className}`}>
            로그아웃
        </button>
    );
};

export default LogoutButton; 