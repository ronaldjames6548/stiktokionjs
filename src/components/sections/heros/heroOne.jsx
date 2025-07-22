// src/components/sections/heros/heroOne.jsx
import Link from 'next/link';
import InputScreen from '../InputScreen';

export default function HeroOne() {
  return (
    <div className="hero-section-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content-2">
              <div className="sub-title-2" data-animation="fade-zoom-in" data-delay={0.4}>
                <p>Tiktokio</p>
              </div>
              <h2 data-animation="fade-up">Tiktok Downloader</h2>
              <h3 className="sub-title-2" data-animation="fade-up" data-delay={0.2}>
                Download TikTok Video Without Watermark Tiktok to mp4
              </h3>
              <div className="short-prompt" data-animation="fade-zoom-in">
                <ul>
                  <li>
                    <Link className="hover-bg" href="/portfolio">
                      Video
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio">Photo</Link>
                  </li>
                  <li>
                    <Link href="/portfolio">Story</Link>
                  </li>
                  <li>
                    <Link href="/portfolio">Douyin</Link>
                  </li>
                </ul>
              </div>
              <InputScreen />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}