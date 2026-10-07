import * as THREE from 'three';

export class HoloScreens {
  public group: THREE.Group;
  public decisionTreeMesh: THREE.Mesh;
  public safetyAnalyticsMesh: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = "HOLO_ANALYTICS_SCREENS";
    this.group.position.set(0, 0, -185); // Chapter 11 region

    // 1. "WHY DID THE AI BRAKE?" DECISION TREE HOLOGRAPHIC SCREEN
    const treeCanvas = document.createElement('canvas');
    treeCanvas.width = 1024;
    treeCanvas.height = 512;
    const ctx = treeCanvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = 'rgba(5, 12, 28, 0.9)';
      ctx.fillRect(0, 0, 1024, 512);

      // Cyan cyber borders
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 1004, 492);

      // Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('WHY DID THE AI BRAKE?', 40, 56);

      ctx.fillStyle = '#67e8f9';
      ctx.font = '18px monospace';
      ctx.fillText('Real-time thoughts: Pedestrian crosswalk corridor interception', 40, 90);

      // Tree root node
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(420, 120, 180, 50, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('ROOT: ROOT SENSOR', 430, 150);

      // Level 2 nodes
      const l2 = [
        { label: 'OBSTACLE DETECT', x: 220, y: 220 },
        { label: 'TRAJECTORY RISK', x: 440, y: 220 },
        { label: 'VELOCITY MODEL', x: 660, y: 220 }
      ];

      l2.forEach(n => {
        ctx.fillStyle = '#0e7490';
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, 160, 45, 6);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(n.label, n.x + 10, n.y + 28);

        // Connector line
        ctx.beginPath();
        ctx.moveTo(510, 170);
        ctx.lineTo(n.x + 80, n.y);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Level 3 leaf node - EMERGENCY BRAKE (Selected)
      ctx.fillStyle = '#ef4444'; // Red selected action
      ctx.beginPath();
      ctx.roundRect(410, 320, 220, 60, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('EXECUTE FULL BRAKE', 425, 355);

      // Connector
      ctx.beginPath();
      ctx.moveTo(520, 265);
      ctx.lineTo(520, 320);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Right Stats Panel
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.fillRect(720, 300, 270, 170);
      ctx.strokeStyle = '#0284c7';
      ctx.strokeRect(720, 300, 270, 170);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('METRICS', 740, 335);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px monospace';
      ctx.fillText('Reaction Time: 11.8 ms', 740, 368);
      ctx.fillText('Braking Force: 94%', 740, 395);
      ctx.fillText('Collision Risk: AVERTED', 740, 422);
      ctx.fillText('Safety Margin: +2.1m', 740, 449);
    }

    const treeTexture = new THREE.CanvasTexture(treeCanvas);
    const treeMat = new THREE.MeshBasicMaterial({
      map: treeTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    this.decisionTreeMesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), treeMat);
    this.decisionTreeMesh.position.set(-5.5, 3.2, 0);
    this.decisionTreeMesh.rotation.y = 0.35;
    this.group.add(this.decisionTreeMesh);

    // 2. "SAFETY ANALYTICS 98/100" HOLOGRAPHIC SCREEN
    const analyticsCanvas = document.createElement('canvas');
    analyticsCanvas.width = 1024;
    analyticsCanvas.height = 512;
    const aCtx = analyticsCanvas.getContext('2d');

    if (aCtx) {
      aCtx.fillStyle = 'rgba(6, 15, 35, 0.9)';
      aCtx.fillRect(0, 0, 1024, 512);

      aCtx.strokeStyle = '#22d3ee';
      aCtx.lineWidth = 4;
      aCtx.strokeRect(10, 10, 1004, 492);

      // Score Callout
      aCtx.fillStyle = '#ffffff';
      aCtx.font = 'bold 28px monospace';
      aCtx.fillText('SAFETY ANALYTICS SCORE', 50, 60);

      aCtx.fillStyle = '#10b981';
      aCtx.font = 'bold 96px monospace';
      aCtx.fillText('98/100', 50, 170);

      // Bar Chart
      const bars = [
        { name: 'Detection Acc.', val: 99.4, color: '#38bdf8' },
        { name: 'Lane Tracking', val: 98.7, color: '#06b6d4' },
        { name: 'Pedestrian Margin', val: 97.2, color: '#10b981' },
        { name: 'Latency (11ms)', val: 99.8, color: '#6366f1' },
      ];

      bars.forEach((b, idx) => {
        const y = 230 + idx * 55;
        aCtx.fillStyle = '#cbd5e1';
        aCtx.font = '16px monospace';
        aCtx.fillText(b.name, 50, y + 20);

        aCtx.fillStyle = '#1e293b';
        aCtx.fillRect(280, y, 480, 24);

        aCtx.fillStyle = b.color;
        aCtx.fillRect(280, y, (480 * b.val) / 100, 24);

        aCtx.fillStyle = '#ffffff';
        aCtx.font = 'bold 16px monospace';
        aCtx.fillText(`${b.val}%`, 780, y + 18);
      });
    }

    const aTexture = new THREE.CanvasTexture(analyticsCanvas);
    const aMat = new THREE.MeshBasicMaterial({
      map: aTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    this.safetyAnalyticsMesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), aMat);
    this.safetyAnalyticsMesh.position.set(5.5, 3.2, 0);
    this.safetyAnalyticsMesh.rotation.y = -0.35;
    this.group.add(this.safetyAnalyticsMesh);
  }

  public update(delta: number, progress: number) {
    // Show screens during Chapter 11 (progress >= 0.90)
    const active = progress >= 0.88;
    this.decisionTreeMesh.visible = active;
    this.safetyAnalyticsMesh.visible = active;

    if (active) {
      // Gentle floating oscillation
      const time = performance.now() * 0.002;
      this.decisionTreeMesh.position.y = 3.2 + Math.sin(time) * 0.15;
      this.safetyAnalyticsMesh.position.y = 3.2 + Math.cos(time) * 0.15;
    }
  }
}
