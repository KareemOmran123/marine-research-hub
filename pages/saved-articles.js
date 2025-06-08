import { useState, useEffect } from 'react';

export default function SavedArticles() {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(articles);
  }, []);

  const handleRemoveArticle = (index) => {
    const updatedArticles = savedArticles.filter((_, i) => i !== index);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    setSavedArticles(updatedArticles);
  };

  const groupedArticles = savedArticles.reduce((acc, article) => {
    acc[article.topic] = acc[article.topic] || [];
    acc[article.topic].push(article);
    return acc;
  }, {});

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-b from-white via-gray-100 to-white text-black dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Articles</h1>

      {Object.keys(groupedArticles).length === 0 ? (
        <p className="text-lg text-center">No articles saved yet.</p>
      ) : (
        Object.keys(groupedArticles).map((topic) => (
          <div key={topic} className="w-full max-w-md mb-6">
            <h2 className="text-2xl font-bold mb-4">{topic}</h2>
            <ul className="space-y-4">
              {groupedArticles[topic].map((article, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400 block truncate"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {article.name}
                  </a>
                  <button
                    onClick={() => handleRemoveArticle(index)}
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <button
        onClick={() => (window.location.href = '/')}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </main>
  );
}