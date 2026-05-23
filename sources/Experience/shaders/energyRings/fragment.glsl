precision highp float;
precision highp int;

layout(location = 0) out vec4 pc_FragColor;

uniform float uTime;
uniform float uOpacity;

in vec2 vUv;

#include ../partials/perlin2d.glsl;

#define PI 3.14159265359

// Fractional Brownian Motion — 3 oitavas de ruído Perlin
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.50;
    for(int i = 0; i < 3; i++) {
        v += a * perlin2d(p);
        p  = p * 2.1 + vec2(5.2 * float(i) + 1.7, 3.4 * float(i) + 8.1);
        a *= 0.5;
    }
    return v; // aprox. -1 a 1
}

void main()
{
    vec2 centered = vUv - vec2(0.5);
    float dist    = length(centered) * 2.0; // 0 = centro, 1 = borda

    if(dist > 1.0) discard;

    float angle = atan(centered.y, centered.x);

    // Coordenada angular sem costura (evita seam em ±PI)
    vec2 angCoord = vec2(cos(angle), sin(angle));

    // Camada 1 — fluxo principal derivando radialmente para fora
    // dist*3.0 - uTime*0.055: o padrão de ruído "scroll" para fora com o tempo
    float n1 = fbm(angCoord * 1.6 + vec2(dist * 3.0 - uTime * 0.055, uTime * 0.018       )) * 0.5 + 0.5;

    // Camada 2 — escala e velocidade diferentes, cria profundidade orgânica
    float n2 = fbm(angCoord * 2.4 + vec2(dist * 2.2 - uTime * 0.038, uTime * 0.024 + 4.7)) * 0.5 + 0.5;

    float organic = n1 * 0.60 + n2 * 0.40;

    // Distorção angular — quebra o formato circular da borda (Ajuste 2)
    float warpAng  = clamp(perlin2d(angCoord * 2.8 + vec2(uTime * 0.020, uTime * 0.014 + 1.9)) * 0.5 + 0.5, 0.0, 1.0);
    float warpedDist = dist * (0.85 + warpAng * 0.30); // ±15% — varia por ângulo e tempo

    // Envelope espacial sobre warpedDist — bordas orgânicas e irregulares
    float innerFade = smoothstep(0.0,  0.08, warpedDist);   // cola na silhueta do buraco negro (Ajuste 1)
    float outerFade = 1.0 - smoothstep(0.48, 1.0, warpedDist);

    float intensity = organic * innerFade * outerFade;

    // Roxo vivo próximo → violeta profundo distante
    vec3 color = mix(vec3(0.65, 0.12, 1.00), vec3(0.18, 0.04, 0.55), dist);

    pc_FragColor = vec4(color, intensity * uOpacity);
}
