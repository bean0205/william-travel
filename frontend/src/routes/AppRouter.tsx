import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { APP_ROUTES } from './routes';
import AdminRouteWrapper from './AdminRouteWrapper';

// Page imports
import HomePage from '@/pages/HomePage';
import CountrySelectionPage from '@/pages/CountrySelectionPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import AdminTest from '@/pages/AdminTest';

// Admin pages
import ContentManagement from '@/pages/admin/ContentManagement';
import ArticleManagement from '@/pages/admin/ArticleManagement';
import EventManagement from '@/pages/admin/EventManagement';
import ReviewManagement from '@/pages/admin/ReviewManagement';
import ReportsAnalytics from '@/pages/admin/ReportsAnalytics';
import SystemSettings from '@/pages/admin/SystemSettings';
import UserManagement from '@/pages/admin/UserManagement';
import LocationManagement from '@/pages/admin/LocationManagement';
import GuideManagement from '@/pages/admin/GuideManagement';
import MediaManagement from '@/pages/admin/MediaManagement';
import RolesManagement from '@/pages/admin/RolesManagement';
import PermissionsManagement from '@/pages/admin/PermissionsManagement';
import CommunityPostManagement from '@/pages/admin/CommunityPostManagement';
import RatingManagement from '@/pages/admin/RatingManagement';

// Location Management Pages
import ContinentManagement from '@/pages/admin/ContinentManagement';
import CountryManagement from '@/pages/admin/CountryManagement';
import RegionManagement from '@/pages/admin/RegionManagement';
import DistrictManagement from '@/pages/admin/DistrictManagement';
import WardManagement from '@/pages/admin/WardManagement';
import LocationCategoryManagement from '@/pages/admin/LocationCategoryManagement';
// Accommodation & Food Management Pages
import AccommodationManagement from '@/pages/admin/AccommodationManagement';
import AccommodationCategoryManagement from '@/pages/admin/AccommodationCategoryManagement';
import FoodManagement from '@/pages/admin/FoodManagement';
import FoodCategoryManagement from '@/pages/admin/FoodCategoryManagement';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={APP_ROUTES.COUNTRY_SELECTION.path} element={<CountrySelectionPage />} />
        <Route path={APP_ROUTES.HOME.path} element={<HomePage />} />
        
        {/* Test route for admin functionality */}
        <Route path="/admin-test" element={<AdminTest />} />

        {/* Add other public routes... */}

        {/* Admin Routes - all protected requiring admin role */}
       

        <Route
          path={APP_ROUTES.ADMIN_CONTENT.path}
          element={
            <AdminRouteWrapper>
              <ContentManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ARTICLES.path}
          element={
            <AdminRouteWrapper>
              <ArticleManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_EVENTS.path}
          element={
            <AdminRouteWrapper>
              <EventManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_REVIEWS.path}
          element={
            <AdminRouteWrapper>
              <ReviewManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_REPORTS.path}
          element={
            <AdminRouteWrapper>
              <ReportsAnalytics />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_SYSTEM_SETTINGS.path}
          element={
            <AdminRouteWrapper>
              <SystemSettings />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_USERS.path}
          element={
            <AdminRouteWrapper>
              <UserManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ROLES.path}
          element={
            <AdminRouteWrapper>
              <RolesManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_PERMISSIONS.path}
          element={
            <AdminRouteWrapper>
              <PermissionsManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS.path}
          element={
            <AdminRouteWrapper>
              <LocationManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_MEDIA.path}
          element={
            <AdminRouteWrapper>
              <MediaManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_GUIDES.path}
          element={
            <AdminRouteWrapper>
              <GuideManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Location Management Routes */}
        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_CONTINENTS.path}
          element={
            <AdminRouteWrapper>
              <ContinentManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_COUNTRIES.path}
          element={
            <AdminRouteWrapper>
              <CountryManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_REGIONS.path}
          element={
            <AdminRouteWrapper>
              <RegionManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_DISTRICTS.path}
          element={
            <AdminRouteWrapper>
              <DistrictManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_WARDS.path}
          element={
            <AdminRouteWrapper>
              <WardManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_LOCATIONS_CATEGORIES.path}
          element={
            <AdminRouteWrapper>
              <LocationCategoryManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Accommodation Management Routes */}
        <Route
          path={APP_ROUTES.ADMIN_ACCOMMODATIONS.path}
          element={
            <AdminRouteWrapper>
              <AccommodationManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ACCOMMODATION_CATEGORIES.path}
          element={
            <AdminRouteWrapper>
              <AccommodationCategoryManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Food Management Routes */}
        <Route
          path={APP_ROUTES.ADMIN_FOODS.path}
          element={
            <AdminRouteWrapper>
              <FoodManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_FOOD_CATEGORIES.path}
          element={
            <AdminRouteWrapper>
              <FoodCategoryManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Admin Detail/Edit Routes */}
        <Route
          path={APP_ROUTES.ADMIN_ARTICLE_CREATE.path}
          element={
            <AdminRouteWrapper>
              <ArticleManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ARTICLE_EDIT.path}
          element={
            <AdminRouteWrapper>
              <ArticleManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_EVENT_CREATE.path}
          element={
            <AdminRouteWrapper>
              <EventManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_EVENT_EDIT.path}
          element={
            <AdminRouteWrapper>
              <EventManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ACCOMMODATION_CREATE.path}
          element={
            <AdminRouteWrapper>
              <ContentManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_ACCOMMODATION_EDIT.path}
          element={
            <AdminRouteWrapper>
              <ContentManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_FOOD_CREATE.path}
          element={
            <AdminRouteWrapper>
              <ContentManagement />
            </AdminRouteWrapper>
          }
        />

        <Route
          path={APP_ROUTES.ADMIN_FOOD_EDIT.path}
          element={
            <AdminRouteWrapper>
              <ContentManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Community Posts Management Route */}
        <Route
          path={APP_ROUTES.ADMIN_COMMUNITY_POSTS.path}
          element={
            <AdminRouteWrapper>
              <CommunityPostManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Ratings Management Route */}
        <Route
          path={APP_ROUTES.ADMIN_RATINGS.path}
          element={
            <AdminRouteWrapper>
              <RatingManagement />
            </AdminRouteWrapper>
          }
        />

        {/* Fallback routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path={APP_ROUTES.NOT_FOUND.path} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
