import { useState, useEffect, useMemo } from 'react';

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [bubblesOn, setBubblesOn] = useState(true);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

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

  const showToastWithMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500); // Start fade-out before hiding
    setTimeout(() => setShowToast(false), 2000);    // Hide after fade-out
  };

  const handleSaveArticle = () => {
    if (!generatedArticle) {
      showToastWithMessage('No article generated to save!');
      return;
    }

    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    // Check for duplicate by URL
    const alreadySaved = savedArticles.some(article => article.url === generatedArticle.url);

    if (alreadySaved) {
      showToastWithMessage('This article is already saved!');
      return;
    }

    const updatedArticles = [...savedArticles, generatedArticle];
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    showToastWithMessage('Article saved!');
  };

  const navigateToSavedArticles = () => {
    window.location.href = '/saved-articles';
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-b from-white via-gray-100 to-white text-black dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed ${isMobile ? 'bottom-6' : 'top-6'} left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-300 ${
            toastVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            pointerEvents: 'none',
            backgroundColor:
              toastMessage === 'No article generated to save!' || toastMessage === 'This article is already saved!'
                ? '#f87171'
                : '#16a34a'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top left for all devices */}
      <div className="absolute top-6 left-6 z-10">
        {/* Bubble Toggle Button */}
        <button
          onClick={() => setBubblesOn((on) => !on)}
          className={`
            flex items-center px-3 py-1 text-sm rounded-md font-semibold shadow transition
            ${bubblesOn
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }
          `}
          aria-pressed={bubblesOn}
          style={{ minWidth: 0 }}
        >
          {bubblesOn ? 'Bubbles: On' : 'Bubbles: Off'}
          <span
            className={`ml-2 w-4 h-4 rounded-full border-2 border-white ${bubblesOn ? 'bg-blue-400' : 'bg-gray-400'}`}
          ></span>
        </button>
      </div>

      {/* Top right for all devices */}
      <div className="absolute top-6 right-6 flex space-x-2 items-center">
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
        className="p-3 border rounded-md mb-4 w-full max-w-md text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow"
      >
        <option value="">-- Select a topic --</option>
        <option value="marine science">Marine Science</option>
        <option value="oceanography">Oceanography</option>
        <option value="ecology">Ecology</option>
        <option value="biology">Biology</option>
        <option value="climate science">Climate Science</option>
        <option value="marine pollution">Marine Pollution</option>
        <option value="fisheries">Fisheries</option>
        <option value="coral reefs">Coral Reefs</option>
        <option value="marine ecosystems">Marine Ecosystems</option>
        <option value="plankton">Plankton</option>
        <option value="deep sea">Deep Sea</option>
        <option value="marine mammals">Marine Mammals</option>
        <option value="coastal management">Coastal Management</option>
        <option value="marine technology">Marine Technology</option>
        {/* Add or remove topics as you wish */}
      </select>

      <button
        onClick={handleGenerate}
        className="mb-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-semibold shadow"
      >
        Generate Random Paper
      </button>

      {error && (
        <div className="mt-4 p-4 max-w-md w-full bg-red-100 text-red-700 border border-red-300 rounded shadow text-center font-medium">
          {error}
        </div>
      )}

      {generatedArticle && (
        <div className="mt-4 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-md w-full flex flex-col items-start">
          <span className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            {generatedArticle.topic}
          </span>
          <a
            href={generatedArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400 text-lg font-medium break-words"
            style={{ wordBreak: 'break-word' }}
          >
            {generatedArticle.name}
          </a>
        </div>
      )}

      {/* Bubble animation component */}
      {bubblesOn && <Bubbles />}

      {isMobile && (
        <div className="absolute top-6 left-6 flex space-x-2 items-center">
          {/* Bubble Toggle Button */}
          <button
            onClick={() => setBubblesOn((on) => !on)}
            className={`
              flex items-center px-3 py-1 text-sm rounded-md font-semibold shadow transition
              ${bubblesOn
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }
            `}
            aria-pressed={bubblesOn}
            style={{ minWidth: 0 }}
          >
            {bubblesOn ? 'Bubbles: On' : 'Bubbles: Off'}
            <span
              className={`ml-2 w-4 h-4 rounded-full border-2 border-white ${bubblesOn ? 'bg-blue-400' : 'bg-gray-400'}`}
            ></span>
          </button>
        </div>
      )}
    </main>
  );
}

// Bubble animation component
function Bubbles() {
  // Generate bubbles only once per page load
  const bubbles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        left: Math.random() * 100, // percent
        size: 10 + Math.random() * 30, // px
        delay: Math.random() * 5, // seconds
        duration: 4 + Math.random() * 4, // seconds
        opacity: 0.3 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none z-0">
      {bubbles.map((bubble, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${bubble.left}%`,
            bottom: '-40px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            background: 'radial-gradient(circle at 30% 30%, #60a5fa 70%, #2563eb 100%)',
            borderRadius: '50%',
            animation: `bubbleUp ${bubble.duration}s linear ${bubble.delay}s infinite`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
      <style>{`
        @keyframes bubbleUp {
          0% {
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
