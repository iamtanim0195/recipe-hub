
const DevInfo = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Md. Sahadat Hosse Tanim</h1>
                <p className="text-lg mb-2">MERN Stack Developer</p>
                <p className="text-gray-600">(GMT+6)</p>
                <p className="mb-4">Munshiganj, Bangladesh</p>
                <p className="mb-4">+8801645017119</p>
                <p className="mb-4">sahadatmd195@gmail.com</p>
                <div className="flex justify-center mb-4">
                    <a href="https://github.com/iamtanim0195" target="_blank" rel="noopener noreferrer" className="mr-4">GitHub</a>
                    <a href="https://www.linkedin.com/in/iamtanim0195/" target="_blank" rel="noopener noreferrer" className="mr-4">LinkedIn</a>
                    <a href="https://mellifluous-manatee-97af1d.netlify.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
                </div>
                <p className="text-lg font-bold mb-2">SUMMARY</p>
                <p className="text-gray-600 mb-4">MERN Stack Developer, skilled in crafting dynamic and responsive web applications with a keen focus on enhancing user experiences.</p>
                <p className="text-lg font-bold mb-2">SKILLS</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600 mb-2">Frontend:</p>
                        <p>HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React.js, Next.js</p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-2">Backend:</p>
                        <p>Express.js, Node.js, MongoDB, Mongoose, Firebase, Stripe, JWT</p>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-2">Tools:</p>
                        <p>VS Code, Git, GitHub, Vercel</p>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-lg font-bold mb-2">Educational Background</p>
                <p>Bachelor of Science in Computer Science</p>
                <p>Hamdard University Bangladesh</p>
                <p>2023 to Present </p>
            </div>
        </div>
    );
}

export default DevInfo;
