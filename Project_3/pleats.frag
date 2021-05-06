#version 330 compatibility

in vec2 vST;
in vec3 Normal;
in vec3 Lvector;
in vec3 Evector;
in vec3 vMC;


uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float uLightX, uLightY, uLightZ;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform sampler3D Noise3;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main()
{

    
    

   vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

    vec3 n = RotateNormal(angx, angy, Normal);
    vec3 Light = normalize(Lvector);
	vec3 Eye = normalize(Evector);

    vec4 ambient = uKa * uColor;

	float d = max( dot(n,Light), 0. );
	vec4 diffuse = uKd * d * uColor;

	float s = 0.;
	if( dot(n,Light) > 0. )		
	{
		vec3 ref = normalize( 2. * n * dot(n,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 specular = uKs * s * uSpecularColor;

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
}


