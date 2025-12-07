/* ============================================================================
   RING FRAGMENT SHADER
   Handles wireframe rendering with depth-based fading and glow effects
   ============================================================================ */

#define PI 3.14159265359

// Uniforms
uniform vec3 uColor;
uniform float uTime;
uniform float uGlowAmount;

// Varyings from vertex shader
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDistortion;
varying float vDistance;

// Fresnel calculation for edge glow
float fresnel(vec3 N, vec3 V, float power) {
  return pow(1.0 - abs(dot(N, V)), power);
}

// Wireframe edge detection (for line emphasis)
float wireframeEdge(vec3 pos) {
  vec3 d = fwidth(pos);
  vec3 a3 = smoothstep(vec3(0.0), d * 1.5, pos);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  // Normalize vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vPosition);

  // Calculate fresnel effect
  float fresnelEffect = fresnel(N, V, 2.0);

  // Base wireframe color
  vec3 color = uColor;

  // Add soft glow to edges
  float glow = fresnelEffect * uGlowAmount;
  color += vec3(glow * 0.3);

  // Add subtle color variation based on distortion
  float distortionColor = vDistortion * 0.1;
  color += vec3(distortionColor);

  // Depth-based alpha fade
  float alpha = 0.7;
  alpha = mix(alpha, 1.0, fresnelEffect);
  alpha = mix(alpha, 0.3, vDistance * 0.01);

  // Soft fade effect
  alpha *= smoothstep(0.0, 1.0, fresnelEffect);

  // Anti-aliasing
  alpha = smoothstep(0.0, 0.1, alpha);

  gl_FragColor = vec4(color, alpha);
}
