import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide } from "three";
import type { Group, Mesh, Points } from "three";

export interface SceneInputs {
  /** 0 → section entering, 1 → section leaving */
  progress: MutableRefObject<number>;
  /** normalized pointer over the section, -1..1 */
  pointer: MutableRefObject<{ x: number; y: number }>;
  /** accumulated drag rotation in radians */
  drag: MutableRefObject<{ x: number; y: number }>;
}

const PARTICLE_COUNT = 140;

/** Deterministic pseudo-random so the particle field is stable between renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Particles() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const rand = seeded(42);
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 2.4 + rand() * 2.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#93C5FD"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function AISphere({ progress, pointer, drag }: SceneInputs) {
  const group = useRef<Group>(null);
  const shell = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, delta * 4); // smoothing factor, frame-rate independent
    const p = progress.current;
    const t = state.clock.elapsedTime;

    // mouse-follow tilt + drag rotation + scroll-driven spin
    const targetX = -pointer.current.y * 0.35 + drag.current.x;
    const targetY = pointer.current.x * 0.5 + drag.current.y + p * Math.PI * 1.25;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.y += (targetY - g.rotation.y) * k;

    // scroll: rise and grow slightly as the section passes
    const targetScale = 0.88 + Math.sin(p * Math.PI) * 0.2;
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * k);
    g.position.y = Math.sin(t * 0.8) * 0.1 + (0.5 - p) * 0.5;

    if (shell.current) shell.current.rotation.y -= delta * 0.18;
    if (ring.current) ring.current.rotation.z += delta * 0.25;
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.025;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group}>
      {/* glossy core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 6]} />
        <meshPhysicalMaterial
          color="#1D2A66"
          emissive="#7C3AED"
          emissiveIntensity={0.45}
          metalness={0.55}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* holographic wire shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.32, 2]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.22} />
      </mesh>
      {/* outer glow */}
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.1}
          side={BackSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* orbit ring */}
      <mesh ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.85, 0.012, 12, 160]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

export default function ShowcaseScene({ inputs, active }: { inputs: SceneInputs; active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 3]} intensity={30} color="#60A5FA" />
      <pointLight position={[-3, -1.5, 2]} intensity={28} color="#7C3AED" />
      <pointLight position={[0, 3, -2.5]} intensity={20} color="#22D3EE" />
      <AISphere {...inputs} />
      <Particles />
    </Canvas>
  );
}
