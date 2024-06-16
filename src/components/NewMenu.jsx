import Link from 'next/link'
import MenuButton from './MenuButton';

const NewMenu = ({ user, visualization }) => {
    const list = true
    return (
        <div className="dropdown">
            <button className="btn-dropdown" >
                <div>New <img src='/down.svg' width='15px' /></div>
            </button>
            <div name='new-menu' id='new-menu' className='dropdown-content'>
                <MenuButton name='New Folder' user={user} list={list}></MenuButton>
                <MenuButton name='New Dashboard' user={user} list={list}></MenuButton>
            </div>
        </div>
    );
}

export default NewMenu;