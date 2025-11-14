import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import PlantModel from "./PlantModel";

export default function Scene({ plantData }) {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* 3D Objects */}
      <PlantModel plantData={plantData} />

      {/* Environment */}
      <Environment preset="city" />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </Canvas>
  );
}
