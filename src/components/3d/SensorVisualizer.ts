import * as THREE from 'three';

export interface BoundingBoxTarget {
  boxMesh: THREE.LineSegments;
  labelSprite: THREE.Sprite;
  targetPos: THREE.Vector3;
  type: string;
  confidence: number;
}

export class SensorVisualizer {
  public group: THREE.Group;
  public lidarPointCloud: THREE.Points;
  public cameraFrustum: THREE.LineSegments;
  public radarSweep: THREE.Mesh;
  public emergencyHazardRing: THREE.Mesh;
  public boundingBoxes: BoundingBoxTarget[] = [];
  private lidarPositions: Float32Array;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "SENSOR_VISUALIZATION_SYSTEM";

    // 1. LIDAR 3D POINT CLOUD (Dense laser scan points around car)
    const pointCount = 950;
    const pGeo = new THREE.BufferGeometry();
    this.lidarPositions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 14.0;
      const angle = Math.random() * Math.PI * 2;
      this.lidarPositions[i] = Math.cos(angle) * radius;
      this.lidarPositions[i + 1] = Math.random() * 2.8;
      this.lidarPositions[i + 2] = Math.sin(angle) * radius;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.lidarPositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x22d3ee, // Cyan laser point cloud
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    this.lidarPointCloud = new THREE.Points(pGeo, pMat);
    this.group.add(this.lidarPointCloud);

    // 2. CAMERA PERCEPTION FRUSTUM CONE (Front windshield optics)
    const frustumGeo = new THREE.BufferGeometry();
    const fPoints: number[] = [
      // Apex at windshield
      0, 0.7, -1.2,  -3.5, -0.3, -16.0,
      0, 0.7, -1.2,   3.5, -0.3, -16.0,
      0, 0.7, -1.2,  -3.5,  3.2, -16.0,
      0, 0.7, -1.2,   3.5,  3.2, -16.0,
      // Far boundary rectangle
      -3.5, -0.3, -16.0,  3.5, -0.3, -16.0,
       3.5, -0.3, -16.0,  3.5,  3.2, -16.0,
       3.5,  3.2, -16.0, -3.5,  3.2, -16.0,
      -3.5,  3.2, -16.0, -3.5, -0.3, -16.0,
    ];
    frustumGeo.setAttribute('position', new THREE.Float32BufferAttribute(fPoints, 3));
    const frustumMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
    });
    this.cameraFrustum = new THREE.LineSegments(frustumGeo, frustumMat);
    this.group.add(this.cameraFrustum);

    // 3. RADAR FAN SWEEP BEAM (Ground-projected planar sector)
    const radarGeo = new THREE.RingGeometry(0.5, 18, 32, 1, -Math.PI / 6, Math.PI / 3);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    this.radarSweep = new THREE.Mesh(radarGeo, radarMat);
    this.radarSweep.rotation.x = -Math.PI / 2;
    this.radarSweep.rotation.z = Math.PI / 2;
    this.radarSweep.position.set(0, 0.05, -1.5);
    this.group.add(this.radarSweep);

    // 4. EMERGENCY HAZARD RING (Red pulsating zone for crosswalk pedestrian)
    const hazardGeo = new THREE.RingGeometry(2.0, 2.3, 32);
    const hazardMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Bright Red Alert
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.emergencyHazardRing = new THREE.Mesh(hazardGeo, hazardMat);
    this.emergencyHazardRing.rotation.x = -Math.PI / 2;
    this.emergencyHazardRing.position.set(0.4, 0.06, -75);
    this.group.add(this.emergencyHazardRing);

    // 5. 3D COMPUTER VISION BOUNDING BOXES
    this.createBoundingBoxes();
  }

  private createBoundingBoxes() {
    const targets = [
      { type: 'CAR [SEDAN]', conf: 98, size: [2.0, 1.4, 4.4], pos: [-3.2, 0.7, -45] },
      { type: 'CAR [SUV]', conf: 97, size: [2.2, 1.7, 4.6], pos: [3.2, 0.85, -55] },
      { type: 'PEDESTRIAN', conf: 96, size: [0.8, 1.9, 0.8], pos: [0.4, 0.95, -75] },
      { type: 'TRAFFIC LIGHT', conf: 99, size: [0.6, 1.2, 0.6], pos: [6.5, 5.5, -70] },
      { type: 'CAR [TRUCK]', conf: 95, size: [2.4, 2.8, 7.2], pos: [3.2, 1.4, -140] },
    ];

    targets.forEach((t) => {
      // Wireframe Box
      const boxGeo = new THREE.BoxGeometry(t.size[0], t.size[1], t.size[2]);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const boxMat = new THREE.LineBasicMaterial({
        color: t.type.includes('PEDESTRIAN') ? 0xef4444 : 0x22d3ee,
        linewidth: 2,
      });
      const boxMesh = new THREE.LineSegments(edges, boxMat);
      boxMesh.position.set(t.pos[0], t.pos[1], t.pos[2]);

      // Label Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
        ctx.fillRect(0, 0, 256, 80);
        ctx.strokeStyle = t.type.includes('PEDESTRIAN') ? '#ef4444' : '#22d3ee';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, 248, 72);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(t.type, 14, 34);

        ctx.fillStyle = t.type.includes('PEDESTRIAN') ? '#f87171' : '#38bdf8';
        ctx.font = 'bold 26px monospace';
        ctx.fillText(`CONF: ${t.conf}%`, 14, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.2, 0.7, 1);
      sprite.position.set(t.pos[0], t.pos[1] + t.size[1] / 2 + 0.6, t.pos[2]);

      this.group.add(boxMesh);
      this.group.add(sprite);

      this.boundingBoxes.push({
        boxMesh,
        labelSprite: sprite,
        targetPos: new THREE.Vector3(t.pos[0], t.pos[1], t.pos[2]),
        type: t.type,
        confidence: t.conf,
      });
    });
  }

  public update(delta: number, progress: number, vehiclePos: THREE.Vector3, isEmergency: boolean) {
    // Keep LiDAR point cloud positioned with APEX-1 vehicle
    this.lidarPointCloud.position.copy(vehiclePos);
    this.cameraFrustum.position.copy(vehiclePos);
    this.radarSweep.position.set(vehiclePos.x, 0.05, vehiclePos.z - 1.5);

    // Rotate point cloud slightly to simulate continuous scanning
    this.lidarPointCloud.rotation.y += 1.8 * delta;

    // Pulse radar fan sweep
    const sweepTime = performance.now() * 0.003;
    this.radarSweep.rotation.z = Math.PI / 2 + Math.sin(sweepTime * 2.5) * 0.25;

    // Emergency hazard ring alert
    const hazardMat = this.emergencyHazardRing.material as THREE.MeshBasicMaterial;
    if (isEmergency) {
      const pulse = (Math.sin(performance.now() * 0.015) + 1) / 2;
      hazardMat.opacity = THREE.MathUtils.lerp(hazardMat.opacity, 0.4 + pulse * 0.55, 0.2);
      const s = 1.0 + pulse * 0.25;
      this.emergencyHazardRing.scale.set(s, s, s);
    } else {
      hazardMat.opacity = THREE.MathUtils.lerp(hazardMat.opacity, 0.0, 0.1);
    }

    // Toggle bounding box visibility based on chapter perception phase
    const perceptionActive = progress >= 0.35 && progress <= 0.88;
    this.boundingBoxes.forEach((b) => {
      b.boxMesh.visible = perceptionActive;
      b.labelSprite.visible = perceptionActive;
    });

    // Frustum and pointcloud visibility
    const sensorsActive = progress >= 0.15 && progress <= 0.95;
    this.cameraFrustum.visible = sensorsActive;
    this.radarSweep.visible = sensorsActive;
    this.lidarPointCloud.visible = progress >= 0.16 && progress <= 0.88;
  }
}
