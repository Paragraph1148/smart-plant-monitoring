// src/components/three/Scene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sky } from "@react-three/drei";
import PlantModel from "./PlantModel";

export default function Scene({ plantData }) {
  return (
    <Canvas
      camera={{ position: [6, 4, 6], fov: 50 }}
      shadows
      gl={{ antialias: true }}
    >
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00bfff" />

      {/* 3D Objects */}
      <PlantModel plantData={plantData} />

      {/* Environment */}
      <Environment preset="apartment" />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.8, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        target={[0, 0.5, 0]}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
