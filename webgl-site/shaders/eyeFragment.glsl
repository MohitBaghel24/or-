/* ============================================================================
   EYE FRAGMENT SHADER
   Handles lighting, glow, soft fade effects for the eye core
   ============================================================================ */

#define PI 3.14159265359

// Uniforms
uniform vec3 uColor;
uniform float uTime;
uniform float uGlowIntensity;
uniform sampler2D uTexture;

// Varyings from vertex shader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vDepth;

// Fresnel effect calculation
float fresnel(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - abs(dot(normalize(normal), normalize(viewDir))), power);
}

void main() {
  // Normalize vectors
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  
  // Calculate fresnel effect
  float fresnelEffect = fresnel(N, V, 3.0);
  
  // Base color
  vec3 color = uColor;
  
  // Add glow effect
  float glowPulse = sin(uTime * 0.8) * 0.5 + 0.5;
  float glow = glowPulse * uGlowIntensity;
  color += vec3(glow * 0.2);
  
  // Calculate depth-based alpha (soft fade at edges)
  float alpha = mix(0.7, 1.0, fresnelEffect);
  alpha = mix(alpha, 1.0, 1.0 - abs(vDepth) * 0.01);
  
  // Soft edge fade
  float edgeFade = smoothstep(0.0, 1.0, fresnelEffect);
  alpha *= edgeFade;
  
  // Anti-alias edges
  alpha = smoothstep(0.0, 0.1, alpha);
  
  // Apply fog
  gl_FragColor = vec4(color, alpha);
}
