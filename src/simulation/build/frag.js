export default `
precision highp float;

uniform sampler2D u_spin;
uniform vec2 u_resolution;

uniform float u_coupling;
uniform float u_field;
uniform float u_temperature;

uniform float u_pass;
uniform float u_iteration;
uniform float u_random_seed;

varying vec2 v_texCoord;

const float C_BOLTZMANN = 4e-3;

vec4 get_pixel(float dx, float dy) {
    return 2.0 * texture2D(
        u_spin,
        v_texCoord + vec2(dx, dy) / u_resolution
    ) - 1.0;
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 current = get_pixel(0.0, 0.0);
    vec4 new = (current + 1.0)/2.0;

    // We cram a 2x2 block of binary spin states into each pixel:
    // R G
    // B A
    vec4 top = get_pixel(0.0, 1.0);
    vec4 bottom = get_pixel(0.0, -1.0);
    vec4 left = get_pixel(-1.0, 0.0);
    vec4 right = get_pixel(1.0, 0.0);

    // Sum of four adjacent spin vectors for each 'subpixel'
    vec4 adjacent_sum = vec4(
        current.y + current.z + top.z + left.y,
        current.x + current.w + top.w + right.x,
        current.x + current.w + left.w + bottom.x,
        current.y + current.z + right.z + bottom.y
    );

    // Render to texture on pass zero, otherwise render to screen.
    if (u_pass < 0.5) {
        // Compute new spins on pass 0, otherwise just display existing spins.
        vec4 delta_h = 2.0 * current * (u_coupling * adjacent_sum + u_field);
        float beta = 1.0 / (u_temperature * C_BOLTZMANN);
        vec4 flip_probability = exp(-max(delta_h, 0.0) * beta);

        // Update only 'odd' checkerboard on odd iterations and vice-versa
        vec2 noise = vec2(
            rand(v_texCoord + u_random_seed * vec2(3.14159, 0.0)),
            rand(v_texCoord + u_random_seed * vec2(0.0, 3.14159))
        );
        if (u_iteration > 0.5) {
            if (flip_probability.x > noise.x) {new.x = 1.0 - new.x;}
            if (flip_probability.w > noise.y) {new.w = 1.0 - new.w;}
        } else {
            if (flip_probability.y > noise.x) {new.y = 1.0 - new.y;}
            if (flip_probability.z > noise.y) {new.z = 1.0 - new.z;}
        }

        gl_FragColor = new;
    } else {
        float average = (new.x + new.y + new.z + new.w) / 4.0;
        gl_FragColor = vec4(average, average, average, 1.0);
    }
}
`;
