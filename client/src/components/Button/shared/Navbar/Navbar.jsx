import Container from '../Container'
import Logo from '../Logo';
import MenuDropdown from './MenuDropdown';

const Navbar = () => {
    return (
        <div className='fixed w-full bg-white z-10 shadow-sm'>
            <div className='border-b-[1px]'>
                <Container>
                    <div className='flex flex-row  items-center justify-between gap-3 md:gap-0'>
                        {/* Logo */}
                        <Logo />
                        {/* Dropdown Menu */}
                        <MenuDropdown />
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Navbar;
