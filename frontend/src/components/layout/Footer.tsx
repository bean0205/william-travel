import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  ArrowRightIcon,
  GlobeIcon,
  SendIcon,
  PlaneIcon,
  CompassIcon
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    // Here you would typically call an API to add the email to your newsletter list
    setEmail('');
    // Show a success message or notification
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/patterns/noise.png)',
            backgroundSize: '200px',
            opacity: 0.3
          }}
        ></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500"></div>
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-teal-600/10 blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/home" className="flex items-center group">
              <div className="relative mr-2 flex h-10 w-10 overflow-hidden rounded-full bg-primary-600 text-white shadow-md">
                <GlobeIcon className="m-auto h-6 w-6" />
                <div className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-amber-500"></div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                {t('appName')}
              </span>
            </Link>
            <p className="text-slate-300">
              {t('footer.description')}
            </p>

            <div className="space-y-3 pt-3">
              <div className="flex items-start">
                <MapPinIcon className="mr-3 h-5 w-5 text-primary-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-300">
                  123 Travel Street, Exploring City, World
                </p>
              </div>
              <div className="flex items-center">
                <MailIcon className="mr-3 h-5 w-5 text-primary-400" />
                <a href="mailto:info@Skylora.com" className="text-sm text-slate-300 hover:text-white transition-colors">
                  info@williamtravel.com
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="mr-3 h-5 w-5 text-primary-400" />
                <a href="tel:+1234567890" className="text-sm text-slate-300 hover:text-white transition-colors">
                  +123 456 7890
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute -bottom-1 left-0 h-0.5 w-12 bg-primary-500"></span>
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link
                  to="/"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.mapExplorer')}
                </Link>
              </li>
              <li>
                <Link
                  to="/locations"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.locations')}
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.guides')}
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.events')}
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('navigation.articles')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white relative inline-block">
              {t('footer.resources')}
              <span className="absolute -bottom-1 left-0 h-0.5 w-12 bg-primary-500"></span>
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li>
                <Link
                  to="#"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center transition-all hover:translate-x-1 hover:text-primary-400"
                >
                  <ArrowRightIcon className="mr-2 h-3.5 w-3.5 text-primary-500" />
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white relative inline-block">
              {t('footer.newsletterTitle')}
              <span className="absolute -bottom-1 left-0 h-0.5 w-12 bg-primary-500"></span>
            </h3>
            <p className="text-slate-300 text-sm">
              {t('footer.newsletterDescription')}
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="bg-slate-800/50 border-slate-700 pl-10 w-full rounded-lg text-white placeholder:text-slate-400 focus:border-primary-400 focus:ring-primary-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white flex items-center justify-center gap-2"
              >
                <SendIcon className="h-4 w-4" />
                {t('footer.subscribe')}
              </Button>
            </form>

            {/* Social Media */}
            <div>
              <p className="text-sm font-medium text-white mb-3">
                {t('footer.connectWithUs')}
              </p>
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-primary-600 hover:text-white hover:scale-110"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-primary-600 hover:text-white hover:scale-110"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-primary-600 hover:text-white hover:scale-110"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-primary-600 hover:text-white hover:scale-110"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <CompassIcon className="h-5 w-5 mr-2 text-primary-400" />
              {t('footer.popularDestinations')}
            </h3>
            <Link
              to="/locations"
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center transition-all"
            >
              {t('footer.viewAll')}
              <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Ha Long Bay', 'Hoi An', 'Hanoi', 'Ho Chi Minh City', 'Sapa', 'Da Nang'].map((place, index) => (
              <Link
                key={index}
                to={`/locations?q=${place}`}
                className="bg-slate-800/50 hover:bg-slate-700/70 transition-all rounded-lg px-3 py-2 text-center text-sm hover:text-primary-300 group"
              >
                <span className="group-hover:underline">{place}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* App Footer */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm">
              &copy; {currentYear} {t('appName')}. {t('footer.rightsReserved')}
            </p>
          </div>

          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {t('footer.termsOfService')}
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to="#"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {t('footer.cookiePolicy')}
            </Link>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-2">{t('footer.madeWith')}</span>
            <span className="text-red-500">❤</span>
            <span className="text-sm text-slate-400 ml-2">{t('footer.inVietnam')}</span>
          </div>
        </div>
      </div>

      {/* "Back to top" button */}
      <a
        href="#top"
        className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
