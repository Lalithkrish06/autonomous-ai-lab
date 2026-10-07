export interface ChapterData {
  id: number;
  number: string;
  title: string;
  tagline: string;
  description: string;
  scrollStart: number;
  scrollEnd: number;
  systemStatus: string;
  speedKmh: number;
  safetyScore: number;
  sensorState: string;
  decisionState: string;
  cameraFocus: 'vehicle' | 'sensor' | 'city' | 'emergency' | 'parking' | 'analytics' | 'aerial';
  videoRole: string;
}

export const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    number: "01",
    title: "LAB ACTIVATION",
    tagline: "SMARTER ROADS. SAFER TOMORROW.",
    description: "Digital Twin launch inside the Autonomous AI Simulation Chamber. Initializing neural weight matrix and telemetry bus.",
    scrollStart: 0.0,
    scrollEnd: 0.09,
    systemStatus: "INITIALIZING",
    speedKmh: 0,
    safetyScore: 99.8,
    sensorState: "COLD BOOT",
    decisionState: "STANDBY",
    cameraFocus: "vehicle",
    videoRole: "Chamber reveal & circular turntable activation"
  },
  {
    id: 2,
    number: "02",
    title: "APEX-1 ACTIVATION",
    tagline: "AUTONOMOUS DRIVE PLATFORM",
    description: "APEX-1 powertrain and optical arrays synchronize. Solid-state LiDAR spins up to 1,200 RPM with 360-degree field coverage.",
    scrollStart: 0.09,
    scrollEnd: 0.18,
    systemStatus: "AI CORE ONLINE",
    speedKmh: 0,
    safetyScore: 99.9,
    sensorState: "5/5 SENSORS ONLINE",
    decisionState: "DIAGNOSTIC PASS",
    cameraFocus: "sensor",
    videoRole: "Sensor diagnostic HUD & roof LiDAR pulse"
  },
  {
    id: 3,
    number: "03",
    title: "SENSOR FUSION",
    tagline: "MULTI-MODAL PERCEPTION MATRIX",
    description: "Camera cones, mmWave radar sweeps, ultrasonic sonar, and LiDAR point clouds fuse into a coherent spatial digital twin.",
    scrollStart: 0.18,
    scrollEnd: 0.28,
    systemStatus: "FUSION ACTIVE",
    speedKmh: 12,
    safetyScore: 99.7,
    sensorState: "POINT-CLOUD DENSE",
    decisionState: "SYNCHRONIZED",
    cameraFocus: "sensor",
    videoRole: "Multi-modal sensor rings & data streams"
  },
  {
    id: 4,
    number: "04",
    title: "NEO-METROPOLIS",
    tagline: "URBAN ARTERY DIGITAL TWIN",
    description: "APEX-1 dispatches onto Neo-Metropolis avenues. Wet asphalt reflections, smart streetlamps, and cybernetic urban infrastructure.",
    scrollStart: 0.28,
    scrollEnd: 0.38,
    systemStatus: "URBAN NAVIGATION",
    speedKmh: 48,
    safetyScore: 99.4,
    sensorState: "LONG-RANGE RADAR",
    decisionState: "CRUISE ENGAGED",
    cameraFocus: "city",
    videoRole: "Metropolis gate rollout & drivable area view"
  },
  {
    id: 5,
    number: "05",
    title: "AI PERCEPTION",
    tagline: "OBJECT DETECTION & 3D BOUNDING",
    description: "Real-time semantic segmentation identifies surrounding vehicles (98%), crosswalk pedestrians (96%), and traffic signals (99%).",
    scrollStart: 0.38,
    scrollEnd: 0.48,
    systemStatus: "PERCEPTION ACTIVE",
    speedKmh: 52,
    safetyScore: 99.1,
    sensorState: "SEMANTIC VISION",
    decisionState: "TRACKING 14 TARGETS",
    cameraFocus: "vehicle",
    videoRole: "Computer vision bounding boxes & classification"
  },
  {
    id: 6,
    number: "06",
    title: "ROAD UNDERSTANDING",
    tagline: "DRIVABLE AREA SEGMENTATION",
    description: "Lane tracking curves and drivable surface segmentation project dynamic predictive navigation vectors onto the roadway.",
    scrollStart: 0.48,
    scrollEnd: 0.58,
    systemStatus: "LANE RECOGNITION",
    speedKmh: 54,
    safetyScore: 98.9,
    sensorState: "EDGE DETECTION",
    decisionState: "PATH PROJECTED",
    cameraFocus: "vehicle",
    videoRole: "Lane boundary illumination & trajectory vector"
  },
  {
    id: 7,
    number: "07",
    title: "DECISION ENGINE",
    tagline: "REAL-TIME TRAJECTORY SOLVER",
    description: "Evaluates multi-hypothesis path branches at 100 Hz. Calculates comfort, velocity, and clearance before locking optimal steering curve.",
    scrollStart: 0.58,
    scrollEnd: 0.68,
    systemStatus: "TREE EVALUATING",
    speedKmh: 45,
    safetyScore: 98.7,
    sensorState: "360 AWARENESS",
    decisionState: "TURN LEFT: 97.8% CONF",
    cameraFocus: "vehicle",
    videoRole: "Navigation branching & path replanning ribbon"
  },
  {
    id: 8,
    number: "08",
    title: "EMERGENCY RESPONSE",
    tagline: "CRITICAL COLLISION AVOIDANCE",
    description: "Unanticipated pedestrian enters road corridor. 78% collision risk flagged. Sub-12ms brake reaction safely arrests vehicle.",
    scrollStart: 0.68,
    scrollEnd: 0.78,
    systemStatus: "EMERGENCY BRAKE",
    speedKmh: 0,
    safetyScore: 98.0,
    sensorState: "HIGH-PRIORITY ALERT",
    decisionState: "COLLISION AVOIDED",
    cameraFocus: "emergency",
    videoRole: "Pedestrian hazard detection & full safe stop"
  },
  {
    id: 9,
    number: "09",
    title: "SAFE PATH RECOVERY",
    tagline: "RE-ROUTING & HAZARD CLEARANCE",
    description: "Recalculates clear trajectory envelope around urban roadwork zone. Safely navigates past construction pylons and heavy machinery.",
    scrollStart: 0.78,
    scrollEnd: 0.86,
    systemStatus: "RECOVERING PATH",
    speedKmh: 36,
    safetyScore: 98.4,
    sensorState: "OBSTACLE RE-ROUTE",
    decisionState: "SAFE PATH FOUND",
    cameraFocus: "city",
    videoRole: "Highway rerouting & amber hazard avoidance"
  },
  {
    id: 10,
    number: "10",
    title: "AUTONOMOUS PARKING",
    tagline: "MILLIMETER-PRECISION DOCKING",
    description: "Bird's-eye 360 ultrasonic and optical grid scans tight parking bay, smoothly executing multi-point reverse alignment.",
    scrollStart: 0.86,
    scrollEnd: 0.94,
    systemStatus: "PARK ASSIST ACTIVE",
    speedKmh: 5,
    safetyScore: 99.9,
    sensorState: "ULTRASONIC GRID",
    decisionState: "PARKING COMPLETE",
    cameraFocus: "parking",
    videoRole: "360 overhead sonar & automated bay dock"
  },
  {
    id: 11,
    number: "11",
    title: "AI PERFORMANCE & HERO",
    tagline: "SMARTER ROADS. SAFER TOMORROW.",
    description: "Holographic decision tree telemetry validates 98/100 safety score as APEX-1 speeds into the golden Neo-Metropolis dawn.",
    scrollStart: 0.94,
    scrollEnd: 1.0,
    systemStatus: "MISSION NOMINAL",
    speedKmh: 58,
    safetyScore: 98.6,
    sensorState: "CONTINUOUS LEARNING",
    decisionState: "HIGHWAY PROCEED",
    cameraFocus: "aerial",
    videoRole: "Safety analytics tree & golden sunrise hero"
  }
];

export type CameraMode = 'cinematic' | 'chase' | 'topdown' | 'sensor_lidar';
