import { Link } from "react-router-dom";
import { BiLogoGithub } from "react-icons/bi";
import { RxNotionLogo } from "react-icons/rx";

const Footer = () => {
    return(
        <footer>
            <div className="inner">
                <div>
                    <Link to="https://github.com/orgs/AI-5team-final/repositories" target="_blank"><BiLogoGithub /></Link>
                    <Link to="https://www.notion.so/5-1b07db28f0398037b47ffa3604613a6b?pvs=4" target="_blank"><RxNotionLogo /></Link>
                </div>
                <small><strong>© 2025 OhapZizon.</strong> All rights reserved.</small>
            </div>
        </footer>
    );
}

export default Footer;