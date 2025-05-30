import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2,
  User,
  Calendar,
  Tag,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - replace with actual API call
const getForumPost = (id: string) => {
  return {
    id,
    title: 'Best time to visit Ha Long Bay?',
    authorName: 'TravelEnthusiast92',
    authorAvatar: '/images/avatar-1.jpg',
    authorLevel: 'Explorer',
    postedDate: '2025-05-10T08:45:00Z',
    category: 'Travel Planning',
    tags: ['Vietnam', 'Ha Long Bay', 'Weather', 'Timing'],
    content: `I'm planning a trip to Vietnam later this year and Ha Long Bay is on top of my bucket list. I've heard mixed opinions about when to visit - some say avoid summer due to crowds and storms, others say it's the most beautiful time.

What has been your experience? When is the best time to visit considering weather, crowds, and overall experience? Also, is it worth spending an extra day to visit Lan Ha Bay or should I stick with the standard Ha Long Bay cruise?

Thanks for any advice!`,
    viewCount: 245,
    upvotes: 18,
    downvotes: 2,
    replies: [
      {
        id: '1',
        authorName: 'VietnamExpert',
        authorAvatar: '/images/avatar-2.jpg',
        authorLevel: 'Local Guide',
        content: 'October to December is generally the best time to visit Ha Long Bay. The weather is mild with less rain, and visibility is good for those stunning limestone karst views. September can still have some storms, and January to March can be a bit chilly with misty conditions (though this creates a mystical atmosphere that some travelers prefer).\n\nRegarding Lan Ha Bay - absolutely worth the extra day! It\'s less crowded than Ha Long Bay and equally beautiful. Many locals actually prefer it.',
        postedDate: '2025-05-10T09:30:00Z',
        upvotes: 24,
        downvotes: 0,
        isVerified: true,
      },
      {
        id: '2',
        authorName: 'WorldTrekker',
        authorAvatar: '/images/avatar-3.jpg',
        authorLevel: 'Adventurer',
        content: 'I visited in early November last year and it was perfect! Great weather, comfortable temperatures, and fewer tourists compared to stories I\'ve heard about summer months. We did a 2-night cruise that included both Ha Long and Lan Ha bays, and I highly recommend that approach if you have the time.',
        postedDate: '2025-05-11T14:15:00Z',
        upvotes: 8,
        downvotes: 0,
      },
      {
        id: '3',
        authorName: 'BudgetBackpacker',
        authorAvatar: '/images/avatar-4.jpg',
        authorLevel: 'Nomad',
        content: 'Another vote for November! But a word of caution - we went during Vietnamese national holiday in early September once and it was extremely crowded with domestic tourists. The pricing was also higher. Check Vietnamese holiday calendar when planning.',
        postedDate: '2025-05-12T10:42:00Z',
        upvotes: 6,
        downvotes: 0,
      }
    ],
    relatedTopics: [
      { id: '234', title: 'Ha Long Bay vs Bai Tu Long Bay - Worth the price difference?', replies: 14 },
      { id: '345', title: 'Solo female traveler safety in Northern Vietnam', replies: 28 },
      { id: '456', title: 'Best cruise companies for Ha Long Bay in 2025', replies: 42 }
    ]
  };
};

const CommunityForumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Replace with actual API call
    if (id) {
      const data = getForumPost(id);
      setPost(data);
      setLoading(false);
    }
  }, [id]);

  const handleSubmitReply = () => {
    if (!newReply.trim()) return;

    // Add the new reply to the post
    if (post) {
      const updatedReplies = [...post.replies, {
        id: `temp-${Date.now()}`,
        authorName: 'You',
        authorAvatar: '/images/avatar-you.jpg',
        authorLevel: 'Traveler',
        content: newReply,
        postedDate: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      }];

      setPost({
        ...post,
        replies: updatedReplies,
      });

      setNewReply('');
    }
  };

  const handleVote = (type: 'up' | 'down') => {
    if (!post) return;

    if (userVote === type) {
      // User is unvoting
      setUserVote(null);
      if (type === 'up') {
        setPost({ ...post, upvotes: post.upvotes - 1 });
      } else {
        setPost({ ...post, downvotes: post.downvotes - 1 });
      }
    } else {
      // User is changing vote or voting for first time
      if (userVote) {
        // Remove previous vote
        if (userVote === 'up') {
          setPost({ ...post, upvotes: post.upvotes - 1 });
        } else {
          setPost({ ...post, downvotes: post.downvotes - 1 });
        }
      }

      // Add new vote
      setUserVote(type);
      if (type === 'up') {
        setPost({ ...post, upvotes: post.upvotes + 1 });
      } else {
        setPost({ ...post, downvotes: post.downvotes + 1 });
      }
    }
  };

  const handleReplyVote = (replyId: string, type: 'up' | 'down') => {
    if (!post) return;

    const updatedReplies = post.replies.map((reply: any) => {
      if (reply.id === replyId) {
        if (type === 'up') {
          return { ...reply, upvotes: reply.upvotes + 1 };
        } else {
          return { ...reply, downvotes: reply.downvotes + 1 };
        }
      }
      return reply;
    });

    setPost({ ...post, replies: updatedReplies });
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('postNotFound')}</h2>
          <Button onClick={() => navigate('/community')}>{t('backToCommunity')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate('/community')}
      >
        <ArrowLeft size={16} />
        {t('backToCommunity')}
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <img src={post.authorAvatar} alt={post.authorName} />
                </Avatar>
                <div>
                  <div className="font-medium">{post.authorName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Badge variant="outline" className="text-xs py-0">
                      {post.authorLevel}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(post.postedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {post.category}
              </Badge>
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <div className="mb-6 whitespace-pre-line">
              {post.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 ${userVote === 'up' ? 'text-green-600' : ''}`}
                    onClick={() => handleVote('up')}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 ${userVote === 'down' ? 'text-red-600' : ''}`}
                    onClick={() => handleVote('down')}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {post.downvotes}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.viewCount} {t('views')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-1" />
                  {t('report')}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  {t('share')}
                </Button>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {post.replies.length} {t('replies')}
            </h2>

            <div className="space-y-4 mb-6">
              {post.replies.map((reply: any) => (
                <Card key={reply.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <img src={reply.authorAvatar} alt={reply.authorName} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reply.authorName}</span>
                          {reply.isVerified && (
                            <Badge className="bg-green-500 text-xs py-0">
                              {t('localExpert')}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reply.authorLevel}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(reply.postedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4 whitespace-pre-line">
                    {reply.content}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      onClick={() => handleReplyVote(reply.id, 'up')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {reply.upvotes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      onClick={() => handleReplyVote(reply.id, 'down')}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {reply.downvotes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      {t('reply')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-3">{t('addReply')}</h3>
              <textarea
                className="w-full border rounded-md p-3 mb-3 dark:bg-gray-800"
                rows={4}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={t('shareYourThoughts')}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitReply}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t('postReply')}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('aboutThisTopic')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('category')}:</span>
                <span className="font-medium">{post.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('posted')}:</span>
                <span>{new Date(post.postedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('views')}:</span>
                <span>{post.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('replies')}:</span>
                <span>{post.replies.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('relatedTopics')}</h3>
            <div className="space-y-3">
              {post.relatedTopics.map((topic: any) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md"
                  onClick={() => navigate(`/community/${topic.id}`)}
                >
                  <div className="text-sm">{topic.title}</div>
                  <Badge variant="secondary" className="text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {topic.replies}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">{t('joinDiscussion')}</h3>
            <p className="text-sm mb-3">
              {t('shareYourExperienceHelp')}
            </p>
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('postNewTopic')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityForumDetailPage;
