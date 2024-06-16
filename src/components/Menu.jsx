'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className='dropdown-menu' ref={dropdownRef}>
            <button className="dropdown-icon" onClick={toggleDropdown}>
                <img className='dropdown-logo' src='/logo.png' />
            </button>
            {isOpen && (
                <div className="menu">
                    <Link className="menu-item" href="/">
                        <h3>Home</h3></Link>

                    <Link className="menu-item" href="/dashboards">
                        <h3>Dashboards</h3></Link>

                    <Link className="menu-item" href="/databases">
                        <h3>Databases</h3></Link>

                    <Link className="menu-item" href="/settings">
                        <h3>Settings</h3></Link>

                    <Link className="menu-item" href="/auth/logout">
                        <h3>Log out</h3></Link>
                </div>
            )}
        </nav>
    )
}
export default Navbar