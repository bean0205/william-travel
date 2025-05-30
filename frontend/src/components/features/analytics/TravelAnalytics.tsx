import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  CalendarRange,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data for charts
const monthlyVisitorsData = [
  { name: 'T1', visitors: 12500, domestic: 9800, foreign: 2700 },
  { name: 'T2', visitors: 11000, domestic: 8500, foreign: 2500 },
  { name: 'T3', visitors: 14500, domestic: 11200, foreign: 3300 },
  { name: 'T4', visitors: 17800, domestic: 13500, foreign: 4300 },
  { name: 'T5', visitors: 22500, domestic: 16800, foreign: 5700 },
  { name: 'T6', visitors: 25800, domestic: 18900, foreign: 6900 },
  { name: 'T7', visitors: 32000, domestic: 23000, foreign: 9000 },
  { name: 'T8', visitors: 35500, domestic: 25500, foreign: 10000 },
  { name: 'T9', visitors: 29800, domestic: 22000, foreign: 7800 },
  { name: 'T10', visitors: 23500, domestic: 17800, foreign: 5700 },
  { name: 'T11', visitors: 18900, domestic: 14500, foreign: 4400 },
  { name: 'T12', visitors: 21500, domestic: 16300, foreign: 5200 },
];

const destinationPopularityData = [
  { name: 'Hạ Long', value: 23 },
  { name: 'Đà Nẵng', value: 18 },
  { name: 'Phú Quốc', value: 15 },
  { name: 'Hà Nội', value: 12 },
  { name: 'Hồ Chí Minh', value: 10 },
  { name: 'Nha Trang', value: 8 },
  { name: 'Đà Lạt', value: 7 },
  { name: 'Khác', value: 7 },
];

const accommodationPriceData = [
  { month: 'T1', resort: 2500000, hotel: 1200000, homestay: 800000 },
  { month: 'T2', resort: 2350000, hotel: 1150000, homestay: 780000 },
  { month: 'T3', resort: 2300000, hotel: 1100000, homestay: 750000 },
  { month: 'T4', resort: 2200000, hotel: 1050000, homestay: 720000 },
  { month: 'T5', resort: 2150000, hotel: 1050000, homestay: 700000 },
  { month: 'T6', resort: 2300000, hotel: 1100000, homestay: 750000 },
  { month: 'T7', resort: 2800000, hotel: 1350000, homestay: 950000 },
  { month: 'T8', resort: 3000000, hotel: 1450000, homestay: 1050000 },
  { month: 'T9', resort: 2600000, hotel: 1250000, homestay: 850000 },
  { month: 'T10', resort: 2400000, hotel: 1150000, homestay: 780000 },
  { month: 'T11', resort: 2350000, hotel: 1120000, homestay: 760000 },
  { month: 'T12', resort: 2900000, hotel: 1400000, homestay: 990000 },
];

const transportationData = [
  { name: 'Máy bay', value: 45 },
  { name: 'Ô tô/Xe khách', value: 28 },
  { name: 'Xe máy', value: 15 },
  { name: 'Tàu hỏa', value: 7 },
  { name: 'Khác', value: 5 },
];

const peakSeasonData = [
  { month: 'T1', score: 65 },
  { month: 'T2', score: 60 },
  { month: 'T3', score: 70 },
  { month: 'T4', score: 80 },
  { month: 'T5', score: 90 },
  { month: 'T6', score: 95 },
  { month: 'T7', score: 100 },
  { month: 'T8', score: 98 },
  { month: 'T9', score: 85 },
  { month: 'T10', score: 75 },
  { month: 'T11', score: 65 },
  { month: 'T12', score: 85 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const TravelAnalytics = () => {
  const { t } = useTranslation(['common', 'analytics']);
  const [timeRange, setTimeRange] = useState('year');
  const [year, setYear] = useState('2025');

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t('analytics.tourismTrends')}</h1>
          <p className="text-muted-foreground">{t('analytics.dataInsightsDescription')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('timeRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">{t('lastMonth')}</SelectItem>
              <SelectItem value="quarter">{t('lastQuarter')}</SelectItem>
              <SelectItem value="year">{t('lastYear')}</SelectItem>
              <SelectItem value="all">{t('allTime')}</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={t('year')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.totalVisitors')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">265,400</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span> {t('vs')} {t('lastYear')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.averageSpend')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,680,000₫</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8.2%</span> {t('vs')} {t('lastYear')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.topDestination')}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hạ Long</div>
            <p className="text-xs text-muted-foreground">
              23% {t('analytics.ofAllBookings')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('analytics.peakSeason')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">T6 - T8</div>
            <p className="text-xs text-muted-foreground">
              +45% {t('analytics.higherOccupancy')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitors" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="visitors">{t('analytics.visitors')}</TabsTrigger>
          <TabsTrigger value="destinations">{t('analytics.popularDestinations')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('analytics.pricingTrends')}</TabsTrigger>
          <TabsTrigger value="transportation">{t('analytics.transportation')}</TabsTrigger>
          <TabsTrigger value="seasonality">{t('analytics.seasonality')}</TabsTrigger>
        </TabsList>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.monthlyVisitorTrends')}</CardTitle>
              <CardDescription>{t('analytics.visitorBreakdown')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyVisitorsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => new Intl.NumberFormat('vi-VN').format(value)}
                      labelFormatter={(label) => `Tháng ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="domestic" name={t('analytics.domesticVisitors')} stackId="a" fill="#8884d8" />
                    <Bar dataKey="foreign" name={t('analytics.foreignVisitors')} stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">{t('analytics.yearlyTotal')}: <span className="font-bold">265,400</span></div>
                <div className="text-sm text-muted-foreground">{t('analytics.domesticForeignRatio')}: 75% / 25%</div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{t('analytics.downloadData')}</Badge>
                <Badge variant="outline">{t('analytics.fullReport')}</Badge>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.visitorDemographics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{t('analytics.ageGroup')}: 25-34</span>
                      <span>38%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '38%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{t('analytics.ageGroup')}: 35-44</span>
                      <span>27%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '27%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{t('analytics.ageGroup')}: 18-24</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{t('analytics.ageGroup')}: 45-54</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{t('analytics.ageGroup')}: 55+</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '5%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.topSourceMarkets')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Hà Nội</span>
                    </div>
                    <span className="font-medium">23.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                      <span>TP. Hồ Chí Minh</span>
                    </div>
                    <span className="font-medium">18.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#82ca9d] rounded-full"></div>
                      <span>Trung Quốc</span>
                    </div>
                    <span className="font-medium">11.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#ffc658] rounded-full"></div>
                      <span>Hàn Quốc</span>
                    </div>
                    <span className="font-medium">9.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#ff8042] rounded-full"></div>
                      <span>Nhật Bản</span>
                    </div>
                    <span className="font-medium">7.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#0088FE] rounded-full"></div>
                      <span>Mỹ</span>
                    </div>
                    <span className="font-medium">5.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Destinations Tab */}
        <TabsContent value="destinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.mostPopularDestinations')}</CardTitle>
              <CardDescription>{t('analytics.basedonBookings')}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[350px] w-full md:w-[70%]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={destinationPopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {destinationPopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Badge variant="outline">Vịnh Hạ Long</Badge>
              <Badge variant="outline">Phố cổ Hội An</Badge>
              <Badge variant="outline">Bãi biển Phú Quốc</Badge>
              <Badge variant="outline">Phố cổ Hà Nội</Badge>
              <Badge variant="outline">Địa đạo Củ Chi</Badge>
              <Badge variant="outline">Vịnh Nha Trang</Badge>
              <Badge variant="outline">Đà Lạt</Badge>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.topRatedDestinations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">1</span>
                      <span>Phố cổ Hội An</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">4.9</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">2</span>
                      <span>Vịnh Hạ Long</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">4.8</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">3</span>
                      <span>Hang Sơn Đoòng</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">4.8</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">4</span>
                      <span>Sapa</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">4.7</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= 4.7 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">5</span>
                      <span>Phong Nha - Kẻ Bàng</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">4.7</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= 4.7 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.emergingDestinations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>Quy Nhơn</div>
                    <Badge className="bg-green-500">+65%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Hà Giang</div>
                    <Badge className="bg-green-500">+52%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Mộc Châu</div>
                    <Badge className="bg-green-500">+48%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Côn Đảo</div>
                    <Badge className="bg-green-500">+43%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Tây Ninh</div>
                    <Badge className="bg-green-500">+38%</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {t('analytics.growthBasedOnYearlySearch')}
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Trends Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.accommodationPricingTrends')}</CardTitle>
              <CardDescription>{t('analytics.averagePricesPerNight')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={accommodationPriceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="resort" name="Resort" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="hotel" name="Khách sạn" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="homestay" name="Homestay" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                {t('analytics.priceIncreaseNotice')}
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.bestValueDestinations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">1</span>
                      <span>Ninh Bình</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">800,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">2</span>
                      <span>Huế</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">850,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">3</span>
                      <span>Tây Nguyên</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">900,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">4</span>
                      <span>Cần Thơ</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">950,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">5</span>
                      <span>Hải Phòng</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">980,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.mostExpensiveDestinations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">1</span>
                      <span>Phú Quốc</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">3,250,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">2</span>
                      <span>Nha Trang</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">2,800,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">3</span>
                      <span>Đà Nẵng</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">2,500,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">4</span>
                      <span>Hồ Chí Minh</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">2,300,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="font-medium">5</span>
                      <span>Đà Lạt</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">2,100,000₫</span>
                      <span className="text-sm text-muted-foreground ml-2">/đêm</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transportation Tab */}
        <TabsContent value="transportation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.transportationMethods')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transportationData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {transportationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.airTravelTrends')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('analytics.busiesAirRoutes')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>Hà Nội - Hồ Chí Minh</div>
                      <Badge>1.2M {t('analytics.passengers')}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Hà Nội - Đà Nẵng</div>
                      <Badge>850K {t('analytics.passengers')}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Hồ Chí Minh - Phú Quốc</div>
                      <Badge>720K {t('analytics.passengers')}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Hồ Chí Minh - Nha Trang</div>
                      <Badge>650K {t('analytics.passengers')}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Hà Nội - Nha Trang</div>
                      <Badge>580K {t('analytics.passengers')}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">{t('analytics.averageAirfares')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Nội địa</div>
                      <div className="font-medium">1,850,000₫</div>
                      <div className="text-xs text-red-500">+12% {t('vs')} 2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Quốc tế</div>
                      <div className="font-medium">8,500,000₫</div>
                      <div className="text-xs text-red-500">+8% {t('vs')} 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.transportationInsights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">{t('analytics.cheapestTravelMonths')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.cheapestMonthsDesc')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Tháng 2</Badge>
                    <Badge variant="outline">Tháng 3</Badge>
                    <Badge variant="outline">Tháng 9</Badge>
                    <Badge variant="outline">Tháng 10</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">{t('analytics.highwayDevelopment')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.highwayDevelopmentDesc')}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('analytics.completed')}</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">{t('analytics.sustainableTransport')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.sustainableTransportDesc')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-green-500">+23% {t('analytics.bikeRentals')}</Badge>
                    <Badge className="bg-green-500">+18% {t('analytics.electricVehicles')}</Badge>
                    <Badge className="bg-green-500">+15% {t('analytics.publicTransport')}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonality Tab */}
        <TabsContent value="seasonality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.travelSeasonality')}</CardTitle>
              <CardDescription>{t('analytics.peakVsOffPeakTrends')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={peakSeasonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      name={t('analytics.occupancyRate')}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <span className="font-medium">{t('analytics.peakSeason')}:</span> {t('analytics.junToAugust')}
              </div>
              <div>
                <span className="font-medium">{t('analytics.shoulderSeason')}:</span> {t('analytics.aprMayAndSepOct')}
              </div>
              <div>
                <span className="font-medium">{t('analytics.offSeason')}:</span> {t('analytics.novToMarch')}
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.weatherPatterns')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('analytics.bestTimeToVisit')}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>Hạ Long Bay</div>
                      <div className="text-sm">T3-T5, T10-T11</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Đà Nẵng</div>
                      <div className="text-sm">T2-T4, T9-T10</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Phú Quốc</div>
                      <div className="text-sm">T11-T3</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Đà Lạt</div>
                      <div className="text-sm">T12-T3</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Hà Nội</div>
                      <div className="text-sm">T10-T11, T3-T4</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('analytics.rainySeasons')}</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <div>{t('analytics.north')}</div>
                      <div>T5-T9</div>
                    </div>
                    <div className="flex justify-between">
                      <div>{t('analytics.central')}</div>
                      <div>T10-T12</div>
                    </div>
                    <div className="flex justify-between">
                      <div>{t('analytics.south')}</div>
                      <div>T5-T10</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.priceFluctuation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('analytics.averagePriceDifference')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>{t('analytics.highVsLowSeason')}</div>
                      <Badge className="bg-amber-500">+65%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{t('analytics.weekendVsWeekday')}</div>
                      <Badge className="bg-amber-500">+35%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{t('analytics.holidaysVsRegular')}</div>
                      <Badge className="bg-amber-500">+85%</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t('analytics.bestBookingWindows')}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{t('analytics.flights')}</span>
                        <span>{t('analytics.daysInAdvance', { days: '45-60' })}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{t('analytics.hotels')}</span>
                        <span>{t('analytics.daysInAdvance', { days: '30-45' })}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{t('analytics.tourPackages')}</span>
                        <span>{t('analytics.daysInAdvance', { days: '60-90' })}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
