#version 330 compatibility

uniform float uK, uP;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;

const float M_PI = 3.14159265;
const float Y0 = 1.;

void
main( )
{    
       vMC = gl_Vertex.xyz;
       vec4 newVertex = gl_Vertex;
       newVertex.z = uK * (1 - vMC.y) * sin( 2. * M_PI * vMC.x / uP);

       vec4 ECposition = gl_ModelViewMatrix * newVertex;

        float dzdx = uK * (1. - vMC.y) * (2. * M_PI / uP) * cos(2. * M_PI * vMC.x /uP);
        vec3 xtangent = vec3( 1., 0., dzdx );

        float dzdy = -uK * sin(2. * M_PI * vMC.x / uP);
        vec3 ytangent = vec3( 0., 1., dzdy );

        vNs = normalize(  cross( xtangent, ytangent )  );
        vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point

        gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}