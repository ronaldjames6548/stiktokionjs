// src/app/api/tiktok-download.js
import { Downloader } from '@tobyg74/tiktok-api-dl';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const urlTik = url.searchParams.get('url') || '';

    if (!urlTik) {
      return res.status(400).json({ error: 'url is required' });
    }

    // Unshorten Douyin links
    let finalUrl = urlTik;
    if (urlTik.includes('douyin')) {
      const response = await fetch(urlTik, {
        method: 'HEAD',
        redirect: 'follow',
      });
      finalUrl = response.url.replace('douyin', 'tiktok');
    }

    // Call the downloader
    const data = await Downloader(finalUrl, {
      version: 'v3',
    });

    // Force set type to 'story' if URL has '/story/'
    const isStory = finalUrl.includes('/story/');
    if (isStory && data?.result) {
      data.result.type = 'story';
    }

    // Add uploadDate if available
    const createTime = data?.result?.create_time;
    const uploadDate = createTime ? new Date(createTime * 1000).toISOString() : null;

    // Add uploadDate into the response object
    if (data?.result) {
      data.result.uploadDate = uploadDate;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error downloading TikTok video:', error);
    return res.status(500).json({ error: error.message });
  }
}