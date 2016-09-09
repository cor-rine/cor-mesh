uniform vec2 mouse_position;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // float distance = length(gl_Position.xy-mouse_position);

    // gl_Position.x += mouse_position.x * 0.1 - distance * 0.5;
    // gl_Position.y -= mouse_position.y * 0.1 - distance * 0.1;
    // gl_Position.x += mouse_position.x / distance * 10.0;
    // gl_Position.y -= mouse_position.y / distance * 10.0;
}