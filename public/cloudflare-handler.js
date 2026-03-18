async function generateCloudflareImage(prompt) {
  const response = await fetch('/api/cloudflare-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data.image;
}
