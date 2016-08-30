uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st.x *= u_resolution.x/u_resolution.y;
	st += vec2(0.180,0.190);

	vec3 top = vec3(0.356,1.000,0.524);
	vec3 bottom = vec3(0.853,1.000,0.432);
	vec3 color = vec3(0.329,1.000,0.776);

	color = mix(top, bottom, smoothstep(-0.540,1.080,st.x));

	gl_FragColor = vec4(color,1.0);
}