import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei'; // 1. Loader 불러오기
import Experience from './Experience';

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Experience />
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#000' }} // 배경색 검정
        innerStyles={{ background: '#fff', height: '5px' }} // 게이지 스타일
        barStyles={{ background: '#00ccff', height: '5px' }} // 채워지는 색 (형광파랑)
        dataStyles={{ color: '#fff', fontSize: '1.2rem' }} // 글씨 스타일
        dataInterpolation={(p) => `Loading... ${p.toFixed(0)}%`} // 텍스트 문구
      />
    </>
  );
}

export default App;