import React from 'react';
import { useKitchenStore } from '../store';

export function KitchenBoundary() {
  const boundary = useKitchenStore((state) => state.boundary);
  const fixtures = useKitchenStore((state) => state.fixtures);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[boundary.width, boundary.depth]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Walls */}
      <group>
        {/* Back wall */}
        <mesh position={[0, boundary.height / 2, -boundary.depth / 2]}>
          <planeGeometry args={[boundary.width, boundary.height]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>

        {/* Left wall */}
        <mesh 
          position={[-boundary.width / 2, boundary.height / 2, 0]} 
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[boundary.depth, boundary.height]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>

        {/* Right wall */}
        <mesh 
          position={[boundary.width / 2, boundary.height / 2, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[boundary.depth, boundary.height]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>

      {/* Fixed Fixtures */}
      {fixtures.map((fixture, index) => (
        <mesh
          key={index}
          position={fixture.position}
          rotation={fixture.rotation}
        >
          <boxGeometry 
            args={[
              fixture.dimensions.width,
              fixture.dimensions.height,
              fixture.dimensions.depth
            ]} 
          />
          <meshStandardMaterial 
            color={fixture.type === 'door' ? '#8b4513' : '#87ceeb'}
            transparent={fixture.type === 'window'}
            opacity={fixture.type === 'window' ? 0.5 : 1}
          />
        </mesh>
      ))}
    </group>
  );
}