import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sparkles, Activity } from "lucide-react";

export default function Restaurant3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);

  // References for animation and scroll reactive state
  const scrollOffsetRef = useRef<number>(0);
  const currentScrollLerp = useRef<number>(0);

  const animRefs = useRef<{
    guestHand?: THREE.Group;
    chefArm?: THREE.Group;
    kdsScreen?: THREE.Mesh;
    serverRoot?: THREE.Group;
    serverLeftLeg?: THREE.Mesh;
    serverRightLeg?: THREE.Mesh;
    cashierArm?: THREE.Group;
    managerHead?: THREE.Group;
    steamPoints?: THREE.Points;
    flowPackets?: THREE.Mesh[];
    signalRing?: THREE.Mesh;
    curve?: THREE.CatmullRomCurve3;
    rootGroup?: THREE.Group;
  }>({});

  // Scroll listener for smooth 3D parallax harmony
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const normalizedScroll = Math.min(Math.max(scrollPos / 600, 0), 1.5);
      scrollOffsetRef.current = normalizedScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 540;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070d1d, 0.02);

    // 2. Isometric Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(15, 13, 15);
    camera.lookAt(0, 0.6, 0);

    // 3. WebGL Renderer with High Precision & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffb570, 2.2);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const rimBlueLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimBlueLight.position.set(-14, 15, -14);
    scene.add(rimBlueLight);

    // Subtle station accent point lights
    const kitchenGlow = new THREE.PointLight(0xff4500, 3.2, 7);
    kitchenGlow.position.set(-3.0, 2.4, -3.0);
    scene.add(kitchenGlow);

    const tableGlow = new THREE.PointLight(0x10b981, 2.5, 6);
    tableGlow.position.set(2.8, 2.2, 1.2);
    scene.add(tableGlow);

    const posGlow = new THREE.PointLight(0x00f0ff, 2.2, 6);
    posGlow.position.set(-3.0, 2.2, 3.0);
    scene.add(posGlow);

    // 5. Materials
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.25 });
    const subFloorMat = new THREE.MeshStandardMaterial({ color: 0x060913, roughness: 0.8 });
    const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.9 });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.35 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x24160d, roughness: 0.55 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd3a5, roughness: 0.5 });
    const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.7 });
    const blueClothesMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const chefUniformMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
    const chefApronMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
    const serverVestMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const managerSuitMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.15 });

    const glassPartitionMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.4,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    animRefs.current.rootGroup = rootGroup;

    // ==========================================
    // 6. ISOMETRIC FLOOR BASE
    // ==========================================
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.6, 13.6), floorMat);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    rootGroup.add(baseMesh);

    const subBase = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.4, 14.2), subFloorMat);
    subBase.position.y = -0.8;
    rootGroup.add(subBase);

    // Neon Perimeter Trim
    const neonBorder = new THREE.Mesh(
      new THREE.BoxGeometry(13.7, 0.08, 13.7),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    neonBorder.position.y = 0.02;
    rootGroup.add(neonBorder);

    // Grid Seams
    const gridHelper = new THREE.GridHelper(13.0, 10, 0xf97316, 0x1e293b);
    gridHelper.position.y = 0.02;
    rootGroup.add(gridHelper);

    // Glass Railings
    const glassBack = new THREE.Mesh(new THREE.BoxGeometry(12.6, 1.8, 0.12), glassPartitionMat);
    glassBack.position.set(0, 0.9, -6.3);
    rootGroup.add(glassBack);

    const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 12.6), glassPartitionMat);
    glassLeft.position.set(-6.3, 0.9, 0);
    rootGroup.add(glassLeft);

    // Elevated Supervisor Platform
    const supervisorDeck = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.25, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.4 })
    );
    supervisorDeck.position.set(0.2, 0.12, -4.0);
    supervisorDeck.receiveShadow = true;
    rootGroup.add(supervisorDeck);

    // ==========================================
    // 7. HUMANOID GENERATOR HELPER
    // ==========================================
    const buildPerson = (opts: {
      torsoMat: THREE.Material;
      pantsMat: THREE.Material;
      skinMat: THREE.Material;
      hairMat: THREE.Material;
      scale?: number;
      isSeated?: boolean;
    }) => {
      const g = new THREE.Group();
      const s = opts.scale || 1.0;

      // Hips
      const hips = new THREE.Mesh(new THREE.BoxGeometry(0.36 * s, 0.18 * s, 0.24 * s), opts.pantsMat);
      hips.position.y = opts.isSeated ? 0.65 * s : 0.85 * s;
      hips.castShadow = true;
      g.add(hips);

      let leftLeg: THREE.Mesh;
      let rightLeg: THREE.Mesh;

      if (opts.isSeated) {
        const lThigh = new THREE.Mesh(new THREE.BoxGeometry(0.14 * s, 0.14 * s, 0.45 * s), opts.pantsMat);
        lThigh.position.set(-0.11 * s, 0.65 * s, 0.2 * s);
        g.add(lThigh);
        const rThigh = new THREE.Mesh(new THREE.BoxGeometry(0.14 * s, 0.14 * s, 0.45 * s), opts.pantsMat);
        rThigh.position.set(0.11 * s, 0.65 * s, 0.2 * s);
        g.add(rThigh);

        leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13 * s, 0.55 * s, 0.14 * s), opts.pantsMat);
        leftLeg.position.set(-0.11 * s, 0.32 * s, 0.42 * s);
        g.add(leftLeg);
        rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13 * s, 0.55 * s, 0.14 * s), opts.pantsMat);
        rightLeg.position.set(0.11 * s, 0.32 * s, 0.42 * s);
        g.add(rightLeg);
      } else {
        leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14 * s, 0.75 * s, 0.16 * s), opts.pantsMat);
        leftLeg.position.set(-0.11 * s, 0.42 * s, 0);
        leftLeg.castShadow = true;
        g.add(leftLeg);

        rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14 * s, 0.75 * s, 0.16 * s), opts.pantsMat);
        rightLeg.position.set(0.11 * s, 0.42 * s, 0);
        rightLeg.castShadow = true;
        g.add(rightLeg);
      }

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44 * s, 0.6 * s, 0.28 * s), opts.torsoMat);
      torso.position.y = (opts.isSeated ? 1.05 : 1.25) * s;
      torso.castShadow = true;
      g.add(torso);

      // Head & Hair
      const headG = new THREE.Group();
      headG.position.y = (opts.isSeated ? 1.5 : 1.7) * s;

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3 * s, 0.32 * s, 0.28 * s), opts.skinMat);
      head.castShadow = true;
      headG.add(head);

      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.32 * s, 0.12 * s, 0.3 * s), opts.hairMat);
      hair.position.y = 0.16 * s;
      headG.add(hair);

      g.add(headG);

      // Arms
      const leftArm = new THREE.Group();
      leftArm.position.set(-0.3 * s, (opts.isSeated ? 1.3 : 1.5) * s, 0);
      const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12 * s, 0.55 * s, 0.14 * s), opts.torsoMat);
      lArmMesh.position.y = -0.24 * s;
      leftArm.add(lArmMesh);
      g.add(leftArm);

      const rightArm = new THREE.Group();
      rightArm.position.set(0.3 * s, (opts.isSeated ? 1.3 : 1.5) * s, 0);
      const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12 * s, 0.55 * s, 0.14 * s), opts.torsoMat);
      rArmMesh.position.y = -0.24 * s;
      rightArm.add(rArmMesh);
      g.add(rightArm);

      return { root: g, headG, leftArm, rightArm, leftLeg, rightLeg };
    };

    // ==========================================
    // 8. 📱 GUEST DINING & TABLET ORDERING (Table #04)
    // ==========================================
    const diningZone = new THREE.Group();
    diningZone.position.set(2.8, 0, 1.2);
    rootGroup.add(diningZone);

    const diningTable = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.1, 32), marbleMat);
    diningTable.position.set(0, 1.0, 0);
    diningTable.castShadow = true;
    diningTable.receiveShadow = true;
    diningZone.add(diningTable);

    const tablePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16), stainlessMat);
    tablePedestal.position.set(0, 0.5, 0);
    diningZone.add(tablePedestal);

    // Glowing Tablet on Stand
    const tabletStand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), stainlessMat);
    tabletStand.position.set(0, 1.08, 0.2);
    diningZone.add(tabletStand);

    const orderTablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.02, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    orderTablet.position.set(0, 1.15, 0.2);
    orderTablet.rotation.x = -0.35;
    diningZone.add(orderTablet);

    // Halo Base
    const tableHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 2.02, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    tableHalo.rotation.x = Math.PI / 2;
    tableHalo.position.y = 0.03;
    diningZone.add(tableHalo);

    // Seated Guest
    const guest = buildPerson({
      torsoMat: blueClothesMat,
      pantsMat: floorMat,
      skinMat,
      hairMat: hairDarkMat,
      scale: 0.92,
      isSeated: true,
    });
    guest.root.position.set(0, 0, -1.1);
    diningZone.add(guest.root);

    guest.rightArm.rotation.x = -Math.PI / 3.0;
    guest.rightArm.rotation.y = -Math.PI / 8;
    guest.leftArm.rotation.x = -Math.PI / 4.0;
    animRefs.current.guestHand = guest.rightArm;

    // Dining Chairs
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
      if (angle === Math.PI * 1.5) continue;
      const chairG = new THREE.Group();
      chairG.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
      chairG.rotation.y = -angle - Math.PI / 2;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), darkWoodMat);
      seat.position.y = 0.55;
      chairG.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.06), darkWoodMat);
      back.position.set(0, 0.8, -0.21);
      chairG.add(back);

      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 12), stainlessMat);
      leg.position.set(0, 0.275, 0);
      chairG.add(leg);

      diningZone.add(chairG);
    }

    // ==========================================
    // 9. 🍳 KITCHEN CHEF & OVERHEAD KDS SCREEN
    // ==========================================
    const kitchenZone = new THREE.Group();
    kitchenZone.position.set(-3.0, 0, -3.0);
    rootGroup.add(kitchenZone);

    const kitchenCounter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.6), stainlessMat);
    kitchenCounter.position.set(0, 0.55, 0);
    kitchenCounter.castShadow = true;
    kitchenCounter.receiveShadow = true;
    kitchenZone.add(kitchenCounter);

    // Burners & Frying Pan
    for (let i = -1; i <= 1; i++) {
      const hob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.02, 24),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xff4500 : 0x1e293b })
      );
      hob.position.set(i * 1.1, 1.12, 0.1);
      kitchenZone.add(hob);
    }

    const chefPan = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.12, 24), marbleMat);
    chefPan.position.set(0, 1.2, 0.1);
    chefPan.castShadow = true;
    kitchenZone.add(chefPan);

    // Overhead KDS Screen
    const kdsArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), stainlessMat);
    kdsArm.position.set(0, 2.15, -0.6);
    kitchenZone.add(kdsArm);

    const kdsScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.75, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xff4500 })
    );
    kdsScreen.position.set(0, 2.15, -0.45);
    kdsScreen.rotation.x = 0.15;
    kitchenZone.add(kdsScreen);
    animRefs.current.kdsScreen = kdsScreen;

    // Chef Humanoid
    const chef = buildPerson({
      torsoMat: chefUniformMat,
      pantsMat: floorMat,
      skinMat,
      hairMat: hairDarkMat,
      scale: 0.94,
    });
    chef.root.position.set(0, 0, 1.1);
    chef.root.rotation.y = Math.PI;
    kitchenZone.add(chef.root);

    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.02), chefApronMat);
    apron.position.set(0, 1.1, -0.15);
    chef.root.add(apron);

    const chefHat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.2, 0.38, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    chefHat.position.y = 0.32;
    chef.headG.add(chefHat);

    chef.rightArm.rotation.x = -Math.PI / 3.5;
    chef.leftArm.rotation.x = -Math.PI / 4.5;
    animRefs.current.chefArm = chef.rightArm;

    // Steam particles
    const steamGeo = new THREE.BufferGeometry();
    const steamCount = 35;
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = (Math.random() - 0.5) * 0.4 - 3.0;
      steamPos[i + 1] = Math.random() * 1.5 + 1.2;
      steamPos[i + 2] = (Math.random() - 0.5) * 0.4 - 2.9;
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffe4d6,
      size: 0.09,
      transparent: true,
      opacity: 0.65,
    });
    const steamPoints = new THREE.Points(steamGeo, steamMat);
    rootGroup.add(steamPoints);
    animRefs.current.steamPoints = steamPoints;

    // ==========================================
    // 10. 🤵 WAITER WITH COVERED PLATTER
    // ==========================================
    const serverGroup = new THREE.Group();
    serverGroup.position.set(-1.2, 0, 0);
    rootGroup.add(serverGroup);
    animRefs.current.serverRoot = serverGroup;

    const server = buildPerson({
      torsoMat: serverVestMat,
      pantsMat: floorMat,
      skinMat,
      hairMat: hairDarkMat,
      scale: 0.94,
    });
    serverGroup.add(server.root);
    animRefs.current.serverLeftLeg = server.leftLeg;
    animRefs.current.serverRightLeg = server.rightLeg;

    const bowTie = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.06, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    bowTie.position.set(0, 1.52, 0.16);
    server.root.add(bowTie);

    // Silver Platter & Cloche
    const trayG = new THREE.Group();
    trayG.position.set(0, 1.25, 0.45);
    server.root.add(trayG);

    const silverPlatter = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.04, 32), stainlessMat);
    silverPlatter.castShadow = true;
    trayG.add(silverPlatter);

    const domeCloche = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      stainlessMat
    );
    domeCloche.position.y = 0.02;
    trayG.add(domeCloche);

    server.leftArm.rotation.x = -Math.PI / 2.8;
    server.leftArm.rotation.z = Math.PI / 8;
    server.rightArm.rotation.x = -Math.PI / 2.8;
    server.rightArm.rotation.z = -Math.PI / 8;

    // ==========================================
    // 11. 💳 CASHIER & POS TERMINAL
    // ==========================================
    const posZone = new THREE.Group();
    posZone.position.set(-3.0, 0, 3.0);
    rootGroup.add(posZone);

    const posDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.4), darkWoodMat);
    posDesk.position.set(0, 0.6, 0);
    posDesk.castShadow = true;
    posZone.add(posDesk);

    const posTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.6), marbleMat);
    posTop.position.set(0, 1.25, 0);
    posZone.add(posTop);

    const posScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    posScreen.position.set(-0.3, 1.6, 0.1);
    posScreen.rotation.x = -0.2;
    posZone.add(posScreen);

    const cashier = buildPerson({
      torsoMat: blueClothesMat,
      pantsMat: floorMat,
      skinMat,
      hairMat: hairDarkMat,
      scale: 0.94,
    });
    cashier.root.position.set(0, 0, -1.05);
    posZone.add(cashier.root);
    cashier.leftArm.rotation.x = -Math.PI / 3;
    cashier.rightArm.rotation.x = -Math.PI / 3.2;
    animRefs.current.cashierArm = cashier.rightArm;

    // ==========================================
    // 12. 👔 MANAGER / SUPERVISOR
    // ==========================================
    const managerZone = new THREE.Group();
    managerZone.position.set(0.2, 0.25, -4.0);
    rootGroup.add(managerZone);

    const manager = buildPerson({
      torsoMat: managerSuitMat,
      pantsMat: managerSuitMat,
      skinMat,
      hairMat: hairDarkMat,
      scale: 0.96,
    });
    managerZone.add(manager.root);
    animRefs.current.managerHead = manager.headG;

    const mTablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.25),
      new THREE.MeshBasicMaterial({ color: 0xa855f7 })
    );
    mTablet.position.set(0, 1.2, 0.3);
    mTablet.rotation.x = 0.4;
    manager.root.add(mTablet);

    manager.leftArm.rotation.x = -Math.PI / 3;
    manager.rightArm.rotation.x = -Math.PI / 2.6;

    // ==========================================
    // 13. ⚡ LIVE ORDER NOTIFICATION SIGNAL ARC (TABLE -> KITCHEN -> POS)
    // ==========================================
    const signalPoints = [
      new THREE.Vector3(2.8, 1.3, 1.2), // Table #04
      new THREE.Vector3(1.2, 2.8, 0.0), // Mid-Air Arc
      new THREE.Vector3(-3.0, 2.2, -3.0), // Kitchen KDS
      new THREE.Vector3(-1.0, 2.6, 1.0), // Relay Node
      new THREE.Vector3(-3.0, 1.6, 3.0), // POS Billing
    ];
    const signalCurve = new THREE.CatmullRomCurve3(signalPoints);
    animRefs.current.curve = signalCurve;

    const signalTube = new THREE.Mesh(
      new THREE.TubeGeometry(signalCurve, 64, 0.035, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.45 })
    );
    rootGroup.add(signalTube);

    const packetCount = 7;
    const packetSpheres: THREE.Mesh[] = [];
    const pktGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const pktMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < packetCount; i++) {
      const sp = new THREE.Mesh(pktGeo, pktMat);
      rootGroup.add(sp);
      packetSpheres.push(sp);
    }
    animRefs.current.flowPackets = packetSpheres;

    const signalRing = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.8, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    signalRing.position.set(2.8, 1.15, 1.2);
    signalRing.rotation.x = Math.PI / 2;
    rootGroup.add(signalRing);
    animRefs.current.signalRing = signalRing;

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      rootGroup.rotation.y += deltaX * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      rootGroup.rotation.y += deltaX * 0.008;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 14. ANIMATION LOOP WITH SCROLL HARMONY
    // ==========================================
    let animId: number;
    const clock = new THREE.Clock();

    const serverWaypoints = [
      new THREE.Vector3(-1.8, 0, -2.0),
      new THREE.Vector3(0.0, 0, 0.0),
      new THREE.Vector3(1.5, 0, 1.2),
      new THREE.Vector3(0.4, 0, 1.5),
      new THREE.Vector3(-0.6, 0, -0.6),
    ];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      currentScrollLerp.current += (scrollOffsetRef.current - currentScrollLerp.current) * 0.06;
      const scrollS = currentScrollLerp.current;

      // React smoothly to page scroll up / down
      camera.position.y = 13 + scrollS * 3.5;
      camera.position.z = 15 - scrollS * 2.0;
      camera.lookAt(0, 0.6 + scrollS * 0.5, 0);

      // Subtle dynamic platform tilt on scroll
      rootGroup.rotation.x = scrollS * 0.12;

      // Continuous ambient rotation
      if (isAutoRotate && !isDragging) {
        rootGroup.rotation.y += 0.0035;
      }

      // Guest Tapping & Table Pulse Wave
      if (animRefs.current.guestHand) {
        animRefs.current.guestHand.rotation.x = -Math.PI / 3.0 + Math.sin(elapsedTime * 5) * 0.12;
      }
      if (animRefs.current.signalRing) {
        const ringScale = (elapsedTime * 1.5) % 2.5 + 0.5;
        animRefs.current.signalRing.scale.set(ringScale, ringScale, 1);
        (animRefs.current.signalRing.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - ringScale / 2.8);
      }

      // Chef Cooking
      if (animRefs.current.chefArm) {
        animRefs.current.chefArm.rotation.x = -Math.PI / 3.5 + Math.sin(elapsedTime * 6) * 0.22;
      }

      // KDS Screen Notification Flash
      if (animRefs.current.kdsScreen) {
        const pulse = Math.sin(elapsedTime * 4) * 0.15 + 0.85;
        animRefs.current.kdsScreen.scale.set(pulse, pulse, 1);
      }

      // Waiter Walking & Delivery Patrol
      if (animRefs.current.serverRoot) {
        const t = (elapsedTime * 0.14) % 1;
        const totalPts = serverWaypoints.length;
        const currIdx = Math.floor(t * totalPts);
        const nextIdx = (currIdx + 1) % totalPts;
        const segT = (t * totalPts) % 1;

        const p1 = serverWaypoints[currIdx];
        const p2 = serverWaypoints[nextIdx];
        animRefs.current.serverRoot.position.lerpVectors(p1, p2, segT);

        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        if (dir.lengthSq() > 0.001) {
          const angle = Math.atan2(dir.x, dir.z);
          animRefs.current.serverRoot.rotation.y = angle;
        }

        const legSwing = Math.sin(elapsedTime * 8) * 0.35;
        if (animRefs.current.serverLeftLeg && animRefs.current.serverRightLeg) {
          animRefs.current.serverLeftLeg.rotation.x = legSwing;
          animRefs.current.serverRightLeg.rotation.x = -legSwing;
        }
      }

      // Cashier typing
      if (animRefs.current.cashierArm) {
        animRefs.current.cashierArm.rotation.x = -Math.PI / 3.2 + Math.sin(elapsedTime * 4) * 0.15;
      }

      // Manager overview
      if (animRefs.current.managerHead) {
        animRefs.current.managerHead.rotation.y = Math.sin(elapsedTime * 1.5) * 0.4;
      }

      // Steam Rising
      if (animRefs.current.steamPoints) {
        const pos = animRefs.current.steamPoints.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < steamCount * 3; i += 3) {
          pos[i] += 0.012;
          if (pos[i] > 2.8) {
            pos[i] = 1.2;
          }
        }
        animRefs.current.steamPoints.geometry.attributes.position.needsUpdate = true;
      }

      // Live Signal Packets Streaming
      if (animRefs.current.flowPackets && animRefs.current.curve) {
        const curveObj = animRefs.current.curve;
        animRefs.current.flowPackets.forEach((pkt, idx) => {
          const offset = (elapsedTime * 0.3 + idx / packetCount) % 1;
          pkt.position.copy(curveObj.getPoint(offset));
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoRotate]);

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] md:h-[540px] lg:h-[560px] rounded-[28px] md:rounded-[36px] overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1628]/95 via-[#090e1a]/95 to-[#030712] backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col justify-between select-none group">
      
      {/* 🔮 Gradient Glow Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 🏷️ Top Minimal Floating Status Header */}
      <div className="relative z-10 p-3 sm:p-4 md:p-5 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Minimal Live Status Tag */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/85 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full shadow-lg shadow-black/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-gray-200 tracking-wide">Live Restaurant 3D</span>
          <span className="text-[11px] text-orange-400 font-medium border-l border-white/15 pl-2 flex items-center gap-1">
            <Activity className="w-3 h-3 text-orange-400 animate-pulse" />
            <span>Syncing</span>
          </span>
        </div>

        {/* Minimal 360 Rotation Toggle */}
        <button
          onClick={() => setIsAutoRotate((prev) => !prev)}
          className={`pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all shadow-md backdrop-blur-md ${
            isAutoRotate
              ? "bg-slate-900/90 text-orange-400 border-orange-500/40 hover:bg-slate-800"
              : "bg-slate-900/60 text-gray-400 border-white/10 hover:text-white"
          }`}
          title="Toggle 3D auto rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin text-orange-400" : ""}`} style={{ animationDuration: "6s" }} />
          <span>{isAutoRotate ? "360° Rotate" : "Paused"}</span>
        </button>
      </div>

      {/* 🎮 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        title="Click and drag to rotate the 3D restaurant model"
      />

      {/* 🏷️ Bottom Minimal Floating Stats */}
      <div className="relative z-10 p-3 sm:p-4 md:p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/75 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-2xl shadow-lg">
          <span className="text-[10px] text-gray-400">Order ➔ KDS Latency:</span>
          <span className="text-[11px] font-bold text-emerald-400">&lt;120ms</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span className="hidden sm:inline">Scroll & Drag Interactive</span>
          <span className="sm:hidden">3D Interactive</span>
        </div>
      </div>

    </div>
  );
}
