// src/app/api/tiktok-download/route.js
import { NextResponse } from 'next/server';
import { Downloader } from '@tobyg74/tiktok-api-dl';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlTik = searchParams.get('url') || '';

    if (!urlTik) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    let finalUrl = urlTik;
    if (urlTik.includes('douyin')) {
      const response = await fetch(urlTik, {
        method: 'HEAD',
        redirect: 'follow',
      });
      finalUrl = response.url.replace('douyin', 'tiktok');
    }

    const data = await Downloader(finalUrl, {
      version: 'v3',
    });

    const isStory = finalUrl.includes('/story/');
    if (isStory && data?.result) {
      data.result.type = 'story';
    }

    const createTime = data?.result?.create_time;
    const uploadDate = createTime ? new Date(createTime * 1000).toISOString() : null;

    if (data?.result) {
      data.result.uploadDate = uploadDate;
      data.result.videoSD = data.result.video?.playAddr || null;
      data.result.videoHD = data.result.video?.playAddr || null;
      data.result.videoWatermark = data.result.video?.wmplayAddr || null;
      data.result.author = {
        avatar: data.result.author?.avatar || null,
        nickname: data.result.author?.nickname || null,
      };
      data.result.desc = data.result.desc || null;
      data.result.music = data.result.music?.playAddr || null;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error downloading TikTok video:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}