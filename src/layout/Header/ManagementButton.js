import { MdKeyboardArrowRight } from "react-icons/md";

const ManagementButton = ({ onClick, role, showArrow = false }) => {
    const buttonText = role === "HR" ? "공고 관리" : "이력서 관리";
    
    return (
        <button type="button" onClick={onClick} className="tutorial-management">
            {buttonText} {showArrow && <MdKeyboardArrowRight className="icon-arrow" />}
        </button>
    );
};

export default ManagementButton; 