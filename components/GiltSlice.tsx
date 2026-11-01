"use client";

import { useRef } from "react";
import surface from "@/public/data/gilt-surface.json";
import { smoothCurve } from "@/lib/curves";
import { useCanvasLoop } from "@/lib/useCanvasLoop";
import { createProgram, fitCanvas, tokenColour } from "@/lib/webgl";

/**
 * A plane of slowly flowing colour whose top edge is the latest UK gilt yield curve, 6 months
 * on the left to 30 years on the right, drawn with a gold line. Faint lines above it are the
 * previous eight weeks, so you can see where the edge has come from. The cursor lights the colour.
 */

const SAMPLES = 64;
const GHOSTS = 8;

// Heights of a curve across the canvas (0 at the bottom, 1 at the top), scaled so the latest
// curve spans `low` to `high`. Earlier curves use the same scale, so their offsets are real.
// The curve starts `start` of the way across; to its left the edge holds the 6-month yield.
function edges(start: number, low: number, high: number) {
  const logs = surface.maturities.map(Math.log);
  const at = Array.from({ length: SAMPLES }, (_, i) => {
    const t = Math.max(0, (i / (SAMPLES - 1) - start) / (1 - start));
    return logs[0] + (logs[logs.length - 1] - logs[0]) * t;
  });
  const curves = surface.curves.slice(-(GHOSTS + 1)).map((c) => smoothCurve(logs, c.yields, at));
  const latest = curves[curves.length - 1];
  const min = Math.min(...latest);
  const max = Math.max(...latest);
  const scale = (y: number) => low + ((y - min) / (max - min)) * (high - low);
  return { latest: latest.map(scale), ghosts: curves.slice(0, -1).map((c) => c.map(scale)) };
}

const vertex = `#version 300 es
in vec2 corner;
void main() { gl_Position = vec4(corner, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform float edge[${SAMPLES}];
uniform vec2 resolution;
uniform float time;
uniform vec2 pointer;
uniform float reveal;
uniform vec3 ink;
uniform vec3 front;
uniform vec3 mid;
uniform vec3 iris;
uniform vec3 back;
uniform vec3 gold;
out vec4 colour;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float edgeAt(float x) {
  float f = clamp(x, 0.0, 1.0) * float(${SAMPLES - 1});
  int i = int(floor(f));
  return mix(edge[i], edge[min(i + 1, ${SAMPLES - 1})], fract(f));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float e = edgeAt(uv.x) * reveal;
  float below = (e - uv.y) * resolution.y; // pixels below the edge
  if (below < -3.0) { colour = vec4(0.0); return; }

  vec2 p = uv * vec2(resolution.x / resolution.y, 1.0) * 1.8;
  float t = time * 0.06;
  vec2 q = vec2(fbm(p + vec2(t, 0.0)), fbm(p + vec2(5.2, 1.3) - t));
  float f = fbm(p + 2.4 * q + vec2(0.0, t * 0.5));

  vec3 c = mix(ink, front, smoothstep(0.15, 0.45, f));
  c = mix(c, mid, smoothstep(0.4, 0.7, f));
  c = mix(c, iris, smoothstep(0.45, 0.8, q.x));
  c = mix(c, back, smoothstep(0.6, 0.95, f * q.y * 1.8));
  // Deeper towards the bottom, lighter where it meets the edge, like light on a horizon.
  c = mix(c, ink, clamp(below / resolution.y * 1.6, 0.0, 0.6));
  c = mix(c, back, exp(-below / 70.0) * 0.45);
  // Fine threads of light in the flow.
  c += vec3(0.9, 0.92, 1.0) * smoothstep(0.01, 0.0, abs(f - 0.58)) * 0.06;
  // The cursor casts a soft light.
  vec2 d = (uv - pointer) * vec2(resolution.x / resolution.y, 1.0);
  c += vec3(0.16, 0.17, 0.22) * exp(-dot(d, d) * 9.0);

  // The edge itself: a 2px gold line, anti-aliased.
  float line = smoothstep(3.0, 1.8, abs(below - 1.0));
  c = mix(c, gold, line);
  float alpha = smoothstep(-1.0, 0.5, below);
  colour = vec4(c * alpha, alpha);
}`;

export function GiltSlice({
  className,
  start = 0.3,
  low = 0.06,
  high = 0.76,
}: {
  className?: string;
  start?: number;
  low?: number;
  high?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const shape = edges(start, low, high);

  useCanvasLoop(ref, (canvas) => {
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true });
    if (!gl) return null;
    const program = createProgram(gl, vertex, fragment);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const corner = gl.getAttribLocation(program, "corner");
    gl.enableVertexAttribArray(corner);
    gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1fv(u("edge"), shape.latest);
    for (const [name, token] of [
      ["ink", "--ink"],
      ["front", "--ribbon-front"],
      ["mid", "--ribbon-mid"],
      ["iris", "--ribbon-iris"],
      ["back", "--ribbon-back"],
      ["gold", "--gilt"],
    ]) {
      gl.uniform3fv(u(name), tokenColour(token));
    }

    return ({ time, pointer, reduced }) => {
      const { width, height } = fitCanvas(canvas, gl);
      gl.uniform2f(u("resolution"), width, height);
      gl.uniform1f(u("time"), reduced ? 0 : time);
      gl.uniform1f(u("reveal"), reduced ? 1 : 1 - (1 - Math.min(1, time / 1.6)) ** 3);
      gl.uniform2f(u("pointer"), (pointer.x + 1) / 2, 1 - (pointer.y + 1) / 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return time < 1.8;
    };
  });

  return (
    <div className={className}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {shape.ghosts.map((g, i) => (
          <path
            key={i}
            d={g
              .map((h, k) => `${k ? "L" : "M"}${(k / (SAMPLES - 1)) * 100},${100 - h * 100}`)
              .join(" ")}
            fill="none"
            className="stroke-line-strong"
            strokeOpacity={0.35 + (0.5 * i) / GHOSTS}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
