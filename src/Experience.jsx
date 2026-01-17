import React, { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLAYLIST } from "./playlist";

import SpaceScene from "./components/SpaceScene";
import VisualizerBars from "./components/VisualizerBars";
import PlayerUI from "./components/PlayerUI";

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
  const [vizMode, setVizMode] = useState("circle");
  const [colorTheme, setColorTheme] = useState("default");
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
      sound.current.onEnded = null;
    }

    const listener = new THREE.AudioListener();
    if (camera.children.length > 0) camera.remove(camera.children[0]);
    camera.add(listener);

    const audio = new THREE.Audio(listener);
    const fileLoader = new THREE.AudioLoader();

    fileLoader.load(PLAYLIST[currentSongIdx].url, (buffer) => {
      audio.setBuffer(buffer);
      audio.setLoop(false);
      audio.setVolume(volume);

      audio.onEnded = () => {
        audio.isPlaying = false;
        setCurrentSongIdx((prev) => (prev + 1) % PLAYLIST.length);
      };

      sound.current = audio;
      analyzer.current = new THREE.AudioAnalyser(audio, 128);
      setIsLoaded(true);
      if (isPlaying) audio.play();
    });

    return () => {
      if (audio.isPlaying) audio.stop();
      audio.onEnded = null;
    };
  }, [currentSongIdx]);

  useEffect(() => {
    if (sound.current) sound.current.setVolume(volume);
  }, [volume]);

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
    if (sound.current.isPlaying) {
      sound.current.pause();
      setIsPlaying(false);
    } else {
      sound.current.play();
      setIsPlaying(true);
    }
  };
  const nextSong = () => {
    setCurrentSongIdx((p) => (p + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };
  const prevSong = () => {
    setCurrentSongIdx((p) => (p - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

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
        vizMode={vizMode}
        setVizMode={setVizMode}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        onTogglePlay={togglePlay}
        onNext={nextSong}
        onPrev={prevSong}
        onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </>
  );
};

export default Experience;
