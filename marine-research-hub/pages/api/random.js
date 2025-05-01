export default async function handler(req, res) {
    const { topic } = req.query;
  
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
  
    const encodedQuery = encodeURIComponent(topic);
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&fields=title,url,authors,year,venue&limit=50`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data?.data?.length) {
        return res.status(404).json({ error: 'No papers found for this topic' });
      }
  
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const randomPaper = data.data[randomIndex];
  
      return res.status(200).json(randomPaper);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
  