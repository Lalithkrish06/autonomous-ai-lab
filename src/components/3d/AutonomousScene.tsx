import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraMode, ChapterData } from '../../types';
import { ApexVehicle } from './ApexVehicle';
import { LabChamber } from './LabChamber';
import { NeoMetropolis } from './NeoMetropolis';
import { SensorVisualizer } from './SensorVisualizer';
import { TrajectoryRibbon } from './TrajectoryRibbon';
import { HoloScreens } from './HoloScreens';

interface AutonomousSceneProps {
  scrollProgress: number; // 0.0 to 1.0
  currentChapter: ChapterData;
  cameraMode: CameraMode;
}

export const AutonomousScene: React.FC<AutonomousSceneProps> = ({
  scrollProgress,
  currentChapter,
  cameraMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Entities refs
  const vehicleRef = useRef<ApexVehicle | null>(null);
  const labRef = useRef<LabChamber | null>(null);
  const cityRef = useRef<NeoMetropolis | null>(null);
  const sensorsRef = useRef<SensorVisualizer | null>(null);
  const trajectoryRef = useRef<TrajectoryRibbon | null>(null);
  const holoScreensRef = useRef<HoloScreens | null>(null);

  // Lighting refs
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const labSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const emergencyLightRef = useRef<THREE.PointLight | null>(null);
  const sunriseLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Smooth interpolated camera targets
  const currentCamPos = useRef(new THREE.Vector3(0, 3, 14));
  const targetCamPos = useRef(new THREE.Vector3(0, 3, 14));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.5, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  // Current progress ref for requestAnimationFrame loop
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  const modeRef = useRef(cameraMode);
  modeRef.current = cameraMode;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0x0a192f, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Lab overhead spotlight
    const labSpotLight = new THREE.SpotLight(0x22d3ee, 4, 30, Math.PI / 4, 0.4, 1.0);
    labSpotLight.position.set(0, 12, 0);
    labSpotLight.target.position.set(0, 0, 0);
    scene.add(labSpotLight);
    scene.add(labSpotLight.target);
    labSpotLightRef.current = labSpotLight;

    // Emergency red hazard light
    const emergencyLight = new THREE.PointLight(0xef4444, 0, 25);
    emergencyLight.position.set(0, 2.5, -75);
    scene.add(emergencyLight);
    emergencyLightRef.current = emergencyLight;

    // Sunrise dawn directional light
    const sunriseLight = new THREE.DirectionalLight(0xf59e0b, 0);
    sunriseLight.position.set(0, 15, -280);
    scene.add(sunriseLight);
    sunriseLightRef.current = sunriseLight;

    // --- 3. CREATE PERSISTENT ENTITIES ---
    const vehicle = new ApexVehicle();
    scene.add(vehicle.group);
    vehicleRef.current = vehicle;

    const lab = new LabChamber();
    scene.add(lab.group);
    labRef.current = lab;

    const city = new NeoMetropolis();
    scene.add(city.group);
    cityRef.current = city;

    const sensors = new SensorVisualizer();
    scene.add(sensors.group);
    sensorsRef.current = sensors;

    const trajectory = new TrajectoryRibbon();
    scene.add(trajectory.group);
    trajectoryRef.current = trajectory;

    const holoScreens = new HoloScreens();
    scene.add(holoScreens.group);
    holoScreensRef.current = holoScreens;

    // --- 4. ANIMATION & RENDER LOOP ---
    let lastTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const p = progressRef.current;
      const camMode = modeRef.current;

      // ---------------------------------------------
      // VEHICLE CHOREOGRAPHY BASED ON SCROLL PROGRESS
      // ---------------------------------------------
      // Vehicle position along world z axis:
      // In lab (p: 0 -> 0.28): stays near turntable z = 0 -> -20 (exit bay)
      // In city (p: 0.28 -> 1.0): moves from z = -20 to z = -200
      let vehicleZ = 0;
      let vehicleX = 0;
      let vehicleRotY = 0;
      let vehicleSpeed = 0;
      let isBraking = false;
      let isEmergency = false;

      if (p < 0.20) {
        // In AI Lab
        vehicleZ = 0;
        vehicleX = 0;
        vehicleRotY = 0;
        vehicleSpeed = 0;
      } else if (p < 0.32) {
        // Exiting lab gate into city
        const t = (p - 0.20) / 0.12;
        vehicleZ = -t * 22;
        vehicleSpeed = 15;
      } else if (p < 0.68) {
        // Driving down Neo-Metropolis avenue
        const t = (p - 0.32) / 0.36;
        vehicleZ = -22 - t * 50; // z goes from -22 to -72 (crosswalk approach)
        // Slight lane weaving / cornering
        vehicleX = Math.sin(t * Math.PI * 2) * 0.8;
        vehicleRotY = -Math.cos(t * Math.PI * 2) * 0.08;
        vehicleSpeed = 52;
      } else if (p < 0.78) {
        // CHAPTER 08: EMERGENCY RESPONSE!
        // Approaching crosswalk at z = -75
        vehicleZ = -72;
        vehicleX = 0;
        vehicleRotY = 0;
        vehicleSpeed = 0;
        isBraking = true;
        isEmergency = true;
      } else if (p < 0.86) {
        // CHAPTER 09: SAFE PATH RECOVERY & DETOUR
        const t = (p - 0.78) / 0.08;
        vehicleZ = -72 - t * 45; // z goes from -72 to -117
        vehicleX = Math.sin(t * Math.PI) * 1.5; // Curves around construction cones
        vehicleRotY = Math.cos(t * Math.PI) * 0.12;
        vehicleSpeed = 36;
      } else if (p < 0.94) {
        // CHAPTER 10: AUTONOMOUS PARKING
        const t = (p - 0.86) / 0.08;
        vehicleZ = -117 - t * 45; // arrives at parking bay z = -162
        vehicleX = THREE.MathUtils.lerp(0, 5.2, t); // moves into parking stall
        vehicleRotY = THREE.MathUtils.lerp(0, 0, t);
        vehicleSpeed = 5;
      } else {
        // CHAPTER 11: HIGHWAY SUNRISE HERO CRUISE
        const t = (p - 0.94) / 0.06;
        vehicleZ = -162 - t * 45; // reaches z = -207
        vehicleX = 0;
        vehicleRotY = 0;
        vehicleSpeed = 58;
      }

      vehicle.group.position.set(vehicleX, 0, vehicleZ);
      vehicle.group.rotation.y = vehicleRotY;

      // Update vehicle subcomponents
      vehicle.update(delta, vehicleSpeed, vehicleRotY, isBraking, p >= 0.08 && p <= 0.95);

      // ---------------------------------------------
      // SCENE & SYSTEM UPDATES
      // ---------------------------------------------
      const labFactor = Math.max(0, 1.0 - p * 3.5);
      lab.update(delta, labFactor);
      city.update(delta, p);
      sensors.update(delta, p, vehicle.group.position, isEmergency);
      trajectory.update(delta, p, vehicleZ, isEmergency);
      holoScreens.update(delta, p);

      // ---------------------------------------------
      // DYNAMIC LIGHTING TRANSITIONS
      // ---------------------------------------------
      // Emergency light alert
      if (emergencyLightRef.current) {
        if (isEmergency) {
          const alertPulse = (Math.sin(now * 0.012) + 1) * 3;
          emergencyLightRef.current.intensity = alertPulse;
        } else {
          emergencyLightRef.current.intensity = 0;
        }
      }

      // Sunrise dawn light
      if (sunriseLightRef.current) {
        if (p > 0.88) {
          const sunT = (p - 0.88) / 0.12;
          sunriseLightRef.current.intensity = THREE.MathUtils.lerp(0, 2.5, sunT);
          if (ambientLightRef.current) {
            ambientLightRef.current.color.setHex(0x78350f); // Amber warm ambient
          }
          scene.fog!.color.setHex(0x1e1b4b);
        } else {
          sunriseLightRef.current.intensity = 0;
          if (ambientLightRef.current) {
            ambientLightRef.current.color.setHex(0x0a192f);
          }
          scene.fog!.color.setHex(0x030712);
        }
      }

      // ---------------------------------------------
      // CAMERA CHOREOGRAPHY: SCROLL = CAMERA CONTROL
      // ---------------------------------------------
      if (camMode === 'chase') {
        // Third-person vehicle chase camera
        targetCamPos.current.set(vehicleX, 2.8, vehicleZ + 7.5);
        targetLookAt.current.set(vehicleX, 1.0, vehicleZ - 5);
      } else if (camMode === 'topdown') {
        // Birds-eye engineering view
        targetCamPos.current.set(vehicleX, 22, vehicleZ - 2);
        targetLookAt.current.set(vehicleX, 0, vehicleZ - 3);
      } else if (camMode === 'sensor_lidar') {
        // High-tech sensor optics close-up
        targetCamPos.current.set(vehicleX + 1.2, 1.6, vehicleZ - 1.8);
        targetLookAt.current.set(vehicleX, 0.9, vehicleZ + 0.5);
      } else {
        // CINEMATIC DIRECTOR MODE (Default) - 11 distinct cinematic perspectives!
        if (p < 0.08) {
          // 01: LAB ACTIVATION - Distant approach
          const t = p / 0.08;
          targetCamPos.current.set(0, THREE.MathUtils.lerp(4.5, 2.8, t), THREE.MathUtils.lerp(18, 9.5, t));
          targetLookAt.current.set(0, 0.8, 0);
        } else if (p < 0.18) {
          // 02: APEX-1 ACTIVATION - Low-angle orbit
          const t = (p - 0.08) / 0.10;
          const orbAngle = t * Math.PI * 0.8;
          targetCamPos.current.set(Math.sin(orbAngle) * 6.5, 1.4, Math.cos(orbAngle) * 6.5);
          targetLookAt.current.set(0, 0.6, 0);
        } else if (p < 0.28) {
          // 03: SENSOR FUSION - Elevated 3/4 sensor cone view
          const t = (p - 0.18) / 0.10;
          targetCamPos.current.set(-4.5 + t * 2, 3.2, 5.0 - t * 2);
          targetLookAt.current.set(0, 0.7, 0);
        } else if (p < 0.38) {
          // 04: NEO-METROPOLIS - Following car leaving lab
          targetCamPos.current.set(vehicleX - 3.5, 2.6, vehicleZ + 7.5);
          targetLookAt.current.set(vehicleX, 1.0, vehicleZ - 6);
        } else if (p < 0.48) {
          // 05: AI PERCEPTION - Dynamic side tracking shot highlighting bounding boxes
          targetCamPos.current.set(vehicleX + 4.8, 2.2, vehicleZ - 2);
          targetLookAt.current.set(vehicleX - 2, 1.0, vehicleZ - 8);
        } else if (p < 0.58) {
          // 06: ROAD UNDERSTANDING - Elevated rear chase showing drivable area
          targetCamPos.current.set(vehicleX, 4.2, vehicleZ + 8.5);
          targetLookAt.current.set(vehicleX, 0.4, vehicleZ - 12);
        } else if (p < 0.68) {
          // 07: DECISION ENGINE - Dynamic offset showing turn left & trajectory branch
          targetCamPos.current.set(vehicleX + 3.8, 2.5, vehicleZ + 5.5);
          targetLookAt.current.set(vehicleX - 2.5, 0.8, vehicleZ - 10);
        } else if (p < 0.78) {
          // 08: EMERGENCY RESPONSE - Dramatic low frontal shot confronting crosswalk
          targetCamPos.current.set(0.4, 1.2, -81); // in front of APEX-1
          targetLookAt.current.set(0, 0.8, -72); // looking at APEX-1 front grille
        } else if (p < 0.86) {
          // 09: SAFE PATH RECOVERY - Side tracking around construction cones
          targetCamPos.current.set(vehicleX - 4.5, 2.8, vehicleZ + 6.0);
          targetLookAt.current.set(vehicleX, 1.0, vehicleZ - 6);
        } else if (p < 0.94) {
          // 10: AUTONOMOUS PARKING - Overhead 80-degree parking bay monitor
          targetCamPos.current.set(vehicleX + 1.5, 14, vehicleZ - 1);
          targetLookAt.current.set(vehicleX, 0, vehicleZ);
        } else {
          // 11: FINAL HERO - Ascending aerial drone crane shot into golden sunrise!
          const t = (p - 0.94) / 0.06;
          targetCamPos.current.set(0, THREE.MathUtils.lerp(6, 32, t), THREE.MathUtils.lerp(vehicleZ + 12, vehicleZ + 48, t));
          targetLookAt.current.set(0, 2, vehicleZ - 25);
        }
      }

      // Smooth camera interpolation (cinematic damping)
      const lerpFactor = 0.07;
      currentCamPos.current.lerp(targetCamPos.current, lerpFactor);
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};
