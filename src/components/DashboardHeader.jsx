'use client'
import Link from "next/link"
import MenuButton from "./MenuButton";
import { useState } from "react";
import { editDashboard } from "@/lib/actions";

function DashboardHeader({ folder, dashboard }) {

    const [buttonState, setButtonState] = useState(true)
    const [buttonSaveState, setButtonSaveState] = useState('none')
    const [buttonEditState, setEditState] = useState('flex')

    const changeState = () => {
        setButtonState(false)
        setEditState('none')
        setButtonSaveState('flex')
    }

    const returnState = () => {
        setEditState('flex')
        setButtonSaveState('none')
        // setButtonState(true)
    }

    return (
        < div className='dashboard-header'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <form style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <input type='hidden' name='id' id='id' key={dashboard.id} defaultValue={dashboard.id}></input>
                    <h1 style={{ marginRight: '10px' }}>
                        <input className='input-name' type='text' name='dashboardName' placeholder={dashboard.name} defaultValue={dashboard.name}
                            disabled={buttonState} autoFocus />
                    </h1>
                    <button type='submit' formAction={editDashboard} onClick={returnState} className='btn-menu button' style={{ display: buttonSaveState }}>Save name</button>
                    <button type='button' className='btn-menu button' onClick={changeState} style={{ display: buttonEditState }}>Edit name</button>
                </form>
            </div>
            <div>
                <form>
                    <select name={`interval-type-${dashboard.id}`} >
                            {/* value={filter.interval.type} onChange={(e) => handleFilterChange(index, 'interval.type', e.target.value)} */}
                        <option value="">-- Choose an interval of time --</option>
                        <option value="last4h">Last 4 hours</option>
                        <option value="last6h">Last 6 hours</option>
                        <option value="last8h">Last 8 hours</option>
                        <option value="last12h">Last 12 hours</option>
                        <option value="last24h">Last 24 hours</option>
                        <option value='6to18'>From 6:00 to 18:00</option>
                        <option value='8to20'>From 8:00 to 20:00</option>
                        <option value='0to24'>From 00:00 to 24:00</option>
                    </select>
                </form>
            </div>
            <MenuButton className='btn-menu button' name='New Visualization' dashboardId={dashboard.id} folderId={folder?.id}></MenuButton>
        </div >
    )
}

export default DashboardHeader;