import { useState } from 'react';

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const topics = [
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
      const response = await fetch(`/api/random?topic=${encodeURIComponent(selectedTopic)}`);
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Marine Science Paper Generator</h1>

      <select
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        className="p-3 border rounded-md mb-4 w-full max-w-md text-black"
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
