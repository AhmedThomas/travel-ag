import { Header } from 'components';
import React from 'react';

const Dashboard = () => {
  let user = {
    name: {
      firstName: 'Ahmed',
      lastName: 'Thomas',
    },
  };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome back, ${user?.name.firstName ?? 'Guest'} 👋`}
        description="Here's what's happening today."
      />
      Dashborad Page Contents
    </main>
  );
};

export default Dashboard;
