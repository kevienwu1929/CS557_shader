#version 330 compatibility

out vec3  vMCposition;
out vec3 Normal;
out vec3 Lvector;
out vec3 Evector;
out vec2  vST;

const float M_PI = 	3.14159265;

const vec3 LIGHTPOS   = vec3( 0., 0., 0. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;

	float dzdx = (2. * M_PI ) * cos(2. * M_PI * vMCposition.x);
    float dzdy = 0;

    vec3 Tx = vec3(1., 0., dzdx);
    vec3 Ty = vec3(0., 1., dzdy);

    Normal =  normalize(cross(Tx,Ty));

	
	vec4 ECposition = gl_ModelViewMatrix * vec4(vMCposition, 1.);
    Lvector = LIGHTPOS - ECposition.xyz; 
    Evector = vec3( 0., 0., 0. ) - ECposition.xyz;
	
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}