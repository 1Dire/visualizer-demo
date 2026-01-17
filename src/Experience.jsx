import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYLIST } from './playlist';

import SpaceScene from './components/SpaceScene';
import VisualizerBars from './components/VisualizerBars';
import PlayerUI from './components/PlayerUI';

const Experience = () => {
  const { camera, size } = useThree(); 
  const sound = useRef();
  const analyzer = useRef();
  const controlsRef = useRef();

  // --- 상태 관리 ---
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [vizMode, setVizMode] = useState('circle');
  const [colorTheme, setColorTheme] = useState('default');
  const [baseZ, setBaseZ] = useState(18); 

  // 1. 화면 크기에 따른 기본 카메라 위치
  useEffect(() => {
    const isMobile = size.width < 768;
    const targetZ = isMobile ? 26 : 18;
    setBaseZ(targetZ);
    camera.position.set(0, 8, targetZ);
    camera.lookAt(0, 0, 0);
  }, [size.width, camera]);

  // 🎵 2. 오디오 로직 (자동 재생 추가됨)
  useEffect(() => {
    setIsLoaded(false);
    
    // 기존 오디오 클린업
    if (sound.current) {
        if (sound.current.isPlaying) sound.current.stop();
        sound.current.onEnded = null; // 이전 곡의 이벤트 리스너 제거 방지
    }

    const listener = new THREE.AudioListener();
    if (camera.children.length > 0) camera.remove(camera.children[0]);
    camera.add(listener);

    const audio = new THREE.Audio(listener);
    const fileLoader = new THREE.AudioLoader();

    fileLoader.load(PLAYLIST[currentSongIdx].url, (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(false); // 🔥 [수정] 반복 재생 끄기
        audio.setVolume(volume);
        
        // 🔥 [추가] 노래가 끝나면 자동으로 다음 곡으로
        audio.onEnded = () => {
            audio.isPlaying = false;
            // 다음 곡 인덱스로 변경 (isPlaying 상태는 true 유지 -> 다음 곡 자동 재생)
            setCurrentSongIdx((prev) => (prev + 1) % PLAYLIST.length);
        };

        sound.current = audio;
        analyzer.current = new THREE.AudioAnalyser(audio, 128);
        setIsLoaded(true);
        if (isPlaying) audio.play();
    });

    return () => { 
        if (audio.isPlaying) audio.stop(); 
        audio.onEnded = null; // 🔥 [중요] 클린업 시 이벤트 제거 (수동 이동 시 중복 실행 방지)
    };
  }, [currentSongIdx]);

  useEffect(() => { if (sound.current) sound.current.setVolume(volume); }, [volume]);

  // 3. 카메라 무빙 애니메이션
  useFrame((state, delta) => {
    if (controlsRef.current) {
        // 자동 회전 로직이 필요하다면 여기에 추가
    }

    if (isPlaying && analyzer.current) {
        const data = analyzer.current.getFrequencyData();
        let bass = 0;
        for (let i = 0; i < 10; i++) bass += data[i];
        bass = bass / 10;

        const bounceStrength = bass > 100 ? (bass / 255) * 2 : 0; 
        const targetZ = baseZ + bounceStrength * 3; 
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    }
  });

  const togglePlay = () => {
    if (!sound.current || !isLoaded) return;
    if (sound.current.isPlaying) { sound.current.pause(); setIsPlaying(false); }
    else { sound.current.play(); setIsPlaying(true); }
  };
  const nextSong = () => { setCurrentSongIdx((p) => (p + 1) % PLAYLIST.length); setIsPlaying(true); };
  const prevSong = () => { setCurrentSongIdx((p) => (p - 1 + PLAYLIST.length) % PLAYLIST.length); setIsPlaying(true); };

  return (
    <>
      <SpaceScene autoRotate={true} /> 

      <VisualizerBars 
        sound={sound} 
        analyzer={analyzer} 
        isPlaying={isPlaying} 
        vizMode={vizMode} 
        colorTheme={colorTheme} 
      />

      <PlayerUI 
        currentSongIdx={currentSongIdx}
        isPlaying={isPlaying}
        volume={volume}
        vizMode={vizMode} setVizMode={setVizMode}
        colorTheme={colorTheme} setColorTheme={setColorTheme}
        onTogglePlay={togglePlay}
        onNext={nextSong}
        onPrev={prevSong}
        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </>
  );
};

export default Experience;