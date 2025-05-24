import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Smile, X, Minimize2, Maximize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatbotProps {
  initialMinimized?: boolean;
}

// Common questions and answers for the chatbot
const commonQuestions = [
  {
    id: 'q1',
    question: 'Đề xuất địa điểm thăm quan ở Hà Nội',
    answer: 'Hà Nội có nhiều điểm tham quan tuyệt vời như Văn Miếu - Quốc Tử Giám, Hoàn Kiếm, Lăng Chủ Tịch Hồ Chí Minh, Bảo tàng Dân tộc học, Phố cổ, và Chùa Trấn Quốc. Bạn quan tâm đến lịch sử, văn hóa, hay ẩm thực?'
  },
  {
    id: 'q2',
    question: 'Mùa nào đẹp nhất để du lịch Đà Lạt?',
    answer: 'Đà Lạt đẹp quanh năm, nhưng thời điểm lý tưởng nhất là từ tháng 12 đến tháng 3, khi thời tiết mát mẻ, khô ráo và nhiều lễ hội hoa diễn ra. Tháng 11 đến tháng 12 là mùa hoa dã quỳ nở rộ, trong khi tháng 1 đến tháng 3 là mùa hoa anh đào.'
  },
  {
    id: 'q3',
    question: 'Gợi ý khách sạn ở Hội An',
    answer: 'Hội An có nhiều lựa chọn từ homestay đến resort. Khu vực phố cổ có nhiều homestay và khách sạn boutique như Tribee Bana, Vinh Hung, hay Maison Vy. Nếu bạn thích nghỉ dưỡng cao cấp, có thể xem Victoria Hội An, Four Seasons Nam Hai hay Sunrise Premium Resort gần biển An Bàng và Cửa Đại.'
  },
  {
    id: 'q4',
    question: 'Cách di chuyển từ Hà Nội đến Hạ Long',
    answer: 'Từ Hà Nội đến Hạ Long có nhiều cách: Xe bus limousine (2.5-3 giờ), taxi (2.5 giờ), hoặc tour trọn gói. Nếu đặt tour du thuyền, thường đã bao gồm đưa đón từ Hà Nội. Từ tháng 9/2018, cao tốc Hà Nội - Hải Phòng - Hạ Long rút ngắn thời gian đi lại còn khoảng 2.5 giờ.'
  }
];

export const TravelChatbot = ({ initialMinimized = true }: ChatbotProps) => {
  const { t } = useTranslation(['common', 'chatbot']);
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message on first load
  useEffect(() => {
    const welcomeMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot' as const,
      text: t('chatbot.welcome', { username: user?.full_name || t('traveler') }),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [t, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      // Basic logic to match questions with predefined answers
      const lowerCaseInput = inputValue.toLowerCase();

      let botResponse = '';

      // Simple keyword matching
      if (lowerCaseInput.includes('hà nội') &&
          (lowerCaseInput.includes('thăm') || lowerCaseInput.includes('tham quan') || lowerCaseInput.includes('địa điểm'))) {
        botResponse = commonQuestions[0].answer;
      }
      else if (lowerCaseInput.includes('đà lạt') &&
               (lowerCaseInput.includes('mùa') || lowerCaseInput.includes('thời gian') || lowerCaseInput.includes('khi nào'))) {
        botResponse = commonQuestions[1].answer;
      }
      else if (lowerCaseInput.includes('hội an') &&
               (lowerCaseInput.includes('khách sạn') || lowerCaseInput.includes('nghỉ') || lowerCaseInput.includes('ở đâu'))) {
        botResponse = commonQuestions[2].answer;
      }
      else if ((lowerCaseInput.includes('hà nội') && lowerCaseInput.includes('hạ long')) ||
               (lowerCaseInput.includes('di chuyển') && lowerCaseInput.includes('hạ long'))) {
        botResponse = commonQuestions[3].answer;
      }
      else if (lowerCaseInput.includes('chào') || lowerCaseInput.includes('xin chào') || lowerCaseInput.includes('hello')) {
        botResponse = t('chatbot.greeting', { username: user?.full_name || t('traveler') });
      }
      else if (lowerCaseInput.includes('cảm ơn') || lowerCaseInput.includes('thank')) {
        botResponse = t('chatbot.thankResponse');
      }
      else {
        botResponse = t('chatbot.defaultResponse');
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsBotTyping(false);
    }, 1500);
  };

  const handleQuickQuestionClick = (questionId: string) => {
    const question = commonQuestions.find(q => q.id === questionId);
    if (!question) return;

    setInputValue(question.question);

    // Simulate user clicking send
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: question.question,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsBotTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        text: question.answer,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsBotTyping(false);
      setInputValue('');
    }, 1500);
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-primary text-primary-foreground"
      >
        <Bot size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] bg-card rounded-lg shadow-lg flex flex-col overflow-hidden border z-50">
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <div className="font-medium flex items-center gap-2">
          <Bot size={18} />
          {t('chatbot.title')}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 max-h-[400px]">
        {/* Messages */}
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.type === 'user'
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none"
              )}>
                {message.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center rounded-full">
                        <Bot size={12} />
                      </div>
                    </Avatar>
                    <span className="font-medium text-xs">Travel Assistant</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg rounded-bl-none p-3 max-w-[80%]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick questions */}
      <div className="p-2 border-t border-border overflow-x-auto whitespace-nowrap">
        <div className="flex gap-2">
          {commonQuestions.map(q => (
            <button
              key={q.id}
              onClick={() => handleQuickQuestionClick(q.id)}
              className="bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
            >
              {q.question}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('chatbot.askPlaceholder')}
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
