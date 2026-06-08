const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
uniform vec2 touch;
uniform int pointerCount;
uniform vec2 pointers[10];
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  vec3 cyan=vec3(.122,.878,1.);
  vec3 deep=vec3(.006,.045,.085);
  vec3 titanium=vec3(.38,.45,.52);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    vec3 spectral=mix(deep,cyan,.45+.35*sin(i*.72+T*.12));
    col+=.00125/d*(spectral+titanium*.12);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)))*(cyan*.72+deep*.4);
    col=mix(col,deep+cyan*(bg*.16)+titanium*(bg*.035),d);
  }
  float vignette=smoothstep(1.28,.24,length(st*.72));
  col=mix(vec3(.019,.027,.043),col,vignette);
  O=vec4(col,1);
}`;

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private scale: number;
  private shaderSource = defaultShaderSource;
  private mouseMove = [0, 0];
  private mouseCoords = [0, 0];
  private pointerCoords = [0, 0];
  private nbrOfPointers = 0;

  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      stencil: false,
    });

    if (!gl) {
      throw new Error('WebGL2 indisponível.');
    }

    this.gl = gl;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
  }

  updateShader(source: string): void {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }

  updateMove(deltas: number[]): void {
    this.mouseMove = deltas;
  }

  updateMouse(coords: number[]): void {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]): void {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number): void {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale: number): void {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }

  compile(shader: WebGLShader, source: string): void {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? 'Erro ao compilar shader.');
    }
  }

  test(source: string): string | null {
    let result = null;
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!shader) {
      return 'Não foi possível criar fragment shader.';
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }

    gl.deleteShader(shader);
    return result;
  }

  reset(): void {
    const gl = this.gl;

    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }

      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }

      gl.deleteProgram(this.program);
    }
  }

  setup(): void {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);

    if (!this.vs || !this.fs) {
      throw new Error('Não foi possível criar shaders.');
    }

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram();

    if (!this.program) {
      throw new Error('Não foi possível criar programa WebGL.');
    }

    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program) ?? 'Erro ao linkar programa WebGL.');
    }
  }

  init(): void {
    const gl = this.gl;
    const program = this.program;

    if (!program) {
      return;
    }

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).resolution = gl.getUniformLocation(
      program,
      'resolution',
    );
    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).time = gl.getUniformLocation(program, 'time');
    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).move = gl.getUniformLocation(program, 'move');
    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).touch = gl.getUniformLocation(program, 'touch');
    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).pointerCount = gl.getUniformLocation(
      program,
      'pointerCount',
    );
    (program as WebGLProgram & Record<string, WebGLUniformLocation | null>).pointers = gl.getUniformLocation(
      program,
      'pointers',
    );
  }

  render(now = 0): void {
    const gl = this.gl;
    const program = this.program as (WebGLProgram & Record<string, WebGLUniformLocation | null>) | null;

    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) {
      return;
    }

    gl.clearColor(0.019, 0.027, 0.043, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform2f(program.move, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(program.touch, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(program.pointerCount, this.nbrOfPointers);
    gl.uniform2fv(program.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (target: HTMLCanvasElement, currentScale: number, x: number, y: number) => [
      x * currentScale,
      target.height - y * currentScale,
    ];

    element.addEventListener('pointerdown', (event) => {
      this.active = true;
      this.pointers.set(event.pointerId, map(element, this.getScale(), event.clientX, event.clientY));
    }, { passive: true });

    element.addEventListener('pointerup', (event) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }

      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    }, { passive: true });

    element.addEventListener('pointerleave', (event) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }

      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    }, { passive: true });

    element.addEventListener('pointermove', (event) => {
      if (!this.active) {
        return;
      }

      this.lastCoords = [event.clientX, event.clientY];
      this.pointers.set(event.pointerId, map(element, this.getScale(), event.clientX, event.clientY));
      this.moves = [this.moves[0] + event.movementX, this.moves[1] + event.movementY];
    }, { passive: true });
  }

  getScale(): number {
    return this.scale;
  }

  updateScale(scale: number): void {
    this.scale = scale;
  }

  get count(): number {
    return this.pointers.size;
  }

  get move(): number[] {
    return this.moves;
  }

  get coords(): number[] {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
  }

  get first(): number[] {
    return this.pointers.values().next().value ?? this.lastCoords;
  }
}

let animationFrame: number | undefined;
let renderer: WebGLRenderer | null = null;
let pointers: PointerHandler | null = null;
let canvasVisible = true;
let motionReduced = false;
let lastFrame = 0;
let resizeTimer: number | undefined;

const targetFrameMs = 1000 / 40;

function resize(canvas: HTMLCanvasElement): void {
  const dpr = Math.min(1.35, Math.max(1, 0.45 * window.devicePixelRatio));
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  if (renderer) {
    renderer.updateScale(dpr);
  }

  if (pointers) {
    pointers.updateScale(dpr);
  }
}

function loop(now: number): void {
  if (!renderer || !pointers) {
    return;
  }

  if (canvasVisible && !document.hidden && now - lastFrame >= targetFrameMs) {
    renderer.updateMouse(pointers.first);
    renderer.updatePointerCount(pointers.count);
    renderer.updatePointerCoords(pointers.coords);
    renderer.updateMove(pointers.move);
    renderer.render(now);
    lastFrame = now;
  }

  animationFrame = requestAnimationFrame(loop);
}

function startLoop(): void {
  if (animationFrame || motionReduced || !renderer) {
    return;
  }

  lastFrame = 0;
  animationFrame = requestAnimationFrame(loop);
}

function stopLoop(): void {
  if (!animationFrame) {
    return;
  }

  cancelAnimationFrame(animationFrame);
  animationFrame = undefined;
}

export function renderShaderBackground(): string {
  return `
    <div class="shader-background" aria-hidden="true">
      <canvas class="shader-background__canvas" data-shader-background></canvas>
      <div class="shader-background__fallback"></div>
    </div>
  `;
}

export function initShaderBackground(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-shader-background]');

  if (!canvas) {
    return;
  }

  motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    const dpr = Math.min(1.35, Math.max(1, 0.45 * window.devicePixelRatio));
    renderer = new WebGLRenderer(canvas, dpr);
    pointers = new PointerHandler(canvas, dpr);
    renderer.setup();
    renderer.init();
    resize(canvas);

    if (renderer.test(defaultShaderSource) === null) {
      renderer.updateShader(defaultShaderSource);
    }

    if (motionReduced) {
      renderer.render(0);
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          canvasVisible = Boolean(entry?.isIntersecting);

          if (canvasVisible && !document.hidden) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: '160px 0px 160px 0px', threshold: 0 },
      );

      observer.observe(canvas);
      startLoop();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopLoop();
      } else if (canvasVisible) {
        startLoop();
      }
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => resize(canvas), 120);
    }, { passive: true });
  } catch {
    canvas.closest('.shader-background')?.classList.add('shader-background--fallback');

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
}
