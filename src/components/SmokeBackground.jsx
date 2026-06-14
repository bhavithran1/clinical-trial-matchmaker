import { useEffect, useRef, useState } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

float blob(vec2 uv, vec2 center, float rx, float ry) {
  vec2 d = (uv - center) / vec2(rx, ry);
  return exp(-dot(d,d) * 0.55);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * 0.3;
  float asp = u_res.x / u_res.y;
  vec2 a = vec2(uv.x * asp, uv.y);

  float v = 0.0;
  v += blob(a, vec2((0.22 + sin(t*0.38)*0.08)*asp, 0.30 + cos(t*0.29)*0.07), 0.72*asp, 0.68) * 0.95;
  v += blob(a, vec2((0.80 + cos(t*0.32)*0.07)*asp, 0.60 + sin(t*0.25)*0.07), 0.62*asp, 0.60) * 0.88;
  v += blob(a, vec2((0.50 + sin(t*0.22)*0.06)*asp, 0.88 + cos(t*0.20)*0.06), 0.58*asp, 0.54) * 0.75;
  v += blob(a, vec2((0.10 + cos(t*0.28)*0.05)*asp, 0.70 + sin(t*0.24)*0.05), 0.44*asp, 0.48) * 0.60;

  v = clamp(v, 0.0, 1.0);
  v = pow(v, 0.5);

  vec3 col = mix(vec3(0.031), vec3(0.90, 0.90, 0.95), v);
  gl_FragColor = vec4(col, 1.0);
}
`;

function initGL(canvas) {
  try {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;
    function shader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    return { gl, uRes: gl.getUniformLocation(prog,'u_res'), uTime: gl.getUniformLocation(prog,'u_time') };
  } catch { return null; }
}

function WebGLSmoke() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const state = initGL(canvas);
    if (!state) return;
    const { gl, uRes, uTime } = state;
    let animId, start = performance.now();
    function resize() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// CSS fallback — works everywhere WebGL isn't available
function CSSSmoke() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 18% 28%, rgba(160,160,172,0.20) 0%, transparent 60%),
          radial-gradient(ellipse 60% 55% at 82% 60%, rgba(148,148,160,0.17) 0%, transparent 60%),
          radial-gradient(ellipse 55% 50% at 50% 90%, rgba(140,140,152,0.14) 0%, transparent 60%),
          radial-gradient(ellipse 45% 48% at 8% 72%,  rgba(132,132,144,0.12) 0%, transparent 60%)
        `,
        animation: 'cssDrift 24s ease-in-out infinite',
      }} />
    </div>
  );
}

export default function SmokeBackground() {
  const [hasWebGL, setHasWebGL] = useState(null);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch { setHasWebGL(false); }
  }, []);

  if (hasWebGL === null) return null; // brief flash prevention
  return hasWebGL ? <WebGLSmoke /> : <CSSSmoke />;
}
