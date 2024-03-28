uniform texture2d image_a;
uniform texture2d image_b;
uniform float transition_time = 0.5;
uniform bool convert_linear = true;

uniform float pixel_width = 160;

float rand_1_05(float2 uv)
{
    float2 noise = (frac(sin(dot(uv, float2(12.9898,78.233)*2.0)) * 43758.5453));
    return abs(noise.x + noise.y) * 0.5;
}

float4 mainImage(VertData v_in) : TARGET
{
	float4 a_val = image_a.Sample(textureSampler, v_in.uv);
	float4 b_val = image_b.Sample(textureSampler, v_in.uv);
	float2 pxl = floor((v_in.uv - float2(0.5, 0.5)) * float2(1920, 1080) / pixel_width) * pixel_width / float2(1920, 1080) + float2(0.5, 0.5);
	float k = 0;
	if (transition_time < 0.5) k = clamp((pxl.x + pxl.y) / 2 - 1 + (transition_time), 0, 1) / 2;
	else k = 0.5 + (clamp((pxl.x + pxl.y) / 2 + (transition_time * 2 - 1), 0, 1) / 2);
	float4 rgba = lerp(a_val, b_val, step(rand_1_05(float2(k, floor(transition_time * 10) / 10)), k));
	if (convert_linear) rgba.rgb = srgb_nonlinear_to_linear(rgba.rgb);
	return rgba;
}