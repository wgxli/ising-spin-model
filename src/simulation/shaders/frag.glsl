precision highp float;

uniform sampler2D u_spin;
uniform vec2 u_resolution;

uniform float u_coupling;
uniform float u_field;
uniform float u_temperature;

uniform float u_iteration;
uniform float u_random_seed;

varying vec2 v_texCoord;

const float C_BOLTZMANN = 4e-3;

float get_spin(float dx, float dy) {
    return 2.0 * texture2D(
        u_spin,
        v_texCoord + vec2(dx, dy) / u_resolution
    ).x - 1.0;
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float spin = get_spin(0.0, 0.0);
    float delta_h = 2.0 * spin * (u_coupling * (
        get_spin(1.0, 0.0)
        + get_spin(-1.0, 0.0)
        + get_spin(0.0, 1.0)
        + get_spin(0.0, -1.0)
    ) + u_field);
    float beta = 1.0 / (u_temperature * C_BOLTZMANN);
    float flip_probability = exp(-max(delta_h, 0.0) * beta);

    // Ensures we never flip two adjacent cells at once
    bool mask = mod(
        gl_FragCoord.x + gl_FragCoord.y + u_iteration, 2.0
    ) < 0.5;

    float new_spin = (spin + 1.0)/2.0;
    if (mask && (rand(
        v_texCoord + u_random_seed * vec2(1.0, 3.14159)
    ) < flip_probability)) {
        new_spin = 1.0 - new_spin;
    }
    gl_FragColor = vec4(new_spin, new_spin, new_spin, 1.0);
}
