const UserTitle = ({ role, name }) => {
    return (
        <p>
            <span>{role === "HR" ? "함께 성장하는" : "취업 성공기원"},{" "}</span>
            <strong>{name}</strong>님
        </p>
    );
};

export default UserTitle; 