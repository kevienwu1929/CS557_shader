#version 330 compatibility


in float            gLightIntensity;

void
main( )
{
	vec4 newcolor = vec4(1,1,0,1);
	gl_FragColor = vec4( gLightIntensity* newcolor.rgb, 1. );
	
	
}