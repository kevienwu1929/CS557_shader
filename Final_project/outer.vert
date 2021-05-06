#version 330 compatibility

out vec3 vNormal;

uniform float Timer;

void
main( )
{

	
	
    vec3 vert  = gl_Vertex.xyz;
    vert.x = vert.x ;
    vert.y = vert.y ;
    vert.z = vert.z ;
    

    vNormal    = normalize( gl_NormalMatrix * gl_Normal );
	gl_Position = vec4(vert,1);
	
	
}