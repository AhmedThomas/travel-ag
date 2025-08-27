import { Header, StatsCards, TripCards } from 'components';
import { dashboradStats, user, allTrips } from '~/constants';

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboradStats;

const Dashboard = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome back, ${user?.name.firstName ?? 'Guest'} 👋`}
        description="Here's what's happening today."
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCards
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />
          <StatsCards
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCards
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCards
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ''}
                tags={tags}
                price={estimatedPrice}
              />
            ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
