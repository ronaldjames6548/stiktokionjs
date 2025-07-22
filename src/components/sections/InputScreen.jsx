// components/InputScreen.tsx
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the TikTokData interface
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
  const [error, setError] = useState('');
  const [adLoaded, setAdLoaded] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/tiktok-download?url=${encodeURIComponent(url)}`);
      const json = await res.json();
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

    // Clear previous content
    adContainer.innerHTML = '';

    // Create the AC script if it doesn't exist
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
      // Script already exists, just run the banner
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
      <div style="width:336px;height:280px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;border-radius:8px;border:1px dashed #ddd;">
        <div style="text-align:center;color:#666;">
          <p>Advertisement</p>
          <p style="font-size:12px;margin-top:8px;">Ad failed to load</p>
        </div>
      </div>
    `;
  };

  // Cleanup script on component unmount
  useEffect(() => {
    return () => {
      const script = document.getElementById('aclib');
      if (script) script.remove();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <ToastContainer />

      {/* Input Form Section */}
      <div className="max-w-6xl mx-auto">
        <div className="download-box rounded-2xl">
          <div className="bg-cyan-800/80 rounded-xl backdrop-blur-md p-4">
            <form
              className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
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
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste TikTok video link here"
                  className="w-full h-14 border-gray-700 text-black rounded-xl px-5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 flex-1 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
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
              <button
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {data && (
        <div className="mt-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="relative rounded-lg overflow-hidden max-h-[430px]">
                    <video
                      controls
                      src={data.result.videoSD || data.result.videoHD || data.result.videoWatermark || data.result.music || ''}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="md:w-2/3 flex flex-col justify-between">
                  <div className="mb-3">
                    <div className="flex items-center gap-3 justify-between mb-1">
                      <img
                        src={data.result.author.avatar || ''}
                        alt={data.result.author.nickname || ''}
                        className="rounded-full w-24 h-24"
                      />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.result.author.nickname}</h2>
                      <div className="text-gray-400 text-xs px-2 py-1 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-xs mb-2">{data.result.desc}</div>

                    {/* Ad Banner Container */}
                    <div className="flex justify-center my-4">
                      <div id="ad-banner" style={{ minHeight: '280px', width: '336px', margin: '0 auto' }}>
                        {!adLoaded && (
                          <div
                            style={{
                              width: '336px',
                              height: '280px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f5f5f5',
                              borderRadius: '8px',
                            }}
                          >
                            <div className="animate-pulse text-gray-400">Loading advertisement...</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {data.result.videoSD && (
                      <button className="download-button bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 w-full text-white py-2 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                          className="btn"
                        >
                          Download SD (No Watermark)
                        </a>
                      </button>
                    )}
                    {data.result.videoHD && (
                      <button className="download-button bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-500 hover:to-pink-300 w-full text-white py-2 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                          className="btn"
                        >
                          Download HD (No Watermark)
                        </a>
                      </button>
                    )}
                    {data.result.videoWatermark && (
                      <button className="download-button bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 w-full text-white py-2 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                          className="btn"
                        >
                          Download (With Watermark)
                        </a>
                      </button>
                    )}
                    <button className="download-button bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 w-full text-white py-2 rounded-lg flex items-center justify-center">
                      <a href="/" className="btn">
                        Download Another Video
                      </a>
                    </button>
                  </div>
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