import { useEffect, useRef } from "react";
import * as THREE from "three";

type ChapterOneSceneProps = {
  sceneIndex: number;
  title: string;
  narrativeLine: string;
  requiresInteraction: boolean;
  onPrimaryNodeActivated: () => void;
};

const SCENE_COUNT = 8;

const SCENE_BACKGROUNDS = [
  "#041018",
  "#081018",
  "#091522",
  "#07161f",
  "#0b151d",
  "#0a1824",
  "#0b1a25",
  "#0d1a23",
];

const SCENE_CAMERAS: [number, number, number][] = [
  [-0.55, 2.05, 7.2],
  [2.15, 1.62, 5.2],
  [0.2, 2.4, 12.5],
  [0, 2.2, 11.2],
  [0.8, 2.1, 10.9],
  [0.2, 2.0, 10.6],
  [0, 2.0, 10.4],
  [0, 2.2, 10.6],
];

const SCENE_LOOK_ATS: [number, number, number][] = [
  [0.42, 0.48, -1.24],
  [1.46, 0.55, -0.9],
  [0, 1.1, -1.0],
  [0, 1.0, -1.2],
  [0.6, 1.1, -1.3],
  [0, 0.9, -1.2],
  [0.2, 0.8, -1.1],
  [0, 1.0, -1.2],
];

const HOTSPOT_TARGETS = [
  new THREE.Vector3(0.16, 0.43, -1.24),
  new THREE.Vector3(1.46, 0.47, -0.88),
  new THREE.Vector3(0, 0.82, -1),
  new THREE.Vector3(0, 0.5, -1.2),
  new THREE.Vector3(0.94, 1.08, -1.26),
  new THREE.Vector3(0, 0.16, -1.05),
  new THREE.Vector3(1.1, 0.54, -1.05),
  new THREE.Vector3(0, 0.32, -1.2),
];

const DEFAULT_BACKGROUND = "#041018";
const DEFAULT_CAMERA: [number, number, number] = [0, 3, 16];
const DEFAULT_LOOK_AT: [number, number, number] = [0, 2, -1];
const DEFAULT_HOTSPOT_TARGET = new THREE.Vector3(0, 0.3, -1.2);

const getBackgroundFor = (index: number) =>
  SCENE_BACKGROUNDS[index] ?? DEFAULT_BACKGROUND;

const getCameraFor = (index: number): [number, number, number] =>
  SCENE_CAMERAS[index] ?? DEFAULT_CAMERA;

const getLookAtFor = (index: number): [number, number, number] =>
  SCENE_LOOK_ATS[index] ?? DEFAULT_LOOK_AT;

const getHotspotFor = (index: number): THREE.Vector3 =>
  HOTSPOT_TARGETS[index] ?? DEFAULT_HOTSPOT_TARGET;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const weightFor = (blend: number, index: number) => {
  const distance = Math.abs(blend - index);
  return clamp(1 - distance, 0, 1);
};

const setOpacity = (materials: THREE.Material[], opacity: number) => {
  for (const material of materials) {
    if ("transparent" in material) {
      material.transparent = true;
    }
    if ("opacity" in material) {
      (material as THREE.Material & { opacity: number }).opacity = opacity;
    }
  }
};

const colorFrom = (hex: string) => new THREE.Color(hex);

const makeTopographicTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#06121C";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(161, 220, 213, 0.14)";
  context.lineWidth = 1.2;

  for (let i = 0; i < 24; i += 1) {
    const radius = 26 + i * 25;
    context.beginPath();
    context.ellipse(300, 330, radius, radius * 0.56, Math.PI / 11, 0, Math.PI * 2);
    context.stroke();
  }

  for (let i = 0; i < 20; i += 1) {
    const radius = 38 + i * 23;
    context.beginPath();
    context.ellipse(760, 720, radius, radius * 0.48, -Math.PI / 8, 0, Math.PI * 2);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.8, 1.8);
  return texture;
};

const makeTextTexture = (
  text: string,
  options?: {
    width?: number;
    height?: number;
    fontSize?: number;
    fill?: string;
    background?: string;
    stroke?: string;
  }
) => {
  const width = options?.width ?? 640;
  const height = options?.height ?? 180;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, width, height);
  context.fillStyle = options?.background ?? "rgba(8, 27, 38, 0.82)";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = options?.stroke ?? "rgba(173, 239, 231, 0.68)";
  context.lineWidth = 4;
  context.strokeRect(4, 4, width - 8, height - 8);
  context.fillStyle = options?.fill ?? "#E9FFFC";
  context.font = `700 ${options?.fontSize ?? 54}px Outfit, Inter, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export default function ChapterOneScene({
  sceneIndex,
  title,
  narrativeLine,
  requiresInteraction,
  onPrimaryNodeActivated,
}: ChapterOneSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneIndexRef = useRef(sceneIndex);
  const requiresInteractionRef = useRef(requiresInteraction);
  const callbackRef = useRef(onPrimaryNodeActivated);
  const activatedSceneRef = useRef(-1);

  sceneIndexRef.current = sceneIndex;
  requiresInteractionRef.current = requiresInteraction;
  callbackRef.current = onPrimaryNodeActivated;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = colorFrom(getBackgroundFor(0));
    scene.fog = new THREE.Fog(0x02080d, 9, 26);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);
    camera.position.set(...getCameraFor(0));
    camera.lookAt(...getLookAtFor(0));

    const ambient = new THREE.AmbientLight(0xffffff, 0.42);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(-8, 12, 6);
    const mint = new THREE.DirectionalLight(0xadefe7, 1.05);
    mint.position.set(7, 8, -4);
    const rim = new THREE.DirectionalLight(0xa1dcd5, 0.72);
    rim.position.set(-2, 5, -8);
    scene.add(ambient, key, mint, rim);

    const topographicTexture = makeTopographicTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x081721,
      map: topographicTexture ?? null,
      roughness: 0.95,
      metalness: 0.03,
      transparent: true,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.9;
    scene.add(floor);

    const textures: THREE.Texture[] = [];

    const libraryGroup = new THREE.Group();
    const libraryMaterials: THREE.Material[] = [];

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f2,
      roughness: 0.88,
      metalness: 0.04,
      transparent: true,
    });
    libraryMaterials.push(wallMaterial);
    const libraryWall = new THREE.Mesh(new THREE.BoxGeometry(8.6, 7.2, 0.34), wallMaterial);
    libraryWall.position.set(-2.1, 1.35, -1.8);
    libraryGroup.add(libraryWall);

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xefebe2,
      roughness: 0.82,
      metalness: 0.06,
      transparent: true,
    });
    libraryMaterials.push(frameMaterial);

    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(8.95, 7.55, 0.22), frameMaterial);
    outerFrame.position.set(-2.1, 1.35, -1.56);
    libraryGroup.add(outerFrame);

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x8fc9c3,
      emissive: 0x427277,
      emissiveIntensity: 0.26,
      roughness: 0.55,
      metalness: 0.12,
      transparent: true,
    });
    libraryMaterials.push(trimMaterial);

    const verticalDividers = [-4.95, -3.1, -1.25, 0.6];
    for (const x of verticalDividers) {
      const divider = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.9, 0.18), trimMaterial);
      divider.position.set(x, 1.35, -1.5);
      libraryGroup.add(divider);
    }

    const shelfY = [3.9, 3.0, 2.1, 1.2, 0.3, -0.6, -1.5];
    for (const y of shelfY) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(7.95, 0.08, 0.18), trimMaterial);
      shelf.position.set(-2.1, y, -1.5);
      libraryGroup.add(shelf);
    }

    for (let column = 0; column < 4; column += 1) {
      const startX = -4.5 + column * 1.85;
      for (let row = 0; row < 7; row += 1) {
        const y = 3.55 - row * 0.9;
        for (let slot = 0; slot < 5; slot += 1) {
          const x = startX + slot * 0.32;
          const isScroll = (slot + row + column) % 2 === 0;
          const bookMaterial = new THREE.MeshStandardMaterial({
            color: isScroll ? 0xf7f2ea : 0xefebe3,
            roughness: 0.74,
            metalness: 0.04,
            transparent: true,
          });
          libraryMaterials.push(bookMaterial);

          if (isScroll) {
            const scroll = new THREE.Mesh(
              new THREE.CylinderGeometry(0.09, 0.09, 0.44, 14),
              bookMaterial
            );
            scroll.rotation.z = Math.PI / 2;
            scroll.position.set(x, y, -1.38);
            libraryGroup.add(scroll);
          } else {
            const book = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.24), bookMaterial);
            book.rotation.z = (slot % 2 === 0 ? -1 : 1) * 0.12;
            book.position.set(x, y, -1.36);
            libraryGroup.add(book);
          }
        }
      }
    }

    const podiumMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f6ef,
      roughness: 0.78,
      metalness: 0.06,
      transparent: true,
    });
    libraryMaterials.push(podiumMaterial);
    const stepHeights = [0.18, 0.26, 0.34];
    for (let index = 0; index < stepHeights.length; index += 1) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2.15 - index * 0.32, stepHeights[index] ?? 0.2, 1.3),
        podiumMaterial
      );
      step.position.set(1.62, -1.66 + index * 0.21, -1.0 - index * 0.06);
      libraryGroup.add(step);
    }

    const libraryScrollMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6efe6,
      roughness: 0.62,
      metalness: 0.08,
      transparent: true,
    });
    libraryMaterials.push(libraryScrollMaterial);
    const libraryScroll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1.4, 20),
      libraryScrollMaterial
    );
    libraryScroll.rotation.z = Math.PI / 2;
    libraryScroll.position.set(0.16, 0.42, -1.26);
    libraryGroup.add(libraryScroll);

    scene.add(libraryGroup);

    const soldierGroup = new THREE.Group();
    const soldierMaterials: THREE.Material[] = [];

    const soldierBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x8ec6c0,
      emissive: 0x427277,
      emissiveIntensity: 0.26,
      roughness: 0.83,
      metalness: 0.08,
      transparent: true,
    });
    soldierMaterials.push(soldierBodyMaterial);
    const soldierTorso = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 1.0, 8, 16), soldierBodyMaterial);
    soldierTorso.position.set(1.65, 0.04, -0.96);
    soldierGroup.add(soldierTorso);

    const soldierHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), soldierBodyMaterial);
    soldierHead.position.set(1.65, 1.0, -0.96);
    soldierGroup.add(soldierHead);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI), soldierBodyMaterial);
    helmet.position.set(1.65, 1.08, -0.95);
    soldierGroup.add(helmet);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.2), soldierBodyMaterial);
    crest.position.set(1.65, 1.34, -0.95);
    soldierGroup.add(crest);

    const armLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.54, 6, 12), soldierBodyMaterial);
    armLeft.position.set(1.32, 0.31, -0.94);
    armLeft.rotation.z = -0.42;
    soldierGroup.add(armLeft);

    const armRight = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.58, 6, 12), soldierBodyMaterial);
    armRight.position.set(1.96, 0.3, -0.9);
    armRight.rotation.z = 0.3;
    soldierGroup.add(armRight);

    const legLeft = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.72, 6, 12), soldierBodyMaterial);
    legLeft.position.set(1.5, -0.86, -0.93);
    soldierGroup.add(legLeft);

    const legRight = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.72, 6, 12), soldierBodyMaterial);
    legRight.position.set(1.8, -0.86, -0.93);
    soldierGroup.add(legRight);

    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 26), soldierBodyMaterial);
    shield.position.set(1.18, 0.12, -0.76);
    shield.rotation.z = Math.PI / 2;
    soldierGroup.add(shield);

    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.64, 0.08), soldierBodyMaterial);
    sword.position.set(2.16, -0.02, -0.98);
    sword.rotation.z = -0.24;
    soldierGroup.add(sword);

    const unreadableScrollMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6efe6,
      roughness: 0.6,
      metalness: 0.08,
      transparent: true,
    });
    soldierMaterials.push(unreadableScrollMaterial);
    const unreadableScroll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.88, 18),
      unreadableScrollMaterial
    );
    unreadableScroll.rotation.z = Math.PI / 2;
    unreadableScroll.position.set(1.46, 0.47, -0.89);
    soldierGroup.add(unreadableScroll);

    const barrierMaterial = new THREE.MeshBasicMaterial({
      color: 0xa1dcd5,
      transparent: true,
      opacity: 0.45,
    });
    soldierMaterials.push(barrierMaterial);
    const barrier = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.92), barrierMaterial);
    barrier.position.set(0.78, 0.28, -1.04);
    soldierGroup.add(barrier);
    scene.add(soldierGroup);

    const toolChaosGroup = new THREE.Group();
    const toolChaosMaterials: THREE.Material[] = [];
    const toolOrbitNodes: THREE.Mesh[] = [];

    const centerSignalMaterial = new THREE.MeshStandardMaterial({
      color: 0xadefe7,
      emissive: 0x427277,
      emissiveIntensity: 1.1,
      roughness: 0.26,
      metalness: 0.32,
      transparent: true,
    });
    toolChaosMaterials.push(centerSignalMaterial);
    const centerSignal = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 18), centerSignalMaterial);
    centerSignal.position.set(0, 0.82, -1);
    toolChaosGroup.add(centerSignal);

    for (let index = 0; index < 8; index += 1) {
      const blockMaterial = new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0xf4f4f2 : 0xd8e8e5,
        roughness: 0.66,
        metalness: 0.2,
        transparent: true,
      });
      toolChaosMaterials.push(blockMaterial);
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), blockMaterial);
      block.userData = { angle: (index / 8) * Math.PI * 2, radius: 1.35 + (index % 3) * 0.26 };
      toolOrbitNodes.push(block);
      toolChaosGroup.add(block);
    }
    scene.add(toolChaosGroup);

    const semanticSplitGroup = new THREE.Group();
    const semanticSplitMaterials: THREE.Material[] = [];

    const semanticHubMaterial = new THREE.MeshStandardMaterial({
      color: 0xadefe7,
      emissive: 0x427277,
      emissiveIntensity: 0.95,
      roughness: 0.34,
      metalness: 0.24,
      transparent: true,
    });
    semanticSplitMaterials.push(semanticHubMaterial);
    const semanticHub = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), semanticHubMaterial);
    semanticHub.position.set(0, 0.5, -1.2);
    semanticSplitGroup.add(semanticHub);

    const departmentLabels = ["Marketing", "Sales", "Finance", "CS", "Board"];
    for (let index = 0; index < departmentLabels.length; index += 1) {
      const angle = -1.1 + index * 0.55;
      const x = Math.sin(angle) * 2.4;
      const z = -1.4 + Math.cos(angle) * 0.65;
      const height = 0.58 + index * 0.2;

      const towerMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4f4f2,
        roughness: 0.76,
        metalness: 0.1,
        transparent: true,
      });
      semanticSplitMaterials.push(towerMaterial);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1, 0.54), towerMaterial);
      tower.position.set(x, -0.98 + height * 0.5, z);
      tower.scale.y = height;
      semanticSplitGroup.add(tower);

      const textTexture = makeTextTexture(departmentLabels[index] ?? "", {
        width: 420,
        height: 120,
        fontSize: 34,
      });
      if (textTexture) {
        textures.push(textTexture);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          opacity: 1,
        });
        semanticSplitMaterials.push(textMaterial);
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.3), textMaterial);
        plate.position.set(x, -0.22 + height, z);
        plate.lookAt(camera.position);
        semanticSplitGroup.add(plate);
      }

      const linkMaterial = new THREE.LineBasicMaterial({
        color: 0xa1dcd5,
        transparent: true,
        opacity: 0.8,
      });
      semanticSplitMaterials.push(linkMaterial);
      const linkGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.5, -1.2),
        new THREE.Vector3(x, -0.18 + height * 0.45, z),
      ]);
      const link = new THREE.Line(linkGeometry, linkMaterial);
      semanticSplitGroup.add(link);
    }
    scene.add(semanticSplitGroup);

    const weworkGroup = new THREE.Group();
    const weworkMaterials: THREE.Material[] = [];

    const chartPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f2,
      roughness: 0.78,
      metalness: 0.08,
      transparent: true,
    });
    weworkMaterials.push(chartPanelMaterial);
    const chartPanel = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.2), chartPanelMaterial);
    chartPanel.position.set(0.2, 0.5, -1.4);
    weworkGroup.add(chartPanel);

    const chartLineMaterial = new THREE.LineBasicMaterial({
      color: 0x427277,
      transparent: true,
      opacity: 0.95,
    });
    weworkMaterials.push(chartLineMaterial);
    const chartPoints = [
      new THREE.Vector3(-2.3, -0.6, -1.3),
      new THREE.Vector3(-1.3, -0.15, -1.3),
      new THREE.Vector3(-0.2, 0.6, -1.3),
      new THREE.Vector3(0.95, 1.08, -1.3),
      new THREE.Vector3(1.7, -0.78, -1.3),
      new THREE.Vector3(2.3, -0.9, -1.3),
    ];
    const chartLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chartPoints),
      chartLineMaterial
    );
    weworkGroup.add(chartLine);

    const peakMaterial = new THREE.MeshStandardMaterial({
      color: 0xadefe7,
      emissive: 0x427277,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
    });
    weworkMaterials.push(peakMaterial);
    const peak = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), peakMaterial);
    peak.position.set(0.95, 1.08, -1.26);
    weworkGroup.add(peak);

    const crashMaterial = new THREE.MeshStandardMaterial({
      color: 0x8ea4a7,
      roughness: 0.58,
      metalness: 0.14,
      transparent: true,
    });
    weworkMaterials.push(crashMaterial);
    const crashShard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.42, 0), crashMaterial);
    crashShard.position.set(1.66, -0.35, -1.2);
    weworkGroup.add(crashShard);
    scene.add(weworkGroup);

    const layersGroup = new THREE.Group();
    const layersMaterials: THREE.Material[] = [];

    const layerPalette = [0xadefe7, 0xf4f4f2, 0xd8e8e5];
    const layerNames = ["Semantic", "Coordination", "Tool"];

    for (let index = 0; index < 3; index += 1) {
      const layerMaterial = new THREE.MeshStandardMaterial({
        color: layerPalette[index] ?? 0xf4f4f2,
        roughness: 0.72,
        metalness: 0.14,
        transparent: true,
      });
      layersMaterials.push(layerMaterial);
      const layer = new THREE.Mesh(
        new THREE.BoxGeometry(4.6 - index * 0.42, 0.5, 2.5 - index * 0.24),
        layerMaterial
      );
      layer.position.set(0, -1 + index * 0.63, -1.05);
      layersGroup.add(layer);

      const nameTexture = makeTextTexture(layerNames[index] ?? "", {
        width: 420,
        height: 120,
        fontSize: 34,
        background: "rgba(8, 22, 30, 0.66)",
      });
      if (nameTexture) {
        textures.push(nameTexture);
        const nameMaterial = new THREE.MeshBasicMaterial({
          map: nameTexture,
          transparent: true,
          opacity: 1,
        });
        layersMaterials.push(nameMaterial);
        const name = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), nameMaterial);
        name.position.set(0, -0.72 + index * 0.63, 0.35);
        layersGroup.add(name);
      }
    }

    const anchorBeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xadefe7,
      transparent: true,
      opacity: 0.74,
    });
    layersMaterials.push(anchorBeamMaterial);
    const anchorBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.11, 2.6, 22),
      anchorBeamMaterial
    );
    anchorBeam.position.set(0, 0.15, -1.05);
    layersGroup.add(anchorBeam);
    scene.add(layersGroup);

    const formulaGroup = new THREE.Group();
    const formulaMaterials: THREE.Material[] = [];

    const formulaTexture = makeTextTexture("ROI_AI = M x SC", {
      width: 760,
      height: 190,
      fontSize: 62,
    });
    if (formulaTexture) {
      textures.push(formulaTexture);
      const formulaMaterial = new THREE.MeshBasicMaterial({
        map: formulaTexture,
        transparent: true,
        opacity: 1,
      });
      formulaMaterials.push(formulaMaterial);
      const formulaCard = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 1.16), formulaMaterial);
      formulaCard.position.set(0, 1.36, -1.2);
      formulaGroup.add(formulaCard);
    }

    const metricMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f2,
      roughness: 0.48,
      metalness: 0.22,
      transparent: true,
    });
    formulaMaterials.push(metricMaterial);
    const mNode = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), metricMaterial);
    mNode.position.set(-1.1, 0.54, -1.05);
    formulaGroup.add(mNode);

    const coherenceMaterial = new THREE.MeshStandardMaterial({
      color: 0xadefe7,
      emissive: 0x427277,
      emissiveIntensity: 0.95,
      roughness: 0.32,
      metalness: 0.24,
      transparent: true,
    });
    formulaMaterials.push(coherenceMaterial);
    const scNode = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 18), coherenceMaterial);
    scNode.position.set(1.1, 0.54, -1.05);
    formulaGroup.add(scNode);

    const formulaLinkMaterial = new THREE.LineBasicMaterial({
      color: 0xa1dcd5,
      transparent: true,
      opacity: 0.84,
    });
    formulaMaterials.push(formulaLinkMaterial);
    const formulaLink = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.1, 0.54, -1.05),
        new THREE.Vector3(1.1, 0.54, -1.05),
      ]),
      formulaLinkMaterial
    );
    formulaGroup.add(formulaLink);
    scene.add(formulaGroup);

    const fulcrumGroup = new THREE.Group();
    const fulcrumMaterials: THREE.Material[] = [];

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f2,
      roughness: 0.76,
      metalness: 0.12,
      transparent: true,
    });
    fulcrumMaterials.push(baseMaterial);
    const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.2, 4), baseMaterial);
    fulcrum.position.set(0, -0.45, -1.2);
    fulcrum.rotation.y = Math.PI / 4;
    fulcrumGroup.add(fulcrum);

    const leverMaterial = new THREE.MeshStandardMaterial({
      color: 0xd7e5e3,
      roughness: 0.58,
      metalness: 0.18,
      transparent: true,
    });
    fulcrumMaterials.push(leverMaterial);
    const lever = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 0.3), leverMaterial);
    lever.position.set(0, 0.1, -1.2);
    lever.rotation.z = -0.22;
    fulcrumGroup.add(lever);

    const weightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), baseMaterial);
    weightLeft.position.set(-1.8, 0.04, -1.2);
    fulcrumGroup.add(weightLeft);
    const weightRight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), baseMaterial);
    weightRight.position.set(1.8, 0.54, -1.2);
    fulcrumGroup.add(weightRight);

    const valueCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0xadefe7,
      emissive: 0x427277,
      emissiveIntensity: 1.12,
      roughness: 0.26,
      metalness: 0.34,
      transparent: true,
    });
    fulcrumMaterials.push(valueCoreMaterial);
    const valueCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), valueCoreMaterial);
    valueCore.position.set(0, 0.32, -1.2);
    fulcrumGroup.add(valueCore);
    scene.add(fulcrumGroup);

    const hotspotMaterial = new THREE.MeshStandardMaterial({
      color: 0xbef4ec,
      emissive: 0x427277,
      emissiveIntensity: 0.56,
      roughness: 0.24,
      metalness: 0.36,
      transparent: true,
      opacity: 0.42,
    });
    const hotspot = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), hotspotMaterial);
    scene.add(hotspot);

    const cueRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xb8fff7,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const cueRing = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.48, 48), cueRingMaterial);
    scene.add(cueRing);

    const cuePulseMaterial = new THREE.MeshBasicMaterial({
      color: 0x78efe3,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const cuePulse = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.3, 42), cuePulseMaterial);
    scene.add(cuePulse);

    const cuePointerMaterial = new THREE.MeshBasicMaterial({
      color: 0xe9fffc,
      transparent: true,
      opacity: 0.44,
    });
    const cuePointer = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 16), cuePointerMaterial);
    cuePointer.rotation.x = Math.PI;
    scene.add(cuePointer);

    const cueBeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xadefe7,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
    });
    const cueBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.06, 1.3, 18, 1, true),
      cueBeamMaterial
    );
    scene.add(cueBeam);

    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 160;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let index = 0; index < dustCount; index += 1) {
      dustPositions[index * 3] = (Math.random() - 0.5) * 18;
      dustPositions[index * 3 + 1] = Math.random() * 8.6 - 1.2;
      dustPositions[index * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xa1dcd5,
      size: 0.05,
      transparent: true,
      opacity: 0.26,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const interactiveTargets = [hotspot, cueRing, cuePulse, cueBeam, cuePointer];

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height || 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const activateFromPoint = (clientX: number, clientY: number) => {
      const activeScene = sceneIndexRef.current;
      if (!requiresInteractionRef.current) return;
      if (activatedSceneRef.current === activeScene) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveTargets, true);
      if (!intersects.length) return;

      activatedSceneRef.current = activeScene;
      callbackRef.current();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      activateFromPoint(event.clientX, event.clientY);
    };
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    const clock = new THREE.Clock();
    let frame = 0;
    let blend = sceneIndexRef.current;
    const cA = new THREE.Color();
    const cB = new THREE.Color();
    const cMix = new THREE.Color();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      blend = lerp(blend, sceneIndexRef.current, clamp(delta * 3.2, 0, 1));
      const floorScene = clamp(Math.floor(blend), 0, SCENE_COUNT - 1);
      const ceilScene = clamp(floorScene + 1, 0, SCENE_COUNT - 1);
      const blendAmount = blend - floorScene;

      const w0 = weightFor(blend, 0);
      const w1 = weightFor(blend, 1);
      const w2 = weightFor(blend, 2);
      const w3 = weightFor(blend, 3);
      const w4 = weightFor(blend, 4);
      const w5 = weightFor(blend, 5);
      const w6 = weightFor(blend, 6);
      const w7 = weightFor(blend, 7);

      const libraryWeight = clamp(w0 * 0.92 + w1 * 0.14, 0, 1);
      const soldierWeight = clamp(w1 + w0 * 0.54, 0, 1);
      const sceneTwoFocus = clamp(w1 - w0 * 0.2, 0, 1);

      setOpacity(libraryMaterials, libraryWeight);
      libraryGroup.visible = libraryWeight > 0.02;
      libraryGroup.position.x = Math.sin(elapsed * 0.16) * 0.12 * libraryWeight - sceneTwoFocus * 0.56;
      libraryGroup.position.z = -sceneTwoFocus * 0.08;

      setOpacity(soldierMaterials, soldierWeight);
      soldierGroup.visible = soldierWeight > 0.02;
      soldierGroup.position.y = Math.sin(elapsed * 0.9) * 0.05 * soldierWeight;
      soldierGroup.position.x = sceneTwoFocus * 0.18;

      setOpacity(toolChaosMaterials, w2);
      toolChaosGroup.visible = w2 > 0.02;
      for (let index = 0; index < toolOrbitNodes.length; index += 1) {
        const node = toolOrbitNodes[index];
        if (!node) continue;
        const angle = (node.userData.angle as number) + elapsed * (0.5 + index * 0.03);
        const radius = node.userData.radius as number;
        node.position.set(Math.cos(angle) * radius, 0.82 + Math.sin(angle * 1.4) * 0.38, -1 + Math.sin(angle) * 0.4);
        node.rotation.x += delta * 0.6;
        node.rotation.y += delta * 0.8;
      }

      setOpacity(semanticSplitMaterials, w3);
      semanticSplitGroup.visible = w3 > 0.02;
      semanticHub.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.07 * w3);

      setOpacity(weworkMaterials, w4);
      weworkGroup.visible = w4 > 0.02;
      crashShard.rotation.x += delta * 0.5 * w4;
      crashShard.rotation.y += delta * 0.7 * w4;

      setOpacity(layersMaterials, w5);
      layersGroup.visible = w5 > 0.02;
      anchorBeam.scale.y = 1 + Math.sin(elapsed * 2.2) * 0.08 * w5;

      setOpacity(formulaMaterials, w6);
      formulaGroup.visible = w6 > 0.02;
      scNode.scale.setScalar(1 + Math.sin(elapsed * 2.7) * 0.09 * w6);

      setOpacity(fulcrumMaterials, w7);
      fulcrumGroup.visible = w7 > 0.02;
      lever.rotation.z = -0.22 + Math.sin(elapsed * 1.8) * 0.08 * w7;
      valueCore.rotation.x += delta * 0.7 * w7;
      valueCore.rotation.y += delta * 0.9 * w7;

      const hotspotTarget = getHotspotFor(sceneIndexRef.current);
      hotspot.position.copy(hotspotTarget);
      const cueActive = requiresInteractionRef.current ? 1 : 0.16;
      const pulse = Math.sin(elapsed * 3.1);
      hotspot.scale.setScalar(1 + pulse * 0.08 * cueActive);
      hotspotMaterial.opacity = 0.2 + 0.22 * cueActive;
      hotspotMaterial.emissiveIntensity = 0.24 + (pulse + 1) * 0.13 * cueActive;

      cueRing.position.set(hotspotTarget.x, hotspotTarget.y - 0.2, hotspotTarget.z);
      cueRing.lookAt(camera.position);
      cueRing.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.1 * cueActive);
      cueRingMaterial.opacity = 0.04 + 0.24 * cueActive;

      cuePulse.position.set(hotspotTarget.x, hotspotTarget.y, hotspotTarget.z);
      cuePulse.lookAt(camera.position);
      cuePulse.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.14 * cueActive);
      cuePulseMaterial.opacity = 0.02 + 0.16 * cueActive;

      cuePointer.position.set(hotspotTarget.x, hotspotTarget.y + 0.28, hotspotTarget.z);
      cuePointer.scale.setScalar(1 + Math.sin(elapsed * 3.8) * 0.05 * cueActive);
      cuePointerMaterial.opacity = 0.08 + 0.3 * cueActive;

      cueBeam.position.set(hotspotTarget.x, hotspotTarget.y + 0.1, hotspotTarget.z);
      cueBeam.scale.y = 0.95 + Math.sin(elapsed * 2.6) * 0.06 * cueActive;
      cueBeamMaterial.opacity = 0.01 + 0.1 * cueActive;

      const dustPositionsAttribute = dust.geometry.attributes.position as THREE.BufferAttribute;
      for (let index = 0; index < dustCount; index += 1) {
        const yIndex = index * 3 + 1;
        dustPositionsAttribute.array[yIndex] = ((dustPositionsAttribute.array[yIndex] as number) +
          0.0025 +
          Math.sin(elapsed * 0.45 + index) * 0.0006) as number;
        if ((dustPositionsAttribute.array[yIndex] as number) > 7.8) {
          dustPositionsAttribute.array[yIndex] = -1.3;
        }
      }
      dustPositionsAttribute.needsUpdate = true;

      const fromCamera = getCameraFor(floorScene);
      const toCamera = getCameraFor(ceilScene);
      const fromLook = getLookAtFor(floorScene);
      const toLook = getLookAtFor(ceilScene);

      const cx = lerp(fromCamera[0], toCamera[0], blendAmount);
      const cy = lerp(fromCamera[1], toCamera[1], blendAmount);
      const cz = lerp(fromCamera[2], toCamera[2], blendAmount);
      const lx = lerp(fromLook[0], toLook[0], blendAmount);
      const ly = lerp(fromLook[1], toLook[1], blendAmount);
      const lz = lerp(fromLook[2], toLook[2], blendAmount);

      camera.position.set(cx, cy, cz);
      camera.lookAt(lx, ly, lz);

      cA.set(getBackgroundFor(floorScene));
      cB.set(getBackgroundFor(ceilScene));
      cMix.lerpColors(cA, cB, blendAmount);
      scene.background = cMix;

      renderer.domElement.style.cursor = requiresInteractionRef.current ? "pointer" : "default";
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);

      topographicTexture?.dispose();
      textures.forEach((texture) => texture.dispose());
      floor.geometry.dispose();
      floorMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      hotspot.geometry.dispose();
      hotspotMaterial.dispose();
      cueRing.geometry.dispose();
      cueRingMaterial.dispose();
      cuePulse.geometry.dispose();
      cuePulseMaterial.dispose();
      cuePointer.geometry.dispose();
      cuePointerMaterial.dispose();
      cueBeam.geometry.dispose();
      cueBeamMaterial.dispose();

      const disposeGroupGeometries = (group: THREE.Group) => {
        group.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
        });
      };

      disposeGroupGeometries(libraryGroup);
      disposeGroupGeometries(soldierGroup);
      disposeGroupGeometries(toolChaosGroup);
      disposeGroupGeometries(semanticSplitGroup);
      disposeGroupGeometries(weworkGroup);
      disposeGroupGeometries(layersGroup);
      disposeGroupGeometries(formulaGroup);
      disposeGroupGeometries(fulcrumGroup);

      [
        ...libraryMaterials,
        ...soldierMaterials,
        ...toolChaosMaterials,
        ...semanticSplitMaterials,
        ...weworkMaterials,
        ...layersMaterials,
        ...formulaMaterials,
        ...fulcrumMaterials,
      ].forEach((material) => material.dispose());

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="chapter-one-canvas-shell">
      <div className="chapter-one-canvas" ref={containerRef} />
      <div className="scene-title-overlay" aria-hidden="true">
        {title}
      </div>
      <div className="scene-narrative-overlay" aria-hidden="true">
        {narrativeLine}
      </div>
    </div>
  );
}
