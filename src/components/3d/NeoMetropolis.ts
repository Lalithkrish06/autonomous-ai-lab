import * as THREE from 'three';

export class NeoMetropolis {
  public group: THREE.Group;
  public roadGroup: THREE.Group;
  public buildingsGroup: THREE.Group;
  public trafficVehicles: THREE.Group[] = [];
  public pedestrian: THREE.Group;
  public constructionBarriers: THREE.Group;
  public parkingBay: THREE.Group;
  public roadArch: THREE.Group;
  public roadDrivableArea: THREE.Mesh;
  public crosswalk: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "NEO_METROPOLIS_WORLD";
    this.group.position.set(0, 0, -20); // Starts outside lab exit

    // 1. MAIN ROADWAY
    this.roadGroup = new THREE.Group();
    const roadLength = 220;
    const roadWidth = 14;

    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.15, // Wet reflective asphalt
      metalness: 0.75,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -roadLength / 2);
    road.receiveShadow = true;
    this.roadGroup.add(road);

    // Glowing lane lines (Cyan boundaries)
    const laneBoundaryGeo = new THREE.PlaneGeometry(0.12, roadLength);
    const cyanLaneMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const laneLeft = new THREE.Mesh(laneBoundaryGeo, cyanLaneMat);
    laneLeft.rotation.x = -Math.PI / 2;
    laneLeft.position.set(-6.5, 0.015, -roadLength / 2);
    const laneRight = new THREE.Mesh(laneBoundaryGeo, cyanLaneMat);
    laneRight.rotation.x = -Math.PI / 2;
    laneRight.position.set(6.5, 0.015, -roadLength / 2);
    this.roadGroup.add(laneLeft, laneRight);

    // Center dashed lane lines
    const dashCount = 36;
    const dashGeo = new THREE.PlaneGeometry(0.18, 2.5);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < dashCount; i++) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.018, -i * 6 - 5);
      this.roadGroup.add(dash);
    }

    // Drivable Area corridor overlay (as seen in Video 3)
    const drivableGeo = new THREE.PlaneGeometry(3.6, roadLength);
    const drivableMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    this.roadDrivableArea = new THREE.Mesh(drivableGeo, drivableMat);
    this.roadDrivableArea.rotation.x = -Math.PI / 2;
    this.roadDrivableArea.position.set(0, 0.02, -roadLength / 2);
    this.roadGroup.add(this.roadDrivableArea);

    // Crosswalk at z = -75
    const crosswalkGeo = new THREE.PlaneGeometry(12, 4);
    const crosswalkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    this.crosswalk = new THREE.Mesh(crosswalkGeo, crosswalkMat);
    this.crosswalk.rotation.x = -Math.PI / 2;
    this.crosswalk.position.set(0, 0.022, -75);
    this.roadGroup.add(this.crosswalk);

    this.group.add(this.roadGroup);

    // 2. FUTURISTIC SKYSCRAPERS & NEON SIGNS
    this.buildingsGroup = new THREE.Group();
    const buildingColors = [0x090f1f, 0x0b1329, 0x050c18, 0x0a1626];
    const neonColors = [0x06b6d4, 0x3b82f6, 0x8b5cf6, 0xec4899];

    // Left and Right city blocks
    for (let side = -1; side <= 1; side += 2) {
      for (let z = -10; z > -roadLength; z -= 18) {
        const height = 22 + Math.random() * 45;
        const width = 10 + Math.random() * 8;
        const depth = 12 + Math.random() * 6;

        const bGeo = new THREE.BoxGeometry(width, height, depth);
        const bMat = new THREE.MeshStandardMaterial({
          color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
          roughness: 0.35,
          metalness: 0.85,
        });
        const building = new THREE.Mesh(bGeo, bMat);
        building.position.set(side * (13 + width / 2), height / 2, z);
        this.buildingsGroup.add(building);

        // Glowing window stripes / neon facade
        const stripeGeo = new THREE.BoxGeometry(0.1, height * 0.8, 0.1);
        const stripeMat = new THREE.MeshBasicMaterial({
          color: neonColors[Math.floor(Math.random() * neonColors.length)],
        });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(side * (13 + 0.1), height / 2, z + (Math.random() - 0.5) * 6);
        this.buildingsGroup.add(stripe);

        // Rooftop communication antenna / beacon
        const beaconGeo = new THREE.CylinderGeometry(0.08, 0.15, 6, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(building.position.x, height + 3, building.position.z);
        this.buildingsGroup.add(beacon);
      }
    }
    this.group.add(this.buildingsGroup);

    // 3. STREET LAMPS
    for (let z = -15; z > -roadLength; z -= 25) {
      const lampL = this.createStreetLamp(-7.5, z);
      const lampR = this.createStreetLamp(7.5, z, true);
      this.group.add(lampL, lampR);
    }

    // 4. OVERHEAD ROAD ARCH ("SAFE PATH FOUND" / "NEO-METROPOLIS PORTAL")
    this.roadArch = new THREE.Group();
    this.roadArch.position.set(0, 0, -115);

    const archBeamGeo = new THREE.BoxGeometry(16, 0.8, 0.8);
    const archBeamMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const archBeam = new THREE.Mesh(archBeamGeo, archBeamMat);
    archBeam.position.y = 6.5;

    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7, 0.8), archBeamMat);
    pLeft.position.set(-7.5, 3.5, 0);
    const pRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7, 0.8), archBeamMat);
    pRight.position.set(7.5, 3.5, 0);

    // Holographic digital sign on arch
    const archSignGeo = new THREE.PlaneGeometry(8, 1.8);
    const archSignMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const archSign = new THREE.Mesh(archSignGeo, archSignMat);
    archSign.position.set(0, 6.5, 0.45);

    this.roadArch.add(archBeam, pLeft, pRight, archSign);
    this.group.add(this.roadArch);

    // 5. TRAFFIC VEHICLES (Surrounding cars)
    const trafficConfigs = [
      { x: -3.2, z: -45, color: 0x475569, speed: 38 },
      { x: 3.2, z: -55, color: 0x0284c7, speed: 42 },
      { x: -3.2, z: -95, color: 0x334155, speed: 35 },
      { x: 3.2, z: -140, color: 0x64748b, speed: 50 },
    ];

    trafficConfigs.forEach((cfg) => {
      const tCar = this.createTrafficCar(cfg.color);
      tCar.position.set(cfg.x, 0, cfg.z);
      this.trafficVehicles.push(tCar);
      this.group.add(tCar);
    });

    // 6. PEDESTRIAN (For Chapter 08 Emergency Response!)
    this.pedestrian = new THREE.Group();
    this.pedestrian.name = "CROSSWALK_PEDESTRIAN";
    this.pedestrian.position.set(5.5, 0, -75); // Starts on sidewalk, steps onto crosswalk

    // Pedestrian body primitives
    const pMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const pTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.9, 12), pMat);
    pTorso.position.y = 1.15;
    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
    pHead.position.y = 1.75;
    const pLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.75, 12), pMat);
    pLegs.position.y = 0.38;

    this.pedestrian.add(pTorso, pHead, pLegs);
    this.group.add(this.pedestrian);

    // 7. CONSTRUCTION BARRIERS & WARNING CONES (Chapter 09)
    this.constructionBarriers = new THREE.Group();
    this.constructionBarriers.position.set(0, 0, -135);

    for (let i = 0; i < 6; i++) {
      const coneGeo = new THREE.ConeGeometry(0.22, 0.75, 12);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xf97316 }); // Traffic Orange
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(-2.8 + (i % 2) * 1.2, 0.38, -i * 3.5);
      this.constructionBarriers.add(cone);
    }

    // Construction warning barrier sign
    const bSignGeo = new THREE.BoxGeometry(3.5, 1.2, 0.15);
    const bSignMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const bSign = new THREE.Mesh(bSignGeo, bSignMat);
    bSign.position.set(-2.0, 1.0, -8);
    this.constructionBarriers.add(bSign);
    this.group.add(this.constructionBarriers);

    // 8. AUTONOMOUS PARKING BAY (Chapter 10)
    this.parkingBay = new THREE.Group();
    this.parkingBay.position.set(5.2, 0, -170);

    // Outlined parking stall lines
    const stallOutlineGeo = new THREE.PlaneGeometry(3.2, 5.8);
    const stallOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
    });
    const stallMesh = new THREE.Mesh(stallOutlineGeo, stallOutlineMat);
    stallMesh.rotation.x = -Math.PI / 2;
    stallMesh.position.y = 0.02;
    this.parkingBay.add(stallMesh);

    // Parked adjacent cars
    const parked1 = this.createTrafficCar(0x1e293b);
    parked1.position.set(0, 0, 4.2);
    const parked2 = this.createTrafficCar(0x334155);
    parked2.position.set(0, 0, -4.2);
    this.parkingBay.add(parked1, parked2);

    this.group.add(this.parkingBay);
  }

  private createStreetLamp(x: number, z: number, flip: boolean = false): THREE.Group {
    const lamp = new THREE.Group();
    lamp.position.set(x, 0, z);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 7.5, 12), poleMat);
    pole.position.y = 3.75;
    lamp.add(pole);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), poleMat);
    arm.rotation.z = flip ? -Math.PI / 3 : Math.PI / 3;
    arm.position.set(flip ? -1.0 : 1.0, 7.2, 0);
    lamp.add(arm);

    // Glowing bulb
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), bulbMat);
    bulb.position.set(flip ? -2.0 : 2.0, 7.6, 0);
    lamp.add(bulb);

    return lamp;
  }

  private createTrafficCar(bodyColor: number): THREE.Group {
    const car = new THREE.Group();
    const bGeo = new THREE.BoxGeometry(1.8, 0.7, 4.0);
    const bMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.85, roughness: 0.3 });
    const body = new THREE.Mesh(bGeo, bMat);
    body.position.y = 0.55;
    car.add(body);

    const cabinGeo = new THREE.BoxGeometry(1.4, 0.55, 2.2);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x070d17, metalness: 0.95, roughness: 0.1 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.05, -0.2);
    car.add(cabin);

    // Taillights
    const tailGeo = new THREE.BoxGeometry(1.4, 0.1, 0.05);
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, 0.65, 2.02);
    car.add(tail);

    return car;
  }

  public update(delta: number, progress: number) {
    // Animate traffic vehicles slowly forward
    this.trafficVehicles.forEach((v, idx) => {
      v.position.z -= (10 + idx * 2.5) * delta;
      if (v.position.z < -210) {
        v.position.z = -25;
      }
    });

    // Animate pedestrian stepping across road during emergency chapter (progress approx 0.68 - 0.78)
    if (progress >= 0.66 && progress <= 0.80) {
      // Step from sidewalk (x=5.5) towards crosswalk center (x=0.5)
      const pT = (progress - 0.66) / 0.08;
      this.pedestrian.position.x = THREE.MathUtils.lerp(5.5, 0.4, Math.min(pT, 1.0));
      // Subtle walking sway
      this.pedestrian.rotation.y = Math.PI / 2;
      this.pedestrian.position.y = Math.abs(Math.sin(performance.now() * 0.008)) * 0.08;
    } else if (progress > 0.80) {
      // Pedestrian finishes crossing safely onto opposite sidewalk
      this.pedestrian.position.x = -5.0;
    } else {
      this.pedestrian.position.x = 5.5;
    }
  }
}
