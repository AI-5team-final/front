import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <footer>
            <div className="inner">
                <div>
                    <Link to="https://github.com/orgs/AI-5team-final/repositories"></Link>
                    <Link to="https://www.notion.so/5-1b07db28f0398037b47ffa3604613a6b?pvs=4"></Link>
                </div>
                <small>© 2025 Ohapjijon. All rights reserved.</small>
            </div>
        </footer>
    );
}

export default Footer;