#version 330 compatibility

in vec3 vMCposition;
in vec3 Normal;
in vec3 Lvector;
in vec3 Evector;
in vec2 vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uAlpha;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform float Timer;

const vec3 RGB1 = vec3( 1., .1, 0. );
const vec3 RGB2 = vec3(0., 0., 0.);
const vec3 WHITE = vec3(1., 1., 1.);
const vec3 Ta   = vec3(.8,.8,.8);

void
main( )
{   
    float Ar = uAd / 2.;
    float Br = uBd / 2.;

    

    int numins = int(vST.s / uAd);
    int numint = int(vST.t / uBd);

    vec3 N = Normal;
    vec3 Light = normalize(Lvector);
	vec3 Eye = normalize(Evector);

    float dl = max( dot(N,Light), 0. );
    float s = 0.;
	if( dot(N,Light) > 0. )		
	{
		vec3 ref = normalize( 2. * N * dot(N,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}

    vec4 nv  = texture2D( Noise2, uNoiseFreq*vST*(11-Timer)*0.1 );
    float n = nv.r + nv.g + nv.b + nv.a;         //  1. -> 3.
    n = n - 2.;                                  // -1. -> 1.    
    n *= (uNoiseAmp * (11-Timer)) * 0.05 ;

    float sc = float(numins) * uAd  +  Ar;
    float ds = vST.s - sc;                        // wrt ellipse center
    float tc = float(numint) * uBd  +  Br;
    float dt = vST.t - tc;                        // wrt ellipse center

    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = oldDist + n;
    float scale = newDist / oldDist;             // this could be < 1., = 1., or > 1.    
    ds *= scale;                                 // scale by noise factor
    ds /= Ar;                                    // ellipse equation
    dt *= scale;                                 // scale by noise factor
    dt /= Br;                                    // ellipse equation

    float d = ds*ds + dt*dt;
    float et = smoothstep( 1.-uTol, 1.+uTol, d );
    
     vec3 Tb = vec3(uAlpha, uAlpha, uAlpha);
    vec4 color = mix(vec4(uKa * RGB2 + uKd * dl * RGB2 * n + uKs * s * WHITE, Ta), vec4(uKa * RGB1 + uKd * d * RGB1 + uKs * s * WHITE, Tb), et);

   
    if(color == vec4( 1., 1., 0., 0. )){
        discard;
       

    }

   gl_FragColor = color;
    

}