import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="theme-transition-slow bg-slate-800 py-10 text-slate-200 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="theme-transition-fast mb-4 text-lg font-bold text-white">
              {t('appName')}
            </h3>
            <p className="theme-transition-fast text-slate-300">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="theme-transition-fast mb-4 text-lg font-bold text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  to="/"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('navigation.mapExplorer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/locations"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('navigation.locations')}
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('navigation.guides')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="theme-transition-fast mb-4 text-lg font-bold text-white">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  to="#"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="theme-transition-fast transition-colors hover:text-white"
                >
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="theme-transition-fast mb-4 text-lg font-bold text-white">
              {t('footer.connectWithUs')}
            </h3>
            <p className="theme-transition-fast mb-3 text-slate-300">
              {t('footer.followUs')}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="theme-transition-fast rounded-full border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600 hover:text-white dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700"
              >
                <FacebookIcon className="h-4 w-4" />
                <span className="sr-only">{t('footer.facebook')}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="theme-transition-fast rounded-full border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600 hover:text-white dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700"
              >
                <TwitterIcon className="h-4 w-4" />
                <span className="sr-only">{t('footer.twitter')}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="theme-transition-fast rounded-full border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600 hover:text-white dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700"
              >
                <InstagramIcon className="h-4 w-4" />
                <span className="sr-only">{t('footer.instagram')}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="theme-transition-fast mt-8 border-t border-slate-700 pt-6 text-center text-slate-400">
          <p>&copy; {currentYear} {t('appName')}. {t('footer.rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
