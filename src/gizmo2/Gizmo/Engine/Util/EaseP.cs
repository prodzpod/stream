using Gizmo.Engine.Data;

namespace Gizmo.Engine.Util
{
    public static class EaseP
    {
        public static float Pow(float a, float b, float t, float exponent) => (b - a) * MathF.Pow(t, exponent) + a;
        // public static Func<float, float, float, float> In(Func<float, float, float, float> fn) => fn;
        public static Func<float, float, float, float> Out(Func<float, float, float, float> fn) => (a, b, t) => fn(b, a, 1 - t);
        public static Func<float, float, float, float> InOut(Func<float, float, float, float> fn) => (a, b, t) =>
        {
            float m = (a + b) / 2;
            if (t <= 0.5f) return fn(a, m, t * 2); // in
            else return fn(b, m, t * 2 - 1); // out
        };
        public static Func<float, float, float, float> OutIn(Func<float, float, float, float> fn) => (a, b, t) =>
        {
            float m = (a + b) / 2;
            if (t <= 0.5f) return fn(m, a, 1 - t * 2); // out
            else return fn(m, b, 2 - t * 2); // in
        };
        public static Func<float, float, float, float> InPow(float exponent) => (a, b, t) => Pow(a, b, t, exponent);
        public static Func<float, float, float, float> OutPow(float exponent) => Out((a, b, t) => Pow(a, b, t, exponent));
        public static Func<float, float, float, float> InOutPow(float exponent) => InOut((a, b, t) => Pow(a, b, t, exponent));
        public static Func<float, float, float, float> OutInPow(float exponent) => OutIn((a, b, t) => Pow(a, b, t, exponent));
        public static Func<float, float, float, float> Linear() => MathP.Lerp;
        public static Func<float, float, float, float> InSine() => (a, b, t) => (a - b) * MathP.Cos(t * 90) + b;
        public static Func<float, float, float, float> OutSine() => Out((a, b, t) => InSine()(a, b, t));
        public static Func<float, float, float, float> InOutSine() => InOut((a, b, t) => InSine()(a, b, t));
        public static Func<float, float, float, float> OutInSine() => OutIn((a, b, t) => InSine()(a, b, t));
        public static Func<float, float, float, float> InQuad() => InPow(2);
        public static Func<float, float, float, float> OutQuad() => OutPow(2);
        public static Func<float, float, float, float> InOutQuad() => InOutPow(2);
        public static Func<float, float, float, float> OutInQuad() => OutInPow(2);
        public static Func<float, float, float, float> InCubic() => InPow(3);
        public static Func<float, float, float, float> OutCubic() => OutPow(3);
        public static Func<float, float, float, float> InOutCubic() => InOutPow(3);
        public static Func<float, float, float, float> OutInCubic() => OutInPow(3);
        public static Func<float, float, float, float> InQuart() => InPow(4);
        public static Func<float, float, float, float> OutQuart() => OutPow(4);
        public static Func<float, float, float, float> InOutQuart() => InOutPow(4);
        public static Func<float, float, float, float> OutInQuart() => OutInPow(4);
        public static Func<float, float, float, float> InQuint() => InPow(5);
        public static Func<float, float, float, float> OutQuint() => OutPow(5);
        public static Func<float, float, float, float> InOutQuint() => InOutPow(5);
        public static Func<float, float, float, float> OutInQuint() => OutInPow(5);
        public static Func<float, float, float, float> InExpo() => (a, b, t) => (b - a) * MathF.Pow(2, 10 * (t - 1)) + a;
        public static Func<float, float, float, float> OutExpo() => Out((a, b, t) => InExpo()(a, b, t));
        public static Func<float, float, float, float> InOutExpo() => InOut((a, b, t) => InExpo()(a, b, t));
        public static Func<float, float, float, float> OutInExpo() => OutIn((a, b, t) => InExpo()(a, b, t));
        public static Func<float, float, float, float> InCirc() => (a, b, t) => (a - b) * (MathF.Sqrt(1 - t * t) - 1) + a;
        public static Func<float, float, float, float> OutCirc() => Out((a, b, t) => InCirc()(a, b, t));
        public static Func<float, float, float, float> InOutCirc() => InOut((a, b, t) => InCirc()(a, b, t));
        public static Func<float, float, float, float> OutInCirc() => OutIn((a, b, t) => InCirc()(a, b, t));
        public static Func<float, float, float, float> InBounce() => (a, b, t) => {
            float x = 1 - t, z = 0;
            if (t < (0.25f / 2.75f)) { x = 0.125f / 2.75f - t; z = .984375f; }
            else if (t < (0.75f / 2.75f)) { x = 0.5f / 2.75f - t; z = .9375f; }
            else if (t < (1.75f / 2.75f)) { x = 1.25f / 2.75f - t; z = .75f; }
            return (a - b) * (7.5625f * x * x + z) + a;
        };
        public static Func<float, float, float, float> OutBounce() => Out((a, b, t) => InBounce()(a, b, t));
        public static Func<float, float, float, float> InOutBounce() => InOut((a, b, t) => InBounce()(a, b, t));
        public static Func<float, float, float, float> OutInBounce() => OutIn((a, b, t) => InBounce()(a, b, t));
        public static Func<float, float, float, float> InBack() => (a, b, t) => (b - a) * (t * t * (2.70158f * t + 1.70158f)) + a;
        public static Func<float, float, float, float> OutBack() => Out((a, b, t) => InBack()(a, b, t));
        public static Func<float, float, float, float> InOutBack() => InOut((a, b, t) => InBack()(a, b, t));
        public static Func<float, float, float, float> OutInBack() => OutIn((a, b, t) => InBack()(a, b, t));
        public static Func<float, float, float, float> InElastic() => (a, b, t) =>
        {
            if (t <= 0) return a; if (t >= 1) return b;
            return (a - b) * MathF.Pow(2, 10 * (t - 1)) * MathP.Sin((t - 1.075f) * 360 / .3f) + a;
        };
        public static Func<float, float, float, float> OutElastic() => Out((a, b, t) => InElastic()(a, b, t));
        public static Func<float, float, float, float> InOutElastic() => InOut((a, b, t) => InElastic()(a, b, t));
        public static Func<float, float, float, float> OutInElastic() => OutIn((a, b, t) => InElastic()(a, b, t));
        public static Func<float, float, float, float> Hold(float threshold = 1) => (a, b, t) => t >= threshold ? b : a;
        public static Func<float, float, float, float> Step(float step)
        {
            if (step <= 0) return MathP.Lerp;
            return (a, b, t) => MathP.Lerp(a, b, (int)((t / step) + 0.5f) * step);
        }
        public static Func<float, float, float, float> Stair(Func<float, float, float, float> fn, float step)
        {
            if (step <= 0) return fn;
            return (a, b, t) =>
            {
                float t0 = (int)(t / step) * step;
                float a0 = MathP.Lerp(a, b, t0);
                float b0 = MathP.Lerp(a, b, t0 + step);
                return fn(a0, b0, (t - t0) / step);
            };
        }
        public static Func<float, float, float, float> Pulse(Func<float, float, float, float> fn, float step)
        {
            if (step <= 0) return fn;
            return (a, b, t) => fn(a, b, t % step / step);
        }
        public static Func<float, float, float, float> PulseAlternate(Func<float, float, float, float> fn, float step)
        {
            if (step <= 0) return fn;
            return (a, b, t) => {
                float t0 = t % step / step;
                return fn(a, b, t % (step * 2) < step ? t0 : 1 - t0);
            };
        }
        public static Func<float, float, float, float> Flicker() => (a, b, t) => RandomP.Chance(t, false) ? b : a;
        public static Func<float, float, float, float> InFlicker() => (a, b, t) => RandomP.Chance(t, false) ? MathP.Lerp(a, b, t) : a;
        public static Func<float, float, float, float> OutFlicker() => (a, b, t) => RandomP.Chance(t, false) ? b : MathP.Lerp(a, b, t);
        public static Func<float, float, float, float> InOutFlicker() => (a, b, t) => t < 0.5 ? InFlicker()(a, b, t) : OutFlicker()(a, b, t);
        public static Func<float, float, float, float> OutInFlicker() => (a, b, t) => t < 0.5 ? OutFlicker()(a, b, t) : InFlicker()(a, b, t);
    }
}
