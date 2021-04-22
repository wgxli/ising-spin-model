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
        fract(v_texCoord + vec2(dx, dy) / u_resolution)
    ) - 1.0;
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float decode(vec4 v) {
    v *= 255.0;
    return (v.x + (v.y + (v.z + v.w/256.0)/256.0)/256.0)/256.0;
}

vec4 encode(float value) {
    vec4 encoded = vec4(0.0, 0.0, 0.0, 0.0);
    for (int i = 0; i < 4; i++) {
        value *= 255.999;
        float pixel = floor(value);
        value -= pixel;
        encoded[i] = pixel/255.0;
    }
    // To account for rounding bias
    encoded[3] += value/255.0;
    return encoded;
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

    // Render Passes
    // 0: Compute simulated spins for next frame
    // 1: Display average spin per cell (render to screen)
    // 2: Display average spin per cell (render to texture)
    // 3: Compute partial average (convolve with kernel)
    if (u_pass < 0.5) {
        // Compute new spins on pass 0, otherwise just display existing spins.
        vec4 delta_h = 2.0 * current * (u_coupling * adjacent_sum + u_field);
        float beta = 1.0 / (u_temperature * C_BOLTZMANN);
        vec4 flip_probability = exp(-max(delta_h, 0.0) * beta);


        vec2 noise = vec2(
            rand(v_texCoord + u_random_seed * vec2(3.14159, 0.0)),
            rand(v_texCoord + u_random_seed * vec2(0.0, 3.14159))
        );

        // Update only 'odd' checkerboard on odd iterations and vice-versa
        if (u_iteration > 0.5) {
            if (flip_probability.x > noise.x) {new.x = 1.0 - new.x;}
            if (flip_probability.w > noise.y) {new.w = 1.0 - new.w;}
        } else {
            if (flip_probability.y > noise.x) {new.y = 1.0 - new.y;}
            if (flip_probability.z > noise.y) {new.z = 1.0 - new.z;}
        }

        gl_FragColor = new;
        return;
    }

    float average = (new.x + new.y + new.z + new.w) / 4.0;
    if (u_pass < 1.5) {
        gl_FragColor = vec4(average, average, average, 1.0);
        return;
    }

    if (u_pass < 2.5) {
        gl_FragColor = encode(average);
        return;
    }

    vec4 k_average = vec4(0.0, 0.0, 0.0, 0.0);
    for (int i = 0; i < 100; i++) {
        float dx = rand(u_random_seed * vec2(float(i) * 3.14159, 0.0));
        float dy = rand(u_random_seed * vec2(0.0, float(i) * 3.14159));
        k_average += get_pixel(dx * u_resolution.x, dy * u_resolution.y);
    }
    k_average /= 200.0;
    k_average += 0.5;

    gl_FragColor = encode(decode(k_average));
}
