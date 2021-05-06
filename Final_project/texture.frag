#version 330 compatibility

in vec2  vST;
uniform sampler2D  uTexUnit;

void
main( )
{
	vec4 newcolor = texture( uTexUnit, vST );
	gl_FragColor = vec4( newcolor.rgb, 1. );
	
	
}
