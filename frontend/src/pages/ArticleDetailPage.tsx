import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import SimpleLayout from '@/layouts/SimpleLayout';
import { PageTransition } from '@/components/common/PageTransition';
import {
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaClock,
  FaTag,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaInfoCircle,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';

// Mock service - Replace with your actual service
const articleService = {
  getArticleById: async (id: string) => {
    // Simulate API call
    return {
      id,
      title: 'Khám phá 10 cảnh đẹp không thể bỏ qua khi đến Việt Nam',
      summary: 'Việt Nam đang nổi lên như một điểm đến du lịch hàng đầu tại châu Á với các địa điểm thiên nhiên tuyệt đẹp, di sản văn hóa phong phú và ẩm thực nổi tiếng toàn cầu.',
      content: `<p>Việt Nam là một đất nước với vẻ đẹp đa dạng, từ các dãy núi hùng vĩ ở phía Bắc đến những bãi biển cát trắng tuyệt đẹp ở miền Trung và đồng bằng sông Cửu Long màu mỡ ở phía Nam. Bài viết này sẽ giới thiệu 10 địa điểm không thể bỏ qua khi du lịch Việt Nam.</p>

      <h2>1. Vịnh Hạ Long</h2>
      <p>Vịnh Hạ Long là di sản thiên nhiên thế giới được UNESCO công nhận và là một trong những điểm đến nổi tiếng nhất tại Việt Nam. Với hơn 1.600 hòn đảo đá vôi nhô lên từ mặt nước xanh ngọc, tạo nên một khung cảnh ngoạn mục không thể tìm thấy ở bất cứ đâu trên thế giới.</p>

      <h2>2. Phố cổ Hội An</h2>
      <p>Hội An là một thành phố cổ nằm ở miền Trung Việt Nam, với những con phố rợp bóng đèn lồng, kiến trúc cổ kính pha trộn giữa các nền văn hóa Việt Nam, Trung Quốc, Nhật Bản và phương Tây. Đặc biệt vào đêm rằm, khi ánh sáng điện được tắt đi, thành phố chỉ sáng bởi đèn lồng, tạo nên không gian cổ tích lung linh.</p>

      <h2>3. Động Phong Nha - Kẻ Bàng</h2>
      <p>Vườn quốc gia Phong Nha - Kẻ Bàng tại tỉnh Quảng Bình là nơi có hệ thống hang động kỳ vĩ, trong đó có Sơn Đoòng - hang động lớn nhất thế giới. Khám phá các hang động ở đây là một trải nghiệm không thể quên với những khung cảnh như trong thế giới cổ tích.</p>

      <h2>4. Sapa</h2>
      <p>Nằm ở phía tây bắc Việt Nam, Sapa nổi tiếng với những thửa ruộng bậc thang trải dài trên sườn núi và văn hóa đặc sắc của các dân tộc thiểu số như H'Mông, Dao đỏ. Đây cũng là điểm xuất phát để chinh phục đỉnh Fansipan - "nóc nhà Đông Dương".</p>

      <h2>5. Huế</h2>
      <p>Cố đô Huế mang đến cho du khách một cái nhìn về lịch sử phong kiến Việt Nam với hệ thống kiến trúc cung đình, lăng tẩm vua chúa nhà Nguyễn. Đặc biệt, Đại Nội - Kinh thành Huế là một công trình kiến trúc đồ sộ và tinh xảo, nơi vua chúa triều Nguyễn từng sinh sống và làm việc.</p>

      <h2>6. Mũi Né</h2>
      <p>Mũi Né nổi tiếng với những đồi cát trắng, đồi cát đỏ và bãi biển dài với làn nước trong xanh. Đây là thiên đường cho những người yêu thích các môn thể thao biển như lướt ván diều (kitesurfing) và dù lượn (parasailing).</p>

      <h2>7. Đồng bằng sông Cửu Long</h2>
      <p>Đồng bằng sông Cửu Long là vùng đất màu mỡ với mạng lưới kênh rạch chằng chịt, những khu chợ nổi đầy màu sắc và nền văn hóa sông nước đặc trưng. Du khách có thể tham gia các tour du lịch bằng thuyền để khám phá cuộc sống thường ngày của người dân địa phương.</p>

      <h2>8. Đà Lạt</h2>
      <p>Được mệnh danh là "thành phố ngàn hoa", Đà Lạt nổi tiếng với khí hậu mát mẻ quanh năm, những vườn hoa rực rỡ và kiến trúc Pháp cổ kính. Đây là điểm đến lý tưởng cho những ai muốn tránh cái nóng oi bức của mùa hè nhiệt đới.</p>

      <h2>9. Hà Nội</h2>
      <p>Thủ đô Hà Nội là nơi hòa quyện giữa nét hiện đại và truyền thống. Du khách có thể tản bộ quanh Hồ Hoàn Kiếm, khám phá 36 phố phường cổ, thưởng thức ẩm thực đường phố phong phú và tìm hiểu lịch sử tại các bảo tàng và di tích lịch sử.</p>

      <h2>10. Đảo Phú Quốc</h2>
      <p>Phú Quốc - hòn đảo lớn nhất Việt Nam nằm ở phía Nam, nổi tiếng với những bãi biển cát trắng tuyệt đẹp, nước biển trong xanh và những khu rừng nguyên sinh. Đây cũng là nơi sản xuất nước mắm nổi tiếng và nuôi cấy ngọc trai chất lượng cao.</p>

      <h2>Kết luận</h2>
      <p>Việt Nam với sự đa dạng về thiên nhiên, văn hóa và ẩm thực chắc chắn sẽ mang đến cho du khách những trải nghiệm khó quên. Dù bạn là người yêu thích thiên nhiên, khám phá văn hóa hay đơn giản chỉ muốn thư giãn trên những bãi biển tuyệt đẹp, Việt Nam đều có thể đáp ứng mọi mong muốn của bạn.</p>`,
      publishedDate: '2025-03-15T00:00:00Z',
      updatedDate: '2025-03-18T00:00:00Z',
      author: {
        id: 'author1',
        name: 'Nguyễn Văn A',
        avatar: '/images/vite.svg',
        bio: 'Chuyên gia du lịch với hơn 10 năm kinh nghiệm khám phá Việt Nam và Đông Nam Á.',
        articleCount: 45
      },
      category: 'Du lịch',
      tags: ['Việt Nam', 'Địa điểm du lịch', 'Văn hóa', 'Thiên nhiên'],
      readTime: '8 phút',
      viewCount: 1250,
      likesCount: 324,
      commentsCount: 42,
      featuredImage: '/images/halong_wal.jpg',
      images: [
        '/images/halong_wal.jpg',
        '/images/hoian.jpg',
        '/images/sapa.jpg',
        '/images/hanoi.jpg',
        '/images/hagiang.jpg'
      ],
      relatedArticles: [
        {
          id: 'article2',
          title: 'Ẩm thực Việt Nam - Hành trình khám phá tinh hoa ẩm thực truyền thống',
          summary: 'Khám phá nền ẩm thực phong phú và đa dạng của Việt Nam, từ phở Hà Nội đến hủ tiếu Nam Bộ.',
          featuredImage: '/images/hanoi.jpg',
          publishedDate: '2025-02-20T00:00:00Z',
          author: 'Trần Thị B',
          category: 'Ẩm thực'
        },
        {
          id: 'article3',
          title: 'Những trải nghiệm văn hóa độc đáo chỉ có tại Việt Nam',
          summary: 'Tìm hiểu về những lễ hội truyền thống, nghệ thuật dân gian và các hoạt động văn hóa đặc sắc của Việt Nam.',
          featuredImage: '/images/hagiang.jpg',
          publishedDate: '2025-01-05T00:00:00Z',
          author: 'Lê Văn C',
          category: 'Văn hóa'
        }
      ]
    };
  }
};

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        const data = await articleService.getArticleById(id as string);
        setArticle(data);
        // Check if the article is in user's bookmarks and liked articles
        const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '[]');
        const likes = JSON.parse(localStorage.getItem('articleLikes') || '[]');
        setIsBookmarked(bookmarks.includes(id));
        setIsLiked(likes.includes(id));
      } catch (err) {
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        console.error('Error fetching article details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '[]');
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
    } else {
      newBookmarks = [...bookmarks, id];
    }

    localStorage.setItem('articleBookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const toggleLike = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    const likes = JSON.parse(localStorage.getItem('articleLikes') || '[]');
    let newLikes;

    if (isLiked) {
      newLikes = likes.filter((likeId: string) => likeId !== id);
    } else {
      newLikes = [...likes, id];
    }

    localStorage.setItem('articleLikes', JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <SimpleLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (error || !article) {
    return (
      <SimpleLayout>
        <div className="py-12 text-center">
          <div className="mb-4 text-5xl text-red-500">
            <FaInfoCircle className="inline" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Không tìm thấy bài viết'}
          </h1>
          <p className="mb-6 text-gray-600">
            Có thể bài viết này không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/articles" className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            Quay lại danh sách bài viết
          </Link>
        </div>
      </SimpleLayout>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <PageTransition>
      <SimpleLayout>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Article header */}
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
              {article.category}
            </span>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {article.title}
            </h1>
            <div className="mb-4 text-lg text-gray-600">
              {article.summary}
            </div>

            <div className="mb-6 flex flex-wrap items-center text-sm text-gray-600">
              <div className="mr-6 flex items-center">
                <FaUser className="mr-2 text-gray-500" />
                <span>{article.author.name}</span>
              </div>
              <div className="mr-6 flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <span>{formatDate(article.publishedDate)}</span>
              </div>
              <div className="mr-6 flex items-center">
                <FaClock className="mr-2 text-gray-500" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center">
                <FaEye className="mr-2 text-gray-500" />
                <span>{article.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={toggleLike}
                className={`flex items-center rounded-md px-4 py-2 font-medium ${
                  isLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isLiked ? (
                  <FaHeart className="mr-2" />
                ) : (
                  <FaRegHeart className="mr-2" />
                )}
                {isLiked ? `Đã thích (${article.likesCount})` : `Thích (${article.likesCount})`}
              </button>

              <button
                onClick={toggleBookmark}
                className={`flex items-center rounded-md px-4 py-2 font-medium ${
                  isBookmarked
                    ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBookmarked ? (
                  <FaBookmark className="mr-2" />
                ) : (
                  <FaRegBookmark className="mr-2" />
                )}
                {isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}
              </button>

              <button className="flex items-center rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">
                <FaShare className="mr-2" />
                Chia sẻ
              </button>
            </div>
          </div>

          {/* Featured image */}
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Article content */}
          <div className="article-content prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Tags */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mb-4 flex items-center">
              <FaTag className="mr-2 text-gray-500" />
              <span className="font-medium text-gray-700">Tags:</span>
              <div className="ml-2 flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
                  <Link
                    key={index}
                    to={`/articles/tags/${tag}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Share options */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Chia sẻ bài viết</h3>
            <div className="flex space-x-3">
              <button className="rounded-full bg-[#3b5998] p-3 text-white hover:bg-opacity-90">
                <FaFacebookF />
              </button>
              <button className="rounded-full bg-[#1da1f2] p-3 text-white hover:bg-opacity-90">
                <FaTwitter />
              </button>
              <button className="rounded-full bg-[#0077b5] p-3 text-white hover:bg-opacity-90">
                <FaLinkedinIn />
              </button>
              <button className="rounded-full bg-[#e60023] p-3 text-white hover:bg-opacity-90">
                <FaPinterestP />
              </button>
            </div>
          </div>

          {/* Author bio */}
          <div className="mt-10 rounded-lg bg-gray-50 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{article.author.name}</h3>
                <p className="mt-1 text-gray-600">{article.author.bio}</p>
                <p className="mt-2 text-sm text-gray-500">{article.author.articleCount} bài viết đã xuất bản</p>
              </div>
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {article.relatedArticles.map((relatedArticle: any) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.id}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="mb-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                      {relatedArticle.category}
                    </span>
                    <h3 className="mb-2 text-lg font-medium text-gray-900 group-hover:text-primary-600">
                      {relatedArticle.title}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">{relatedArticle.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedArticle.author}</span>
                      <span>{formatDate(relatedArticle.publishedDate)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SimpleLayout>
    </PageTransition>
  );
};

export default ArticleDetailPage;
