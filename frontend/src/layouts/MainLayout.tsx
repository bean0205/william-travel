import { Outlet, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CountryDisplay from '@/components/common/CountryDisplay';
import { useCountryStore } from '@/store/countryStore';

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
    </div>
  );
};

export default MainLayout;
