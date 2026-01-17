import { OrbitControls, Stars, Sparkles, MeshReflectorMaterial, Environment } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const SpaceScene = ({ autoRotate = true }) => {
  const environmentMap = useLoader(THREE.TextureLoader, '/space.png');
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  environmentMap.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <OrbitControls 
        makeDefault 
        autoRotate={autoRotate} 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2 - 0.05} 
        minDistance={10} 
        maxDistance={50} 
      />
      
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 20, 90]} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <Sparkles count={200} scale={30} size={3} speed={0.4} opacity={0.4} color="#ccaaff" />

      <Environment map={environmentMap} background={false} blur={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} distance={20} color="#aaaaff" />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
            blur={[300, 100]} resolution={2048} mixBlur={1} mixStrength={80}
            roughness={0.2} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.4}
            color="#202030" metalness={0.8} mirror={0.9} transparent={true} opacity={0.8}
        />
      </mesh>

      <EffectComposer>
        <Bloom intensity={2.5} luminanceThreshold={0.1} radius={0.7} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

export default SpaceScene;