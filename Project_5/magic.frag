#version 330 compatibility

uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;

in vec2  vST;
uniform sampler2D  uImageUnit;


void
main()
{
    vec3 newcolor;
    //if( uSc - uDs / 2 < vST.s && vST.s < uSc + uDs / 2 && uTc - uDt / 2 < vST.t && vST.t < uTc + uDt / 2){
    if((vST.s - uSc) * (vST.s - uSc) + (vST.t - uTc) * (vST.t - uTc) <=  ((uDs+uDt) / 2) * ((uDs+uDt) / 2) ){
        ivec2 ires = textureSize( uImageUnit, 0 );
        float ResS = float( ires.s );
        float ResT = float( ires.t );

        float t_ST_s = vST.s - uSc;
        float t_ST_t = vST.t - uTc;

        float t2_ST_s = t_ST_s / uMagFactor; // magnified
        float t2_ST_t = t_ST_t / uMagFactor; // magnified

        float t3_ST_s = t2_ST_s * cos(uRotAngle) - t2_ST_t * sin(uRotAngle); //rotated
        float t3_ST_t = t2_ST_s * sin(uRotAngle) + t2_ST_t * cos(uRotAngle); //rotated

        vec2 new_vST = vec2(t3_ST_s + uSc, t3_ST_t + uTc);

        vec2 stp0   =   vec2(1./ResS,    0.      );
        vec2 st0p   =   vec2(0.      ,        1./ResT);
        vec2 stpp   =   vec2(1./ResS,    1./ResT);
        vec2 stpm   =   vec2(1./ResS,  -1./ResT);

        vec3 i00    =   texture2D(    uImageUnit, new_vST ).rgb;
        vec3 im1m1  =   texture2D(    uImageUnit, new_vST - stpp ).rgb;
        vec3 ip1p1  =   texture2D(    uImageUnit, new_vST + stpp ).rgb;
        vec3 im1p1  =   texture2D(    uImageUnit, new_vST - stpm ).rgb;
        vec3 ip1m1  =   texture2D(    uImageUnit, new_vST + stpm ).rgb;
        vec3 im10   =   texture2D(    uImageUnit, new_vST - stp0 ).rgb;
        vec3 ip10   =   texture2D(    uImageUnit, new_vST + stp0 ).rgb;
        vec3 i0m1   =   texture2D(    uImageUnit, new_vST - st0p ).rgb;
        vec3 i0p1   =   texture2D(    uImageUnit, new_vST + st0p ).rgb;
        
        vec3 target = vec3(0.,0.,0.);
        target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
        target += 2.*(im10+ip10+i0m1+i0p1);
        target += 4.*(i00);
        target /= 16.;

        newcolor = vec3( mix( target, texture2D( uImageUnit, new_vST ).rgb, uSharpFactor ) );


    }else{
        newcolor = texture( uImageUnit, vST ).rgb;
        
    }
    
    gl_FragColor = vec4( newcolor, 1. );
}