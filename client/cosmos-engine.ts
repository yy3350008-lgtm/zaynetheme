import { getCosmosPreferences, subscribeCosmosPreferences, type CosmosIntensity } from "./preferences";
import { ZAYNE_THEMES, type EngineId, type ZayneThemeSpec } from "./themes";

interface DomEventTarget {
  addEventListener(type: string, listener: (event: DomEvent) => void, options?: { passive?: boolean } | boolean): void;
  removeEventListener(type: string, listener: (event: DomEvent) => void): void;
}

interface DomEvent {
  clientX?: number;
  clientY?: number;
  touches?: ReadonlyArray<{ clientX: number; clientY: number }>;
  preventDefault?: () => void;
}

interface DomStyle {
  [key: string]: string;
}

interface DomElement extends DomEventTarget {
  id: string;
  className: string;
  textContent: string | null;
  style: DomStyle;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  getAttribute(name: string): string | null;
  appendChild(child: DomElement): DomElement;
  remove(): void;
}

interface DomCanvas extends DomElement {
  width: number;
  height: number;
  getContext(id: "2d"): Canvas2DContext | null;
  getContext(id: "webgl", attrs?: Record<string, boolean>): GlContext | null;
}

interface DomImageData {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
}

interface CanvasGradient {
  addColorStop(offset: number, color: string): void;
}

interface Canvas2DContext {
  globalAlpha: number;
  globalCompositeOperation: string;
  fillStyle: string | CanvasGradient;
  strokeStyle: string | CanvasGradient;
  lineWidth: number;
  lineCap: string;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: string;
  save(): void;
  restore(): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, r: number, start: number, end: number): void;
  ellipse(x: number, y: number, rx: number, ry: number, rot: number, start: number, end: number): void;
  fill(): void;
  stroke(): void;
  setLineDash(segments: readonly number[]): void;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
  createImageData(w: number, h: number): DomImageData;
  putImageData(img: DomImageData, dx: number, dy: number): void;
  drawImage(img: DomCanvas, dx: number, dy: number, dw: number, dh: number): void;
}

interface GlShader {
  readonly _brand?: "shader";
}
interface GlProgram {
  readonly _brand?: "program";
}
interface GlBuffer {
  readonly _brand?: "buffer";
}
interface GlUniformLocation {
  readonly _brand?: "uniform";
}

interface GlContext {
  readonly VERTEX_SHADER: number;
  readonly FRAGMENT_SHADER: number;
  readonly COMPILE_STATUS: number;
  readonly LINK_STATUS: number;
  readonly ARRAY_BUFFER: number;
  readonly STATIC_DRAW: number;
  readonly FLOAT: number;
  readonly TRIANGLE_STRIP: number;
  createShader(type: number): GlShader | null;
  shaderSource(shader: GlShader, source: string): void;
  compileShader(shader: GlShader): void;
  getShaderParameter(shader: GlShader, pname: number): boolean;
  deleteShader(shader: GlShader): void;
  createProgram(): GlProgram | null;
  attachShader(program: GlProgram, shader: GlShader): void;
  linkProgram(program: GlProgram): void;
  getProgramParameter(program: GlProgram, pname: number): boolean;
  deleteProgram(program: GlProgram): void;
  useProgram(program: GlProgram | null): void;
  createBuffer(): GlBuffer | null;
  bindBuffer(target: number, buffer: GlBuffer | null): void;
  bufferData(target: number, data: Float32Array, usage: number): void;
  deleteBuffer(buffer: GlBuffer): void;
  getAttribLocation(program: GlProgram, name: string): number;
  enableVertexAttribArray(index: number): void;
  vertexAttribPointer(index: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
  getUniformLocation(program: GlProgram, name: string): GlUniformLocation | null;
  uniform1f(loc: GlUniformLocation | null, x: number): void;
  uniform2f(loc: GlUniformLocation | null, x: number, y: number): void;
  viewport(x: number, y: number, w: number, h: number): void;
  drawArrays(mode: number, first: number, count: number): void;
}

interface DomDocument extends DomEventTarget {
  readonly readyState: string;
  readonly hidden: boolean;
  readonly documentElement: DomElement;
  readonly head: DomElement;
  readonly body: DomElement | null;
  getElementById(id: string): DomElement | null;
  createElement(tagName: "style" | "div"): DomElement;
  createElement(tagName: "canvas"): DomCanvas;
  createElement(tagName: string): DomElement;
}

interface DomMediaQueryList extends DomEventTarget {
  readonly matches: boolean;
}

interface DomWindow extends DomEventTarget {
  readonly innerWidth: number;
  readonly innerHeight: number;
  readonly devicePixelRatio?: number;
  getComputedStyle(elt: DomElement): { getPropertyValue(name: string): string };
  matchMedia?(query: string): DomMediaQueryList;
  requestAnimationFrame(cb: (now: number) => void): number;
  cancelAnimationFrame(id: number): void;
  setTimeout(cb: () => void, ms: number): number;
  clearTimeout(id: number): void;
}

interface DomMutationObserver {
  observe(
    target: DomElement,
    options: {
      attributes?: boolean;
      attributeFilter?: string[];
      childList?: boolean;
      subtree?: boolean;
      characterData?: boolean;
    },
  ): void;
  disconnect(): void;
}

interface BrowserGlobalHost {
  document?: DomDocument;
  window?: DomWindow;
  MutationObserver?: new (cb: () => void) => DomMutationObserver;
}

const STYLE_ID = "zaynetheme-cosmos-style";
const ROOT_ID = "zaynetheme-cosmos-root";
const HOST_AURORA_CANVAS_ID = "paseo-cyber-aurora-canvas";
const SUPPRESS_HOST_ATTR = "data-zaynetheme-suppress-host-aurora";
const ACTIVE_BG_ATTR = "data-zaynetheme-active-bg";

const INTENSITY_OPACITY: Readonly<Record<CosmosIntensity, number>> = {
  subtle: 0.5,
  balanced: 0.86,
  immersive: 1.0,
};

const BLACKHOLE_INTENSITY_OPACITY: Readonly<Record<CosmosIntensity, number>> = {
  subtle: 0.46,
  balanced: 0.8,
  immersive: 0.96,
};

const SORTED_THEMES_BY_ID = [...ZAYNE_THEMES].sort(
  (a, b) => b.contribution.id.length - a.contribution.id.length,
);

function normalizeColor(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
    if (hex.length >= 6 && /^[0-9a-f]{6}/.test(hex)) return `#${hex.slice(0, 6)}`;
    return null;
  }
  const match = /^rgba?\(([^)]+)\)$/.exec(value);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return `#${parts.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.startsWith("#") ? hex.slice(1) : hex;
  const num = Number.parseInt(clean.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const BLACKHOLE_VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;
const BLACKHOLE_FS = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for(int i = 0; i < 5; i++){ v += a * noise(p); p = rot * p * 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 suv = uv - vec2(-0.14, 0.04);

  float roll = -0.20;
  mat2 rRoll = mat2(cos(roll), -sin(roll), sin(roll), cos(roll));
  suv = rRoll * suv;

  vec2 mOff = (u_mouse - 0.5) * 0.22;
  vec3 ro = vec3(mOff.x * 0.6, 2.15 + mOff.y * 0.35, -14.2);
  vec3 fwd = normalize(-ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 rd = normalize(fwd * 1.62 + right * suv.x + up * suv.y);

  vec3 pos = ro;
  vec3 vel = rd;
  float rs = 0.34;
  vec3 accum = vec3(0.0);
  float captured = 0.0;
  float minR = 99.0;

  for(int i = 0; i < 140; i++){
    float r2 = dot(pos, pos);
    float r = sqrt(r2);
    minR = min(minR, r);

    if(r < rs){
      captured = 1.0;
      break;
    }
    if(r > 26.0 && dot(pos, vel) > 0.0){
      break;
    }

    vec3 L = cross(pos, vel);
    float h2 = dot(L, L);
    vec3 accel = -1.5 * rs * h2 * pos / pow(r2 + 0.0005, 2.5);
    float h = clamp((r - rs * 0.85) * 0.085, 0.018, 0.30);
    vec3 nextPos = pos + vel * h + 0.5 * accel * h * h;
    vel = normalize(vel + accel * h);

    if((pos.y > 0.0 && nextPos.y <= 0.0) || (pos.y < 0.0 && nextPos.y >= 0.0)){
      float frac = abs(pos.y) / max(abs(pos.y) + abs(nextPos.y), 1e-5);
      vec3 hit = mix(pos, nextPos, frac);
      float hr = length(hit.xz);
      if(hr > rs * 1.55 && hr < 12.0){
        float slowT = u_time * 0.055;
        float twist = 4.6 / pow(max(hr, 0.25), 0.62) - slowT;
        mat2 sw = mat2(cos(twist), -sin(twist), sin(twist), cos(twist));
        vec2 sp = sw * hit.xz;
        float f1 = fbm(sp * 1.15);
        float f2 = fbm(sp * 2.9 + vec2(3.7, -1.9));
        float ringTex = fbm(vec2(hr * 5.5, f1 * 3.2));
        float streaks = smoothstep(0.22, 0.80, f1 * 0.45 + f2 * 0.25 + ringTex * 0.30);

        float armTwist = 2.8 / pow(max(hr, 0.3), 0.55) - slowT;
        vec2 armDir = vec2(cos(armTwist), sin(armTwist));
        float align = max(dot(normalize(hit.xz), armDir), 0.0);
        float tidalArm = pow(align, 7.0) * smoothstep(rs * 2.2, rs * 5.5, hr) * smoothstep(11.5, 4.0, hr);

        float radial = smoothstep(rs * 1.55, rs * 2.4, hr) * smoothstep(12.0, 2.2, hr);
        float innerRim = exp(-(hr - rs * 1.58) * 1.8) * 1.15;
        float doppler = clamp(1.0 + 0.36 * (-hit.x / max(hr, 0.25)), 0.58, 1.42);

        float lum = (radial * (0.14 + 0.90 * streaks) + tidalArm * 0.95 + innerRim * 0.55) * doppler;
        vec3 cWhite = vec3(0.97, 0.98, 1.00);
        vec3 cSilver = vec3(0.60, 0.63, 0.69);
        vec3 sampleCol = mix(cSilver, cWhite, clamp(lum * 0.95 + tidalArm * 0.55, 0.0, 1.0));
        accum += sampleCol * lum * 0.92;
      }
    }
    pos = nextPos;
  }

  vec3 col = accum;
  if(captured < 0.5){
    float photon = exp(-pow(max(minR - rs * 1.48, 0.0) / 0.075, 2.0));
    col += vec3(0.96, 0.98, 1.0) * photon * 0.85;

    vec3 dir = normalize(vel);
    float mwBand = exp(-pow((dir.y - 0.14 - 0.07 * sin(dir.x * 2.6)) / 0.17, 2.0));
    float dust = fbm(dir.xy * 7.5 + vec2(u_time * 0.004, 0.0));
    vec3 bg = vec3(0.24, 0.26, 0.30) * mwBand * pow(dust, 1.55) * 0.92;

    vec2 starGrid = dir.xy * 120.0;
    float sh = hash(floor(starGrid));
    if(sh > 0.974){
      float sd = length(fract(starGrid) - 0.5);
      float tw = 0.68 + 0.32 * sin(u_time * 1.3 + sh * 35.0);
      bg += vec3(0.92, 0.94, 0.98) * smoothstep(0.18, 0.0, sd) * tw * (0.4 + 0.6 * mwBand);
    }
    col += bg;
  }

  col = col / (1.0 + col * 0.62);
  col = pow(max(col, 0.0), vec3(0.95));
  gl_FragColor = vec4(col, 1.0);
}`;

interface BgStar { x: number; y: number; r: number; p: number; s: number }
interface CornerStar { x: number; y: number; r: number; p: number }
interface RingComet { orbit: number; angle: number; speed: number; size: number; color: string }
interface RainDrop { x: number; y: number; len: number; vy: number; size: number; warm: boolean }
interface Firefly {
  x: number; y: number; vx: number; vy: number; r: number; depth: number;
  phase: number; warm: boolean; tick: number; history: Array<{ x: number; y: number }>;
}
interface ConstellationStar { ang: number; dist: number; speed: number; r: number; warm: boolean; x: number; y: number }
interface HexNode { cx: number; cy: number; energy: number; phase: number }
interface AuroraNode {
  gx: number; gy: number; ox: number; oy: number; vx: number; vy: number;
  rx: number; ry: number; wave: number; rippleBoost: number; warmMix: number;
}
interface AuroraFloater { x: number; y: number; vx: number; vy: number; r: number; phase: number; warm: boolean }
interface Ripple { x: number; y: number; r: number; maxR: number; a: number; strength: number }

export function installCosmosEngine(): () => void {
  const host = globalThis as unknown as BrowserGlobalHost;
  const doc = host.document;
  const win = host.window;
  if (!doc || !win || typeof doc.createElement !== "function") {
    return () => {};
  }

  let disposed = false;
  let root: DomElement | null = null;
  let styleEl: DomElement | null = null;
  let cgl: DomCanvas | null = null;
  let c2d: DomCanvas | null = null;
  let ctx: Canvas2DContext | null = null;
  let auroraCanvas: DomCanvas | null = null;
  let aCtx: Canvas2DContext | null = null;
  let auroraImg: DomImageData | null = null;

  let gl: GlContext | null = null;
  let glProg: GlProgram | null = null;
  let glBuf: GlBuffer | null = null;
  let glShaders: GlShader[] = [];
  let glReady = false;
  let glUniforms: {
    res: GlUniformLocation | null;
    time: GlUniformLocation | null;
    mouse: GlUniformLocation | null;
  } = { res: null, time: null, mouse: null };

  let W = 0;
  let H = 0;
  let dpr = Math.min(win.devicePixelRatio || 1, 2);
  let t = 0;
  let lastFrame = 0;
  let rafId = 0;
  let resizeTimer = 0;
  let activeEngine: EngineId | null = null;
  let activeThemeSpec: ZayneThemeSpec | null = null;

  const pointer = { x: -9999, y: -9999, nx: 0.5, ny: 0.5, active: false, lastSpawnX: -9999, lastSpawnY: -9999 };
  const smoothMouse = { x: 0.5, y: 0.5 };
  const ripples: Ripple[] = [];

  let bgStars: BgStar[] = [];
  let cornerStars: CornerStar[] = [];
  let ringComets: RingComet[] = [];
  let drops: RainDrop[] = [];
  let fireflies: Firefly[] = [];
  let bhConstellation: ConstellationStar[] = [];
  let hexNodes: HexNode[] = [];
  let auroraCols = 0;
  let auroraRows = 0;
  let auroraNodes: AuroraNode[] = [];
  let auroraFloaters: AuroraFloater[] = [];

  const reducedMotionMql = win.matchMedia ? win.matchMedia("(prefers-reduced-motion: reduce)") : null;

  function detectActiveTheme(): ZayneThemeSpec | null {
    const classAttr = doc!.documentElement.className || "";
    const tokens = new Set(classAttr.split(/\s+/).filter(Boolean));
    const dataTheme = doc!.documentElement.getAttribute("data-theme");
    if (dataTheme) tokens.add(dataTheme.trim());

    for (const spec of SORTED_THEMES_BY_ID) {
      if (tokens.has(spec.contribution.id)) return spec;
    }

    if (typeof win!.getComputedStyle === "function") {
      const cs = win!.getComputedStyle(doc!.documentElement);
      const bg = normalizeColor(
        cs.getPropertyValue("--colors-surface0") ||
          cs.getPropertyValue("--colors-surface-0") ||
          cs.getPropertyValue("--colors-background"),
      );
      const accent = normalizeColor(cs.getPropertyValue("--colors-accent"));
      if (bg && accent) {
        for (const spec of SORTED_THEMES_BY_ID) {
          if (
            spec.contribution.colors.background.toLowerCase() === bg &&
            (spec.contribution.colors.accent ?? "").toLowerCase() === accent
          ) {
            return spec;
          }
        }
      }
    }
    return null;
  }

  function destroyGlResources(): void {
    if (!gl) return;
    for (const sh of glShaders) gl.deleteShader(sh);
    glShaders = [];
    if (glProg) {
      gl.deleteProgram(glProg);
      glProg = null;
    }
    if (glBuf) {
      gl.deleteBuffer(glBuf);
      glBuf = null;
    }
    glReady = false;
  }

  function initBlackHoleGl(): void {
    if (!cgl || glReady) return;
    gl = cgl.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;
    const compile = (type: number, src: string): GlShader | null => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const s1 = compile(gl.VERTEX_SHADER, BLACKHOLE_VS);
    const s2 = compile(gl.FRAGMENT_SHADER, BLACKHOLE_FS);
    if (!s1 || !s2) {
      if (s1) gl.deleteShader(s1);
      if (s2) gl.deleteShader(s2);
      return;
    }
    glShaders = [s1, s2];
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, s1);
    gl.attachShader(prog, s2);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }
    const buf = gl.createBuffer();
    if (!buf) {
      gl.deleteProgram(prog);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glProg = prog;
    glBuf = buf;
    glUniforms = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
    };
    glReady = true;
    gl.viewport(0, 0, cgl.width, cgl.height);
  }

  function buildState(): void {
    if (W <= 0 || H <= 0) return;
    const minDim = Math.min(W, H);

    bgStars = Array.from({ length: 110 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.45 + Math.random() * 0.95,
      p: Math.random() * Math.PI * 2,
      s: 0.5 + Math.random() * 1.1,
    }));

    cornerStars = [];
    for (let i = 0; i < 24; i++) {
      const sideX = i % 2 === 0 ? Math.random() * 0.24 : 0.76 + Math.random() * 0.24;
      const sideY = i % 4 < 2 ? Math.random() * 0.28 : 0.72 + Math.random() * 0.28;
      cornerStars.push({
        x: sideX * W,
        y: sideY * H,
        r: 0.7 + Math.random() * 1.1,
        p: Math.random() * Math.PI * 2,
      });
    }

    ringComets = [
      { orbit: 0, angle: 0.55, speed: 0.0024, size: 3.8, color: "#fff9eb" },
      { orbit: 0, angle: 3.69, speed: 0.0024, size: 2.5, color: "#e5a95c" },
      { orbit: 1, angle: 1.72, speed: -0.0019, size: 3.6, color: "#fff9eb" },
      { orbit: 1, angle: 4.86, speed: -0.0019, size: 2.4, color: "#d97757" },
      { orbit: 2, angle: 2.38, speed: 0.0029, size: 3.3, color: "#fff9eb" },
      { orbit: 2, angle: 5.52, speed: 0.0029, size: 2.3, color: "#e5a95c" },
    ];

    drops = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: 32 + Math.random() * 48,
      vy: 0.36 + Math.random() * 0.48,
      size: 0.8 + Math.random() * 0.65,
      warm: i % 5 === 0,
    }));

    fireflies = Array.from({ length: 44 }, (_, i) => {
      const depth = i < 12 ? 2 : i < 28 ? 1 : 0;
      const fx = Math.random() * W;
      const fy = Math.random() * H;
      return {
        x: fx,
        y: fy,
        vx: (Math.random() - 0.5) * (0.09 + depth * 0.07),
        vy: -0.05 - Math.random() * (0.08 + depth * 0.07),
        r: depth === 2 ? 4.2 + Math.random() * 3.8 : depth === 1 ? 1.9 + Math.random() * 1.8 : 0.9 + Math.random() * 0.8,
        depth,
        phase: Math.random() * Math.PI * 2,
        warm: i % 4 === 0,
        tick: 0,
        history: Array.from({ length: 8 }, (_, k) => ({
          x: fx - (7 - k) * 2.4,
          y: fy + (7 - k) * 1.5,
        })),
      };
    });

    const bhCx = W * 0.5 - minDim * 0.11;
    const bhCy = H * 0.5 + minDim * 0.06;
    bhConstellation = Array.from({ length: 40 }, (_, i) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = minDim * (0.38 + Math.random() * 0.46);
      return {
        ang,
        dist,
        speed: 0.00018 + Math.random() * 0.00025,
        r: 0.8 + Math.random() * 1.15,
        warm: i % 3 === 0,
        x: bhCx + Math.cos(ang) * dist,
        y: bhCy + Math.sin(ang) * dist,
      };
    });

    hexNodes = [];
    const hexR = 52;
    const dx = hexR * 1.5;
    const dy = hexR * Math.sqrt(3);
    for (let col = -1; col < W / dx + 2; col++) {
      for (let row = -1; row < H / dy + 2; row++) {
        hexNodes.push({
          cx: col * dx,
          cy: row * dy + (col % 2 ? dy * 0.5 : 0),
          energy: 0,
          phase: col * 0.35 + row * 0.28,
        });
      }
    }

    const spacing = 48;
    auroraCols = Math.max(4, Math.ceil(W / spacing) + 2);
    auroraRows = Math.max(4, Math.ceil(H / spacing) + 2);
    auroraNodes = [];
    for (let r = 0; r < auroraRows; r++) {
      for (let col = 0; col < auroraCols; col++) {
        const gx = (col - 0.5) * spacing + (Math.random() - 0.5) * 16;
        const gy = (r - 0.5) * spacing + (Math.random() - 0.5) * 16;
        auroraNodes.push({
          gx,
          gy,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          rx: gx,
          ry: gy,
          wave: 0,
          rippleBoost: 0,
          warmMix: (Math.sin(gx * 0.004 + gy * 0.003) + 1) * 0.5,
        });
      }
    }
    auroraFloaters = Array.from({ length: 38 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0.1 + Math.random() * 0.14,
      vy: -0.09 - Math.random() * 0.18,
      r: 0.65 + Math.random() * 1.15,
      phase: Math.random() * Math.PI * 2,
      warm: i % 3 === 0,
    }));
  }

  function resize(): void {
    if (!c2d || !cgl || !ctx) return;
    dpr = Math.min(win!.devicePixelRatio || 1, 2);
    W = win!.innerWidth;
    H = win!.innerHeight;
    c2d.width = Math.max(1, Math.round(W * dpr));
    c2d.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cgl.width = Math.max(1, Math.round(W * dpr));
    cgl.height = Math.max(1, Math.round(H * dpr));
    if (gl && glReady) gl.viewport(0, 0, cgl.width, cgl.height);
    buildState();
  }

  function drawBgStars(c: Canvas2DContext, breath: number, tint: string): void {
    c.fillStyle = tint;
    for (const s of bgStars) {
      const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.s + s.p));
      c.globalAlpha = 0.12 + tw * 0.36 * breath;
      c.beginPath();
      c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      c.fill();
    }
  }

  function drawFourPointFlare(c: Canvas2DContext, x: number, y: number, size: number, alpha: number): void {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = "#fff9eb";
    c.lineWidth = 0.9;
    c.beginPath();
    c.moveTo(x - size, y);
    c.lineTo(x + size, y);
    c.moveTo(x, y - size);
    c.lineTo(x, y + size);
    c.stroke();
    c.restore();
  }

  function orbitPoint(cx: number, cy: number, rx: number, ry: number, tilt: number, ang: number): { x: number; y: number } {
    const lx = Math.cos(ang) * rx;
    const ly = Math.sin(ang) * ry;
    return {
      x: cx + lx * Math.cos(tilt) - ly * Math.sin(tilt),
      y: cy + lx * Math.sin(tilt) + ly * Math.cos(tilt),
    };
  }

  function renderOrbital(c: Canvas2DContext, breath: number): void {
    const acc = "#e5a95c";
    const sec = "#d97757";
    const c1 = hexToRgb(acc);
    const c2 = hexToRgb(sec);
    drawBgStars(c, breath, "#f5ecd8");
    const minDim = Math.min(W, H);
    const cx = W * 0.52;
    const cy = H * 0.5;

    const maxC = minDim * 0.22;
    c.lineWidth = 0.65;
    for (let i = 0; i < cornerStars.length; i++) {
      const a = cornerStars[i];
      for (let j = i + 1; j < cornerStars.length; j++) {
        const b = cornerStars[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxC) {
          c.strokeStyle = acc;
          c.globalAlpha = (1 - d / maxC) * 0.26 * breath;
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(b.x, b.y);
          c.stroke();
        }
      }
      c.fillStyle = "#f5ecd8";
      c.globalAlpha = 0.45 + 0.3 * Math.sin(t + a.p);
      c.beginPath();
      c.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      c.fill();
    }

    const g = c.createRadialGradient(cx, cy, 3, cx, cy, minDim * 0.52);
    g.addColorStop(0, `rgba(${c1[0]},${c1[1]},${c1[2]},${0.36 * breath})`);
    g.addColorStop(0.35, `rgba(${c2[0]},${c2[1]},${c2[2]},${0.13 * breath})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.globalAlpha = 1;
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);

    const orbits = [
      { rx: Math.max(W * 0.44, minDim * 0.55), ry: minDim * 0.21, tilt: -0.42, dash: [] as number[], col: acc },
      { rx: Math.max(W * 0.39, minDim * 0.49), ry: minDim * 0.19, tilt: 0.38, dash: [5, 10], col: sec },
      { rx: Math.max(W * 0.33, minDim * 0.43), ry: minDim * 0.17, tilt: 1.12, dash: [] as number[], col: acc },
    ];

    for (const ob of orbits) {
      c.save();
      c.translate(cx, cy);
      c.rotate(ob.tilt);
      c.setLineDash(ob.dash);
      c.beginPath();
      c.ellipse(0, 0, ob.rx, ob.ry, 0, Math.PI, Math.PI * 2);
      c.strokeStyle = ob.col;
      c.globalAlpha = 0.24;
      c.lineWidth = 0.95;
      c.stroke();
      c.setLineDash([]);
      c.restore();
    }

    const astR = minDim * 0.11;
    c.save();
    c.translate(cx, cy);
    c.rotate(t * 0.04);
    c.strokeStyle = acc;
    c.globalAlpha = 0.34 * breath;
    c.lineWidth = 0.85;
    c.beginPath();
    c.arc(0, 0, astR, 0, Math.PI * 2);
    c.stroke();
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * Math.PI * 2;
      const len = k % 3 === 0 ? 6.5 : 3.2;
      c.globalAlpha = k % 3 === 0 ? 0.48 : 0.24;
      c.beginPath();
      c.moveTo(Math.cos(a) * (astR - len), Math.sin(a) * (astR - len));
      c.lineTo(Math.cos(a) * astR, Math.sin(a) * astR);
      c.stroke();
    }
    c.restore();

    const sg = c.createRadialGradient(cx, cy, 0, cx, cy, 24);
    sg.addColorStop(0, "rgba(255,249,235,0.95)");
    sg.addColorStop(0.35, `rgba(${c1[0]},${c1[1]},${c1[2]},0.55)`);
    sg.addColorStop(1, "rgba(0,0,0,0)");
    c.globalAlpha = 1;
    c.fillStyle = sg;
    c.beginPath();
    c.arc(cx, cy, 24, 0, Math.PI * 2);
    c.fill();
    drawFourPointFlare(c, cx, cy, 14 + 3 * breath, 0.72 * breath);

    for (const ob of orbits) {
      c.save();
      c.translate(cx, cy);
      c.rotate(ob.tilt);
      c.setLineDash(ob.dash);
      c.beginPath();
      c.ellipse(0, 0, ob.rx, ob.ry, 0, 0, Math.PI);
      c.strokeStyle = ob.col;
      c.globalAlpha = 0.62;
      c.lineWidth = 1.9;
      c.stroke();
      c.setLineDash([]);
      c.restore();
    }

    for (const b of ringComets) {
      b.angle += b.speed;
      const ob = orbits[b.orbit];
      const dirSign = b.speed >= 0 ? 1 : -1;
      const steps = 28;
      const arcSpan = 0.24 * dirSign;

      let prev = orbitPoint(cx, cy, ob.rx, ob.ry, ob.tilt, b.angle - arcSpan);
      c.lineCap = "round";
      for (let s = 1; s <= steps; s++) {
        const k = s / steps;
        const cur = orbitPoint(cx, cy, ob.rx, ob.ry, ob.tilt, b.angle - arcSpan * (1 - k));
        c.strokeStyle = k > 0.72 ? "#fff9eb" : ob.col;
        c.globalAlpha = Math.pow(k, 1.8) * 0.85;
        c.lineWidth = 0.2 + k * (b.size * 0.85);
        c.beginPath();
        c.moveTo(prev.x, prev.y);
        c.lineTo(cur.x, cur.y);
        c.stroke();
        prev = cur;
      }

      const head = orbitPoint(cx, cy, ob.rx, ob.ry, ob.tilt, b.angle);
      const hg = c.createRadialGradient(head.x, head.y, 0, head.x, head.y, b.size * 4.2);
      hg.addColorStop(0, "rgba(255,249,235,0.95)");
      hg.addColorStop(0.4, `rgba(${c1[0]},${c1[1]},${c1[2]},0.38)`);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      c.globalAlpha = 1;
      c.fillStyle = hg;
      c.beginPath();
      c.arc(head.x, head.y, b.size * 4.2, 0, Math.PI * 2);
      c.fill();
      if (b.size > 3.2) {
        drawFourPointFlare(c, head.x, head.y, b.size * 2.6, 0.65);
      }
    }
  }

  function renderMoss(c: Canvas2DContext, breath: number, interactive: boolean): void {
    const acc = "#5eead4";
    const sec = "#d97757";
    const c1 = hexToRgb(acc);
    const c2 = hexToRgb(sec);

    c.save();
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 3; i++) {
      const cxBeam = W * (0.46 + i * 0.21) + Math.sin(t * 0.22 + i) * 24;
      const halfW = 110 + i * 30;
      const peakA = (0.14 - i * 0.02) * breath;
      c.save();
      c.translate(cxBeam, 0);
      c.transform(1, 0, -0.45, 1, 0, 0);
      const hg = c.createLinearGradient(-halfW, 0, halfW, 0);
      hg.addColorStop(0, "rgba(0,0,0,0)");
      hg.addColorStop(0.5, `rgba(${c1[0]},${c1[1]},${c1[2]},${peakA})`);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = hg;
      c.fillRect(-halfW, 0, halfW * 2, H * 0.76);
      c.restore();
    }
    c.restore();

    const wy = H * 0.74;
    const wg = c.createLinearGradient(0, wy, 0, H);
    wg.addColorStop(0, "rgba(0,0,0,0)");
    wg.addColorStop(0.2, `rgba(${c1[0]},${c1[1]},${c1[2]},${0.09 * breath})`);
    wg.addColorStop(1, `rgba(${c2[0]},${c2[1]},${c2[2]},${0.07 * breath})`);
    c.globalAlpha = 1;
    c.fillStyle = wg;
    c.fillRect(0, wy, W, H - wy);

    c.strokeStyle = acc;
    c.globalAlpha = 0.1 * breath;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, wy);
    c.lineTo(W, wy);
    c.stroke();

    for (const d of drops) {
      d.y += d.vy;
      if (d.y > wy + 16) {
        d.y = -d.len;
        d.x = Math.random() * W;
        if (Math.random() < 0.28) {
          ripples.push({ x: d.x, y: wy + 8 + Math.random() * Math.max(12, H - wy - 18), r: 2, maxR: 85, a: 0.34, strength: 1 });
          if (ripples.length > 12) ripples.shift();
        }
      }
      const grad = c.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, d.warm ? sec : acc);
      c.globalAlpha = 0.22 + 0.14 * breath;
      c.strokeStyle = grad;
      c.lineWidth = d.size;
      c.beginPath();
      c.moveTo(d.x, d.y - d.len);
      c.lineTo(d.x, d.y);
      c.stroke();
    }

    c.save();
    c.globalCompositeOperation = "lighter";
    for (const f of fireflies) {
      f.x += f.vx + Math.sin(t * 0.4 + f.phase) * 0.14;
      f.y += f.vy;
      if (interactive && pointer.active) {
        const dx = f.x - pointer.x;
        const dy = f.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 1) {
          f.x += (dx / dist) * 0.85;
          f.y += (dy / dist) * 0.85;
        }
      }
      if (f.y < -25) {
        f.y = wy + 20;
        f.x = Math.random() * W;
        f.history = [];
      }
      if (f.x < -25) {
        f.x = W + 25;
        f.history = [];
      }
      if (f.x > W + 25) {
        f.x = -25;
        f.history = [];
      }

      f.tick++;
      if (f.depth >= 1 && f.tick % 2 === 0) {
        f.history.push({ x: f.x, y: f.y });
        if (f.history.length > 10) f.history.shift();
      }

      const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9 + f.phase));
      const col = f.warm ? c2 : c1;

      if (f.history.length > 1) {
        for (let k = 1; k < f.history.length; k++) {
          const p0 = f.history[k - 1];
          const p1 = f.history[k];
          const frac = k / f.history.length;
          c.strokeStyle = f.warm ? sec : acc;
          c.globalAlpha = frac * 0.36 * glow;
          c.lineWidth = frac * (f.depth === 2 ? 2.2 : 1.3);
          c.beginPath();
          c.moveTo(p0.x, p0.y);
          c.lineTo(p1.x, p1.y);
          c.stroke();
        }
      }

      const rad = f.r * (f.depth === 2 ? 6.2 : 4.2);
      const fg = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
      fg.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${(f.depth === 2 ? 0.36 : 0.6) * glow})`);
      fg.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},0.10)`);
      fg.addColorStop(1, "rgba(0,0,0,0)");
      c.globalAlpha = 1;
      c.fillStyle = fg;
      c.beginPath();
      c.arc(f.x, f.y, rad, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "#f0fdfa";
      c.globalAlpha = 0.85 * glow;
      c.beginPath();
      c.arc(f.x, f.y, f.depth === 2 ? 1.5 : 0.9, 0, Math.PI * 2);
      c.fill();

      if (f.y < wy && wy - f.y < H * 0.45 && f.depth >= 1) {
        const distRatio = 1 - (wy - f.y) / (H * 0.45);
        const ry = wy + (wy - f.y) * 0.42;
        const rx = f.x + Math.sin(t * 2.2 + f.phase) * 8;
        const rw = f.r * 5.0 * (1.2 + (1 - distRatio));
        const rh = f.r * 1.4;
        c.fillStyle = f.warm ? sec : acc;
        c.globalAlpha = 0.16 * distRatio * glow;
        c.beginPath();
        c.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }

  function renderBlackHoleFallback(c: Canvas2DContext, breath: number): void {
    const minDim = Math.min(W, H);
    const cx = W * 0.5 - minDim * 0.14;
    const cy = H * 0.5 + minDim * 0.04;
    const rHorizon = minDim * 0.095;

    c.save();
    c.translate(cx, cy);
    c.rotate(-0.2);

    const outerHalo = c.createRadialGradient(0, 0, rHorizon * 0.9, 0, 0, minDim * 0.34);
    outerHalo.addColorStop(0, `rgba(245,247,250,${0.55 * breath})`);
    outerHalo.addColorStop(0.28, `rgba(180,190,206,${0.25 * breath})`);
    outerHalo.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = outerHalo;
    c.beginPath();
    c.ellipse(0, 0, minDim * 0.44, minDim * 0.16, 0, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = `rgba(243,244,246,${0.7 * breath})`;
    c.lineWidth = 2.2;
    c.beginPath();
    c.arc(0, 0, rHorizon * 1.15, Math.PI, Math.PI * 2);
    c.stroke();

    c.strokeStyle = "rgba(229,231,235,0.45)";
    c.lineWidth = 3.2;
    c.beginPath();
    c.ellipse(0, 0, rHorizon * 2.9, rHorizon * 0.55, 0, 0, Math.PI * 2);
    c.stroke();

    c.fillStyle = "#000000";
    c.beginPath();
    c.arc(0, 0, rHorizon, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function renderBlackHoleConstellation(c: Canvas2DContext, breath: number, interactive: boolean): void {
    const minDim = Math.min(W, H);
    const cx = W * 0.5 - minDim * 0.18;
    const cy = H * 0.5 + minDim * 0.05;
    for (const p of bhConstellation) {
      p.ang += p.speed;
      let x = cx + Math.cos(p.ang) * p.dist;
      let y = cy + Math.sin(p.ang) * p.dist;
      if (interactive && pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 155 && d > 1) {
          const push = (1 - d / 155) * 20;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
      }
      p.x = x;
      p.y = y;
    }

    c.lineWidth = 0.6;
    const maxLink = minDim * 0.2;
    c.strokeStyle = "rgba(229,231,235,1)";
    for (let i = 0; i < bhConstellation.length; i++) {
      const a = bhConstellation[i];
      for (let j = i + 1; j < bhConstellation.length; j++) {
        const b = bhConstellation[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxLink) {
          c.globalAlpha = (1 - d / maxLink) * 0.18 * breath;
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(b.x, b.y);
          c.stroke();
        }
      }
    }
    for (const p of bhConstellation) {
      c.fillStyle = p.warm ? "#f3f4f6" : "#94a3b8";
      c.globalAlpha = 0.42 + 0.35 * breath;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c.fill();
    }
  }

  function renderPrism(c: Canvas2DContext, breath: number, interactive: boolean): void {
    const acc = "#22d3ee";
    const sec = "#a78bfa";
    const c1 = hexToRgb(acc);
    const c2 = hexToRgb(sec);
    drawBgStars(c, breath, "#dbeafe");

    c.save();
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) {
      const shift = Math.sin(t * 0.45 + i * 1.4) * 85;
      const x0 = W * (0.14 + i * 0.23) + shift;
      const grad = c.createLinearGradient(x0, 0, x0 + 250, H);
      const col = i % 2 === 0 ? c1 : c2;
      grad.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      grad.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},${0.22 * breath})`);
      grad.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(x0 - 70, 0);
      c.lineTo(x0 + 115, 0);
      c.lineTo(x0 + 365, H);
      c.lineTo(x0 + 180, H);
      c.closePath();
      c.fill();
    }
    c.restore();

    const hexR = 52;
    for (const h of hexNodes) {
      let target = (Math.sin(t * 1.0 + h.phase) * 0.5 + 0.5) * 0.4;
      if (interactive && pointer.active) {
        const d = Math.hypot(h.cx - pointer.x, h.cy - pointer.y);
        if (d < 240) target = Math.max(target, 1 - d / 240);
      }
      h.energy += (target - h.energy) * 0.14;
      if (h.energy < 0.05) continue;

      c.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k;
        const px = h.cx + Math.cos(a) * (hexR * 0.86);
        const py = h.cy + Math.sin(a) * (hexR * 0.86);
        if (k === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.strokeStyle = h.energy > 0.5 ? acc : sec;
      c.globalAlpha = 0.14 + h.energy * 0.62;
      c.lineWidth = 0.9 + h.energy * 1.35;
      c.stroke();

      if (h.energy > 0.35) {
        c.fillStyle = h.energy > 0.7 ? "#ffffff" : acc;
        c.globalAlpha = h.energy * 0.85;
        c.beginPath();
        c.arc(h.cx, h.cy, 1.6 + h.energy * 2.2, 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  function renderAurora(c: Canvas2DContext, breath: number, interactive: boolean): void {
    const AW = 160;
    const AH = 100;
    if (aCtx && auroraImg) {
      const data = auroraImg.data;
      const t1 = t * 0.55;
      const t2 = t * 0.42;
      for (let py = 0; py < AH; py++) {
        const v = py / AH;
        for (let px = 0; px < AW; px++) {
          const u = px / AW;
          const diag =
            u * 0.78 + v * 0.62 - 0.72 + 0.11 * Math.sin(u * 4.2 - v * 3.1 - t1) + 0.06 * Math.cos(v * 5.5 + t2);
          const band1 = Math.exp(-(diag * diag) / 0.048) * breath;
          const d2 = diag - 0.18;
          const band2 = Math.exp(-(d2 * d2) / 0.065) * breath;

          const hueMix = 0.5 + 0.5 * Math.sin(u * 3.0 - v * 2.5 - t1 * 1.15);
          const r1 = 98 + (56 - 98) * hueMix;
          const g1 = 84 + (189 - 84) * hueMix;
          const b1 = 245 + (248 - 245) * hueMix;

          const w1 = band1 * 0.34;
          const w2 = band2 * 0.24;
          const wSum = w1 + w2;
          const idx = (py * AW + px) * 4;
          if (wSum > 0.002) {
            data[idx] = Math.min(255, Math.round((r1 * w1 + 217 * w2) / wSum));
            data[idx + 1] = Math.min(255, Math.round((g1 * w1 + 119 * w2) / wSum));
            data[idx + 2] = Math.min(255, Math.round((b1 * w1 + 87 * w2) / wSum));
            data[idx + 3] = Math.min(98, Math.round(wSum * 255));
          } else {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 0;
          }
        }
      }
      aCtx.putImageData(auroraImg, 0, 0);
      c.save();
      c.imageSmoothingEnabled = true;
      c.imageSmoothingQuality = "high";
      c.drawImage(auroraCanvas!, 0, 0, W, H);
      c.restore();
    }

    for (const n of auroraNodes) {
      const diagPhase = (n.gx * 0.72 - n.gy * 0.68) * 0.0068 - t * 1.65;
      const crossMod = Math.cos((n.gx * 0.68 + n.gy * 0.72) * 0.0038 + t * 0.65);
      const wave = (Math.sin(diagPhase) * 0.72 + crossMod * 0.28) * (0.75 + 0.25 * breath);

      let rippleLift = 0;
      let rippleBoost = 0;
      for (const rp of ripples) {
        const dr = Math.hypot(n.gx - rp.x, n.gy - rp.y) - rp.r;
        if (Math.abs(dr) < 42) {
          const band = Math.cos((dr / 42) * Math.PI * 0.5) * rp.strength;
          rippleLift += band * 9;
          rippleBoost = Math.max(rippleBoost, band);
        }
      }

      if (interactive && pointer.active) {
        const dx = n.gx - pointer.x;
        const dy = n.gy - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 135 && dist > 1) {
          const f = 1 - dist / 135;
          const push = f * f * 2.4;
          n.vx += (dx / dist) * push - (dy / dist) * f * 0.55;
          n.vy += (dy / dist) * push + (dx / dist) * f * 0.55;
        }
      }

      n.vx += -n.ox * 0.075;
      n.vy += -n.oy * 0.075;
      n.vx *= 0.86;
      n.vy *= 0.86;
      n.ox += n.vx;
      n.oy += n.vy;

      n.wave = wave;
      n.rippleBoost = rippleBoost;
      n.rx = n.gx + wave * 8 * breath + n.ox;
      n.ry = n.gy - wave * 14 * breath - rippleLift + n.oy;
    }

    c.lineWidth = 0.55;
    for (let r = 0; r < auroraRows; r++) {
      const rowOff = r * auroraCols;
      for (let col = 0; col < auroraCols; col++) {
        const a = auroraNodes[rowOff + col];
        const aScore = a.wave + a.rippleBoost * 0.7;
        if (aScore <= 0.42) continue;
        if (col + 1 < auroraCols) {
          const b = auroraNodes[rowOff + col + 1];
          const bScore = b.wave + b.rippleBoost * 0.7;
          if (bScore > 0.42) {
            const linkAlpha = Math.min(0.16, 0.04 + (Math.min(aScore, bScore) - 0.42) * 0.14);
            c.strokeStyle =
              a.warmMix > 0.58 ? `rgba(226,138,107,${linkAlpha.toFixed(3)})` : `rgba(148,210,255,${linkAlpha.toFixed(3)})`;
            c.beginPath();
            c.moveTo(a.rx, a.ry);
            c.lineTo(b.rx, b.ry);
            c.stroke();
          }
        }
        if (r + 1 < auroraRows) {
          const d = auroraNodes[rowOff + auroraCols + col];
          const dScore = d.wave + d.rippleBoost * 0.7;
          if (dScore > 0.42) {
            const linkAlpha = Math.min(0.16, 0.04 + (Math.min(aScore, dScore) - 0.42) * 0.14);
            c.strokeStyle =
              a.warmMix > 0.58 ? `rgba(226,138,107,${linkAlpha.toFixed(3)})` : `rgba(148,210,255,${linkAlpha.toFixed(3)})`;
            c.beginPath();
            c.moveTo(a.rx, a.ry);
            c.lineTo(d.rx, d.ry);
            c.stroke();
          }
        }
      }
    }

    for (const n of auroraNodes) {
      const norm = Math.max(0, Math.min(1, (n.wave + 1) * 0.5 + n.rippleBoost * 0.35));
      const radius = 0.55 + norm * 1.6;
      const alpha = 0.05 + Math.pow(norm, 1.35) * 0.63;
      if (n.wave > 0.32 || n.rippleBoost > 0.15) {
        const mixT = Math.max(0, Math.min(1, (n.wave - 0.22) * 1.15 + n.rippleBoost * 0.5));
        const warm = Math.max(0, (n.warmMix - 0.5) * 2);
        c.fillStyle = `rgb(${Math.round(92 + mixT * (56 + warm * 78))},${Math.round(112 + mixT * (98 - warm * 72))},${Math.round(145 + mixT * (110 - warm * 148))})`;
      } else {
        c.fillStyle = "rgb(78,90,118)";
      }
      c.globalAlpha = alpha;
      c.beginPath();
      c.arc(n.rx, n.ry, radius, 0, Math.PI * 2);
      c.fill();
    }

    for (const f of auroraFloaters) {
      f.x += f.vx;
      f.y += f.vy;
      if (f.y < -6) {
        f.y = H + 6;
        f.x = Math.random() * W;
      }
      if (f.x < -6) f.x = W + 6;
      if (f.x > W + 6) f.x = -6;
      const fb = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.3 + f.phase));
      c.globalAlpha = (0.18 + fb * 0.36) * breath;
      c.fillStyle = f.warm ? "#e28a6b" : "#94d2ff";
      c.beginPath();
      c.arc(f.x, f.y, f.r * (0.85 + 0.25 * fb), 0, Math.PI * 2);
      c.fill();
    }
  }

  function stepFrame(now: number): void {
    if (disposed || !activeEngine || !ctx) {
      rafId = 0;
      return;
    }
    rafId = win!.requestAnimationFrame(stepFrame);
    if (doc!.hidden) return;
    if (now - lastFrame < 24) return;
    lastFrame = now;
    t += 0.02;

    const prefs = getCosmosPreferences();
    smoothMouse.x += (pointer.nx - smoothMouse.x) * 0.05;
    smoothMouse.y += (pointer.ny - smoothMouse.y) * 0.05;
    const breath = 0.68 + 0.32 * (0.5 + 0.5 * Math.sin(t * 0.95));

    ctx.clearRect(0, 0, W, H);

    if (activeEngine === "blackhole") {
      if (gl && glReady && glProg) {
        gl.useProgram(glProg);
        gl.uniform2f(glUniforms.res, cgl!.width, cgl!.height);
        gl.uniform1f(glUniforms.time, t);
        gl.uniform2f(glUniforms.mouse, smoothMouse.x, 1.0 - smoothMouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else {
        renderBlackHoleFallback(ctx, breath);
      }
      renderBlackHoleConstellation(ctx, breath, prefs.interactive);
    } else if (activeEngine === "orbital") {
      renderOrbital(ctx, breath);
    } else if (activeEngine === "moss") {
      renderMoss(ctx, breath, prefs.interactive);
    } else if (activeEngine === "prism") {
      renderPrism(ctx, breath, prefs.interactive);
    } else {
      renderAurora(ctx, breath, prefs.interactive);
    }

    const accentColor =
      activeEngine === "moss"
        ? "#5eead4"
        : activeEngine === "prism"
          ? "#22d3ee"
          : activeThemeSpec?.contribution.colors.accent ?? "#e5a95c";

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      if (activeEngine === "aurora") {
        rp.r += 5.5;
        rp.strength = Math.max(0, 1 - rp.r / rp.maxR);
        if (rp.r >= rp.maxR) ripples.splice(i, 1);
      } else {
        rp.r += activeEngine === "moss" ? 1.3 : 2.8;
        rp.a *= activeEngine === "moss" ? 0.978 : 0.96;
        if (rp.r >= rp.maxR || rp.a < 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = rp.a;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.05;
        if (activeEngine === "moss") {
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.25, 0, 0, Math.PI * 2);
          ctx.stroke();
          if (rp.r > 18) {
            ctx.globalAlpha = rp.a * 0.45;
            ctx.beginPath();
            ctx.ellipse(rp.x, rp.y, rp.r * 0.62, rp.r * 0.155, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function startLoop(): void {
    if (rafId !== 0 || !activeEngine || doc!.hidden) return;
    lastFrame = 0;
    rafId = win!.requestAnimationFrame(stepFrame);
  }

  function stopLoop(): void {
    if (rafId !== 0) {
      win!.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function syncRuntime(): void {
    if (disposed || !root || !cgl || !c2d) return;
    const prefs = getCosmosPreferences();
    activeThemeSpec = detectActiveTheme();

    const reducedMotion = prefs.respectReducedMotion && Boolean(reducedMotionMql?.matches);
    let nextEngine: EngineId | null = null;
    if (prefs.mode !== "off" && !reducedMotion) {
      nextEngine = prefs.mode === "auto" ? activeThemeSpec?.engine ?? null : prefs.mode;
    }

    const hostAuroraPresent = Boolean(doc!.getElementById(HOST_AURORA_CANVAS_ID));
    const delegateToHostAurora =
      nextEngine === "aurora" && prefs.mode === "auto" && hostAuroraPresent;

    if (activeThemeSpec || (nextEngine !== null && !delegateToHostAurora)) {
      doc!.documentElement.setAttribute(ACTIVE_BG_ATTR, "1");
    } else {
      doc!.documentElement.removeAttribute(ACTIVE_BG_ATTR);
    }

    if (delegateToHostAurora) {
      doc!.documentElement.removeAttribute(SUPPRESS_HOST_ATTR);
      activeEngine = null;
      root.style.opacity = "0";
      cgl.style.display = "none";
      stopLoop();
      return;
    }

    if (nextEngine === null) {
      if (activeThemeSpec) {
        doc!.documentElement.setAttribute(SUPPRESS_HOST_ATTR, "1");
      } else {
        doc!.documentElement.removeAttribute(SUPPRESS_HOST_ATTR);
      }
      activeEngine = null;
      root.style.opacity = "0";
      cgl.style.display = "none";
      stopLoop();
      return;
    }

    doc!.documentElement.setAttribute(SUPPRESS_HOST_ATTR, "1");
    activeEngine = nextEngine;
    if (nextEngine === "blackhole") {
      initBlackHoleGl();
      cgl.style.display = glReady ? "block" : "none";
      root.style.opacity = String(BLACKHOLE_INTENSITY_OPACITY[prefs.intensity]);
    } else {
      cgl.style.display = "none";
      root.style.opacity = String(INTENSITY_OPACITY[prefs.intensity]);
    }

    if (W === 0 || H === 0) resize();
    if (doc!.hidden) stopLoop();
    else startLoop();
  }

  const onPointerMove = (e: DomEvent): void => {
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    if (typeof cx !== "number" || typeof cy !== "number") return;
    pointer.x = cx;
    pointer.y = cy;
    pointer.nx = cx / Math.max(W, 1);
    pointer.ny = cy / Math.max(H, 1);
    pointer.active = true;

    const prefs = getCosmosPreferences();
    if (!prefs.interactive || !activeEngine) return;

    if (activeEngine === "aurora") {
      const dist = Math.hypot(cx - pointer.lastSpawnX, cy - pointer.lastSpawnY);
      if (dist > 22) {
        pointer.lastSpawnX = cx;
        pointer.lastSpawnY = cy;
        ripples.push({ x: cx, y: cy, r: 0, maxR: 260, a: 0.4, strength: 1 });
        if (ripples.length > 4) ripples.shift();
      }
    } else if (activeEngine !== "orbital" && activeEngine !== "blackhole") {
      const chance = activeEngine === "moss" ? 0.1 : 0.16;
      if (Math.random() < chance) {
        ripples.push({
          x: cx,
          y: cy,
          r: 4,
          maxR: activeEngine === "moss" ? 130 : 155,
          a: activeEngine === "moss" ? 0.34 : 0.46,
          strength: 1,
        });
        if (ripples.length > 10) ripples.shift();
      }
    }
  };

  const onPointerDown = (e: DomEvent): void => {
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    if (typeof cx !== "number" || typeof cy !== "number") return;
    const prefs = getCosmosPreferences();
    if (!prefs.interactive || !activeEngine) return;
    if (activeEngine !== "orbital" && activeEngine !== "blackhole") {
      ripples.push({ x: cx, y: cy, r: 6, maxR: 240, a: 0.72, strength: 1 });
      if (ripples.length > 12) ripples.shift();
    }
  };

  const onPointerLeave = (): void => {
    pointer.active = false;
  };

  const onVisibilityChange = (): void => {
    if (doc!.hidden) stopLoop();
    else if (activeEngine) startLoop();
  };

  const onResize = (): void => {
    win!.clearTimeout(resizeTimer);
    resizeTimer = win!.setTimeout(resize, 60);
  };

  const onGlLost = (e: DomEvent): void => {
    e.preventDefault?.();
    glReady = false;
    if (cgl) cgl.style.display = "none";
  };

  const onGlRestored = (): void => {
    destroyGlResources();
    if (activeEngine === "blackhole") {
      initBlackHoleGl();
      if (cgl) cgl.style.display = glReady ? "block" : "none";
    }
  };

  let observer: DomMutationObserver | null = null;
  let unsubPrefs: (() => void) | null = null;

  function mount(): void {
    if (disposed || !doc!.body) return;
    if (!doc!.getElementById(STYLE_ID)) {
      styleEl = doc!.createElement("style");
      styleEl.id = STYLE_ID;
      styleEl.textContent = `
        #${ROOT_ID} {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9998;
          mix-blend-mode: screen;
          opacity: 0;
          transition: opacity 0.45s ease;
        }
        #${ROOT_ID} canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
        }
        html[${SUPPRESS_HOST_ATTR}="1"] #${HOST_AURORA_CANVAS_ID} {
          display: none !important;
        }
        html[${ACTIVE_BG_ATTR}="1"],
        html[${ACTIVE_BG_ATTR}="1"] body {
          background-color: var(--colors-surface0, var(--colors-surface-0, var(--colors-background, #06060f))) !important;
        }
      `;
      doc!.head.appendChild(styleEl);
    }

    doc!.getElementById(ROOT_ID)?.remove();
    root = doc!.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("aria-hidden", "true");

    cgl = doc!.createElement("canvas");
    cgl.id = "zaynetheme-cosmos-gl";
    cgl.style.display = "none";

    c2d = doc!.createElement("canvas");
    c2d.id = "zaynetheme-cosmos-2d";

    root.appendChild(cgl);
    root.appendChild(c2d);
    doc!.body.appendChild(root);

    ctx = c2d.getContext("2d");
    auroraCanvas = doc!.createElement("canvas");
    auroraCanvas.width = 160;
    auroraCanvas.height = 100;
    aCtx = auroraCanvas.getContext("2d");
    auroraImg = aCtx ? aCtx.createImageData(160, 100) : null;

    cgl.addEventListener("webglcontextlost", onGlLost);
    cgl.addEventListener("webglcontextrestored", onGlRestored);
    win!.addEventListener("resize", onResize);
    win!.addEventListener("mousemove", onPointerMove, { passive: true });
    win!.addEventListener("touchmove", onPointerMove, { passive: true });
    win!.addEventListener("mousedown", onPointerDown, { passive: true });
    win!.addEventListener("touchstart", onPointerDown, { passive: true });
    win!.addEventListener("mouseleave", onPointerLeave, { passive: true });
    win!.addEventListener("touchend", onPointerLeave, { passive: true });
    doc!.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMql?.addEventListener("change", syncRuntime);

    if (typeof host.MutationObserver === "function") {
      let lastObservedSig = "";
      observer = new host.MutationObserver(() => {
        const cs = typeof win!.getComputedStyle === "function" ? win!.getComputedStyle(doc!.documentElement) : null;
        const sig = [
          doc!.documentElement.className,
          cs?.getPropertyValue("--colors-surface0") ?? "",
          cs?.getPropertyValue("--colors-surface-0") ?? "",
          cs?.getPropertyValue("--colors-accent") ?? "",
        ].join("|");
        if (sig === lastObservedSig) return;
        lastObservedSig = sig;
        syncRuntime();
      });
      observer.observe(doc!.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style", "data-theme"],
      });
      observer.observe(doc!.head, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    unsubPrefs = subscribeCosmosPreferences(syncRuntime);

    resize();
    syncRuntime();
  }

  const onReady = (): void => {
    if (!disposed) mount();
  };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", onReady);
  } else {
    mount();
  }

  return () => {
    disposed = true;
    stopLoop();
    win.clearTimeout(resizeTimer);
    doc.removeEventListener("DOMContentLoaded", onReady);
    doc.removeEventListener("visibilitychange", onVisibilityChange);
    win.removeEventListener("resize", onResize);
    win.removeEventListener("mousemove", onPointerMove);
    win.removeEventListener("touchmove", onPointerMove);
    win.removeEventListener("mousedown", onPointerDown);
    win.removeEventListener("touchstart", onPointerDown);
    win.removeEventListener("mouseleave", onPointerLeave);
    win.removeEventListener("touchend", onPointerLeave);
    reducedMotionMql?.removeEventListener("change", syncRuntime);
    cgl?.removeEventListener("webglcontextlost", onGlLost);
    cgl?.removeEventListener("webglcontextrestored", onGlRestored);
    observer?.disconnect();
    unsubPrefs?.();
    destroyGlResources();
    root?.remove();
    styleEl?.remove();
    doc.documentElement.removeAttribute(SUPPRESS_HOST_ATTR);
    doc.documentElement.removeAttribute(ACTIVE_BG_ATTR);
  };
}
