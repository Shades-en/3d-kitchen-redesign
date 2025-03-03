import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PivotControls, Html, useGLTF } from '@react-three/drei';
import { KitchenItem as KitchenItemType } from '../types';
import { useKitchenStore } from '../store';
import * as THREE from 'three';

interface Props {
  item: KitchenItemType;
}

export function KitchenItem({ item }: Props) {
  const setSelectedItem = useKitchenStore((state) => state.setSelectedItem);
  const selectedItemId = useKitchenStore((state) => state.selectedItemId);
  const updateItem = useKitchenStore((state) => state.updateItem);
  const boundary = useKitchenStore((state) => state.boundary);

  const [isDragging, setIsDragging] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Load the GLB model
  const { scene } = useGLTF(item.modelPath);
  // Clone the scene to avoid sharing materials between instances
  const model = scene.clone();

  useEffect(() => {
    if (model && groupRef.current) {
      // Add a check to prevent multiple executions
      if (groupRef.current.userData.dimensionsCalculated) return;

      groupRef.current.userData.dimensionsCalculated = true;

      console.log(`Calculating dimensions for ${item.type} (${item.id})`);

      const bbox = new THREE.Box3().setFromObject(model);
      const modelSize = new THREE.Vector3();
      bbox.getSize(modelSize);

      console.log(`Original ${item.type} dimensions:`, {
        width: modelSize.x,
        height: modelSize.y,
        depth: modelSize.z,
      });

      updateItem(item.id, {
        ...item,
        dimensions: {
          width: modelSize.x,
          height: modelSize.y,
          depth: modelSize.z,
        },
      });
    }
  }, [model, item.id, item.type]); // Only include stable dependencies

  const handleDrag = (_matrix: THREE.Matrix4, deltaMatrix: THREE.Matrix4) => {
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    deltaMatrix.decompose(position, rotation, new THREE.Vector3());

    const newX = Math.max(
      -boundary.width / 2 + item.dimensions.width / 2,
      Math.min(
        boundary.width / 2 - item.dimensions.width / 2,
        item.position[0] + position.x
      )
    );

    const newZ = Math.max(
      -boundary.depth / 2 + item.dimensions.depth / 2,
      Math.min(
        boundary.depth / 2 - item.dimensions.depth / 2,
        item.position[2] + position.z
      )
    );

    // Extract rotation in radians around Y axis
    const euler = new THREE.Euler().setFromQuaternion(rotation);
    const currentRotation = new THREE.Euler().fromArray([...item.rotation]);
    const newRotation = [
      currentRotation.x,
      currentRotation.y + euler.y,
      currentRotation.z,
    ] as [number, number, number];

    updateItem(item.id, {
      ...item,
      position: [newX, item.position[1], newZ],
      rotation: newRotation,
    });
  };

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    if (!isDragging) {
      if (!isSelected) {
        setSelectedItem(item.id);
        setShowDimensions(true);
      } else {
        setSelectedItem(null);
        setShowDimensions(false);
      }
    }
  };

  const isSelected = selectedItemId === item.id;

  // Set highlight on selected model
  if (model && isSelected) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // If object is selected, add emissive highlight
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color('#ff3333');
        child.material.emissiveIntensity = 0.3;
      }
    });
  }

  return (
    <PivotControls
      visible={isSelected}
      scale={0.75}
      anchor={[0, -1, 0]}
      onDrag={handleDrag}
      onDragStart={() => {
        setIsDragging(true);
        setShowDimensions(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        setTimeout(() => setShowDimensions(false), 2000);
      }}
      autoTransform={false}
    >
      <group
        ref={groupRef}
        position={item.position}
        rotation={item.rotation}
        scale={item.scale}
        onClick={handleClick}
        dispose={null}
      >
        {/* The actual 3D model */}
        <primitive object={model} />

        {/* Optional: invisible bounding box for better click detection */}
        <mesh visible={false}>
          <boxGeometry
            args={[
              item.dimensions.width,
              item.dimensions.height,
              item.dimensions.depth,
            ]}
          />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {(showDimensions || isDragging) && (
          <Html position={[0, item.dimensions.height / 2, 0]}>
            <div className="bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {item.type} ({item.dimensions.width}m × {item.dimensions.height}m
              × {item.dimensions.depth}m)
            </div>
          </Html>
        )}
      </group>
    </PivotControls>
  );
}
