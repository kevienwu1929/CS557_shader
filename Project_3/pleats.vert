#version 330 compatibility
out vec2 vST;
out vec3 Normal;
out vec3 Lvector;
out vec3 Evector;
out vec3 vMC;

uniform float uK, uP;
uniform float uLightX, uLightY, uLightZ;

const float M_PI = 	3.14159265;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void
main( )
{

    vST = gl_MultiTexCoord0.st;
   
    vec3 vert = gl_Vertex.xyz;

    vert.x = vert.x;
    vert.y = vert.y;
    vert.z = uK * (1 - vert.y) * sin( 2. * M_PI * vert.x / uP);

    float dzdx = uK * (1. - vert.y) * (2. * M_PI / uP) * cos(2. * M_PI * vert.x /uP);
    float dzdy = -uK * sin(2. * M_PI * vert.x / uP);

    vec3 Tx = vec3(1., 0., dzdx);
    vec3 Ty = vec3(0., 1., dzdy);

    Normal =  normalize(cross(Tx,Ty));
    
    vMC = vert;
    vec4 ECposition = gl_ModelViewMatrix * vec4(vert, 1.);
    Lvector = eyeLightPosition - ECposition.xyz; 
    Evector = vec3( 0., 0., 0. ) - ECposition.xyz;

    

    

    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.);

}