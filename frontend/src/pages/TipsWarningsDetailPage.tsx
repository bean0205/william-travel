import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleLayout from '@/layouts/SimpleLayout';
import {
  FaArrowLeft,
  FaShareAlt,
  FaPrint,
  FaShieldAlt,
  FaSuitcase,
  FaUtensils,
  FaWater,
  FaMoneyBillWave,
  FaUserFriends,
  FaRegLightbulb,
  FaExclamationTriangle,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalPolice, MdWarning } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';

interface TipsWarningDetail {
  id: string;
  title: string;
  category: 'safety' | 'health' | 'cultural' | 'money' | 'transportation' | 'food' | 'weather' | 'scams';
  urgency: 'high' | 'medium' | 'low';
  description: string;
  fullDescription: string;
  dos: string[];
  donts: string[];
  relatedTips: {
    id: string;
    title: string;
    category: string;
  }[];
  resources: {
    title: string;
    url: string;
  }[];
  lastUpdated: string;
}

const TipsWarningsDetailPage = () => {
  const { t } = useTranslation(['common']);
  const { id } = useParams<{ id: string }>();
  const [tipItem, setTipItem] = useState<TipsWarningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipDetail = async () => {
      try {
        setLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data for different tips
          const mockDetail: TipsWarningDetail = {
            id: id || '1',
            title: id === '1' ? 'Pickpocketing in Tourist Areas' :
                   id === '2' ? 'Drinking Water Safety' :
                   id === '3' ? 'Traffic and Road Safety' :
                   id === '4' ? 'Temple and Pagoda Etiquette' :
                   id === '5' ? 'Street Food Safety' :
                   id === '6' ? 'Monsoon Season Precautions' :
                   id === '7' ? 'Common Tourist Scams' :
                   id === '8' ? 'Currency Exchange Tips' :
                   id === '9' ? 'Motorbike Rental Precautions' : 'Insect-Borne Disease Prevention',
            category: id === '1' ? 'safety' :
                      id === '2' ? 'health' :
                      id === '3' ? 'transportation' :
                      id === '4' ? 'cultural' :
                      id === '5' ? 'food' :
                      id === '6' ? 'weather' :
                      id === '7' ? 'scams' :
                      id === '8' ? 'money' :
                      id === '9' ? 'transportation' : 'health',
            urgency: id === '1' || id === '2' || id === '3' || id === '7' || id === '10' ? 'high' :
                     id === '4' || id === '8' ? 'low' : 'medium',
            description: 'Important safety information for travelers in Vietnam',
            fullDescription: `This essential travel advice is designed to help you stay safe and enjoy your trip to Vietnam. 
                            
                            ${id === '1' ? 
                            'Pickpocketing and bag snatching can occur in crowded tourist areas, especially in major cities like Ho Chi Minh City and Hanoi. Thieves often work in pairs or small groups, with one person creating a distraction while another takes valuables. Bag snatching from motorbikes is also common in urban areas, where thieves can grab bags, cameras, or phones as they ride past pedestrians.' : 
                            id === '2' ? 
                            'The tap water in Vietnam is generally not safe to drink. Even locals typically boil water before consumption or purchase bottled water. Waterborne illnesses can cause severe digestive issues that may require medical attention and can significantly disrupt your travel plans. Ice in restaurants and hotels in major tourist areas is usually made from purified water, but it\'s still advisable to ask or exercise caution in less established places.' :
                            id === '3' ? 
                            'Vietnamese traffic can be overwhelming for visitors as it often appears chaotic with seemingly few rules being followed. Motorbikes dominate the roads and often create a continuous flow that can be intimidating to cross through. Traffic accidents are the leading cause of injury to travelers in Vietnam, whether as pedestrians, motorcycle drivers, or passengers in vehicles.' :
                            'All travelers should be aware of this important safety information to ensure a trouble-free trip. Being prepared and informed will help you avoid common problems and know what to do if issues arise. This advice is based on common tourist experiences and official travel recommendations.'}
                            
                            Taking appropriate precautions will help ensure your visit is memorable for the right reasons. If you encounter problems, contact local authorities or your country's embassy or consulate for assistance.`,
            dos: [
              id === '1' ? 'Use money belts or hidden pouches for passports and cash' :
              id === '2' ? 'Drink bottled water with intact seals' :
              id === '3' ? 'Cross roads slowly and steadily with a predictable pace' :
              id === '4' ? 'Dress modestly covering shoulders and knees at temples' :
              id === '5' ? 'Choose busy food stalls with high customer turnover' :
              'Take appropriate safety measures',

              id === '1' ? 'Keep bags closed and in front of you in crowded areas' :
              id === '2' ? 'Brush teeth with bottled water in most areas' :
              id === '3' ? 'Make eye contact with drivers when crossing' :
              id === '4' ? 'Remove shoes before entering temple buildings' :
              id === '5' ? 'Eat at places where food is cooked fresh in front of you' :
              'Be aware of your surroundings',

              id === '1' ? 'Leave valuables in hotel safes when possible' :
              id === '2' ? 'Check that ice is made from purified water' :
              id === '3' ? 'Use licensed taxis or ride-sharing services' :
              id === '4' ? 'Ask permission before photographing monks' :
              id === '5' ? 'Carry basic medications for stomach issues' :
              'Research local customs and regulations',

              id === '1' ? 'Be extra vigilant in markets and on public transport' :
              id === '2' ? 'Use hand sanitizer frequently' :
              id === '3' ? 'Wear a helmet when riding motorbikes or bicycles' :
              id === '4' ? 'Speak quietly and behave respectfully' :
              id === '5' ? 'Peel fruits yourself rather than buying pre-cut pieces' :
              'Plan ahead and make smart decisions',
            ],
            donts: [
              id === '1' ? 'Don\'t keep all valuables in one place' :
              id === '2' ? 'Don\'t drink tap water or use it for brushing teeth' :
              id === '3' ? 'Don\'t expect vehicles to stop for pedestrians' :
              id === '4' ? 'Don\'t touch or point feet at Buddha images' :
              id === '5' ? 'Don\'t eat raw vegetables that may be washed in tap water' :
              'Don\'t ignore local advice or warnings',

              id === '1' ? 'Don\'t flash expensive jewelry or electronics' :
              id === '2' ? 'Don\'t use ice in drinks if unsure of its source' :
              id === '3' ? 'Don\'t rent motorbikes without proper experience' :
              id === '4' ? 'Don\'t take photos where prohibited by signs' :
              id === '5' ? 'Don\'t eat at empty food stalls with pre-cooked food sitting out' :
              'Don\'t take unnecessary risks',

              id === '1' ? 'Don\'t leave bags hanging on chairs in restaurants' :
              id === '2' ? 'Don\'t eat raw or undercooked foods if you have a sensitive stomach' :
              id === '3' ? 'Don\'t drive after consuming alcohol' :
              id === '4' ? 'Don\'t wear revealing clothing in religious sites' :
              id === '5' ? 'Don\'t drink unpasteurized milk or dairy products' :
              'Don\'t disrespect local customs',
            ],
            relatedTips: [
              {
                id: (Number(id) % 10 + 1).toString(),
                title: 'Monsoon Season Precautions',
                category: 'weather'
              },
              {
                id: (Number(id) % 10 + 2).toString(),
                title: 'Street Food Safety',
                category: 'food'
              },
              {
                id: (Number(id) % 10 + 3).toString(),
                title: 'Common Tourist Scams',
                category: 'scams'
              }
            ],
            resources: [
              {
                title: 'Embassy Contact Information',
                url: 'https://example.com/embassy'
              },
              {
                title: 'Travel Insurance Guide',
                url: 'https://example.com/insurance'
              },
              {
                title: 'Emergency Numbers',
                url: 'https://example.com/emergency'
              }
            ],
            lastUpdated: '2023-11-15'
          };

          setTipItem(mockDetail);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error fetching tip details');
        console.error('Error fetching tip details:', err);
        setLoading(false);
      }
    };

    if (id) {
      fetchTipDetail();
    }
  }, [id]);

  const printTip = () => {
    window.print();
  };

  const shareTip = () => {
    if (navigator.share) {
      navigator.share({
        title: tipItem?.title || 'Travel Tip',
        text: tipItem?.description || 'Important travel information',
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return <FaShieldAlt className="text-2xl text-red-500" />;
      case 'health':
        return <MdHealthAndSafety className="text-2xl text-green-500" />;
      case 'cultural':
        return <FaUserFriends className="text-2xl text-purple-500" />;
      case 'transportation':
        return <FaSuitcase className="text-2xl text-blue-500" />;
      case 'food':
        return <FaUtensils className="text-2xl text-amber-500" />;
      case 'weather':
        return <FaWater className="text-2xl text-teal-500" />;
      case 'scams':
        return <MdWarning className="text-2xl text-orange-500" />;
      case 'money':
        return <FaMoneyBillWave className="text-2xl text-emerald-500" />;
      default:
        return <BsInfoCircle className="text-2xl text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'from-red-500 to-red-700';
      case 'medium':
        return 'from-yellow-500 to-amber-600';
      case 'low':
        return 'from-green-500 to-green-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-yellow-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !tipItem) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaExclamationTriangle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Tip information not found'}
          </h1>
          <p className="mb-6 text-gray-600">
            The requested travel tip or warning could not be found.
          </p>
          <Link
            to="/tips-warnings"
            className="inline-flex items-center rounded-lg bg-yellow-600 px-5 py-2 text-center text-white hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300"
          >
            <FaArrowLeft className="mr-2" /> Back to Tips & Warnings
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8 md:px-6 print:py-2">
        {/* Back button - hide on print */}
        <div className="mb-6 print:hidden">
          <Link
            to="/tips-warnings"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
          >
            <FaArrowLeft className="mr-2" /> Back to all tips & warnings
          </Link>
        </div>

        {/* Header */}
        <div className={`relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r ${getUrgencyColor(tipItem.urgency)} p-6 text-white print:bg-white print:p-2 print:text-black md:p-10`}>
          <div className="absolute left-0 top-0 h-full w-1/4 bg-white/10 transform -skew-x-12 print:hidden"></div>

          <div className="relative flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur-sm print:hidden md:h-20 md:w-20">
              {getCategoryIcon(tipItem.category)}
            </div>
            <div className="text-center md:text-left">
              <span className="inline-block rounded px-2.5 py-0.5 text-xs font-medium uppercase text-white print:text-gray-600">
                {tipItem.category}
              </span>
              <h1 className="mb-2 text-2xl font-bold md:text-4xl">{tipItem.title}</h1>
              <p className="text-lg text-white/90 print:text-gray-700">{tipItem.description}</p>

              <div className="mt-3 print:hidden">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  tipItem.urgency === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : tipItem.urgency === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {tipItem.urgency === 'high'
                    ? 'High Importance'
                    : tipItem.urgency === 'medium'
                    ? 'Medium Importance'
                    : 'Good to Know'}
                </span>
                <span className="ml-4 text-sm text-white/80">Last updated: {tipItem.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-4 print:hidden">
          <button
            onClick={shareTip}
            className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-800 shadow-md hover:bg-gray-50"
          >
            <FaShareAlt className="mr-2" />
            Share
          </button>
          <button
            onClick={printTip}
            className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-800 shadow-md hover:bg-gray-50"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>

        {/* Content */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold">About this Tip</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-gray-700">{tipItem.fullDescription}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Dos */}
              <div className="rounded-lg bg-green-50 p-6 shadow-md">
                <h2 className="mb-4 flex items-center text-xl font-bold text-green-800">
                  <FaCheck className="mr-2 text-green-600" />
                  Do's
                </h2>
                <ul className="space-y-3">
                  {tipItem.dos.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-200 text-xs text-green-800">
                        ✓
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="rounded-lg bg-red-50 p-6 shadow-md">
                <h2 className="mb-4 flex items-center text-xl font-bold text-red-800">
                  <FaTimes className="mr-2 text-red-600" />
                  Don'ts
                </h2>
                <ul className="space-y-3">
                  {tipItem.donts.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-200 text-xs text-red-800">
                        ✕
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Related Tips */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Related Tips</h2>
              <div className="space-y-4">
                {tipItem.relatedTips.map((relatedTip, index) => (
                  <Link
                    key={index}
                    to={`/tips-warnings/${relatedTip.id}`}
                    className="flex items-start rounded-lg border border-gray-100 p-3 transition-colors hover:bg-yellow-50"
                  >
                    <span className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      relatedTip.category === 'safety' ? 'bg-red-100 text-red-500' :
                      relatedTip.category === 'health' ? 'bg-green-100 text-green-500' :
                      relatedTip.category === 'cultural' ? 'bg-purple-100 text-purple-500' :
                      relatedTip.category === 'transportation' ? 'bg-blue-100 text-blue-500' :
                      relatedTip.category === 'food' ? 'bg-amber-100 text-amber-500' :
                      relatedTip.category === 'weather' ? 'bg-teal-100 text-teal-500' :
                      relatedTip.category === 'scams' ? 'bg-orange-100 text-orange-500' :
                      'bg-emerald-100 text-emerald-500'
                    }`}>
                      {relatedTip.category === 'safety' ? <FaShieldAlt /> :
                       relatedTip.category === 'health' ? <MdHealthAndSafety /> :
                       relatedTip.category === 'cultural' ? <FaUserFriends /> :
                       relatedTip.category === 'transportation' ? <FaSuitcase /> :
                       relatedTip.category === 'food' ? <FaUtensils /> :
                       relatedTip.category === 'weather' ? <FaWater /> :
                       relatedTip.category === 'scams' ? <MdWarning /> :
                       <FaMoneyBillWave />}
                    </span>
                    <div>
                      <h3 className="font-medium">{relatedTip.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{relatedTip.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-lg bg-white p-6 shadow-md print:break-inside-avoid">
              <h2 className="mb-4 text-xl font-semibold">Helpful Resources</h2>
              <ul className="space-y-3">
                {tipItem.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-yellow-600 hover:text-yellow-700 hover:underline"
                    >
                      <FaRegLightbulb className="mr-2" />
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency info */}
            <div className="rounded-lg bg-red-50 p-6 shadow-md print:break-inside-avoid">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-red-800">
                <MdLocalPolice className="mr-2 text-red-600" />
                Emergency Contacts
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-red-600">•</span>
                  <span><strong>Police:</strong> 113</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-red-600">•</span>
                  <span><strong>Ambulance:</strong> 115</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-red-600">•</span>
                  <span><strong>Fire:</strong> 114</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-red-600">•</span>
                  <span><strong>Tourist Police:</strong> +84 (0)8 3829 7187</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Print footer */}
        <div className="hidden print:block print:mt-8 print:border-t print:pt-4 print:text-center print:text-sm print:text-gray-500">
          Printed from William Travel Guide | {window.location.href} | Last updated: {tipItem.lastUpdated}
        </div>
      </div>
    </SimpleLayout>
  );
};

export default TipsWarningsDetailPage;
