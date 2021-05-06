#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable
layout( triangles )  in;
layout( points, max_vertices=200 )  out;

uniform int  uLevel;
uniform float uGravity;
uniform float Timer;
uniform float uVelScale;

in vec3		vNormal[3];
out float	gLightIntensity;

vec3    V0, V01, V02;
vec3    N0, N01, N02;
vec3    CG;
void
ProduceVertex( float s, float t )
{
    vec3 lightPos = vec3( 0. , 0. , 0. );
    vec3 n = normalize(N0 + s*N01 + t*N02);	// interpolate the normal from s and t
	vec3 tnorm = normalize( gl_NormalMatrix * n );	// transformed normal

    vec3 v = V0 + s*V01 + t*V02;
    vec3 vel = uVelScale * ( v - CG );
    v = CG + vel*(1+Timer)*10 + 0.5*vec3(0.,uGravity,0.)*(1+Timer)*(1+Timer)*5;

    vec4 ECposition = gl_ModelViewMatrix * vec4( v, 1. );

    gLightIntensity  = abs(   dot( normalize(lightPos - ECposition.xyz), tnorm )   );
    gl_Position = gl_ModelViewProjectionMatrix * vec4( v, 1. );
    EmitVertex( );
}

void
main( ){
    V01 = ( gl_PositionIn[1] -gl_PositionIn[0] ).xyz;
    V02 = ( gl_PositionIn[2] -gl_PositionIn[0] ).xyz;
    V0  =   gl_PositionIn[0].xyz;
    CG = ( gl_PositionIn[0].xyz + gl_PositionIn[1].xyz + gl_PositionIn[2].xyz ) / 3.;

    N01 = vNormal[1] -vNormal[0];
    N02 = vNormal[2] -vNormal[0];
    N0  =   vNormal[0];

    int numLayers = 1 << uLevel;
    float dt = 1. / float( numLayers );
    float t = 1.;
    
    for( int it = 0; it <= numLayers; it++ )
    {
        float smax = 1. - t;
        int nums = it + 1;
        float ds = smax / float( nums - 1 );
        float s = 0.;
        
        for( int is = 0; is < nums; is++ )
        {
            ProduceVertex( s, t );s += ds;
        }
    t -= dt;
    }
}