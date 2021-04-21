import fragmentShader from './build/frag.js';
import vertexShader from './build/vert.js';

let gl = null;


// Textures for current and next simulation state
let currentState = null;
let nextState = null;

let currAverage = null;
let nextAverage = null;

let framebuffer = null;
let program = null;

// Hyperparameters of simulation
let state = {
    coupling: 0.5,
    field: 0,
    temperature: 273,
    iteration: 0,
    pass: 0,
    random_seed: 0,
};

// Location of GLSL uniforms.
// Will be initialized based on state.
let uniforms = {};



// GLSL Initialization Functions
function createShader(type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {return shader;}

    // Log failure
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram() {
    let vert = createShader(gl.VERTEX_SHADER, vertexShader);
    let frag = createShader(gl.FRAGMENT_SHADER, fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {gl.useProgram(program);}

    // Log failure
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function createScreen() {
    // Initialize vertex position buffers
    let positionAttr = gl.getAttribLocation(program, 'a_position');
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

    // Create two triangles covering entire canvas
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
}

function createTexture() {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Initialize texture settings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    initializeTexture();
    return texture;
}

function createUniforms() {
    // Initialize float uniforms
    for (let [key, value] of Object.entries(state)) {
        uniforms[key] = gl.getUniformLocation(program, 'u_' + key);
        gl.uniform1f(uniforms[key], value);
    }

    // Initialize resolution uniform
    uniforms.resolution = gl.getUniformLocation(program, 'u_resolution');
}



// GLSL Update Functions
function initializeTexture() {
    // Initialize empty texture
    let data = []
    let [width, height] = [gl.canvas.width, gl.canvas.height];
    for (let i = 0; i < width * height * 4; i++) {
        data.push((Math.random() < 0.5) ? 0 : 255);
    }
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
    gl.uniform2f(uniforms.resolution, width, height);
}

function setState(name, value) {
    state[name] = value;
    gl.uniform1f(uniforms[name], value);
}





// Main initialization function
function start() {
    if (gl !== null) {return;}

    // Get WebGL context
    const canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl');

    // Initialize program
    createProgram();
    createScreen();

    nextState = createTexture();
    currentState = createTexture();

    currAverage = createTexture();
    nextAverage = createTexture();

    framebuffer = gl.createFramebuffer();


    createUniforms();

    // Register resize handler
    window.addEventListener('resize', onResize);
    onResize();

    render();
}

function onResize() {
    gl.bindTexture(gl.TEXTURE_2D, currentState);
    initializeTexture();
    gl.bindTexture(gl.TEXTURE_2D, nextState);
    initializeTexture();
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

let frame  = 0;
function render() {
    gl.bindTexture(gl.TEXTURE_2D, currentState);

    // Render to texture
    setState('pass', 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D, nextState, 0
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Render to screen
    setState('pass', 1);
    gl.bindTexture(gl.TEXTURE_2D, nextState);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap textures
    let temp = currentState;
    currentState = nextState;
    nextState = temp;

    // Compute averaging step
    if (frame % 5 === 0) {
        setState('pass', 3);
        gl.bindTexture(gl.TEXTURE_2D, currAverage);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, nextAverage, 0
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Swap textures
        temp = currAverage;
        currAverage = nextAverage;
        nextAverage = temp;
    }

    // Sometimes read current average,
    // and overwrite the average buffer
    if (frame % 20 === 0) {
        setState('pass', 2);

        let pixels = new Uint8Array(4 * 100);
        gl.bindTexture(gl.TEXTURE_2D, nextAverage);
        gl.readPixels(0, 0, 10, 10, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels);

        gl.bindTexture(gl.TEXTURE_2D, currentState);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, currAverage, 0
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Toggle iteration (odd/even)
    setState('iteration', 1 - state.iteration);
    setState('random_seed', Math.random());

    frame += 1;
    requestAnimationFrame(render);
}

// Timeout to fix iPhone bug
document.addEventListener('DOMContentLoaded', () => setTimeout(start, 100));

export {setState};
