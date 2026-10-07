import * as THREE from 'three';

export class TrajectoryRibbon {
  public group: THREE.Group;
  public mainPathMesh: THREE.Mesh;
  public alternativeBranchMesh: THREE.Mesh;
  public parkingPathMesh: THREE.Mesh;
  public decisionArrows: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "AI_TRAJECTORY_RIBBONS";

    // 1. MAIN PLANNED TRAJECTORY RIBBON (Cyan glowing path ahead)
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(0, 0.08, -12),
      new THREE.Vector3(-0.8, 0.08, -25),
      new THREE.Vector3(-1.2, 0.08, -45),
      new THREE.Vector3(0, 0.08, -70),
      new THREE.Vector3(1.2, 0.08, -110),
      new THREE.Vector3(0, 0.08, -160),
    ]);

    const mainGeo = new THREE.TubeGeometry(mainCurve, 64, 0.28, 8, false);
    const mainMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Neon cyan
      transparent: true,
      opacity: 0.85,
    });
    this.mainPathMesh = new THREE.Mesh(mainGeo, mainMat);
    this.group.add(this.mainPathMesh);

    // 2. ALTERNATIVE REJECTED DECISION BRANCH (Red/amber hypothesis branch in Chapter 07)
    const branchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.08, -25),
      new THREE.Vector3(2.5, 0.08, -42),
      new THREE.Vector3(3.2, 0.08, -60),
    ]);
    const branchGeo = new THREE.TubeGeometry(branchCurve, 32, 0.18, 6, false);
    const branchMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Rose / rejected path
      transparent: true,
      opacity: 0.45,
    });
    this.alternativeBranchMesh = new THREE.Mesh(branchGeo, branchMat);
    this.group.add(this.alternativeBranchMesh);

    // 3. AUTONOMOUS PARKING S-CURVE (Reverse path into parking slot)
    const parkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, -160),
      new THREE.Vector3(2.0, 0.08, -165),
      new THREE.Vector3(5.2, 0.08, -170),
    ]);
    const parkGeo = new THREE.TubeGeometry(parkCurve, 32, 0.22, 6, false);
    const parkMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald green target path
      transparent: true,
      opacity: 0.75,
    });
    this.parkingPathMesh = new THREE.Mesh(parkGeo, parkMat);
    this.group.add(this.parkingPathMesh);

    // 4. FLOATING HOLOGRAPHIC NAVIGATION ARROWS
    this.decisionArrows = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const arrowGeo = new THREE.ConeGeometry(0.35, 0.7, 3);
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.rotation.x = Math.PI / 2;
      arrow.position.set(0, 0.35, -15 - i * 14);
      this.decisionArrows.add(arrow);
    }
    this.group.add(this.decisionArrows);
  }

  public update(delta: number, progress: number, vehicleZ: number, isEmergency: boolean) {
    // Pulse the main trajectory line
    const time = performance.now() * 0.003;
    const mat = this.mainPathMesh.material as THREE.MeshBasicMaterial;

    if (isEmergency) {
      // Flash red alert on trajectory line
      mat.color.setHex(0xef4444);
      mat.opacity = 0.95;
    } else {
      mat.color.setHex(0x06b6d4);
      mat.opacity = 0.65 + Math.sin(time * 3) * 0.2;
    }

    // Toggle branch visibility (Chapter 07 Decision Engine: progress ~ 0.58 - 0.68)
    const showBranch = progress >= 0.56 && progress <= 0.70;
    this.alternativeBranchMesh.visible = showBranch;

    // Toggle parking path visibility (Chapter 10 Parking: progress >= 0.85)
    this.parkingPathMesh.visible = progress >= 0.84 && progress <= 0.96;

    // Pulse navigation arrows forward
    this.decisionArrows.children.forEach((arrow, idx) => {
      arrow.position.z -= 12 * delta;
      if (arrow.position.z < vehicleZ - 50) {
        arrow.position.z = vehicleZ - 5;
      }
    });
  }
}
