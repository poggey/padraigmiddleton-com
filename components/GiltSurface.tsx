"use client";

import { useRef } from "react";
import { buildSurface } from "@/lib/surface";
import { useCanvasLoop } from "@/lib/useCanvasLoop";
import {
  attribute,
  createProgram,
  fitCanvas,
  multiply,
  perspective,
  rotationX,
  rotationY,
  tokenColour,
  translation,
} from "@/lib/webgl";

/**
 * The UK yield curve as a sculpted object: weekly gilt curves since January 2025 form a solid,
 * softly lit surface (maturity across, time front to back, yield as height). The latest close is
 * the gold front edge. It rises out of flat on load, turns slowly, and leans towards the cursor.
 */

const BASE = -0.06; // floor of the solid, just below the lowest yield

const vertex = `#version 300 es
in vec3 position;
in vec3 normal;
in vec2 uv;
in float side;
uniform mat4 projection;
uniform mat4 view;
uniform float rise;
out vec3 vNormal;
out vec3 vWorld;
out vec2 vUv;
out float vSide;
out float vHeight;
void main() {
  vec3 p = position;
  p.y = mix(${BASE.toFixed(2)}, p.y, rise);
  vNormal = normal;
  vWorld = p;
  vUv = uv;
  vSide = side;
  vHeight = position.y / 0.75;
  gl_Position = projection * view * vec4(p, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vWorld;
in vec2 vUv;
in float vSide;
in float vHeight;
uniform vec3 camera;
uniform vec3 back;
uniform vec3 iris;
uniform vec3 mid;
uniform vec3 front;
uniform vec3 gold;
uniform float weeks;
uniform float rows;
out vec4 colour;

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.34) return mix(back, iris, t / 0.34);
  if (t < 0.68) return mix(iris, mid, (t - 0.34) / 0.34);
  return mix(mid, front, (t - 0.68) / 0.32);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(camera - vWorld);
  vec3 key = normalize(vec3(-0.5, 1.0, 0.7));
  float diffuse = max(dot(n, key), 0.0);
  float fill = max(dot(n, normalize(vec3(0.8, 0.4, 0.3))), 0.0);
  float spec = pow(max(dot(n, normalize(key + v)), 0.0), 60.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  vec3 base;
  if (vSide < 0.0) {
    base = ramp(vHeight);
    // Faint lines along each weekly curve, so it reads as data, not a blob.
    float w = vUv.y * (weeks - 1.0);
    float line = clamp(1.0 - (0.5 - abs(fract(w) - 0.5)) / (fwidth(w) * 0.9), 0.0, 1.0);
    base = mix(base, vec3(1.0), line * 0.18);
  } else {
    // The walls of the solid: deep blue, lighter towards the top edge.
    base = mix(front * 0.8, mid, pow(vSide, 1.2));
  }

  vec3 lit = base * (0.42 + 0.5 * diffuse + 0.16 * fill) + spec * 0.35 + rim * vec3(0.78, 0.8, 1.0) * 0.28;

  // The latest close: a gold band along the front edge of the top and the top of the front wall.
  float edge = vSide < 0.0 ? smoothstep(1.0 - 2.2 / rows, 1.0 - 0.6 / rows, vUv.y)
                           : step(0.999, vUv.y) * smoothstep(0.955, 0.985, vSide);
  lit = mix(lit, gold * (0.85 + 0.25 * diffuse), edge);

  colour = vec4(lit, 1.0);
}`;

// Adds the four walls that turn the surface into a solid, sharing its top edge.
function addWalls(s: ReturnType<typeof buildSurface>) {
  const position: number[] = Array.from(s.position);
  const normal: number[] = Array.from(s.normal);
  const uv: number[] = Array.from(s.uv);
  const side: number[] = new Array(s.rows * s.columns).fill(-1);
  const indices: number[] = Array.from(s.indices);

  const edges: Array<{ cells: number[]; out: [number, number, number] }> = [
    {
      cells: Array.from({ length: s.columns }, (_, c) => (s.rows - 1) * s.columns + c),
      out: [0, 0, 1],
    },
    { cells: Array.from({ length: s.columns }, (_, c) => c), out: [0, 0, -1] },
    { cells: Array.from({ length: s.rows }, (_, r) => r * s.columns), out: [-1, 0, 0] },
    {
      cells: Array.from({ length: s.rows }, (_, r) => r * s.columns + s.columns - 1),
      out: [1, 0, 0],
    },
  ];

  for (const { cells, out } of edges) {
    const first = position.length / 3;
    for (const cell of cells) {
      const [x, y, z] = [s.position[cell * 3], s.position[cell * 3 + 1], s.position[cell * 3 + 2]];
      const [u, v] = [s.uv[cell * 2], s.uv[cell * 2 + 1]];
      position.push(x, y, z, x, BASE, z);
      normal.push(...out, ...out);
      uv.push(u, v, u, v);
      side.push(1, 0);
    }
    for (let k = 0; k < cells.length - 1; k++) {
      const a = first + k * 2;
      indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }

  return {
    position: new Float32Array(position),
    normal: new Float32Array(normal),
    uv: new Float32Array(uv),
    side: new Float32Array(side),
    indices: new Uint16Array(indices),
  };
}

export function GiltSurface({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useCanvasLoop(ref, (canvas) => {
    const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true });
    if (!gl) return null;

    const surface = buildSurface(64, 2, 1);
    const solid = addWalls(surface);
    const program = createProgram(gl, vertex, fragment);
    gl.useProgram(program);
    attribute(gl, program, "position", solid.position, 3);
    attribute(gl, program, "normal", solid.normal, 3);
    attribute(gl, program, "uv", solid.uv, 2);
    attribute(gl, program, "side", solid.side, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, solid.indices, gl.STATIC_DRAW);

    const u = (name: string) => gl.getUniformLocation(program, name);
    for (const [name, token] of [
      ["back", "--ribbon-back"],
      ["iris", "--ribbon-iris"],
      ["mid", "--ribbon-mid"],
      ["front", "--ribbon-front"],
      ["gold", "--gilt"],
    ]) {
      gl.uniform3fv(u(name), tokenColour(token));
    }
    gl.uniform1f(u("weeks"), surface.weeks);
    gl.uniform1f(u("rows"), surface.rows);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    return ({ time, pointer, reduced }) => {
      const { width, height } = fitCanvas(canvas, gl);
      const rise = reduced ? 1 : 1 - (1 - Math.min(1, time / 1.8)) ** 3;
      const yaw = -0.55 + (reduced ? 0 : Math.sin(time * 0.18) * 0.12) + pointer.x * 0.28;
      const pitch = 0.46 + pointer.y * 0.08;

      // Step back on narrow canvases so the whole object always fits.
      const distance = 5.2 * Math.max(1, 1.3 / (width / height));
      const view = multiply(
        translation(0, -0.18, -distance),
        multiply(rotationX(pitch), rotationY(yaw)),
      );
      const projection = perspective(0.5, width / height, 0.1, 50);
      // Camera position in world space, for the rim light.
      const camera = [
        Math.sin(-yaw) * distance * Math.cos(pitch),
        distance * Math.sin(pitch) + 0.18,
        Math.cos(-yaw) * distance * Math.cos(pitch),
      ];

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(u("projection"), false, projection);
      gl.uniformMatrix4fv(u("view"), false, view);
      gl.uniform3fv(u("camera"), camera);
      gl.uniform1f(u("rise"), rise);
      gl.drawElements(gl.TRIANGLES, solid.indices.length, gl.UNSIGNED_SHORT, 0);
      return time < 2;
    };
  });

  return <canvas ref={ref} aria-hidden className={className} />;
}
