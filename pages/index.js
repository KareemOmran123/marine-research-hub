import { useState } from 'react';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState('');
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
        window.open(paper.url, '_blank');
      } else {
        alert('No link found for this paper.');
      }
    } catch (err) {
      alert('Error fetching paper.');
    }
  };  

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      <DarkModeToggle />
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
