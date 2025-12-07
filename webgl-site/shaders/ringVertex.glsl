/* ============================================================================
   RING VERTEX SHADER
   Handles vertex transformations for wireframe rings with distortion
   ============================================================================ */

#define PI 3.14159265359

// Uniforms
uniform float uTime;
uniform float uDistortionAmount;
uniform float uDistortionSpeed;

// Varyings
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDistortion;
varying float vDistance;

// Noise function for organic distortion
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

float perlin(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash(i);
  float n100 = hash(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx0 = mix(nx00, nx10, f.y);

  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nx1 = mix(nx01, nx11, f.y);

  return mix(nx0, nx1, f.z);
}

void main() {
  vec3 basePosition = position;
  vec3 baseNormal = normalize(normalMatrix * normal);

  // Calculate distance from center
  float distance = length(basePosition);
  vDistance = distance;

  // Apply time-based distortion
  float distortion = perlin(basePosition * 0.3 + vec3(uTime * uDistortionSpeed));
  vDistortion = distortion;

  // Displace vertices along normal
  vec3 displacedPosition = basePosition + baseNormal * (distortion - 0.5) * uDistortionAmount;

  // Transform position
  vPosition = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;
  vNormal = baseNormal;

  // Project to screen
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
