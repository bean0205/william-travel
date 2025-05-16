import { Link } from 'react-router-dom';

type GuideCardProps = {
  guide: {
    id: string;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    imageUrl: string;
    date: string;
  };
};

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]">
      <img
        src={guide.imageUrl}
        alt={guide.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-5">
        <div className="mb-2 flex items-center">
          <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
            {guide.category}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {new Date(guide.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-bold">{guide.title}</h3>
        <p className="mb-3 text-sm text-gray-500">By {guide.author}</p>
        <p className="mb-4 text-gray-600 line-clamp-3">{guide.excerpt}</p>
        <Link
          to={`/guides/${guide.id}`}
          className="text-primary-600 font-medium hover:text-primary-700"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default GuideCard;
