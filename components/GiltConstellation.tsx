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
 * The gilt yield-curve surface as a cloud of light on night blue: one point per maturity per
 * day, weekly curves since January 2025 with two blended days between each. The latest close is
 * a row of gold points along the front. It turns slowly and leans towards the cursor.
 */

const vertex = `#version 300 es
in vec3 position;
in vec2 uv;
uniform mat4 projection;
uniform mat4 view;
uniform float rise;
uniform float size;
uniform float time;
out float vHeight;
out float vLatest;
out float vDepth;
void main() {
  vec3 p = position;
  p.y = mix(0.0, p.y * 1.5, rise) + sin(time * 0.6 + uv.x * 9.0 + uv.y * 14.0) * 0.006;
  vec4 eye = view * vec4(p, 1.0);
  gl_Position = projection * eye;
  vLatest = step(0.999, uv.y);
  vHeight = position.y / 0.75;
  vDepth = -eye.z;
  gl_PointSize = size * mix(1.0, 2.2, vLatest) * (4.6 / vDepth);
}`;

const fragment = `#version 300 es
precision highp float;
in float vHeight;
in float vLatest;
in float vDepth;
uniform vec3 low;
uniform vec3 mid;
uniform vec3 high;
uniform vec3 gold;
out vec4 colour;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float glow = (1.0 - d) * (1.0 - d);
  vec3 tint = vHeight < 0.5 ? mix(low, mid, vHeight * 2.0) : mix(mid, high, vHeight * 2.0 - 1.0);
  tint = mix(tint, gold, vLatest);
  // Points further back fade, which gives the cloud depth.
  float fog = clamp(1.3 - (vDepth - 3.8) * 0.5, 0.3, 1.0);
  float alpha = glow * mix(0.75, 1.0, vLatest) * fog;
  colour = vec4(tint * alpha, alpha);
}`;

export function GiltConstellation({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useCanvasLoop(ref, (canvas) => {
    const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true });
    if (!gl) return null;

    const surface = buildSurface(72, 2);
    const program = createProgram(gl, vertex, fragment);
    gl.useProgram(program);
    attribute(gl, program, "position", surface.position, 3);
    attribute(gl, program, "uv", surface.uv, 2);

    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform3fv(u("low"), tokenColour("--ribbon-iris"));
    gl.uniform3fv(u("mid"), tokenColour("--signal-soft"));
    gl.uniform3fv(u("high"), tokenColour("--night-text"));
    gl.uniform3fv(u("gold"), tokenColour("--gilt"));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    const count = surface.rows * surface.columns;

    return ({ time, pointer, reduced }) => {
      const { width, height, dpr } = fitCanvas(canvas, gl);
      const rise = reduced ? 1 : 1 - (1 - Math.min(1, time / 2.2)) ** 3;
      const yaw = -0.62 + (reduced ? 0 : Math.sin(time * 0.12) * 0.32) + pointer.x * 0.3;
      const pitch = 0.68 + pointer.y * 0.1;
      const distance = 4.4 * Math.max(1, 1.2 / (width / height));
      const view = multiply(
        translation(0, -0.1, -distance),
        multiply(rotationX(pitch), rotationY(yaw)),
      );

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(u("projection"), false, perspective(0.5, width / height, 0.1, 50));
      gl.uniformMatrix4fv(u("view"), false, view);
      gl.uniform1f(u("rise"), rise);
      gl.uniform1f(u("time"), reduced ? 0 : time);
      gl.uniform1f(u("size"), 3 * dpr);
      gl.drawArrays(gl.POINTS, 0, count);
      return time < 2.4;
    };
  });

  return <canvas ref={ref} aria-hidden className={className} />;
}
