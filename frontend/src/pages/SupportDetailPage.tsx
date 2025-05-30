import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react';

// Mock data - replace with actual API call
const getSupportTicket = (id: string) => {
  return {
    id,
    title: `Support Ticket #${id}`,
    status: 'In Progress',
    category: 'Technical Issue',
    createdAt: '2025-05-15T10:30:00Z',
    updatedAt: '2025-05-18T14:22:00Z',
    description: 'I am having trouble with booking confirmations not showing up in my account.',
    responses: [
      {
        id: '1',
        agentName: 'Sarah Thompson',
        responseText: 'Thank you for reaching out. Could you please provide more details about when you made the booking and what error messages you received?',
        timestamp: '2025-05-16T09:15:00Z',
      },
      {
        id: '2',
        userName: 'You',
        responseText: 'I made the booking yesterday around 3 PM. I received a confirmation email but when I log in to my account, I don\'t see it in my trips.',
        timestamp: '2025-05-16T11:30:00Z',
      },
    ],
  };
};

const SupportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ticket, setTicket] = useState<any>(null);
  const [newResponse, setNewResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with actual API call
    if (id) {
      const data = getSupportTicket(id);
      setTicket(data);
      setLoading(false);
    }
  }, [id]);

  const handleSubmitResponse = () => {
    if (!newResponse.trim()) return;

    // Add the new response to the ticket
    if (ticket) {
      const updatedResponses = [...ticket.responses, {
        id: `${ticket.responses.length + 1}`,
        userName: 'You',
        responseText: newResponse,
        timestamp: new Date().toISOString(),
      }];

      setTicket({
        ...ticket,
        responses: updatedResponses,
        updatedAt: new Date().toISOString(),
      });

      setNewResponse('');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('supportTicketNotFound')}</h2>
          <Button onClick={() => navigate('/support')}>{t('backToSupport')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate('/support')}
      >
        <ArrowLeft size={16} />
        {t('backToSupport')}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground mb-2">
          <span>{t('status')}: <span className="font-medium">{ticket.status}</span></span>
          <span>•</span>
          <span>{t('category')}: {ticket.category}</span>
          <span>•</span>
          <span>{t('created')}: {new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>

        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2">{t('description')}:</h3>
          <p>{ticket.description}</p>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('conversation')}</h2>
        <div className="space-y-4">
          {ticket.responses.map((response: any) => (
            <Card key={response.id} className={`p-4 ${response.userName === 'You' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {response.agentName || response.userName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(response.timestamp).toLocaleString()}
                </span>
              </div>
              <p>{response.responseText}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">{t('addResponse')}</h3>
        <textarea
          className="w-full border rounded-md p-3 mb-3 dark:bg-gray-800"
          rows={4}
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder={t('typeYourResponseHere')}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitResponse}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {t('sendResponse')}
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {t('lastUpdated')}: {new Date(ticket.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SupportDetailPage;
