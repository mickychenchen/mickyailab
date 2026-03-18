import React, { useState } from 'react';

const CloudflareImageGen = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WORKERS_AI_API}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        }
      );
      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Cloudflare Text-to-Image</h2>
      <input 
        type="text" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="Describe the image..." 
        className="w-full p-2 border rounded mb-2 text-black"
      />
      <button 
        onClick={generateImage} 
        disabled={loading} 
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {image && <img src={image} alt="AI Generated" className="mt-4 w-full rounded" />}
    </div>
  );
};

export default CloudflareImageGen;
