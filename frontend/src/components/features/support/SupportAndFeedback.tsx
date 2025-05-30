import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import APP_ROUTES from '@/routes/routes';
import {
  MessageSquare,
  HelpCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  LifeBuoy,
  Phone,
  Mail,
  Info,
  Flag,
  Check,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';

// Enum for issue types
enum IssueType {
  TECHNICAL = 'technical',
  ACCOUNT = 'account',
  PAYMENT = 'payment',
  BOOKING = 'booking',
  FEEDBACK = 'feedback',
  OTHER = 'other',
}

// Enum for issue priority
enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Interface for FAQ item
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular?: boolean;
}

// Interface for a support ticket
interface SupportTicket {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: 'open' | 'inProgress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  responses?: Array<{
    id: string;
    message: string;
    fromSupport: boolean;
    timestamp: Date;
  }>;
}

// Mock data for FAQs
const mockFAQs: FAQItem[] = [
  {
    id: 'faq1',
    question: 'Làm thế nào để đặt phòng khách sạn?',
    answer: 'Để đặt phòng khách sạn, bạn có thể tìm kiếm khách sạn mong muốn trong mục "Khách sạn", chọn ngày check-in và check-out, số lượng phòng và người, sau đó nhấn "Đặt ngay". Hệ thống sẽ hướng dẫn bạn hoàn tất quá trình thanh toán.',
    category: 'booking',
    isPopular: true,
  },
  {
    id: 'faq2',
    question: 'Làm thế nào để hủy đặt phòng hoặc vé tour?',
    answer: 'Để hủy đặt phòng hoặc vé tour, vui lòng đăng nhập vào tài khoản của bạn, truy cập mục "Đặt chỗ của tôi" và chọn đặt chỗ bạn muốn hủy. Nhấn vào nút "Hủy đặt chỗ" và làm theo hướng dẫn. Lưu ý rằng chính sách hoàn tiền sẽ phụ thuộc vào từng khách sạn hoặc tour.',
    category: 'booking',
    isPopular: true,
  },
  {
    id: 'faq3',
    question: 'Làm thế nào để thay đổi thông tin cá nhân của tôi?',
    answer: 'Để thay đổi thông tin cá nhân, vui lòng đăng nhập vào tài khoản của bạn, nhấp vào biểu tượng hồ sơ ở góc trên bên phải và chọn "Hồ sơ của tôi". Tại đây, bạn có thể cập nhật thông tin cá nhân, thay đổi mật khẩu hoặc cập nhật thông tin thanh toán.',
    category: 'account',
  },
  {
    id: 'faq4',
    question: 'Các phương thức thanh toán nào được chấp nhận?',
    answer: 'Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau bao gồm thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB), ví điện tử (MoMo, ZaloPay, VNPay), chuyển khoản ngân hàng và thanh toán khi nhận phòng (đối với một số khách sạn).',
    category: 'payment',
    isPopular: true,
  },
  {
    id: 'faq5',
    question: 'Làm thế nào để tôi nhận được hóa đơn cho đặt phòng của mình?',
    answer: 'Hóa đơn điện tử sẽ được gửi tự động đến email bạn đã đăng ký sau khi thanh toán thành công. Nếu bạn cần hóa đơn VAT, vui lòng đánh dấu vào ô "Tôi cần hóa đơn VAT" trong quá trình đặt phòng và cung cấp thông tin công ty của bạn.',
    category: 'payment',
  },
  {
    id: 'faq6',
    question: 'Tôi có thể đặt tour du lịch riêng không?',
    answer: 'Có, chúng tôi cung cấp dịch vụ đặt tour du lịch riêng. Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua mục "Liên hệ" hoặc số hotline để được tư vấn và thiết kế tour phù hợp với nhu cầu của bạn.',
    category: 'booking',
  },
  {
    id: 'faq7',
    question: 'Làm sao để tôi tạo và chia sẻ lịch trình du lịch?',
    answer: 'Để tạo lịch trình du lịch, hãy đăng nhập và truy cập vào tính năng "Lập kế hoạch chuyến đi". Tại đây, bạn có thể thêm các địa điểm, hoạt động, khách sạn vào lịch trình của mình. Để chia sẻ, nhấn vào biểu tượng "Chia sẻ" và chọn phương thức chia sẻ (email, liên kết, mạng xã hội).',
    category: 'technical',
  },
  {
    id: 'faq8',
    question: 'Tôi không thể đăng nhập vào tài khoản của mình?',
    answer: 'Nếu bạn gặp vấn đề khi đăng nhập, vui lòng thử các giải pháp sau: Kiểm tra kết nối internet, đảm bảo rằng bạn nhập đúng email và mật khẩu, xóa cache trình duyệt, hoặc sử dụng tính năng "Quên mật khẩu" để đặt lại mật khẩu. Nếu vẫn không thể đăng nhập, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.',
    category: 'account',
  }
];

// Mock data for support tickets
const mockTickets: SupportTicket[] = [
  {
    id: 'ticket1',
    title: 'Không thể đặt phòng khách sạn',
    description: 'Tôi đang cố gắng đặt phòng tại khách sạn Vinpearl Resort Nha Trang nhưng hệ thống liên tục báo lỗi khi tôi nhấn nút thanh toán.',
    type: IssueType.TECHNICAL,
    priority: IssuePriority.HIGH,
    status: 'inProgress',
    createdAt: new Date('2025-05-18T10:30:00'),
    updatedAt: new Date('2025-05-18T14:45:00'),
    responses: [
      {
        id: 'resp1',
        message: 'Chào bạn, cảm ơn bạn đã báo cáo vấn đề này. Chúng tôi đang kiểm tra và sẽ phản hồi sớm.',
        fromSupport: true,
        timestamp: new Date('2025-05-18T11:15:00')
      },
      {
        id: 'resp2',
        message: 'Vui lòng cho chúng tôi biết bạn đang sử dụng trình duyệt nào và phiên bản nào?',
        fromSupport: true,
        timestamp: new Date('2025-05-18T11:20:00')
      },
      {
        id: 'resp3',
        message: 'Tôi đang dùng Chrome phiên bản mới nhất trên MacBook Pro.',
        fromSupport: false,
        timestamp: new Date('2025-05-18T12:05:00')
      }
    ]
  },
  {
    id: 'ticket2',
    title: 'Yêu cầu hoàn tiền cho tour đã hủy',
    description: 'Tôi đã hủy tour du lịch Hạ Long vào ngày 15/05/2025 nhưng vẫn chưa nhận được tiền hoàn lại sau 3 ngày làm việc như chính sách đã đề cập.',
    type: IssueType.PAYMENT,
    priority: IssuePriority.MEDIUM,
    status: 'open',
    createdAt: new Date('2025-05-19T09:15:00'),
    updatedAt: new Date('2025-05-19T09:15:00')
  }
];

export const SupportAndFeedback = () => {
  const { t } = useTranslation(['common', 'support']);
  const { user } = useAuthStore();
  const navigate = useNavigate(); // Add navigate hook
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>(mockFAQs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    type: IssueType.TECHNICAL,
    priority: IssuePriority.MEDIUM,
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<string>('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  // Handle search and filter for FAQs
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = mockFAQs;

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(lowercaseQuery) ||
        faq.answer.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    setFilteredFAQs(filtered);
  };

  // Handle ticket submission
  const handleSubmitTicket = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(null);
        setNewTicket({
          title: '',
          description: '',
          type: IssueType.TECHNICAL,
          priority: IssuePriority.MEDIUM,
        });
      }, 3000);
    }, 1500);
  };

  // Handle reply to ticket
  const handleReplyToTicket = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Add reply to the ticket
      const updatedTicket = {
        ...selectedTicket,
        responses: [
          ...(selectedTicket.responses || []),
          {
            id: `resp-${Date.now()}`,
            message: replyMessage,
            fromSupport: false,
            timestamp: new Date()
          }
        ]
      };

      setSelectedTicket(updatedTicket);
      setReplyMessage('');
    }, 1000);
  };

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(null);
        setFeedbackText('');
        setFeedbackType('suggestion');
      }, 3000);
    }, 1500);
  };

  // Get status badge for ticket
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Mới mở</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Đã đóng</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  // Get priority badge for ticket
  const getPriorityBadge = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Thấp</Badge>;
      case IssuePriority.MEDIUM:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Trung bình</Badge>;
      case IssuePriority.HIGH:
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Cao</Badge>;
      case IssuePriority.URGENT:
        return <Badge variant="outline" className="bg-red-500/10 text-red-500">Khẩn cấp</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('support.helpAndSupport')}</h1>
        <p className="text-muted-foreground">{t('support.helpDescription')}</p>
      </div>

      <Tabs
        defaultValue="faq"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="faq">
            <HelpCircle className="w-4 h-4 mr-2" />
            {t('support.faq')}
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="w-4 h-4 mr-2" />
            {t('support.contactUs')}
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('support.supportTickets')}
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Flag className="w-4 h-4 mr-2" />
            {t('support.feedback')}
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
              <div className="flex gap-2 mb-6">
                <div className="relative flex-grow">
                  <Input
                    placeholder={t('support.searchFAQs')}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                  <HelpCircle className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                </div>

                <Select value={selectedCategory || 'all'} onValueChange={(value) => {
                  setSelectedCategory(value === 'all' ? null : value);
                  handleSearch(searchQuery);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('support.allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('support.allCategories')}</SelectItem>
                    <SelectItem value="booking">{t('support.categories.booking')}</SelectItem>
                    <SelectItem value="payment">{t('support.categories.payment')}</SelectItem>
                    <SelectItem value="account">{t('support.categories.account')}</SelectItem>
                    <SelectItem value="technical">{t('support.categories.technical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredFAQs.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <div className="flex flex-col items-center gap-2">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">{t('support.noFAQsFound')}</h3>
                      <p className="text-muted-foreground">{t('support.tryDifferentSearch')}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-medium">
                            {faq.question}
                          </CardTitle>
                          {faq.isPopular && (
                            <Badge>{t('support.popular')}</Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="w-fit">
                          {t(`support.categories.${faq.category}`)}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
                        <div>{t('support.helpfulQuestion')}</div>
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 hover:text-primary">
                            <ThumbsUp className="w-4 h-4" /> {t('yes')}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <ThumbsDown className="w-4 h-4" /> {t('no')}
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="md:w-1/4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('support.popularTopics')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    className="text-left w-full hover:text-primary"
                    onClick={() => handleSearch('đặt phòng')}
                  >
                    {t('support.bookingQuestions')}
                  </button>
                  <button
                    className="text-left w-full hover:text-primary"
                    onClick={() => handleSearch('thanh toán')}
                  >
                    {t('support.paymentQuestions')}
                  </button>
                  <button
                    className="text-left w-full hover:text-primary"
                    onClick={() => handleSearch('hủy')}
                  >
                    {t('support.cancellationQuestions')}
                  </button>
                  <button
                    className="text-left w-full hover:text-primary"
                    onClick={() => handleSearch('tài khoản')}
                  >
                    {t('support.accountQuestions')}
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{t('support.needMoreHelp')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('support.cantFindAnswerDescription')}
                  </p>
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab('contact')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {t('support.contactSupport')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab('tickets')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t('support.createSupportTicket')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Contact Us Section */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.contactMethods')}</CardTitle>
              <CardDescription>
                {t('support.contactMethodsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{t('support.phoneSupport')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">1900 1234</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('support.availableHours')}: 8:00 - 20:00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('support.allDays')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{t('support.emailSupport')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">support@williamtravel.vn</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('support.emailResponseTime')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{t('support.liveChat')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('support.chatWithUsDescription')}
                  </p>
                  <Button>
                    {t('support.startChat')}
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('support.contactForm')}</CardTitle>
              <CardDescription>
                {t('support.contactFormDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    placeholder={t('yourName')}
                    defaultValue={user?.full_name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('yourEmail')}
                    defaultValue={user?.email || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{t('subject')}</Label>
                <Input id="subject" placeholder={t('support.subjectPlaceholder')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMessage">{t('message')}</Label>
                <Textarea
                  id="contactMessage"
                  placeholder={t('support.messagePlaceholder')}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('support.preferredContactMethod')}</Label>
                <RadioGroup defaultValue="email" className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-contact" />
                    <Label htmlFor="email-contact">{t('support.viaEmail')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-contact" />
                    <Label htmlFor="phone-contact">{t('support.viaPhone')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                {t('support.sendMessage')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('support.officeLocations')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">{t('support.hanoiOffice')}</h3>
                <p className="text-sm text-muted-foreground">
                  Tầng 8, Tòa nhà VIT, 519 Kim Mã, Ba Đình, Hà Nội
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">{t('support.hcmcOffice')}</h3>
                <p className="text-sm text-muted-foreground">
                  Tầng 15, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 10, TP.HCM
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tickets Section */}
        <TabsContent value="tickets" className="space-y-4">
          {selectedTicket ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                  >
                    ← {t('back')}
                  </Button>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{selectedTicket.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span>#{selectedTicket.id}</span>
                  <span>{t(`support.issueTypes.${selectedTicket.type}`)}</span>
                  <span>{new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p>{selectedTicket.description}</p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {selectedTicket.responses?.map(response => (
                    <div
                      key={response.id}
                      className={`flex ${response.fromSupport ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          response.fromSupport 
                            ? 'bg-muted' 
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {response.fromSupport && (
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-xs font-medium">
                                CS
                              </div>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {t('support.customerSupport')}
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{response.message}</p>
                        <p className="text-xs mt-2 text-right opacity-70">
                          {new Date(response.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTicket.status !== 'closed' && (
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">{t('support.replyToTicket')}</h3>
                    <div className="space-y-3">
                      <Textarea
                        placeholder={t('support.typeYourReply')}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                      />
                      <Button
                        onClick={handleReplyToTicket}
                        disabled={!replyMessage.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('sending')}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t('support.sendReply')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0 text-sm text-muted-foreground border-t">
                <div>
                  {selectedTicket.status === 'open' || selectedTicket.status === 'inProgress' ? (
                    <span>{t('support.estimatedResponse')} 24 {t('hours')}</span>
                  ) : (
                    <span>{t('support.ticketClosed')}</span>
                  )}
                </div>
                {selectedTicket.status !== 'closed' && (
                  <Button variant="outline" size="sm">
                    {t('support.closeTicket')}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('support.yourTickets')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {mockTickets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">{t('support.noTickets')}</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {mockTickets.map(ticket => (
                          <div
                            key={ticket.id}
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => navigate(`/support/${ticket.id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{ticket.title}</h4>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              #{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('support.createNewTicket')}</CardTitle>
                    <CardDescription>
                      {t('support.fillFormForSupport')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submitSuccess === true ? (
                      <div className="py-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                          {t('support.ticketSubmitted')}
                        </h3>
                        <p className="text-muted-foreground">
                          {t('support.ticketConfirmation')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="ticketTitle">{t('support.ticketTitle')}</Label>
                          <Input
                            id="ticketTitle"
                            placeholder={t('support.briefDescription')}
                            value={newTicket.title}
                            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t('support.issueType')}</Label>
                            <Select
                              value={newTicket.type}
                              onValueChange={(value) => setNewTicket({...newTicket, type: value as IssueType})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('support.selectIssueType')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={IssueType.TECHNICAL}>{t('support.issueTypes.technical')}</SelectItem>
                                <SelectItem value={IssueType.ACCOUNT}>{t('support.issueTypes.account')}</SelectItem>
                                <SelectItem value={IssueType.PAYMENT}>{t('support.issueTypes.payment')}</SelectItem>
                                <SelectItem value={IssueType.BOOKING}>{t('support.issueTypes.booking')}</SelectItem>
                                <SelectItem value={IssueType.OTHER}>{t('support.issueTypes.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>{t('support.priority')}</Label>
                            <Select
                              value={newTicket.priority}
                              onValueChange={(value) => setNewTicket({...newTicket, priority: value as IssuePriority})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('support.selectPriority')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={IssuePriority.LOW}>{t('support.priorities.low')}</SelectItem>
                                <SelectItem value={IssuePriority.MEDIUM}>{t('support.priorities.medium')}</SelectItem>
                                <SelectItem value={IssuePriority.HIGH}>{t('support.priorities.high')}</SelectItem>
                                <SelectItem value={IssuePriority.URGENT}>{t('support.priorities.urgent')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ticketDescription">{t('support.detailedDescription')}</Label>
                          <Textarea
                            id="ticketDescription"
                            placeholder={t('support.descriptionPlaceholder')}
                            rows={5}
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                          />
                        </div>

                        <div className="pt-2">
                          <Button
                            onClick={handleSubmitTicket}
                            disabled={!newTicket.title || !newTicket.description || isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('submitting')}
                              </>
                            ) : (
                              t('support.submitTicket')
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Feedback Section */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.provideFeedback')}</CardTitle>
              <CardDescription>
                {t('support.feedbackDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitSuccess === true ? (
                <div className="py-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {t('support.thankForFeedback')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('support.feedbackConfirmation')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label>{t('support.feedbackType')}</Label>
                    <RadioGroup
                      value={feedbackType}
                      onValueChange={setFeedbackType}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suggestion" id="suggestion" />
                        <Label htmlFor="suggestion">{t('support.feedbackTypes.suggestion')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compliment" id="compliment" />
                        <Label htmlFor="compliment">{t('support.feedbackTypes.compliment')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="complaint" id="complaint" />
                        <Label htmlFor="complaint">{t('support.feedbackTypes.complaint')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bug" id="bug" />
                        <Label htmlFor="bug">{t('support.feedbackTypes.bug')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedbackText">{t('support.yourFeedback')}</Label>
                    <Textarea
                      id="feedbackText"
                      placeholder={t('support.feedbackPlaceholder')}
                      rows={6}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={!feedbackText.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('submitting')}
                        </>
                      ) : (
                        t('support.submitFeedback')
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>{t('support.reportProblem')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('support.reportProblemDescription')}
                </p>
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setActiveTab('tickets');
                  setNewTicket({
                    ...newTicket,
                    type: IssueType.TECHNICAL
                  });
                }}>
                  <AlertCircle className="h-4 w-4" />
                  {t('support.reportProblem')}
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>{t('support.reportContent')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('support.reportContentDescription')}
                </p>
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setActiveTab('tickets');
                  setNewTicket({
                    ...newTicket,
                    type: IssueType.OTHER,
                    title: 'Báo cáo nội dung không phù hợp'
                  });
                }}>
                  <Flag className="h-4 w-4" />
                  {t('support.reportContent')}
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>{t('support.featureRequest')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('support.featureRequestDescription')}
                </p>
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFeedbackType('suggestion');
                  setActiveTab('feedback');
                }}>
                  <LifeBuoy className="h-4 w-4" />
                  {t('support.requestFeature')}
                </Button>
              </CardContent>
            </Card>

          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('support.serviceAvailability')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t('support.operatingHours')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('support.onlineSupport')}</span>
                      <span>24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('support.phoneSupport')}</span>
                      <span>8:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('support.emailSupport')}</span>
                      <span>8:00 - 22:00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{t('support.responseTime')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('support.liveChatResponse')}</span>
                      <span className="text-green-600">{t('support.immediate')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('support.ticketResponse')}</span>
                      <span>4-24 {t('hours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('support.emailResponse')}</span>
                      <span>24-48 {t('hours')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
