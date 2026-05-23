precision highp float;
precision highp int;

layout(location = 0) out vec4 pc_FragColor;

uniform float uTime;
uniform float uOpacity;

in vec2 vUv;

void main()
{
    vec2 centered = vUv - vec2(0.5);
    float dist = length(centered) * 2.0; // 0 no centro, 1 na borda do círculo

    if(dist > 1.0) discard;

    // Duas ondas concêntricas com velocidades diferentes
    float wave1 = sin(dist * 7.0  - uTime * 0.45) * 0.5 + 0.5;
    float wave2 = sin(dist * 13.0 - uTime * 0.28 + 1.6) * 0.5 + 0.5;
    float intensity = wave1 * 0.6 + wave2 * 0.4;

    // Deixa o centro do buraco negro livre (sem névoa até dist=0.4)
    float innerFade = smoothstep(0.0, 0.40, dist);
    // Atenua nas bordas externas
    float outerFade = 1.0 - smoothstep(0.55, 1.0, dist);

    float alpha = intensity * innerFade * outerFade * uOpacity;

    // Roxo interno → azul profundo externo
    vec3 color = mix(vec3(0.50, 0.10, 0.90), vec3(0.10, 0.05, 0.50), dist);

    pc_FragColor = vec4(color, alpha);
}
