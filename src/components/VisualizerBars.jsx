import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BAR_COUNT = 64;

const VisualizerBars = ({ sound, analyzer, isPlaying, vizMode, colorTheme }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    let data = [];
    if (isPlaying && sound.current && sound.current.isPlaying && analyzer.current) {
        data = analyzer.current.getFrequencyData();
    }

    const time = Date.now() * 0.002;
    const color = new THREE.Color();

    for (let i = 0; i < BAR_COUNT; i++) {
        let value = (isPlaying && sound.current?.isPlaying) ? (data[i] || 0) : (Math.sin(i * 0.2 + time) * 0.5 + 0.5) * 50;
        

        const yScale = Math.max(0.1, value / 20);
        
        // --- 좌표 계산 ---
        let x = 0, z = 0, rotationY = 0;
        if (vizMode === 'circle') {
            const angle = (i / BAR_COUNT) * Math.PI * 2;
            const radius = 8;
            x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; rotationY = -angle;
        } else if (vizMode === 'line') {
            const spacing = 0.4;
            x = (i - BAR_COUNT / 2) * spacing; z = 0; rotationY = 0;
        } else if (vizMode === 'spiral') {
            const angle = i * 0.2;
            const radius = 1 + (i * 0.15);
            x = Math.cos(angle) * radius; z = Math.sin(angle) * radius; rotationY = -angle;
        }
        
        dummy.position.set(x, yScale / 2, z);
        dummy.rotation.y = rotationY;
        dummy.scale.set(0.3, yScale, 0.3);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        // --- 색상 계산 ---
        switch (colorTheme) {
            case 'ocean': 
                color.setHSL(0.6 - (value/255)*0.15, 1.0, 0.5 + (value/255)*0.5); 
                break;
            case 'fire': 
                color.setHSL(0.0 + (value/255)*0.15, 1.0, 0.5 + (value/255)*0.5); 
                break;
            case 'forest': 
                color.setHSL(0.3 - (value/255)*0.15, 1.0, 0.5 + (value/255)*0.5); 
                break;
            case 'default': 
            default: 
                color.setHSL(0.76 + (value/255)*0.14, 1.0, 0.5 + (value/255)*0.5); 
                break;
        }

        // 발광 효과 (강도 5배)
        color.multiplyScalar(5); 

        meshRef.current.setColorAt(i, color);
    }
    
    // 위치 업데이트
    meshRef.current.instanceMatrix.needsUpdate = true;
    // 색상 업데이트
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, BAR_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial 
        toneMapped={false} 
        roughness={0.2} 
        metalness={0} 
      />
    </instancedMesh>
  );
};

export default VisualizerBars;