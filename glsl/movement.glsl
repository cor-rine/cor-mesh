uniform vec2 mouse_position;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    float distance = length(gl_Position.xy-mouse_position);
    gl_Position.x += mouse_position.x / distance * 100.0;
    gl_Position.y -= mouse_position.y / distance * 100.0;

}