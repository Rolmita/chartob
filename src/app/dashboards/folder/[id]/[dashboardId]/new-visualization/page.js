'use client'
import Navbar from "@/components/Menu"
import Link from "next/link"
import Visualization from "@/components/charts/Visualization";
import QueryForm from "@/components/charts/QueryForm";
import ChartForm from '@/components/charts/ChartForm';
import { getFolderById, getDashboardById, getUserBySession, saveChart } from "@/lib/actions";
import { useState, useEffect } from 'react'
import NavSection from "@/components/NavSection";

export default function NewVisualization({ params }) {
    const [folder, setFolder] = useState(null)
    const [dashboard, setDashboard] = useState(null)
    const [databases, setDatabases] = useState(null)
    const [queryDb, setQueryDb] = useState(null)
    const [queryRes, setQueryRes] = useState(null);
    const [finalData, setFinalData] = useState(null)
    const [finalOptions, setFinalOptions] = useState(null)
    const [chartType, setChartType] = useState(null)
    const [query, setQuery] = useState(null)
    const status = 'new'

    useEffect(() => {
        const fetchData = () => {
            const folderId = Number(params.id);
            getFolderById(folderId)
                .then(folder => setFolder(folder))
                .catch(error => console.error('Error fetching folder:', error));
            const dashboardId = Number(params.dashboardId);
            getDashboardById(dashboardId)
                .then(dashboard => setDashboard(dashboard))
                .catch(error => console.error('Error fetching dashboard:', error));
            getUserBySession()
                .then(user => setDatabases(user.databases))
                .catch(error => console.error('Error fetching user by session:', error));
        };

        fetchData();
    }, [params.id, params.dashboardId]);

    return (
        <section>
            <NavSection>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href='/dashboards'>Dashboards</Link>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href={`/dashboards/folder/${folder?.id}`}>{folder?.name}</Link>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href={`/dashboards/folder/${folder?.id}/${dashboard?.id}`}>{dashboard?.name}</Link>
                <img src='/right.svg' width='18px'></img>
                <Link className='route-link' href={``}>New visualization</Link>
            </NavSection>

            <div style={{ display: 'flex', flexDirection: 'column' }} className='dashboard-header'>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'lightgray', width: '100%', padding: '10px' }}>
                    <div>
                        <h1>New Visualization</h1>
                    </div>
                    
                    <div>
                        <button className='button' onClick={() => saveChart(finalData, finalOptions, dashboard, query, queryDb)}>Save</button>
                        <button className='button'>
                            <Link className='route-link' href={`/dashboards/folder/${folder?.id}/${dashboard?.id}`} style={{ color: '#ffffff' }}>Discard</Link>
                        </button>
                    </div>
                </div>
                <Visualization data={queryRes} status={status} finalData={finalData} type={chartType} finalOpt={finalOptions}></Visualization>
                <section className="visualization-settings tabs" style={{ display: 'flex', flexDirection: 'column', minWidth: '100%', padding: '5px', backgroundColor: 'lightgray' }}>

                    <div className="tab-container">

                        <div id="tab2" className="tab">
                            <a href="#tab2"><h3>Chart</h3></a>

                            <div className="tab-content" >
                                <h3>Chart Settings</h3>
                                <ChartForm data={queryRes} status={status} onFinalData={setFinalData} onFinalOptions={setFinalOptions} onChartType={setChartType}></ChartForm>
                            </div >
                        </div>

                        <div id='tab1' className="tab">
                            <a href='#tab1'><h3>Data</h3></a>
                            <QueryForm databases={databases} onQueryResults={setQueryRes} onQuery={setQuery} onDb={setQueryDb}>
                            </QueryForm>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
