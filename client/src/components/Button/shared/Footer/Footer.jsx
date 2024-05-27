import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 px-4 py-6">
            <div className="container mx-auto text-center">
                <div className="flex justify-center items-center mb-4 space-x-4">
                    <a href="https://github.com/iamtanim0195" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaGithub />
                    </a>
                    <a href="https://www.linkedin.com/in/iamtanim0195/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaLinkedin />
                    </a>
                    <a href="https://mellifluous-manatee-97af1d.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <CgWebsite />
                    </a>
                </div>
                <p className="text-sm">Connect with me:</p>
                <p className="text-sm">Email: sahadatmd195@gmail.com</p>
            </div>
            <div className="text-sm text-center mt-4">
                © 2023 Recipe Hub. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
