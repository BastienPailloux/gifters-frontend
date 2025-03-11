import React from 'react';

export interface TestimonialProps {
  content: string;
  author: {
    name: string;
    title?: string;
    company?: string;
    avatarUrl?: string;
  };
  rating?: number;
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  content,
  author,
  rating = 5,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 flex flex-col ${className}`}>
      {/* Étoiles de notation */}
      {rating > 0 && (
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              data-testid="star"
              className={`w-5 h-5 ${
                index < rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-label={index < rating ? 'Étoile pleine' : 'Étoile vide'}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Contenu du témoignage */}
      <div className="flex-grow">
        <p className="text-gray-700 italic mb-4">{content}</p>
      </div>

      {/* Informations sur l'auteur */}
      <div className="flex items-center mt-4">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={`Photo de ${author.name}`}
            className="w-10 h-10 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
            <span className="text-lg font-semibold">{author.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{author.name}</p>
          {(author.title || author.company) && (
            <p className="text-sm text-gray-500">
              {author.title}
              {author.title && author.company && ', '}
              {author.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
