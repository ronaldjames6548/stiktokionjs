// src/components/sections/InputScreen.tsx
'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TikTokData {
  status: string | null;
  result: {
    type: string | null;
    author: {
      avatar: string | null;
      nickname: string | null;
    };
    desc: string | null;
    videoSD: string | null;
    videoHD: string | null;
    video_hd: string | null;
    videoWatermark: string | null;
    music: string | null;
    uploadDate?: string | null;
  };
}

const InputScreen = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<TikTokData | null>(null);
  const [loading, setLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tiktok-download?url=${encodeURIComponent(url)}`);
     
	  console.log('API Response:', json); 
      if (json.status === 'error') throw new Error(json.error);
      setData(json ?? null);
      loadAd();
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-center',
        autoClose: 3000,
        style: { fontSize: '16px' },
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' } as any);
      if (permission.state === 'granted' || permission.state === 'prompt') {
        const text = await navigator.clipboard.readText();
        setUrl(text);
      } else {
        toast.error('Clipboard access denied', {
          position: 'bottom-center',
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('Clipboard access denied', {
        position: 'bottom-center',
        autoClose: 3000,
      });
    }
  };

  const loadAd = () => {
    const adContainer = document.getElementById('ad-banner');
    if (!adContainer) return;

    adContainer.innerHTML = '';

    if (!document.getElementById('aclib')) {
      const script = document.createElement('script');
      script.id = 'aclib';
      script.src = 'https://acscdn.com/script/aclib.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.aclib !== 'undefined') {
          runAdcashBanner();
        } else {
          showFallbackAd();
        }
      };
      script.onerror = () => {
        showFallbackAd();
      };
      document.body.appendChild(script);
    } else {
      if (typeof window.aclib !== 'undefined') {
        runAdcashBanner();
      } else {
        showFallbackAd();
      }
    }
  };

  const runAdcashBanner = () => {
    const adContainer = document.getElementById('ad-banner');
    if (!adContainer) return;

    try {
      adContainer.innerHTML = '<div id="ac-banner"></div>';
      window.aclib.runBanner({
        zoneId: '9480206',
        width: 336,
        height: 280,
        container: document.getElementById('ac-banner'),
      });
      setAdLoaded(true);
    } catch (e) {
      console.error('Adcash error:', e);
      showFallbackAd();
    }
  };

  const showFallbackAd = () => {
    const adContainer = document.getElementById('ad-banner');
    if (!adContainer) return;

    adContainer.innerHTML = `
      <div className="ad-fallback">
        <div className="ad-fallback-content">
          <p>Advertisement</p>
          <p className="ad-fallback-text">Ad failed to load</p>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    return () => {
      const script = document.getElementById('aclib');
      if (script) script.remove();
    };
  }, []);

  return (
    <div className="container">
      <ToastContainer />

      {/* Input Form Section */}
      <div className="download-box">
        <div className="form-container">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!url) {
                toast.error('Please enter a valid URL', {
                  position: 'bottom-center',
                  autoClose: 3000,
                });
              } else {
                fetchData();
              }
            }}
          >
            <div className="input-container">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste TikTok video link here"
                className="input-field"
              />
              <button type="button" onClick={handlePaste} className="paste-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                  />
                </svg>
                Paste
              </button>
            </div>
            <button type="submit" className="download-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {data && (
        <div className="result-container">
          <div className="result-box">
            <div className="result-content">
              <div className="video-section">
                <div className="video-wrapper">
                <video controls src={data.result.videoSD || data.result.videoHD || data.result.videoWatermark || data.result.music || ''} className="video" referrerPolicy="no-referrer"/>

				</div>
              </div>

              <div className="info-section">
                <div className="info-header">
                  <img
                    src={data.result.author.avatar || ''}
                    alt={data.result.author.nickname || ''}
                    className="avatar"
                  />
                  <h2 className="nickname">{data.result.author.nickname}</h2>
                  <div className="badge"></div>
                </div>
                <div className="description">{data.result.desc}</div>

                <div className="ad-container">
                  <div id="ad-banner" className="ad-banner">
                    {!adLoaded && (
                      <div className="ad-fallback">
                        <div className="ad-fallback-content">
                          <div className="animate-pulse">Loading advertisement...</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="download-buttons">
                  {data.result.videoSD && (
                    <button className="download-button sd">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <a
                        href={`https://dl.tiktokiocdn.workers.dev/api/download?url=${encodeURIComponent(data.result.videoSD)}&type=.mp4&title=${encodeURIComponent(data.result.author.nickname || '')}`}
                        className="download-link"
                      >
                        Download SD (No Watermark)
                      </a>
                    </button>
                  )}
                  {data.result.videoHD && (
                    <button className="download-button hd">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <a
                        href={`https://dl.tiktokiocdn.workers.dev/api/download?url=${encodeURIComponent(data.result.videoHD)}&type=.mp4&title=${encodeURIComponent(data.result.author.nickname || '')}`}
                        className="download-link"
                      >
                        Download HD (No Watermark)
                      </a>
                    </button>
                  )}
                  {data.result.videoWatermark && (
                    <button className="download-button watermark">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <a
                        href={`https://dl.tiktokiocdn.workers.dev/api/download?url=${encodeURIComponent(data.result.videoWatermark)}&type=.mp4&title=${encodeURIComponent(data.result.author.nickname || '')}`}
                        className="download-link"
                      >
                        Download (With Watermark)
                      </a>
                    </button>
                  )}
                  <button className="download-button another">
                    <a href="/" className="download-link">
                      Download Another Video
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputScreen;