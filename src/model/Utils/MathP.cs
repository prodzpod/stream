

using Microsoft.Xna.Framework;
using System;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Utils
{
    public static class MathP
    {

        public static T Modp<T>(T n, T a) where T : System.Numerics.INumber<T> { return (n % a + a) % a; }
        public static int Div(double n, double a) { return (int)(n / a); }
        public static int Div(float n, float a) { return (int)(n / a); }
        public static T Demod<T>(T n, T a) where T : System.Numerics.INumber<T> { return n - n % a; }
        public static T Lerp<T>(T a, T b, T t) where T : System.Numerics.IFloatingPoint<T> { return a + (b - a) * t; }
        public static Vector2 Composite(this Vector2 x, Vector2 y, Func<float, float, float> fn) => new(fn(x.X, y.X), fn(x.Y, y.Y));
        public static Vector3 Composite(this Vector3 x, Vector3 y, Func<float, float, float> fn) => new(fn(x.X, y.X), fn(x.Y, y.Y), fn(x.Z, y.Z));
        public static Vector4 Composite(this Vector4 x, Vector4 y, Func<float, float, float> fn) => new(fn(x.X, y.X), fn(x.Y, y.Y), fn(x.Z, y.Z), fn(x.W, y.W));
        public static Vector2 Composite(this Vector2 x, Vector2 y, Vector2 z, Func<float, float, float, float> fn) => new(fn(x.X, y.X, z.X), fn(x.Y, y.Y, z.Y));
        public static Vector3 Composite(this Vector3 x, Vector3 y, Vector3 z, Func<float, float, float, float> fn) => new(fn(x.X, y.X, z.X), fn(x.Y, y.Y, z.Y), fn(x.Z, y.Z, z.Z));
        public static Vector4 Composite(this Vector4 x, Vector4 y, Vector4 z, Func<float, float, float, float> fn) => new(fn(x.X, y.X, z.X), fn(x.Y, y.Y, z.Y), fn(x.Z, y.Z, z.Z), fn(x.W, y.W, z.W));
        public static Vector2 Lerp(Vector2 a, Vector2 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static float Unlerp(Vector2 p, Vector2 a, Vector2 b)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            return 0.5f;
        }
        public static float Unlerp(Vector3 p, Vector3 a, Vector3 b)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            if (a.Z != b.Z) return (p.Z - a.Z) / (b.Z - a.Z);
            return 0.5f;
        }
        public static float Unlerp(Vector4 p, Vector4 a, Vector4 b)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            if (a.Z != b.Z) return (p.Z - a.Z) / (b.Z - a.Z);
            if (a.W != b.W) return (p.W - a.W) / (b.W - a.W);
            return 0.5f;
        }
        public static Vector3 Lerp(Vector3 a, Vector3 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector4 Lerp(Vector4 a, Vector4 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector2 Clamp(Vector2 v, Vector2 min, Vector2 max) => v.Composite(min, max, Math.Clamp);
        public static Vector3 Clamp(Vector3 v, Vector3 min, Vector3 max) => v.Composite(min, max, Math.Clamp);
        public static Vector4 Clamp(Vector4 v, Vector4 min, Vector4 max) => v.Composite(min, max, Math.Clamp);
        public static bool Between<T>(T a, T b, T c) where T : IComparable<T> { return a.CompareTo(b) <= 0 && b.CompareTo(c) <= 0 || a.CompareTo(b) >= 0 && b.CompareTo(c) >= 0; }
        public static float Sidedness(Vector2 p, Vector2 a, Vector2 b) => (b.X - a.X) * (p.Y - a.Y) - (p.X - a.X) * (b.Y - a.Y);
        public static float Cross(Vector2 a, Vector2 b) => (a.X * b.Y) - (a.Y * b.X);
        public static Vector3 Cross(Vector3 a, Vector3 b) => new((a.Y * b.Z) - (a.Z * b.Y), (a.Z * b.X) - (a.X * b.Z), (a.X * b.Y) - (a.Y * b.X));
        public static Vector2 XY(this Vector4 p) => new(p.X, p.Y);
        public static Vector2 ZW(this Vector4 p) => new(p.Z, p.W);
        public static Vector2 Flip(this Vector2 p) => new(p.X, -p.Y);
        public static Vector4 Compose(Vector2 a, Vector2 b) => new(a.X, a.Y, b.X, b.Y);
        public static Vector2 RotateAround(Vector2 a, float angle) => RotateAround(a, Vector2.Zero, angle);
        public static Vector2 RotateAround(Vector2 a, Vector2 b, float angle)
        {
            var q = a - b;
            var r = MathF.Sqrt((q.X * q.X) + (q.Y * q.Y));
            var t = MathF.Atan2(q.Y, q.X) + angle;
            var p = new Vector2(r * MathF.Cos(t), r * MathF.Sin(t));
            return p + b;
        }

        public static bool PositionInBoundingBox(Object.Object o, Vector2 position) => o.GetEdges().All(x => Sidedness(position, x[0], x[1]) >= 0);

        public static Vector2? LineIntersectsLine(Vector2 a, Vector2 b, Vector2 x, Vector2 y)
        {
            if (LinesAreOverlapping(a, b, x, y)) return Lerp(a, b, 0.5f);
            if (Cross(b - a, y - x) == 0) return null;
            var t = Cross(x - a, y - x) / Cross(b - a, y - x);
            var u = Cross(x - a, b - a) / Cross(b - a, y - x);
            if (Between(0, t, 1) && Between(0, u, 1)) return Lerp(a, b, t);
            return null;
        }

        public static bool LinesAreOverlapping(Vector2 a, Vector2 b, Vector2 x, Vector2 y)
        {
            if (Cross(b - a, y - x) != 0 || Cross(x - a, b - a) != 0) return false;
            var rr = Vector2.Dot(y - x, y - x);
            var t0 = Vector2.Dot(x - a, y - x) / rr;
            var t1 = t0 + Vector2.Dot(y - x, b - a) / rr;
            return Between(0, t0, 1) || Between(0, t1, 1) || (t0 < 0 && t1 > 1) || (t1 < 0 && t0 > 1);
        }

        public static Vector2? LineIntersectsBoundingBox(Object.Object o, Vector2 a, Vector2 b)
        {
            var e = o.GetEdges();
            var l = e.Select(x => LineIntersectsLine(x[0], x[1], a, b)).ToArray();
            var i = l.Select((_, z) => z).Where(z => l[z] != null).ToArray();
            if (i.Length == 0) return null;
            return l[i.MinBy(z => MathF.Abs(Unlerp((Vector2)l[z], e[z][0], e[z][1]) - 0.5f))];
        }
    }
}
