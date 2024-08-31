using Gizmo.Engine.Util;
using System;
using System.ComponentModel.DataAnnotations;
using System.Numerics;
using System.Runtime.InteropServices;

namespace Gizmo.Engine.Data
{
    public static class MathP
    {
        #region basics
        public static float PI => MathF.PI;
        public static float E => MathF.E;
        public static int Floor(float n) => (int)Math.Floor(n);
        public static int Floor(double n) => (int)Math.Floor(n);
        public static int Floor(decimal n) => (int)Math.Floor(n);
        public static Vector2 Floor(Vector2 n) => CollectionP.Map(n, x => Floor(x));
        public static Vector3 Floor(Vector3 n) => CollectionP.Map(n, x => Floor(x));
        public static Vector4 Floor(Vector4 n) => CollectionP.Map(n, x => Floor(x));
        public static int Ceiling(float n) => (int)Math.Ceiling(n);
        public static int Ceiling(double n) => (int)Math.Ceiling(n);
        public static int Ceiling(decimal n) => (int)Math.Ceiling(n);
        public static Vector2 Ceiling(Vector2 n) => CollectionP.Map(n, x => Ceiling(x));
        public static Vector3 Ceiling(Vector3 n) => CollectionP.Map(n, x => Ceiling(x));
        public static Vector4 Ceiling(Vector4 n) => CollectionP.Map(n, x => Ceiling(x));
        public static int Round(float n) => (int)Math.Round(n);
        public static int Round(double n) => (int)Math.Round(n);
        public static int Round(decimal n) => (int)Math.Round(n);
        public static Vector2 Round(Vector2 n) => CollectionP.Map(n, x => Round(x));
        public static Vector3 Round(Vector3 n) => CollectionP.Map(n, x => Round(x));
        public static Vector4 Round(Vector4 n) => CollectionP.Map(n, x => Round(x));
        public static T? Abs<T>(T n) where T : INumber<T> { if (n.CompareTo(T.Zero) < 0) return -n; return n; }
        public static Vector2 Abs(Vector2 n) => CollectionP.Map(n, Abs);
        public static Vector3 Abs(Vector3 n) => CollectionP.Map(n, Abs);
        public static Vector4 Abs(Vector4 n) => CollectionP.Map(n, Abs);
        public static T? Min<T>(params T[] n) where T : INumber<T> => n.Min();
        public static float Min(Vector2 n) => Min(n.X, n.Y);
        public static float Min(Vector3 n) => Min(n.X, n.Y, n.Z);
        public static float Min(Vector4 n) => Min(n.X, n.Y, n.Z, n.W);
        public static Vector2 Min(IEnumerable<Vector2> n) => n.MinBy(x => x.Magnitude());
        public static Vector3 Min(IEnumerable<Vector3> n) => n.MinBy(x => x.Magnitude());
        public static Vector4 Min(IEnumerable<Vector4> n) => n.MinBy(x => x.Magnitude());
        public static Vector2 Min(Vector2 one, params Vector2[] n) => Min([one, .. n]);
        public static Vector3 Min(Vector3 one, params Vector3[] n) => Min([one, .. n]);
        public static Vector4 Min(Vector4 one, params Vector4[] n) => Min([one, .. n]);
        public static T? Max<T>(params T[] n) where T : INumber<T> => n.Max();
        public static float Max(Vector2 n) => Max(n.X, n.Y);
        public static float Max(Vector3 n) => Max(n.X, n.Y, n.Z);
        public static float Max(Vector4 n) => Max(n.X, n.Y, n.Z, n.W);
        public static Vector2 Max(IEnumerable<Vector2> n) => n.MaxBy(x => x.Magnitude());
        public static Vector3 Max(IEnumerable<Vector3> n) => n.MaxBy(x => x.Magnitude());
        public static Vector4 Max(IEnumerable<Vector4> n) => n.MaxBy(x => x.Magnitude());
        public static Vector2 Max(Vector2 one, params Vector2[] n) => Max([one, .. n]);
        public static Vector3 Max(Vector3 one, params Vector3[] n) => Max([one, .. n]);
        public static Vector4 Max(Vector4 one, params Vector4[] n) => Max([one, .. n]);
        public static int Div(double n, double a) => (int)(n / a);
        public static int Div(float n, float a) => (int)(n / a);
        public static T PosMod<T>(T n, T a) where T : INumber<T> => (n % a + a) % a;
        public static T Demod<T>(T n, T a) where T : INumber<T> => n - n % a;
        public static T Sqr<T>(T n) where T : INumber<T> => n * n;
        public static T Sign<T>(T n) where T : INumber<T> => T.IsZero(n) ? T.Zero : (T.IsPositive(n) ? T.One : -T.One);
        public static float Sqrt(float a) => MathF.Sqrt(a);
        public static double Sqrt(double a) => Math.Sqrt(a);
        public static decimal Sqrt(decimal a) => (decimal)Math.Sqrt((double)a);
        public static float Pow(float n, float a) => MathF.Pow(n, a);
        public static double Pow(double n, double a) => Math.Pow(n, a);
        public static decimal Pow(decimal n, decimal a) => (decimal)Math.Pow((double)n, (double)a);
        public static float Log(float a) => Log(a, E);
        public static float Log(float a, float b) => MathF.Log(a) / MathF.Log(b);
        public static double Log(double a) => Log(a, Math.E);
        public static double Log(double a, double b) => Math.Log(a) / Math.Log(b);
        public static decimal Log(decimal a) => Log(a, (decimal)Math.E);
        public static decimal Log(decimal a, decimal b) => (decimal)Math.Log((double)a) / (decimal)Math.Log((double)b);
        public static T Hypot<T>(T a, T b) where T : INumber<T> => a * a + b * b;
        public static float Hypot(Vector2 a) => Hypot(a.X, a.Y);
        public static float Hypot(Vector2 a, Vector2 b) => Hypot(b - a);
        public static float Dist(float a, float b) => Sqrt(Hypot(a, b));
        public static double Dist(double a, double b) => Sqrt(Hypot(a, b));
        public static decimal Dist(decimal a, decimal b) => Sqrt(Hypot(a, b));
        public static float Dist(Vector2 a) => Dist(a.X, a.Y);
        public static float Dist(Vector2 a, Vector2 b) => Dist(b - a);
        public static T Lerp<T>(T a, T b, T t) where T : IFloatingPoint<T> => a + (b - a) * t;
        public static Vector2 Lerp(Vector2 a, Vector2 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector3 Lerp(Vector3 a, Vector3 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector4 Lerp(Vector4 a, Vector4 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector2 Lerp(Vector2 a, Vector2 b, Vector2 t) => a.Composite(b, t, (x, y, z) => Lerp(x, y, z));
        public static Vector3 Lerp(Vector3 a, Vector3 b, Vector3 t) => a.Composite(b, t, (x, y, z) => Lerp(x, y, z));
        public static Vector4 Lerp(Vector4 a, Vector4 b, Vector4 t) => a.Composite(b, t, (x, y, z) => Lerp(x, y, z));
        public static float SExp(float a, float t, float deltaTime) => a == 0 ? 0 : SLerp(a, 0, a * t / a, deltaTime);
        public static double SExp(double a, double t, float deltaTime) => a == 0 ? 0 : SLerp(a, 0, a * t / a, deltaTime);
        public static decimal SExp(decimal a, decimal t, float deltaTime) => a == 0 ? 0 : SLerp(a, 0, a * t / a, deltaTime);
        public static Vector2 SExp(Vector2 a, float t, float deltaTime) => a.Map(x => SExp(x, t, deltaTime));
        public static Vector3 SExp(Vector3 a, float t, float deltaTime) => a.Map(x => SExp(x, t, deltaTime));
        public static Vector4 SExp(Vector4 a, float t, float deltaTime) => a.Map(x => SExp(x, t, deltaTime));
        public static Vector2 SExp(Vector2 a, Vector2 t, float deltaTime) => a.Composite(t, (x, z) => SExp(x, z, deltaTime));
        public static Vector3 SExp(Vector3 a, Vector3 t, float deltaTime) => a.Composite(t, (x, z) => SExp(x, z, deltaTime));
        public static Vector4 SExp(Vector4 a, Vector4 t, float deltaTime) => a.Composite(t, (x, z) => SExp(x, z, deltaTime));
        public static float SLerp(float a, float b, float r, float deltaTime) => Lerp(a, b, 1 - Pow(r, deltaTime));
        public static double SLerp(double a, double b, double r, float deltaTime) => Lerp(a, b, 1 - Pow(r, deltaTime));
        public static decimal SLerp(decimal a, decimal b, decimal r, float deltaTime) => Lerp(a, b, 1 - Pow(r, (decimal)deltaTime));
        public static Vector2 SLerp(Vector2 a, Vector2 b, float t, float deltaTime) => a.Composite(b, (x, y) => SLerp(x, y, t, deltaTime));
        public static Vector3 SLerp(Vector3 a, Vector3 b, float t, float deltaTime) => a.Composite(b, (x, y) => SLerp(x, y, t, deltaTime));
        public static Vector4 SLerp(Vector4 a, Vector4 b, float t, float deltaTime) => a.Composite(b, (x, y) => SLerp(x, y, t, deltaTime));
        public static Vector2 SLerp(Vector2 a, Vector2 b, Vector2 t, float deltaTime) => a.Composite(b, t, (x, y, z) => SLerp(x, y, z, deltaTime));
        public static Vector3 SLerp(Vector3 a, Vector3 b, Vector3 t, float deltaTime) => a.Composite(b, t, (x, y, z) => SLerp(x, y, z, deltaTime));
        public static Vector4 SLerp(Vector4 a, Vector4 b, Vector4 t, float deltaTime) => a.Composite(b, t, (x, y, z) => SLerp(x, y, z, deltaTime));
        public static float Unlerp(Vector2 a, Vector2 b, Vector2 p)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            return .5f;
        }
        public static float Unlerp(Vector3 a, Vector3 b, Vector3 p)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            if (a.Z != b.Z) return (p.Z - a.Z) / (b.Z - a.Z);
            return .5f;
        }
        public static float Unlerp(Vector4 a, Vector4 b, Vector4 p)
        {
            if (a.X != b.X) return (p.X - a.X) / (b.X - a.X);
            if (a.Y != b.Y) return (p.Y - a.Y) / (b.Y - a.Y);
            if (a.Z != b.Z) return (p.Z - a.Z) / (b.Z - a.Z);
            if (a.W != b.W) return (p.W - a.W) / (b.W - a.W);
            return .5f;
        }
        public static T Clamp<T>(T v, T min, T max) where T : INumber<T> => Min(Max(v, min), max);
        public static Vector2 Clamp(Vector2 v, float min, float max) => v.Map(x => Math.Clamp(x, min, max));
        public static Vector3 Clamp(Vector3 v, float min, float max) => v.Map(x => Math.Clamp(x, min, max));
        public static Vector4 Clamp(Vector4 v, float min, float max) => v.Map(x => Math.Clamp(x, min, max));
        public static Vector2 Clamp(Vector2 v, Vector2 min, Vector2 max) => v.Composite(min, max, Math.Clamp);
        public static Vector3 Clamp(Vector3 v, Vector3 min, Vector3 max) => v.Composite(min, max, Math.Clamp);
        public static Vector4 Clamp(Vector4 v, Vector4 min, Vector4 max) => v.Composite(min, max, Math.Clamp);
        public static bool Between<T>(T a, T b, T c) where T : IComparable<T> { return a.CompareTo(b) <= 0 && b.CompareTo(c) <= 0 || a.CompareTo(b) >= 0 && b.CompareTo(c) >= 0; }
        public static bool Between(Vector2 a, Vector2 b, Vector2 c) { return Between(a.X, b.X, c.X) && Between(a.Y, b.Y, c.Y); }
        public static bool Between(Vector3 a, Vector3 b, Vector3 c) { return Between(a.X, b.X, c.X) && Between(a.Y, b.Y, c.Y) && Between(a.Z, b.Z, c.Z); }
        public static bool Between(Vector4 a, Vector4 b, Vector4 c) { return Between(a.X, b.X, c.X) && Between(a.Y, b.Y, c.Y) && Between(a.Z, b.Z, c.Z) && Between(a.W, b.W, c.W); }
        public static float Dot(Vector2 a, Vector2 b) => (a.X * b.X) + (a.Y * b.Y);
        public static float Dot(Vector3 a, Vector3 b) => (a.X * b.X) + (a.Y * b.Y) + (a.Z * b.Z);
        public static float Dot(Vector4 a, Vector4 b) => (a.X * b.X) + (a.Y * b.Y) + (a.Z * b.Z) + (a.W * b.W);
        public static float Cross(Vector2 a, Vector2 b) => (a.X * b.Y) - (a.Y * b.X);
        public static Vector3 Cross(Vector3 a, Vector3 b) => new((a.Y * b.Z) - (a.Z * b.Y), (a.Z * b.X) - (a.X * b.Z), (a.X * b.Y) - (a.Y * b.X));
        public static T? Sum<T>(params T[] n) where T : INumber<T> => n.Length == 0 ? T.Zero : n.Aggregate((a, b) => a + b);
        public static float Sum(this Vector2 n) => n.X + n.Y;
        public static float Sum(this Vector3 n) => n.X + n.Y + n.Z;
        public static float Sum(this Vector4 n) => n.X + n.Y + n.Z + n.W;
        public static Vector2 Sum(IEnumerable<Vector2> n) => n.Aggregate((a, b) => a + b);
        public static Vector3 Sum(IEnumerable<Vector3> n) => n.Aggregate((a, b) => a + b);
        public static Vector4 Sum(IEnumerable<Vector4> n) => n.Aggregate((a, b) => a + b);
        public static Vector2 Sum(Vector2 first, params Vector2[] rest) => Sum([first, .. rest]);
        public static Vector3 Sum(Vector3 first, params Vector3[] rest) => Sum([first, .. rest]);
        public static Vector4 Sum(Vector4 first, params Vector4[] rest) => Sum([first, .. rest]);
        public static float Average(params float[] n) => Sum(n) / n.Length;
        public static double Average(params double[] n) => Sum(n) / n.Length;
        public static decimal Average(params decimal[] n) => Sum(n) / n.Length;
        public static float Average(this Vector2 n) => (n.X + n.Y) / 2;
        public static float Average(this Vector3 n) => (n.X + n.Y + n.Z) / 3;
        public static float Average(this Vector4 n) => (n.X + n.Y + n.Z + n.W) / 4;
        public static Vector2 Average(IEnumerable<Vector2> n) => n.Aggregate((a, b) => a + b) / n.Count();
        public static Vector3 Average(IEnumerable<Vector3> n) => n.Aggregate((a, b) => a + b) / n.Count();
        public static Vector4 Average(IEnumerable<Vector4> n) => n.Aggregate((a, b) => a + b) / n.Count();
        public static Vector2 Average(Vector2 first, params Vector2[] rest) => Average([first, .. rest]);
        public static Vector3 Average(Vector3 first, params Vector3[] rest) => Average([first, .. rest]);
        public static Vector4 Average(Vector4 first, params Vector4[] rest) => Average([first, .. rest]);
        public static T? Product<T>(params T[] n) where T : INumber<T> => n.Length == 0 ? T.One : n.Aggregate((a, b) => a * b);
        public static float Product(this Vector2 n) => n.X * n.Y;
        public static float Product(this Vector3 n) => n.X * n.Y * n.Z;
        public static float Product(this Vector4 n) => n.X * n.Y * n.Z * n.W;
        public static Vector2 Product(IEnumerable<Vector2> n) => n.Aggregate((a, b) => a * b);
        public static Vector3 Product(IEnumerable<Vector3> n) => n.Aggregate((a, b) => a * b);
        public static Vector4 Product(IEnumerable<Vector4> n) => n.Aggregate((a, b) => a * b);
        public static Vector2 Product(Vector2 first, params Vector2[] rest) => Product([first, .. rest]);
        public static Vector3 Product(Vector3 first, params Vector3[] rest) => Product([first, .. rest]);
        public static Vector4 Product(Vector4 first, params Vector4[] rest) => Product([first, .. rest]);
        public static float Magnitude(this Vector2 a) => Vector2.Distance(a, Vector2.Zero);
        public static float Magnitude(this Vector3 a) => Vector3.Distance(a, Vector3.Zero);
        public static float Magnitude(this Vector4 a) => Vector4.Distance(a, Vector4.Zero);

        #endregion
        #region angle stuff
        public static float DegToRad(float x) => x / 180 * MathF.PI;
        public static float RadToDeg(float x) => x / MathF.PI * 180;
        public static float DistanceToLine(Vector2 a, Vector2 b, Vector2 p)
        {
            if (a.X == b.X) return MathF.Abs(p.X - a.X);
            if (a.Y == b.Y) return MathF.Abs(p.Y - a.Y);
            return MathF.Abs((b.X - a.X) * (a.Y - p.Y) - (a.X - p.X) * (b.Y - a.Y)) / Vector2.Distance(a, b);
        }
        public static float DistanceToSegment(Vector2 a, Vector2 b, Vector2 p)
        {
            if (Vector2.Dot(b - a, p - b) >= 0) return Vector2.Distance(p, b);
            if (Vector2.Dot(b - a, p - a) <= 0) return Vector2.Distance(p, a);
            return DistanceToLine(a, b, p);
        }
        public static float DistanceBetweenSegments(Vector2 a, Vector2 b, Vector2 x, Vector2 y)
        {
            var r = x - a;
            var u = y - b;
            var v = y - x;
            var ru = Dot(r, u);
            var rv = Dot(r, v);
            var uu = Dot(u, u);
            var uv = Dot(u, v);
            var vv = Dot(v, v);
            var det = uu * vv - uv * uv;
            float s, t;
            if (det == 0) { s = Clamp(ru / uu, 0, 1); t = 0; }
            else { s = Clamp((ru * vv - rv * uv) / det, 0, 1); t = Clamp((ru * uv - rv * uu) / det, 0, 1); }
            return Dist(a + u * Clamp((t * uv + ru) / uu, 0, 1), x + v * Clamp((s * uv - rv) / vv, 0, 1));
        }
        public static bool Intersects(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4) => Intersects(new(x1, y1), new(x2, y2), new(x3, y3), new(x4, y4));
        public static bool Intersects(Vector2 a1, Vector2 a2, float x3, float y3, float x4, float y4) => Intersects(a1, a2, new(x3, y3), new(x4, y4));
        public static bool Intersects(float x1, float y1, float x2, float y2, Vector2 b1, Vector2 b2) => Intersects(new(x1, y1), new(x2, y2), b1, b2);
        public static bool Intersects(Vector2 a1, Vector2 a2, Vector2 b1, Vector2 b2)
        {
            static float ccw(Vector2 a, Vector2 b, Vector2 c) => (c.Y - a.Y) * (b.X - a.X) - (b.Y - a.Y) * (c.X - a.X);
            static bool btn(Vector2 a, Vector2 b, Vector2 c) => a.X == c.X ? Between(a.Y, b.Y, c.Y) : Between(a.X, b.X, c.X);
            float a1b = ccw(a1, b1, b2); float a2b = ccw(a2, b1, b2);
            float b1a = ccw(a1, a2, b1); float b2a = ccw(a1, a2, b2);
            if (a1b == 0 && a2b == 0 && b1a == 0 && b2a == 0) return btn(a1, b1, a2) || btn(a1, b2, a2);
            else return a1b != a2b && b1a != b2a;
        }
        public static Vector2 NormalOfLine(Vector2 a, Vector2 b) => Rotate(b - a, -90);
        public static Vector2 NormalOfLine(float ax, float ay, float bx, float by) => Rotate(bx - ax, by - ay, -90);
        public static Vector2 NormalOfLine(Vector2 v) => Rotate(v, -90);
        public static Vector2 NormalOfLine(float x, float y) => Rotate(x, y, -90);
        public static Vector2 Rotate(Vector2 a, Vector2 b, float angle) => Rotate(a - b, angle) + b;
        public static Vector2 Rotate(Vector2 v, float angle)
        {
            angle = PosMod(angle, 360);
            if (angle == 0) return v;
            if (angle == 180) return -v;
            if (angle == 90) return new(-v.Y, v.X);
            if (angle == 270) return new(v.Y, -v.X);
            return Theta(Atan2(v) + angle) * Magnitude(v);
        }
        public static Vector2 Rotate(float x1, float y1, float x2, float y2, float angle) => Rotate(x1 - x2, y1 - y2, angle) + new Vector2(x2, y2);
        public static Vector2 Rotate(float x, float y, float angle) => Rotate(new(x, y), angle);
        public static Vector3 Rotate(Vector3 a, Vector3 b, Vector3 angle) => Rotate(a - b, angle) + b;
        public static Vector3 Rotate(Vector3 a, Vector3 angle) => MatrixP.Rotate(angle) * a;
        public static Vector2 InverseRotate(Vector2 a, Vector2 b, float angle) => InverseRotate(a - b, angle) + b;
        public static Vector2 InverseRotate(Vector2 v, float angle) => Rotate(v, -angle);
        public static Vector2 InverseRotate(float x1, float y1, float x2, float y2, float angle) => InverseRotate(x1 - x2, y1 - y2, angle) + new Vector2(x2, y2);
        public static Vector2 InverseRotate(float x, float y, float angle) => InverseRotate(new(x, y), angle);
        public static Vector3 InverseRotate(Vector3 a, Vector3 b, Vector3 angle) => InverseRotate(a - b, angle) + b;
        public static Vector3 InverseRotate(Vector3 a, Vector3 angle) => MatrixP.InverseRotate(angle) * a;
        public static Vector2 Mirror(Vector2 v, Vector2 normal) => Mirror(v, Atan2(normal));
        public static Vector2 Mirror(Vector2 v, float normal) => Rotate(-v, 2 * AngleBetween(180 - Atan2(v), normal));
        public static Vector2 Mirror(float x, float y, float nx, float ny) => Mirror(x, y, Atan2(NormalOfLine(nx, ny)));
        public static Vector2 Mirror(float x, float y, Vector2 normal) => Mirror(x, y, Atan2(normal));
        public static Vector2 Mirror(float x, float y, float normal) => Rotate(-x, -y, 2 * AngleBetween(180 - Atan2(x, y), normal));
        public static Vector2 Mirror(float ax, float ay, float bx, float by, float nx, float ny) => Mirror(bx - ax, by - ay, Atan2(NormalOfLine(nx, ny)));
        public static Vector2 Mirror(float ax, float ay, float bx, float by, Vector2 normal) => Mirror(bx - ax, by - ay, Atan2(normal));
        public static Vector2 Mirror(float ax, float ay, float bx, float by, float normal) => Rotate(ax - bx, ay - by, 2 * AngleBetween(180 - Atan2(bx - ax, by - ay), normal));
        public static float AngleBetween(Vector2 a, Vector2 b) => AngleBetween(Atan2(a), Atan2(b));
        public static float AngleBetween(float ax, float ay, float bx, float by) => AngleBetween(Atan2(ax, ay), Atan2(bx, by));
        public static float AngleBetween(float a, float b)
        {
            float ba = PosMod(b - a, 360);
            float ab = PosMod(a - b, 360);
            if (ab > ba) return ba;
            else return -ab;
        }
        public static float Angle(float a) => PosMod(a + 180, 360) - 180;
        public static float Sin(float x) => MathF.Sin(DegToRad(x));
        public static float Cos(float x) => MathF.Cos(DegToRad(x));
        public static float Tan(float x) => MathF.Tan(DegToRad(x));
        public static Vector2 Theta(float angle) => new(Cos(angle), Sin(angle));
        public static float Atan2(Vector2 a, Vector2 b) => Atan2(b - a);
        public static float Atan2(Vector2 v) => Atan2(v.X, v.Y);
        public static float Atan2(float ax, float ay, float bx, float by) => Atan2(bx - ax, by - ay);
        public static float Atan2(float x, float y) => PosMod(RadToDeg(MathF.Atan2(y, x)), 360);
        #endregion
    }
}
