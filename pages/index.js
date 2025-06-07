import { useState } from 'react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState(null); // State to store the generated article
  const topics = [
    'All Topics',
    'Marine Biology',
    'Oceanography',
    'Ecology',
    'Climate Science',
    'Environmental Science',
    'Fisheries Science',
    'Zoology',
    'Geology',
    'Marine Botany',
  ];

  const extractPaperTitleFromURL = async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();

      // Attempt to extract the <title> content
      const match = html.match(/<title>(.*?)\| Semantic Scholar<\/title>/);

      if (match && match[1]) {
        const cleanTitle = match[1].trim();
        return cleanTitle;
      } else {
        // Fallback: Extract article name from the URL
        const urlMatch = url.match(/\/paper\/([^/]+)\//); // Match the name between "/paper/" and the next "/"
        const fallbackTitle = urlMatch ? decodeURIComponent(urlMatch[1].replace(/-/g, ' ')) : 'Unknown Article';
        return fallbackTitle;
      }
    } catch (error) {
      console.error('Error fetching or parsing:', error);

      // Fallback: Extract article name from the URL
      const urlMatch = url.match(/\/paper\/([^/]+)\//); // Match the name between "/paper/" and the next "/"
      const fallbackTitle = urlMatch ? decodeURIComponent(urlMatch[1].replace(/-/g, ' ')) : 'Failed to fetch title';
      return fallbackTitle;
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopic) {
      alert('Please select a topic first.');
      return;
    }

    try {
      const queryTopic = selectedTopic === 'All Topics' ? 'marine science' : selectedTopic;
      const response = await fetch(`/api/random?topic=${encodeURIComponent(queryTopic)}`);
      const paper = await response.json();

      if (paper.url) {
        // Use the topic and URL as identifiers
        setGeneratedArticle({ topic: selectedTopic, url: paper.url, name: `Article from ${selectedTopic}` });
        window.open(paper.url, '_blank');
      } else {
        alert('No link found for this paper.');
      }
    } catch (err) {
      alert('Error fetching paper.');
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
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Generate Random Paper
      </button>
    </main>
  );
}
