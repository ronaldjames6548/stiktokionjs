// src/components/sections/heros/heroOne.jsx
'use client';

import Link from 'next/link';
import InputScreen from '../InputScreen';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HeroOne() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="hero-section-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content-2">
              <div className="sub-title-2" data-aos="fade-zoom-in" data-aos-delay="400">
                <p>Tiktokio</p>
              </div>
              <h2 data-aos="fade-up">Tiktok Downloader</h2>
              <h3 className="sub-title-2" data-aos="fade-up" data-aos-delay="200">
                Download TikTok Video Without Watermark Tiktok to mp4
              </h3>
              <div className="short-prompt" data-aos="fade-zoom-in">
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