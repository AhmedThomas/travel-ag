import { useNavigate } from 'react-router';
import { logoutUser } from '~/appwrite/auth';

const PageLayout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    navigate('/sign-in');
  };
  return (
    <main>
      <div className="flex items-center flex-col-2 gap-5 m-4">
        <button className="cursor-pointer" onClick={handleLogout}>
          <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
        </button>
        <button
          className="cursor-pointer border-b-blue-700 border-2 p-2 rounded-20"
          onClick={() => {
            navigate('/dashboard');
          }}
        >
          Dashboard
        </button>
      </div>
    </main>
  );
};

export default PageLayout;
