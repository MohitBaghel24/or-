/* ============================================================================
   EYE VERTEX SHADER
   Handles vertex transformations with subtle wave distortions
   ============================================================================ */

#define PI 3.14159265359

// Uniforms
uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;

// Varyings passed to fragment shader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vDepth;

// 3D Perlin-like noise function (Simplex)
float noise3D(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

// Smooth noise (Perlin-like)
float smoothNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n0 = noise3D(i);
  float n1 = noise3D(i + vec3(1.0, 0.0, 0.0));
  float nx0 = mix(n0, n1, f.x);

  n0 = noise3D(i + vec3(0.0, 1.0, 0.0));
  n1 = noise3D(i + vec3(1.0, 1.0, 0.0));
  float nx1 = mix(n0, n1, f.x);

  return mix(nx0, nx1, f.y);
}

void main() {
  // Get base position and normal
  vec3 basePosition = position;
  vec3 baseNormal = normalize(normalMatrix * normal);

  // Apply wave distortion
  float wave = sin(basePosition.y * uWaveFrequency + uTime * uWaveSpeed) * uWaveAmplitude;
  
  // Add noise displacement
  float noiseVal = smoothNoise(basePosition * 0.5 + vec3(uTime * 0.1));
  vec3 noiseDisplacement = baseNormal * (noiseVal - 0.5) * 0.05;

  // Final displaced position
  vec3 displacedPosition = basePosition + baseNormal * wave + noiseDisplacement;

  // Transform to world space
  vPosition = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;
  vNormal = baseNormal;
  vViewPosition = -(modelViewMatrix * vec4(displacedPosition, 1.0)).xyz;
  vDepth = gl_Position.z;

  // Project to screen space
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
