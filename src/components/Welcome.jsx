import { auth } from "@/auth"
import { getUserBySession } from "@/lib/actions"

export default async function Welcome() {

    let userWithDashboard
    try {
        const userBySession = await getUserBySession()

        userWithDashboard = await prisma.user.findUnique({
            where: { id: userBySession.id },
            include: {
                dashboards: {
                    orderBy: { updatedAt: 'desc' },
                    take: 10,
                }
            }
        })
    } catch (error) {
        console.log(error);
    }


    return (
        <div className="show-databases">
            <h1>Hi, {userWithDashboard?.name}</h1>
            {userWithDashboard && userWithDashboard.dashboard
                ? <div>
                    <h2>Here you have a list with your last modified dashboard:</h2>
                    <div style={{ marginTop: '10px' }}>
                        <ul className='folder-dashboard-list' style={{ backgroundColor: 'lightgray', width: 'auto' }}>
                            {userWithDashboard?.dashboards.map(dashboard =>
                                <li className='list-row' key={dashboard.id}>
                                    <Link className='list-element' style={{ width: '93%', marginRight: '2%' }}
                                        href={dashboard.folderId ? `/dashboards/folder/${dashboard.folderId}/${dashboard.id}` : `/dashboards/${dashboard.id}`}>
                                        <div>
                                            <p>{dashboard.name}</p>
                                        </div>
                                        <span>Last modification: {formattedDateTime(dashboard.updatedAt)}</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                : <h2>Start by setting up links to your databases and create unique dashboards.</h2>
            }
        </div>

    )
}