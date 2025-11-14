// src/components/three/PlantModel.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export default function PlantModel({ plantData }) {
  const groupRef = useRef();
  const leavesRef = useRef([]);
  const soilRef = useRef();
  const waterEffectRef = useRef();

  // Plant states animation
  useFrame(() => {
    if (!groupRef.current || !leavesRef.current.length) return;

    const moistureLevel = plantData.moisture;
    const isWatering = plantData.pumpStatus;

    // Animate leaves based on moisture
    leavesRef.current.forEach((leaf, index) => {
      if (leaf) {
        // Droop effect when thirsty
        const droopAmount = Math.max(0, (40 - moistureLevel) / 40) * 0.5;
        const targetRotation = new THREE.Euler(
          -0.2 + Math.sin(Date.now() * 0.001 + index) * 0.1,
          0,
          -droopAmount + Math.sin(Date.now() * 0.002 + index) * 0.05
        );

        gsap.to(leaf.rotation, {
          x: targetRotation.x,
          y: targetRotation.y,
          z: targetRotation.z,
          duration: 2,
          ease: "power2.out",
        });

        // Color change based on health
        const healthColor =
          moistureLevel > 60
            ? "#4caf50"
            : moistureLevel > 30
            ? "#8bc34a"
            : "#ff9800";

        gsap.to(leaf.material.color, {
          r: new THREE.Color(healthColor).r,
          g: new THREE.Color(healthColor).g,
          b: new THREE.Color(healthColor).b,
          duration: 3,
        });
      }
    });

    // Soil color animation
    if (soilRef.current) {
      const soilColor =
        moistureLevel > 60
          ? "#5d4037"
          : moistureLevel > 30
          ? "#8d6e63"
          : "#a1887f";

      gsap.to(soilRef.current.material.color, {
        r: new THREE.Color(soilColor).r,
        g: new THREE.Color(soilColor).g,
        b: new THREE.Color(soilColor).b,
        duration: 2,
      });
    }

    // Watering effect
    if (waterEffectRef.current) {
      if (isWatering) {
        waterEffectRef.current.visible = true;
        waterEffectRef.current.position.y = Math.sin(Date.now() * 0.01) * 0.1;
        waterEffectRef.current.scale.setScalar(
          1 + Math.sin(Date.now() * 0.02) * 0.1
        );
      } else {
        waterEffectRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pot */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.1, 1.2, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Soil */}
      <mesh ref={soilRef} position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#5d4037" roughness={1} metalness={0} />
      </mesh>

      {/* Main Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>

      {/* Leaves */}
      <mesh
        ref={(el) => (leavesRef.current[0] = el)}
        position={[0.6, 0.8, 0.2]}
        rotation={[0.3, 0, 0.4]}
        castShadow
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      <mesh
        ref={(el) => (leavesRef.current[1] = el)}
        position={[-0.7, 1.0, 0.1]}
        rotation={[0.2, 0, -0.5]}
        castShadow
      >
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      <mesh
        ref={(el) => (leavesRef.current[2] = el)}
        position={[0.3, 1.3, -0.3]}
        rotation={[-0.1, 0, 0.2]}
        castShadow
      >
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      <mesh
        ref={(el) => (leavesRef.current[3] = el)}
        position={[-0.4, 1.4, 0.4]}
        rotation={[0.1, 0, -0.3]}
        castShadow
      >
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      {/* Watering Effect */}
      <mesh ref={waterEffectRef} position={[0, 0.5, 0]} visible={false}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#00bfff"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Small decorative stones */}
      {[-0.8, -0.3, 0.3, 0.7].map((x, i) => (
        <mesh key={i} position={[x, -0.3, (i % 2) * 0.6 - 0.3]} castShadow>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#757575" />
        </mesh>
      ))}
    </group>
  );
}
