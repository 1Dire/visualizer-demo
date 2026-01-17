import React from 'react';
import { Html } from '@react-three/drei';
import { PLAYLIST } from '../playlist';

const PlayerUI = ({ 
  currentSongIdx, 
  isPlaying, 
  volume, 
  vizMode, 
  setVizMode, 
  colorTheme, 
  setColorTheme, 
  onTogglePlay, 
  onNext, 
  onPrev, 
  onVolumeChange 
}) => {
  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <style>
        {`
          /* --- 기본 PC 스타일 --- */
          
          /* 컨테이너 반응형 스타일 */
          .ui-container {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 500px;
            background: rgba(0, 0, 0, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px;
            color: white;
            font-family: 'Inter', sans-serif;
            pointer-events: auto;
            user-select: none;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease; /* 부드러운 크기 변화 */
          }

          .play-btn {
            background: rgba(255,255,255,0.1); backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.3); border-radius: 50%;
            width: 70px; height: 70px;
            font-size: 2rem; color: white; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
          }
          .play-btn:hover {
            background: rgba(255,255,255,0.2); transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255,255,255,0.3);
          }

          .nav-btn {
            background: none; border: none;
            font-size: 2rem; color: rgba(255,255,255,0.7);
            cursor: pointer; transition: 0.2s;
            display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; padding: 0;
          }

          .text-mode-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 1px;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.2s ease;
          }
          .text-mode-btn.active {
            background: white; color: black; border-color: white;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); font-weight: 800;
          }

          .color-swatch {
            width: 24px; height: 24px; border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2); cursor: pointer; transition: all 0.2s;
          }
          
          /* 슬라이더 */
          .minimal-range {
            -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px;
            background: transparent; outline: none; cursor: pointer;
          }
          .minimal-range::-webkit-slider-thumb {
            -webkit-appearance: none; width: 14px; height: 14px;
            border-radius: 50%; background: #ffffff; cursor: pointer;
            margin-top: -5px; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }

          /* 📱 모바일 반응형 (화면 폭 600px 이하) */
          @media (max-width: 600px) {
            .ui-container {
              width: 95%;        /* 가로폭 더 넓게 */
              padding: 20px;     /* 패딩 줄임 */
              bottom: 20px;      /* 하단 여백 줄임 */
              gap: 15px;         /* 요소 간 간격 줄임 */
            }
            .play-btn {
              width: 55px; height: 55px; font-size: 1.5rem; /* 버튼 작게 */
            }
            .nav-btn {
              font-size: 1.5rem; width: 30px; height: 30px;
            }
            .text-mode-btn {
              padding: 6px 12px; font-size: 0.65rem; /* 텍스트 버튼 작게 */
            }
            .color-swatch {
              width: 20px; height: 20px;
            }
            /* 타이틀 폰트 줄이기 */
            .title-text {
              font-size: 1rem !important;
            }
          }
        `}
      </style>

      {/* CSS 클래스 적용 */}
      <div className="ui-container" onPointerDown={(e) => e.stopPropagation()}>
          
          {/* 타이틀 */}
          <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '2px', marginBottom: '5px' }}>NOW PLAYING</div>
              <div className="title-text" style={{ fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                  {PLAYLIST[currentSongIdx].title}
              </div>
          </div>

          {/* 재생 컨트롤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <button className="nav-btn" onClick={onPrev}>⏮</button>
              <button className="play-btn" onClick={onTogglePlay} style={{ paddingLeft: isPlaying ? '0' : '4px' }}>
                  {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="nav-btn" onClick={onNext}>⏭</button>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

          {/* 모드 & 테마 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                  <button className={`text-mode-btn ${vizMode === 'circle' ? 'active' : ''}`} onClick={() => setVizMode('circle')}>CIRCLE</button>
                  <button className={`text-mode-btn ${vizMode === 'line' ? 'active' : ''}`} onClick={() => setVizMode('line')}>LINE</button>
                  <button className={`text-mode-btn ${vizMode === 'spiral' ? 'active' : ''}`} onClick={() => setVizMode('spiral')}>SPIRAL</button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                  <button className={`color-swatch ${colorTheme === 'default' ? 'active' : ''}`} style={{ background: 'linear-gradient(135deg, #aa00ff, #ff00aa)' }} onClick={() => setColorTheme('default')} />
                  <button className={`color-swatch ${colorTheme === 'ocean' ? 'active' : ''}`} style={{ background: 'linear-gradient(135deg, #00bfff, #00ffff)' }} onClick={() => setColorTheme('ocean')} />
                  <button className={`color-swatch ${colorTheme === 'fire' ? 'active' : ''}`} style={{ background: 'linear-gradient(135deg, #ff4500, #ffff00)' }} onClick={() => setColorTheme('fire')} />
                  <button className={`color-swatch ${colorTheme === 'forest' ? 'active' : ''}`} style={{ background: 'linear-gradient(135deg, #32cd32, #adff2f)' }} onClick={() => setColorTheme('forest')} />
              </div>
          </div>

          {/* 볼륨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%', padding: '0 5px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', width: '25px' }}>VOL</span>
              <input type="range" className="minimal-range" min="0" max="1" step="0.01" value={volume} onChange={onVolumeChange} style={{ background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume * 100}%, #555555 ${volume * 100}%, #555555 100%)` }} />
          </div>
      </div>
    </Html>
  );
};

export default PlayerUI;