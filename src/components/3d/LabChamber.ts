import * as THREE from 'three';

export class LabChamber {
  public group: THREE.Group;
  public platform: THREE.Mesh;
  public platformGlowRing: THREE.Mesh;
  public holographicScreens: THREE.Group;
  public exitGate: THREE.Group;
  public ceilingLights: THREE.Group;
  public labParticles: THREE.Points;
  private particlePositions: Float32Array;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "AUTONOMOUS_LAB_CHAMBER";

    // 1. LAB FLOOR WITH GRID
    const floorGeo = new THREE.CircleGeometry(42, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080d16,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Grid wireframe on floor
    const gridHelper = new THREE.GridHelper(70, 70, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.01;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    this.group.add(gridHelper);

    // 2. CENTRAL TURNTABLE PEDESTAL
    const platformGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.22, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.15,
    });
    this.platform = new THREE.Mesh(platformGeo, platformMat);
    this.platform.position.y = 0.11;
    this.platform.receiveShadow = true;
    this.group.add(this.platform);

    // Turntable glowing cyan outer ring
    const ringGeo = new THREE.RingGeometry(4.22, 4.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
    });
    this.platformGlowRing = new THREE.Mesh(ringGeo, ringMat);
    this.platformGlowRing.rotation.x = -Math.PI / 2;
    this.platformGlowRing.position.y = 0.23;
    this.group.add(this.platformGlowRing);

    // 3. CURVED HOLOGRAPHIC COMMAND SCREENS (Matching Video 1 & Video 2)
    this.holographicScreens = new THREE.Group();
    const screenAngles = [-0.9, -0.45, 0, 0.45, 0.9];
    const screenRadius = 9.5;

    screenAngles.forEach((ang, idx) => {
      const screenGroup = new THREE.Group();
      const sGeo = new THREE.PlaneGeometry(3.6, 2.0);
      
      // Dynamic canvas texture with HUD graphs
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(6, 18, 38, 0.85)';
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3;
        ctx.strokeRect(8, 8, 496, 240);
        
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`SUBSYSTEM [0${idx + 1}] : ACTIVE`, 24, 40);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px monospace';
        ctx.fillText(`NEURAL SIMULATOR // FREQ 100Hz // TELEMETRY OK`, 24, 70);
        
        // Circular radar or waveform
        ctx.beginPath();
        ctx.arc(420, 150, 48, 0, Math.PI * 2);
        ctx.strokeStyle = '#06b6d4';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(24, 180);
        for (let x = 24; x < 350; x += 10) {
          ctx.lineTo(x, 180 + Math.sin(x * 0.08 + idx) * 22);
        }
        ctx.strokeStyle = '#22d3ee';
        ctx.stroke();
      }

      const screenTex = new THREE.CanvasTexture(canvas);
      const sMat = new THREE.MeshBasicMaterial({
        map: screenTex,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
      });

      const screenMesh = new THREE.Mesh(sGeo, sMat);
      screenMesh.position.set(
        Math.sin(ang) * screenRadius,
        3.2,
        -Math.cos(ang) * screenRadius
      );
      screenMesh.rotation.y = ang + Math.PI;

      // Outer glowing frame
      const frameGeo = new THREE.BoxGeometry(3.7, 2.1, 0.04);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        metalness: 0.8,
        roughness: 0.3,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.copy(screenMesh.position);
      frameMesh.rotation.copy(screenMesh.rotation);
      frameMesh.position.z += Math.cos(ang) * 0.03;

      screenGroup.add(frameMesh);
      screenGroup.add(screenMesh);
      this.holographicScreens.add(screenGroup);
    });
    this.group.add(this.holographicScreens);

    // 4. OVERHEAD CEILING LIGHT PODS
    this.ceilingLights = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const lightMeshGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.3, 16);
      const lightMeshMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const lightMesh = new THREE.Mesh(lightMeshGeo, lightMeshMat);
      lightMesh.position.set(Math.sin(angle) * 7.5, 7.8, Math.cos(angle) * 7.5);
      this.ceilingLights.add(lightMesh);
    }
    this.group.add(this.ceilingLights);

    // 5. EXIT GATE (Lab dispatch gate opening into Neo-Metropolis)
    this.exitGate = new THREE.Group();
    this.exitGate.position.set(0, 0, -18);

    const pillarGeo = new THREE.BoxGeometry(0.8, 6.5, 0.8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
    const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
    pLeft.position.set(-5.5, 3.25, 0);
    const pRight = new THREE.Mesh(pillarGeo, pillarMat);
    pRight.position.set(5.5, 3.25, 0);

    const lintelGeo = new THREE.BoxGeometry(11.8, 0.6, 0.8);
    const lintel = new THREE.Mesh(lintelGeo, pillarMat);
    lintel.position.set(0, 6.2, 0);

    const gateSignGeo = new THREE.PlaneGeometry(6.5, 0.9);
    const gateSignMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const gateSign = new THREE.Mesh(gateSignGeo, gateSignMat);
    gateSign.position.set(0, 5.2, 0.45);

    this.exitGate.add(pLeft, pRight, lintel, gateSign);
    this.group.add(this.exitGate);

    // 6. AMBIENT LAB FLOATING DATA PARTICLES
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      this.particlePositions[i] = (Math.random() - 0.5) * 26;
      this.particlePositions[i + 1] = Math.random() * 7;
      this.particlePositions[i + 2] = (Math.random() - 0.5) * 26;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
    });
    this.labParticles = new THREE.Points(pGeo, pMat);
    this.group.add(this.labParticles);
  }

  public update(delta: number, labActivation: number) {
    // Rotate platform slightly when in lab mode
    if (labActivation > 0.05) {
      this.platform.rotation.y += 0.15 * delta * labActivation;
    }

    // Holographic screens glow intensity
    const sOpacity = THREE.MathUtils.clamp(labActivation * 0.9, 0, 0.9);
    this.holographicScreens.children.forEach((child) => {
      const screen = child.children[1] as THREE.Mesh;
      if (screen && screen.material) {
        (screen.material as THREE.MeshBasicMaterial).opacity = sOpacity;
      }
    });

    // Animate lab particles
    const positions = this.labParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += delta * 0.25;
      if (positions[i] > 7.5) {
        positions[i] = 0.2;
      }
    }
    this.labParticles.geometry.attributes.position.needsUpdate = true;
  }
}
