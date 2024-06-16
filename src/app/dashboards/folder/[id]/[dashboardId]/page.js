import Dashboard from "@/components/Dashboard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Menu";
import DashboardHeader from "@/components/DashboardHeader";
import NavSection from "@/components/NavSection";

async function FolderDashboard({ params }) {

    const dashboard = await prisma.dashboard.findUnique({
        where: { id: Number(params.dashboardId) }
    })

    const folder = await prisma.folder.findUnique({
        where: { id: Number(params.id) }
    })

    console.log(JSON.parse(dashboard.content));

    return (
        <section>
            <NavSection>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href='/dashboards'>Dashboards</Link>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href={`/dashboards/folder/${folder.id}`}>{folder.name}</Link>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href={`/dashboards/folder/${folder.id}/${dashboard.id}`}>{dashboard.name}</Link>
            </NavSection>

            <div style={{ width: '100%' }}>
                <DashboardHeader folder={folder} dashboard={dashboard}></DashboardHeader>
                <Dashboard dashboard={dashboard}></Dashboard>
            </div>
        </section>
    )
}

export default FolderDashboard