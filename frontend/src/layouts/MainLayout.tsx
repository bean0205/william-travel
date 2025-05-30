import { Outlet, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CountryDisplay from '@/components/common/CountryDisplay';
import { useCountryStore } from '@/store/countryStore';
import { TravelChatbot } from '@/components/features/chatbot/TravelChatbot';

const MainLayout = () => {
  const { isCountrySelected } = useCountryStore();

  // Redirect to country selection if no country is selected
  if (!isCountrySelected) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CountryDisplay />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Add chatbot to layout so it appears on all pages */}
      <TravelChatbot initialMinimized={true} />
    </div>
  );
};

export default MainLayout;
