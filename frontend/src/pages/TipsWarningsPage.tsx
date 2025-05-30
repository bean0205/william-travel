import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSearch,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaSuitcase,
  FaUtensils,
  FaWater,
  FaMoneyBillWave,
  FaUserFriends,
  FaRegLightbulb,
} from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalPolice, MdWarning, MdCategory } from 'react-icons/md';

interface TipsWarningItem {
  id: string;
  title: string;
  category: 'safety' | 'health' | 'cultural' | 'money' | 'transportation' | 'food' | 'weather' | 'scams';
  urgency: 'high' | 'medium' | 'low';
  description: string;
  shortDescription: string;
  icon: string;
  important: boolean;
}

const TipsWarningsPage = () => {
  const { t } = useTranslation(['common']);
  const [tipsItems, setTipsItems] = useState<TipsWarningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: 'all',
    urgency: 'all',
    searchQuery: '',
    importantOnly: false
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTipsWarnings = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with timeout
        setTimeout(() => {
          const mockData: TipsWarningItem[] = [
            {
              id: '1',
              title: 'Pickpocketing in Tourist Areas',
              category: 'safety',
              urgency: 'high',
              description: 'Be vigilant in crowded tourist areas as pickpocketing is common. Keep your belongings secure, especially in markets, public transportation, and popular attractions. Consider using a money belt or hidden pouch for important items like passports and large amounts of cash.',
              shortDescription: 'Keep belongings secure in crowded areas and tourist spots.',
              icon: 'shield',
              important: true
            },
            {
              id: '2',
              title: 'Drinking Water Safety',
              category: 'health',
              urgency: 'high',
              description: 'Tap water is not safe to drink in most areas. Always drink bottled water with sealed caps or boiled water. Be cautious with ice in drinks, as it may be made from untreated water. Many hotels provide complimentary bottled water for brushing teeth and drinking.',
              shortDescription: 'Only drink bottled or boiled water; avoid tap water.',
              icon: 'water',
              important: true
            },
            {
              id: '3',
              title: 'Traffic and Road Safety',
              category: 'transportation',
              urgency: 'high',
              description: 'Traffic can be chaotic with seemingly few rules followed. Be extremely careful when crossing streets – walk slowly and steadily so drivers can anticipate your movement. When riding motorbikes, always wear a helmet and avoid driving at night if possible.',
              shortDescription: 'Exercise extreme caution when crossing streets and in traffic.',
              icon: 'transportation',
              important: true
            },
            {
              id: '4',
              title: 'Temple and Pagoda Etiquette',
              category: 'cultural',
              urgency: 'medium',
              description: 'Dress modestly when visiting temples and pagodas by covering shoulders and knees. Remove shoes before entering temple buildings. Avoid pointing feet at Buddha images as this is considered disrespectful. Ask permission before taking photos of monks or inside temple sanctuaries.',
              shortDescription: 'Show respect at religious sites with appropriate dress and behavior.',
              icon: 'cultural',
              important: false
            },
            {
              id: '5',
              title: 'Street Food Safety',
              category: 'food',
              urgency: 'medium',
              description: 'While street food is delicious, choose stalls with high turnover and where food is cooked fresh in front of you. Avoid raw vegetables and peeled fruits that may have been washed in tap water. Carry anti-diarrheal medication as a precaution against food-related illness.',
              shortDescription: 'Select busy food stalls with freshly cooked items.',
              icon: 'food',
              important: true
            },
            {
              id: '6',
              title: 'Monsoon Season Precautions',
              category: 'weather',
              urgency: 'medium',
              description: 'During monsoon season (May to October), sudden heavy rainfalls can cause flash flooding in urban areas. Bring waterproof bags for electronics, a lightweight raincoat, and water-resistant footwear. Check weather forecasts daily and plan indoor activities during heavy rain periods.',
              shortDescription: 'Be prepared for heavy rainfall and potential flooding in wet season.',
              icon: 'weather',
              important: false
            },
            {
              id: '7',
              title: 'Common Tourist Scams',
              category: 'scams',
              urgency: 'high',
              description: 'Be aware of common scams like taxi meters that run too fast, incorrect change given, "closed" attractions where touts offer to take you somewhere else, and fake tour agencies. Always agree on prices before services, use reputable companies, and research standard costs beforehand.',
              shortDescription: 'Research common scams and agree on prices before services.',
              icon: 'scams',
              important: true
            },
            {
              id: '8',
              title: 'Currency Exchange Tips',
              category: 'money',
              urgency: 'low',
              description: 'Exchange currency at official banks or authorized money changers to get fair rates and avoid counterfeit bills. Be cautious of exceptionally favorable exchange rates as they may indicate a scam. Count your money carefully before leaving and keep exchange receipts.',
              shortDescription: 'Use official banks and authorized money changers for currency exchange.',
              icon: 'money',
              important: false
            },
            {
              id: '9',
              title: 'Motorbike Rental Precautions',
              category: 'transportation',
              urgency: 'medium',
              description: 'Before renting a motorbike, check it thoroughly for existing damage and take photos as evidence. Ensure your travel insurance covers motorbike accidents, as many policies exclude them. Always wear a helmet, and be aware that international driving permits are technically required.',
              shortDescription: 'Inspect rental bikes thoroughly and ensure proper insurance coverage.',
              icon: 'transportation',
              important: true
            },
            {
              id: '10',
              title: 'Insect-Borne Disease Prevention',
              category: 'health',
              urgency: 'medium',
              description: 'Protect against mosquito-borne diseases by using insect repellent containing DEET, wearing long clothing at dawn and dusk, and sleeping under mosquito nets when in rural areas. Consider antimalarial medication if traveling to high-risk regions as advised by a travel doctor.',
              shortDescription: 'Use insect repellent and protective clothing to prevent mosquito bites.',
              icon: 'health',
              important: true
            },
          ];

          setTipsItems(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tips and warnings data:', error);
        setIsLoading(false);
      }
    };

    fetchTipsWarnings();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety':
        return <FaShieldAlt className="text-red-500" />;
      case 'health':
        return <MdHealthAndSafety className="text-green-500" />;
      case 'cultural':
        return <FaUserFriends className="text-purple-500" />;
      case 'transportation':
        return <FaSuitcase className="text-blue-500" />;
      case 'food':
        return <FaUtensils className="text-amber-500" />;
      case 'weather':
        return <FaWater className="text-teal-500" />;
      case 'scams':
        return <MdWarning className="text-orange-500" />;
      case 'money':
        return <FaMoneyBillWave className="text-emerald-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">High Importance</span>;
      case 'medium':
        return <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Medium Importance</span>;
      case 'low':
        return <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Good to Know</span>;
      default:
        return null;
    }
  };

  const filteredItems = tipsItems.filter((item) => {
    const matchesCategory = filter.category === 'all' || item.category === filter.category;
    const matchesUrgency = filter.urgency === 'all' || item.urgency === filter.urgency;
    const matchesSearch =
      item.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filter.searchQuery.toLowerCase());
    const matchesImportant = !filter.importantOnly || item.important;

    return matchesCategory && matchesUrgency && matchesSearch && matchesImportant;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white md:p-10">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-4xl backdrop-blur-sm">
            <FaExclamationTriangle />
          </div>
          <div className="text-center md:text-left">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Travel Tips & Warnings</h1>
            <p className="text-lg text-yellow-100">Essential information to keep you safe and help you enjoy your trip</p>
          </div>
        </div>
      </div>

      {/* Important Alerts */}
      <div className="mb-8 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-800 shadow-md">
        <div className="flex items-center">
          <div className="mr-3 flex-shrink-0 text-2xl text-red-500">
            <MdWarning />
          </div>
          <div>
            <h2 className="font-semibold">Health & Safety Alerts</h2>
            <p className="text-sm">Always check for the latest travel advisories before and during your trip</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow-md md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tips & warnings..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-yellow-500 focus:outline-none"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              <option value="safety">Safety</option>
              <option value="health">Health</option>
              <option value="cultural">Cultural</option>
              <option value="transportation">Transportation</option>
              <option value="food">Food</option>
              <option value="weather">Weather</option>
              <option value="scams">Scams</option>
              <option value="money">Money</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Importance Level</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none"
              value={filter.urgency}
              onChange={(e) => setFilter(prev => ({ ...prev, urgency: e.target.value }))}
            >
              <option value="all">All Levels</option>
              <option value="high">High Importance</option>
              <option value="medium">Medium Importance</option>
              <option value="low">Good to Know</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                checked={filter.importantOnly}
                onChange={(e) => setFilter(prev => ({ ...prev, importantOnly: e.target.checked }))}
              />
              <span className="ml-2 text-gray-700">Essential tips only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tips and Warnings Items */}
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/tips-warnings/${item.id}`}
                key={item.id}
                className="block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex flex-col md:flex-row ${item.urgency === 'high' ? 'border-l-4 border-red-500' : item.urgency === 'medium' ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}>
                  <div className="flex-shrink-0 bg-gray-50 p-6 md:w-20 md:py-6">
                    <div className="flex h-full items-center justify-center text-2xl">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div>
                        {getUrgencyBadge(item.urgency)}
                      </div>
                    </div>
                    <p className="text-gray-600">{item.shortDescription}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-800">
                        {item.category}
                      </span>
                      <span className="text-sm font-medium text-yellow-600">Read more →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-lg bg-white py-16 text-center shadow">
              <FaRegLightbulb className="mx-auto mb-4 text-4xl text-gray-400" />
              <h3 className="text-xl font-medium">No tips or warnings found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TipsWarningsPage;
