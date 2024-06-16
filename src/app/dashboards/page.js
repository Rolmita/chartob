import React from 'react';
import Link from 'next/link'
import ShowArchives from '../../components/ShowArchives'
import DashboardsHeader from '../../components/DashboardsHearder'
import { auth } from '@/auth'
import NavSection from '@/components/NavSection';

async function DashboardList() {

    let foundUser
    let isFolder
    let folders
    let dashboards

    const session = await auth()
    // console.log(session);

    try {
        foundUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                folders: true, dashboards: {
                    where: {
                        folderId: null
                    }
                }
            }
        })
        // console.log(foundUser);

        isFolder = false;

        folders = foundUser.folders
        dashboards = foundUser.dashboards
        // console.log('dashboardlist',dashboards);
    } catch (error) {
        console.log(error);
    }

    return (
        <section>
            <NavSection>
                <img src='/right.svg' width='18px'></img>
                {/* <TfiAngleRight ></TfiAngleRight> */}
                <Link className='route-link' href='/dashboards'>Dashboards</Link>
            </NavSection>

            <div className="show-dashboards">
                <DashboardsHeader user={foundUser?.id}></DashboardsHeader>
                {
                    folders?.length == 0 && dashboards?.length == 0
                        ? <p>No hay archivos para este usuario</p>
                        : <ShowArchives folder={folders} dashboards={dashboards} isFolder={isFolder}></ShowArchives>
                }
            </div>
        </section>
    )
}

export default DashboardList;