// src/app/api/download/route.ts
import { NextResponse } from 'next/server';
import { Downloader } from '@tobyg74/tiktok-api-dl';
import { TikTokApiResponse, DownloadData } from '@/types/tik.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const result = await Downloader(url, { version: 'v1' });
    console.log('API Response:', result); // Log for debugging
    if (result.status !== 'success') {
      return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
    }

    const data: TikTokApiResponse = result;
    const downloadData: DownloadData = {
      videoHD: data.result.video.playAddr[0] || '', // Use first playAddr URL
      videoSD: data.result.video.downloadAddr[0] || '', // Use first downloadAddr URL
      videoNoWatermark: data.result.video.playAddr[0] || '', // Adjust if no-watermark URL is available
      mp3: data.result.music.playUrl[0] || '', // Use first music playUrl
      avatar: data.result.author.avatarThumb[0] || data.result.author.avatarMedium[0] || '', // Use first avatar URL
      description: data.result.desc,
      nickname: data.result.author.nickname,
      uploadDate: new Date(data.result.createTime * 1000).toLocaleDateString(),
    };

    return NextResponse.json(downloadData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}