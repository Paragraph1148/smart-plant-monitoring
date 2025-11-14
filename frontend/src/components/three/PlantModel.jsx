import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PlantModel({ plantData }) {
  const groupRef = useRef();

  // Simple animation - we'll replace this with GSAP later
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pot */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1, 1, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Soil - color changes based on moisture */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.4, 32]} />
        <meshStandardMaterial
          color={plantData.moisture > 40 ? "#5d4037" : "#a1887f"}
        />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>

      {/* Leaves - simple representation */}
      <mesh position={[0.8, 1.2, 0]} rotation={[0, 0, 0.5]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      <mesh position={[-0.7, 1.5, 0.3]} rotation={[0, 0, -0.4]} castShadow>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
    </group>
  );
}
