import * as THREE from 'three';

export class ApexVehicle {
  public group: THREE.Group;
  public chassisMesh: THREE.Mesh;
  public wheels: THREE.Group[] = [];
  public frontWheelsGroup: THREE.Group[] = [];
  public lidarPod: THREE.Group;
  public headlightsMat: THREE.MeshBasicMaterial;
  public taillightsMat: THREE.MeshBasicMaterial;
  public underglowMat: THREE.MeshBasicMaterial;
  public sensorRings: THREE.Mesh[] = [];
  public currentSpeed: number = 0;
  public steeringAngle: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "APEX-1_VEHICLE";

    // --- MATERIALS ---
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e242d, // Slate Graphite Metallic
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 1.5,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x090b0e,
      roughness: 0.5,
      metalness: 0.7,
    });

    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x06121e,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.9,
    });

    this.headlightsMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9, // Electric cyan/white
    });

    this.taillightsMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Bright red
    });

    this.underglowMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan neon
      transparent: true,
      opacity: 0.6,
    });

    // --- 1. CHASSIS MAIN BODY ---
    // Lower aerodynamic body
    const bodyGeo = new THREE.BoxGeometry(1.85, 0.42, 4.4);
    this.chassisMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
    this.chassisMesh.position.y = 0.42;
    this.chassisMesh.castShadow = true;
    this.chassisMesh.receiveShadow = true;
    this.group.add(this.chassisMesh);

    // Front wedge nose
    const noseGeo = new THREE.CylinderGeometry(0.85, 0.92, 0.9, 4);
    const nose = new THREE.Mesh(noseGeo, bodyMaterial);
    nose.rotation.y = Math.PI / 4;
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.36, -2.1);
    nose.scale.set(1.1, 0.45, 0.4);
    this.group.add(nose);

    // Aerodynamic Greenhouse / Canopy (Cabin)
    const cabinGeo = new THREE.BoxGeometry(1.4, 0.4, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(0, 0.72, -0.1);
    this.group.add(cabin);

    // Windshield slope
    const windshieldGeo = new THREE.BoxGeometry(1.36, 0.35, 0.85);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.position.set(0, 0.62, -1.2);
    windshield.rotation.x = -0.55;
    this.group.add(windshield);

    // Rear engine deck / fastback slope
    const rearSlopeGeo = new THREE.BoxGeometry(1.38, 0.32, 1.1);
    const rearSlope = new THREE.Mesh(rearSlopeGeo, bodyMaterial);
    rearSlope.position.set(0, 0.58, 1.15);
    rearSlope.rotation.x = 0.32;
    this.group.add(rearSlope);

    // Carbon fiber side skirts
    const skirtGeo = new THREE.BoxGeometry(1.95, 0.08, 3.8);
    const skirt = new THREE.Mesh(skirtGeo, carbonMaterial);
    skirt.position.set(0, 0.22, 0);
    this.group.add(skirt);

    // Rear diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.8, 0.16, 0.4);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
    diffuser.position.set(0, 0.26, 2.15);
    this.group.add(diffuser);

    // Rear Aero Wing / Spoiler
    const wingGeo = new THREE.BoxGeometry(1.7, 0.04, 0.32);
    const wing = new THREE.Mesh(wingGeo, carbonMaterial);
    wing.position.set(0, 0.82, 1.85);
    this.group.add(wing);

    // Wing struts
    const strutGeo = new THREE.BoxGeometry(0.04, 0.22, 0.12);
    const strutL = new THREE.Mesh(strutGeo, carbonMaterial);
    strutL.position.set(-0.55, 0.72, 1.85);
    const strutR = new THREE.Mesh(strutGeo, carbonMaterial);
    strutR.position.set(0.55, 0.72, 1.85);
    this.group.add(strutL, strutR);

    // --- 2. LIGHTING & LED STRIPS ---
    // Front LED light strips
    const lightBarGeo = new THREE.BoxGeometry(0.7, 0.05, 0.05);
    const headL = new THREE.Mesh(lightBarGeo, this.headlightsMat);
    headL.position.set(-0.6, 0.42, -2.18);
    headL.rotation.y = 0.2;
    const headR = new THREE.Mesh(lightBarGeo, this.headlightsMat);
    headR.position.set(0.6, 0.42, -2.18);
    headR.rotation.y = -0.2;
    this.group.add(headL, headR);

    // Central front sensor bar
    const centerSensorGeo = new THREE.BoxGeometry(0.4, 0.03, 0.04);
    const centerSensor = new THREE.Mesh(centerSensorGeo, this.headlightsMat);
    centerSensor.position.set(0, 0.36, -2.22);
    this.group.add(centerSensor);

    // Rear full-width LED light bar
    const taillightGeo = new THREE.BoxGeometry(1.7, 0.06, 0.05);
    const taillight = new THREE.Mesh(taillightGeo, this.taillightsMat);
    taillight.position.set(0, 0.54, 2.2);
    this.group.add(taillight);

    // Cyan chassis accent stripes
    const accentMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const sideStripeGeo = new THREE.BoxGeometry(0.04, 0.03, 3.2);
    const stripeL = new THREE.Mesh(sideStripeGeo, accentMat);
    stripeL.position.set(-0.95, 0.38, 0);
    const stripeR = new THREE.Mesh(sideStripeGeo, accentMat);
    stripeR.position.set(0.95, 0.38, 0);
    this.group.add(stripeL, stripeR);

    // Underbody ambient neon plane
    const underglowGeo = new THREE.PlaneGeometry(1.6, 3.6);
    const underglow = new THREE.Mesh(underglowGeo, this.underglowMat);
    underglow.rotation.x = -Math.PI / 2;
    underglow.position.set(0, 0.08, 0);
    this.group.add(underglow);

    // --- 3. ROOF LIDAR SENSOR POD ---
    this.lidarPod = new THREE.Group();
    this.lidarPod.position.set(0, 0.94, -0.15);

    const baseGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.06, 16);
    const baseMesh = new THREE.Mesh(baseGeo, carbonMaterial);
    this.lidarPod.add(baseMesh);

    const rotatingCoreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const rotatingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
    });
    const rotatingCore = new THREE.Mesh(rotatingCoreGeo, rotatingMat);
    rotatingCore.name = "lidar_spinning_core";
    rotatingCore.position.y = 0.06;
    this.lidarPod.add(rotatingCore);

    const lensGeo = new THREE.BoxGeometry(0.04, 0.04, 0.22);
    const lens = new THREE.Mesh(lensGeo, this.headlightsMat);
    lens.position.y = 0.06;
    this.lidarPod.add(lens);

    this.group.add(this.lidarPod);

    // --- 4. 4 WHEELS (FRONT STEERING + REAR FIXED) ---
    const wheelPositions = [
      { x: -0.92, y: 0.34, z: -1.35, isFront: true },  // Front Left
      { x: 0.92, y: 0.34, z: -1.35, isFront: true },   // Front Right
      { x: -0.92, y: 0.34, z: 1.35, isFront: false },  // Rear Left
      { x: 0.92, y: 0.34, z: 1.35, isFront: false },   // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelMount = new THREE.Group();
      wheelMount.position.set(pos.x, pos.y, pos.z);

      const wheelMeshGroup = this.createWheel(carbonMaterial);
      wheelMount.add(wheelMeshGroup);
      this.wheels.push(wheelMeshGroup);

      if (pos.isFront) {
        this.frontWheelsGroup.push(wheelMount);
      }
      this.group.add(wheelMount);
    });

    // --- 5. PULSING SENSOR SCAN RINGS ---
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(1.6 + i * 0.4, 1.65 + i * 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.12;
      this.group.add(ring);
      this.sensorRings.push(ring);
    }
  }

  private createWheel(tireMat: THREE.Material): THREE.Group {
    const wheelGroup = new THREE.Group();

    // Rubber tire
    const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 24);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    wheelGroup.add(tire);

    // Alloy rim
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.27, 16);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.2,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Cyan aerodynamic wheel insert
    const centerRingGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 8);
    const centerRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRing.rotation.z = Math.PI / 2;
    wheelGroup.add(centerRing);

    return wheelGroup;
  }

  public update(delta: number, speedKmh: number, steering: number, isBraking: boolean, sensorActive: boolean) {
    this.currentSpeed = speedKmh;
    this.steeringAngle = steering;

    // Rotate wheels based on velocity
    const rotationSpeed = (speedKmh * 0.4) * delta;
    this.wheels.forEach((w) => {
      w.rotation.x -= rotationSpeed;
    });

    // Steer front wheels
    this.frontWheelsGroup.forEach((mount) => {
      mount.rotation.y = THREE.MathUtils.lerp(mount.rotation.y, steering, 0.1);
    });

    // Spin roof LiDAR continuously
    if (this.lidarPod) {
      this.lidarPod.rotation.y += (speedKmh > 0 || sensorActive ? 8.0 : 2.5) * delta;
    }

    // Taillight brake intensification
    if (isBraking) {
      this.taillightsMat.color.setHex(0xff0000);
      this.taillightsMat.opacity = 1.0;
    } else {
      this.taillightsMat.color.setHex(0x991b1b);
    }

    // Sensor pulsing rings animation
    const time = performance.now() * 0.002;
    this.sensorRings.forEach((ring, idx) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (sensorActive) {
        const wave = (Math.sin(time * 2.5 + idx * 1.2) + 1) / 2;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, wave * 0.65, 0.1);
        const s = 1.0 + wave * 0.35;
        ring.scale.set(s, s, s);
      } else {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.0, 0.1);
      }
    });
  }
}
