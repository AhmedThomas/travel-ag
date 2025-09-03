import { Header, StatsCards, TripCards } from 'components';
import { getAllUsers, getUser } from '~/appwrite/auth';
import type { Route } from './+types/dashboard';
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripStats,
} from '~/appwrite/dashboard';
import { getAllTrips } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utils';
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from '@syncfusion/ej2-react-charts';
import {
  interests,
  tripXAxis,
  tripyAxis,
  userXAxis,
  useryAxis,
} from '~/constants';
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
} from '@syncfusion/ej2-react-grids';

export const clientLoader = async () => {
  const [
    user,
    dashboradStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    await getUser(),
    await getUsersAndTripStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(4, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetails),
    imageUrls: imageUrls ?? [],
  }));

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount,
  }));

  return {
    user,
    dashboradStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;

  const { dashboradStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interests: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: 'Latest user signups',
      dataSource: allUsers,
      field: 'count',
      headerText: 'Trips created',
    },
    {
      title: 'Trips based on interests',
      dataSource: trips,
      field: 'interests',
      headerText: 'Interests',
    },
  ];

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome back, ${user?.name ?? 'Guest'} 👋`}
        description="Here's what's happening today."
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCards
            headerTitle="Total Users"
            total={dashboradStats.totalUsers}
            currentMonthCount={dashboradStats.usersJoined.currentMonth}
            lastMonthCount={dashboradStats.usersJoined.lastMonth}
          />
          <StatsCards
            headerTitle="Total Trips"
            total={dashboradStats.totalTrips}
            currentMonthCount={dashboradStats.tripsCreated.currentMonth}
            lastMonthCount={dashboradStats.tripsCreated.lastMonth}
          />
          <StatsCards
            headerTitle="Active Users"
            total={dashboradStats.userRole.total}
            currentMonthCount={dashboradStats.userRole.currentMonth}
            lastMonthCount={dashboradStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCards
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name!}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ''}
              tags={[trip.interests!, trip.travelStyle!]}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71, 132, 238, 0.3)"
              border={{ width: 2, color: '#4784EE' }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trip Trends"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="day"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>

      <section className="user-trip wrapper">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div key={i} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>

            <GridComponent dataSource={dataSource} gridLines="None">
              <ColumnsDirective>
                <ColumnDirective
                  field="name"
                  headerText="Name"
                  width="200"
                  textAlign="Left"
                  template={(props: UserData) => (
                    <div className="flex items-center gap-1.5 px-4">
                      <img
                        src={props.imageUrl}
                        alt="user"
                        className="rounded-full size-8 aspect-square"
                        referrerPolicy="no-referrer"
                      />
                      <span>{props.name}</span>
                    </div>
                  )}
                />
                <ColumnDirective
                  field={field}
                  headerText={headerText}
                  width="150"
                  textAlign="Left"
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
