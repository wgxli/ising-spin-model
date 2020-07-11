attribute vec2 a_position;

varying vec2 v_texCoord;

void main() {
    v_texCoord = (a_position + 1.0) / 2.0;
    gl_Position = vec4(a_position, 0, 1);
}
