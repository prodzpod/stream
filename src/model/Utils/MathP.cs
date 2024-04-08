using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.Xna.Framework;

namespace NotGMS.Util
{
    public static class MathP
    {
        #region basics

        public static T Min<T>(params T[] n) where T : System.Numerics.INumber<T> { return n.Min(); }
        public static T Max<T>(params T[] n) where T : System.Numerics.INumber<T> { return n.Max(); }
        public static T Modp<T>(T n, T a) where T : System.Numerics.INumber<T> { return (n % a + a) % a; }
        public static int Div(double n, double a) { return (int)(n / a); }
        public static int Div(float n, float a) { return (int)(n / a); }
        public static T Demod<T>(T n, T a) where T : System.Numerics.INumber<T> { return n - n % a; }
        public static T Lerp<T>(T a, T b, T t) where T : System.Numerics.IFloatingPoint<T> { return a + (b - a) * t; }
        public static Vector2 Lerp(Vector2 a, Vector2 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector3 Lerp(Vector3 a, Vector3 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
        public static Vector4 Lerp(Vector4 a, Vector4 b, float t) => a.Composite(b, (x, y) => Lerp(x, y, t));
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
        public static Vector2 Clamp(Vector2 v, Vector2 min, Vector2 max) => v.Composite(min, max, Math.Clamp);
        public static Vector3 Clamp(Vector3 v, Vector3 min, Vector3 max) => v.Composite(min, max, Math.Clamp);
        public static Vector4 Clamp(Vector4 v, Vector4 min, Vector4 max) => v.Composite(min, max, Math.Clamp);
        public static bool Between<T>(T a, T b, T c) where T : IComparable<T> { return a.CompareTo(b) <= 0 && b.CompareTo(c) <= 0 || a.CompareTo(b) >= 0 && b.CompareTo(c) >= 0; }
        public static float Cross(Vector2 a, Vector2 b) => (a.X * b.Y) - (a.Y * b.X);
        public static Vector3 Cross(Vector3 a, Vector3 b) => new((a.Y * b.Z) - (a.Z * b.Y), (a.Z * b.X) - (a.X * b.Z), (a.X * b.Y) - (a.Y * b.X));
        #endregion

        #region random stuff
        public static Random random = new();
        public static Random randomUnseeded = new();
        public static Random GetRandom(bool seeded) => seeded ? random : randomUnseeded;
        public static void Seed(int seed) { random = new(seed); }
        public static bool Chance(double chance, bool seeded = true) => GetRandom(seeded).NextDouble() < chance;
        public static double Random(bool seeded = true) => Random(0.0, 1.0, seeded);
        public static double Random(double max, bool seeded = true) => Random(0, max, seeded);
        public static double Random(double min, double max, bool seeded = true) => Lerp(min, max, GetRandom(seeded).NextDouble());
        public static float Random(float max, bool seeded = true) => Random(0, max, seeded);
        public static float Random(float min, float max, bool seeded = true) => Lerp(min, max, GetRandom(seeded).NextSingle());
        public static int Random(int max, bool seeded = true) => Random(0, max, seeded);
        public static int Random(int min, int max, bool seeded = true) => Modp((int)GetRandom(seeded).NextInt64(), max - min) + min;
        public static T Random<T>(IEnumerable<T> list, bool seeded = true) => list.ElementAt(Random(list.Count(), seeded));
        public static Dictionary<T, double> ToWeightedList<T>(this IEnumerable<T> list)
        {
            Dictionary<T, double> ret = new();
            foreach (var t in list) ret.Add(t, 1.0);
            return ret;
        }
        public static T Random<T>(IDictionary<T, double> weightedList, bool seeded = true) 
        {
            double total = 0;
            List<T> keys = new(weightedList.Keys);
            List<double> weights = new();
            foreach (var k in keys)
            {
                total += weightedList[k];
                weights.Add(total);
            }
            double res = Random(total, seeded);
            for (int i = 0; i < keys.Count; i++) if (res > weights[i]) return keys[i];
            return keys[0]; // fallback, should not happen
        }
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
        public static float Magnitude(Vector2 v) => Vector2.Distance(Vector2.Zero, v);
        public static float Magnitude(float x, float y) => MathF.Sqrt(x * x + y * y);
        public static Vector2 Rotate(Vector2 a, Vector2 b, float angle) => Rotate(a - b, angle) + b;
        public static Vector2 Rotate(Vector2 v, float angle) => Theta(Atan2(v) + angle) * Magnitude(v);
        public static Vector2 Rotate(float x1, float y1, float x2, float y2, float angle) => Rotate(x1 - x2, y1 - y2, angle) + new Vector2(x2, y2);
        public static Vector2 Rotate(float x, float y, float angle) => Theta(Atan2(x, y) + angle) * Magnitude(x, y);
        public static Vector3 Rotate(Vector3 a, Vector3 b, Vector3 angle) => Rotate(a - b, angle) + b;
        public static Vector3 Rotate(Vector3 a, Vector3 angle)
        {
            return new( // stackoverflow GO (again)
                (Cos(angle.X) * Cos(angle.Y)) * a.X +
                (Cos(angle.X) * Sin(angle.Y) * Sin(angle.Z) - Sin(angle.X) * Cos(angle.Z)) * a.Y +
                (Cos(angle.X) * Sin(angle.Y) * Cos(angle.Z) + Sin(angle.X) * Sin(angle.Z)) * a.Z,
                (Sin(angle.X) * Cos(angle.Y)) * a.X +
                (Sin(angle.X) * Sin(angle.Y) * Sin(angle.Z) + Cos(angle.X) * Cos(angle.Z)) * a.Y +
                (Sin(angle.X) * Sin(angle.Y) * Cos(angle.Z) - Cos(angle.X) * Sin(angle.Z)) * a.Z,
                (-Sin(angle.Y)) * a.X +
                (Cos(angle.Y) * Sin(angle.Z)) * a.Y +
                (Cos(angle.Y) * Cos(angle.Z)) * a.Z
                );
        }
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
            float ba = Modp(b - a, 360);
            float ab = Modp(a - b, 360);
            if (ab > ba) return ba;
            else return -ab;
        }
        public static float Angle(float a) => Modp(a + 180, 360) - 180;
        public static float Sin(float x) => MathF.Sin(DegToRad(x));
        public static float Cos(float x) => MathF.Cos(DegToRad(x));
        public static float Tan(float x) => MathF.Tan(DegToRad(x));
        public static Vector2 Theta(float angle) => new(Cos(angle), Sin(angle));
        public static float Atan2(Vector2 a, Vector2 b) => Atan2(b - a);
        public static float Atan2(Vector2 v) => Atan2(v.X, v.Y);
        public static float Atan2(float ax, float ay, float bx, float by) => Atan2(bx - ax, by - ay);
        public static float Atan2(float x, float y) => RadToDeg(MathF.Atan2(y, x));
        #endregion

        #region collision stuff
        public static float Sidedness(Vector2 p, Vector2 a, Vector2 b) => (b.X - a.X) * (p.Y - a.Y) - (p.X - a.X) * (b.Y - a.Y);
                                                                    // sign(b, p, a)

        public static bool PositionInBoundingBox(ProdModel.Object.Object o, Vector2 position) => o.GetEdges().All(x => Sidedness(position, x[0], x[1]) >= 0);

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

        public static Vector2? LineIntersectsBoundingBox(ProdModel.Object.Object o, Vector2 a, Vector2 b)
        {
            var e = o.GetEdges();
            var l = e.Select(x => LineIntersectsLine(x[0], x[1], a, b)).ToArray();
            var i = l.Select((_, z) => z).Where(z => l[z] != null).ToArray();
            if (i.Length == 0) return null;
            return l[i.MinBy(z => MathF.Abs(Unlerp((Vector2)l[z], e[z][0], e[z][1]) - 0.5f))];
        }
        #endregion
    }

    #region better rect
    public struct RectangleP : IEquatable<RectangleP>, IEquatable<Rectangle>, IEquatable<Vector2>, IEquatable<Vector4>
    {
        public Vector2 Position = Vector2.Zero;
        public float X => Position.X;
        public float Y => Position.Y;

        public Vector2 Size = Vector2.Zero;
        public float Width => Size.X;
        public float Height => Size.Y;

        // from 0 to 1
        public Vector2 Origin = Vector2.Zero; // top left
        public float OriginX => Origin.X;
        public float OriginY => Origin.Y;
        public static readonly Vector2 TOP_LEFT = new(0f, 0f);
        public static readonly Vector2 TOP_CENTER = new(0.5f, 0f);
        public static readonly Vector2 TOP_RIGHT = new(1f, 0f);
        public static readonly Vector2 MIDDLE_LEFT = new(0f, 0.5f);
        public static readonly Vector2 MIDDLE_CENTER = new(0.5f, 0.5f);
        public static readonly Vector2 MIDDLE_RIGHT = new(1f, 0.5f);
        public static readonly Vector2 BOTTOM_LEFT = new(0f, 1f);
        public static readonly Vector2 BOTTOM_CENTER = new(0.5f, 1f);
        public static readonly Vector2 BOTTOM_RIGHT = new(1f, 1f);

        public float Left => X - MathP.Lerp(0, Width, OriginX);
        public float Right => X + MathP.Lerp(Width, 0, OriginX);
        public float Top => Y - MathP.Lerp(0, Height, OriginY);
        public float Bottom => Y + MathP.Lerp(Height, 0, OriginY);
        public float Area => Width * Height;
        public bool IsEmpty => Width == 0 && Height == 0;
        public RectangleP Center() { Origin = MIDDLE_CENTER; return this; }

        public RectangleP() : this(0, 0) { }
        public RectangleP(RectangleP from) : this(from.X, from.Y, from.Width, from.Height, from.Origin) { }
        public RectangleP(Rectangle r) : this(r, TOP_LEFT) { }
        public RectangleP(Rectangle r, Vector2 center) : this(r.Left + MathP.Lerp(0, r.Width, center.X), r.Top + MathP.Lerp(0, r.Height, center.Y), r.Width, r.Height, center) { }
        public RectangleP(Vector4 r) : this(r, TOP_LEFT) { }
        public RectangleP(Vector4 r, Vector2 center) : this(r.X + MathP.Lerp(0, r.Z, center.X), r.Y + MathP.Lerp(0, r.W, center.Y), r.Z, r.W, center) { }
        public RectangleP(Vector2 s) : this(Vector2.Zero, s, TOP_LEFT) { }
        public RectangleP(Vector2 p, Vector2 s) : this(p, s, TOP_LEFT) { }
        public RectangleP(Vector2 p, Vector2 s, Vector2 c)
        {
            Position = p;
            Size = s;
            Origin = c;
        }
        public RectangleP(float w, float h) : this(0, 0, w, h) { }
        public RectangleP(float x, float y, float w, float h) : this(x, y, w, h, 0, 0) { }
        public RectangleP(float x, float y, float w, float h, Vector2 center) : this(x, y, w, h, center.X, center.Y) { }
        public RectangleP(float x, float y, float w, float h, float centerx, float centery)
        {
            Position = new(x, y);
            Size = new(w, h);
            Origin = new(centerx, centery);
        }
        public bool Contains(Vector2 point) => Contains(point.X, point.Y);
        public bool Contains(float x, float y) => MathP.Between(Left, x, Right) && MathP.Between(Top, y, Bottom);
        public bool Contains(Vector2 a, Vector2 b) => Contains(a.X, a.Y, b.X, b.Y);
        public bool Contains(float ax, float ay, float bx, float by) => Contains(ax, ay) && Contains(bx, by);
        public bool Contains(Rectangle r) => Contains(r.Left, r.Top) && Contains(r.Right, r.Bottom);
        public bool Contains(Vector4 r) => Contains(r.X, r.Y) && Contains(r.X + r.Z, r.Y + r.W);
        public bool Contains(RectangleP r) => Contains(r.Left, r.Top) && Contains(r.Right, r.Bottom);
        public bool Intersects(Vector2 a, Vector2 b) => Intersects(a.X, a.Y, b.X, b.Y);
        public bool Intersects(float ax, float ay, float bx, float by) =>
               MathP.Intersects(ax, ay, bx, by, Left, Top, Right, Top)
            || MathP.Intersects(ax, ay, bx, by, Right, Top, Right, Bottom)
            || MathP.Intersects(ax, ay, bx, by, Right, Bottom, Right, Bottom)
            || MathP.Intersects(ax, ay, bx, by, Left, Top, Left, Bottom);
        public bool Intersects(Rectangle r) => Intersects(new RectangleP(r));
        public bool Intersects(Vector4 r) => Intersects(new RectangleP(r));
        public bool Intersects(RectangleP r) => (r.Right >= Left && r.Left <= Right) || (r.Bottom >= Top && r.Top <= Bottom);
        public RectangleP Lerp(float x, float y, float t) => Lerp(x, y, Width, Height, OriginX, OriginY, t);
        public RectangleP Lerp(Vector2 p, float t) => Lerp(p.X, p.Y, Width, Height, OriginX, OriginY, t);
        public RectangleP Lerp(Rectangle r, float t) => Lerp(MathP.Lerp(r.Left, r.Right, OriginX), MathP.Lerp(r.Top, r.Bottom, OriginY), r.Width, r.Height, OriginX, OriginY, t);
        public RectangleP Lerp(float x, float y, float w, float h, float t) => Lerp(x, y, w, h, OriginX, OriginY, t);
        public RectangleP Lerp(Vector2 p, Vector2 s, float t) => Lerp(p.X, p.Y, s.X, s.Y, OriginX, OriginY, t);
        public RectangleP Lerp(Vector4 v, float t) => Lerp(MathP.Lerp(v.X, v.X + v.Z, OriginX), MathP.Lerp(v.Y, v.Y + v.W, OriginY), v.Z, v.W, OriginX, OriginY, t);
        public RectangleP Lerp(Vector2 p, Vector2 s, Vector2 c, float t) => Lerp(p.X, p.Y, s.X, s.Y, c.X, c.Y, t);
        public RectangleP Lerp(float x, float y, float w, float h, Vector2 c, float t) => Lerp(x, y, w, h, c.X, c.Y, t);
        public RectangleP Lerp(float x, float y, float w, float h, float cx, float cy, float t) => new(
            MathP.Lerp(X, x, t), MathP.Lerp(Y, y, t),
            MathP.Lerp(Width, w, t), MathP.Lerp(Height, h, t),
            MathP.Lerp(OriginX, cx, t), MathP.Lerp(OriginY, cy, t));
        public void Deconstruct(out float x, out float y, out float width, out float height)
        {
            x = X;
            y = Y;
            width = Width;
            height = Height;
        }
        public void Deconstruct(out float x, out float y, out float width, out float height, out float centerX, out float centerY)
        {
            x = X;
            y = Y;
            width = Width;
            height = Height;
            centerX = OriginX;
            centerY = OriginY;
        }
        public static RectangleP operator +(Vector2 off, RectangleP r) => r + off;
        public static RectangleP operator +(RectangleP r, Vector2 off) => new(r.Position + off, r.Size, r.Origin);
        public static RectangleP operator -(RectangleP r, Vector2 off) => new(r.Position - off, r.Size, r.Origin);
        public static RectangleP operator *(float scale, RectangleP r) => r * scale;
        public static RectangleP operator *(RectangleP r, float scale) => new(r.Position, r.Size * scale, r.Origin);
        public static RectangleP operator /(RectangleP r, float scale) => new(r.Position, r.Size / scale, r.Origin);
        public static RectangleP operator *(Vector2 scale, RectangleP r) => r * scale;
        public static RectangleP operator *(RectangleP r, Vector2 scale) => new(r.Position, r.Size * scale, r.Origin);
        public static RectangleP operator /(RectangleP r, Vector2 scale) => new(r.Position, r.Size / scale, r.Origin);
        public Vector4 ToVector() { return new(X, Y, Width, Height); }
        public Rectangle ToRectangle() { return new((int)X, (int)Y, (int)Width, (int)Height); }
        public static bool operator ==(RectangleP a, RectangleP b) => a.Equals(b);
        public static bool operator !=(RectangleP a, RectangleP b) => !a.Equals(b);
        public bool Equals(RectangleP other) => Position == other.Position && Size == other.Size && Origin == other.Origin;
        public static bool operator ==(Rectangle a, RectangleP b) => b == a;
        public static bool operator ==(RectangleP a, Rectangle b) => a.Equals(b);
        public static bool operator !=(Rectangle a, RectangleP b) => b != a;
        public static bool operator !=(RectangleP a, Rectangle b) => !a.Equals(b);
        public bool Equals(Rectangle other) => (int)Left == other.Left && (int)Top == other.Top && (int)Width == other.Width && (int)Height == other.Height;
        public static bool operator ==(Vector2 a, RectangleP b) => b == a;
        public static bool operator ==(RectangleP a, Vector2 b) => a.Equals(b);
        public static bool operator !=(Vector2 a, RectangleP b) => b != a;
        public static bool operator !=(RectangleP a, Vector2 b) => !a.Equals(b);
        public bool Equals(Vector2 other) => Width == other.X && Height == other.Y;
        public static bool operator ==(Vector4 a, RectangleP b) => b == a;
        public static bool operator ==(RectangleP a, Vector4 b) => a.Equals(b);
        public static bool operator !=(Vector4 a, RectangleP b) => b != a;
        public static bool operator !=(RectangleP a, Vector4 b) => !a.Equals(b);
        public bool Equals(Vector4 other) => Left == other.X && Top == other.Y && Width == other.Z && Height == other.W;
        public override bool Equals(object obj)
        {
            if (obj is RectangleP p) return Equals(p);
            if (obj is Rectangle r) return Equals(r);
            if (obj is Vector2 v) return Equals(v);
            if (obj is Vector4 x) return Equals(x);
            return false;
        }
        public override int GetHashCode() => 17 * 23 * Position.GetHashCode() + 19 * 29 * Size.GetHashCode() + 43 * Origin.GetHashCode();
        public override string ToString() => "{p(" + X + ", " + Y + ") s(" + Width + ", " + Height + "c(" + OriginX + ", " + OriginY + ")}";
    }
    #endregion
}
