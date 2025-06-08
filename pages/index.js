import { useState } from 'react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setGeneratedArticle(null);

    if (!selectedTopic) {
      setError('Please select a topic first.');
      return;
    }

    try {
      const response = await fetch(`/api/random?topic=${encodeURIComponent(selectedTopic)}`);
      const paper = await response.json();

      if (paper.error) {
        setError(paper.error);
        return;
      }

      if (paper.url) {
        setGeneratedArticle({ topic: selectedTopic, url: paper.url, name: paper.title || paper.url });
      } else {
        setError('No link found for this paper.');
      }
    } catch (err) {
      setError('Error fetching paper.');
    }
  };

  const handleSaveArticle = () => {
    if (!generatedArticle) {
      alert('No article generated to save!');
      return;
    }

    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    const updatedArticles = [...savedArticles, generatedArticle];
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles)); // Save all articles to localStorage
    alert('Article saved!');
  };

  const navigateToSavedArticles = () => {
    window.location.href = '/saved-articles';
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-b from-white via-gray-100 to-white text-black dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      <div className="absolute top-6 right-6 flex space-x-4">
        <button
          onClick={handleSaveArticle}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Article
        </button>
        <button
          onClick={navigateToSavedArticles}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Saved Articles
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Marine Science Paper Generator</h1>

      <select
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        className="p-3 border rounded-md mb-4 w-full max-w-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      >
        <option value="">-- Select a topic --</option>
        <option value="marine science">Marine Science</option>
        <option value="oceanography">Oceanography</option>
        <option value="ecology">Ecology</option>
        <option value="biology">Biology</option>
        <option value="climate science">Climate Science</option>
        {/* Add more topics as needed */}
      </select>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Generate Random Paper
      </button>

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}

      {generatedArticle && (
        <div className="mt-4 p-4 border rounded bg-white shadow max-w-md w-full">
          <div className="mb-2 font-semibold">{generatedArticle.topic}</div>
          <a
            href={generatedArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {generatedArticle.name}
          </a>
        </div>
      )}
    </main>
  );
}
