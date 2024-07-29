using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.Engine.Builtin
{
    public static class HitboxP
    {
        public static bool Check(Instance a, Instance b) => Check(a.Hitbox?.Transform(a.Position, a.Scale, a.Angle), b.Hitbox?.Transform(b.Position, b.Scale, b.Angle));
        public static bool Check(IHitbox? x, Instance b) => Check(x, b.Hitbox?.Transform(b.Position, b.Scale, b.Angle));
        public static bool Check(Instance a, IHitbox? y) => Check(a.Hitbox?.Transform(a.Position, a.Scale, a.Angle), y);
        public static bool Check(IHitbox? x, IHitbox? y)
        {
            if (x == null || y == null) return false;
            if (x is PointHitbox x1)
            {
                if (y is PointHitbox y1) return Check(x1, y1);
                else if (y is LineHitbox y2) return Check(x1, y2);
                else if (y is CircleHitbox y3) return Check(x1, y3);
                else if (y is AABBHitbox y4) return Check(x1, y4);
                else if (y is RectangleHitbox y5) return Check(x1, y5);
                else if (y is PolygonHitbox y6) return Check(x1, y6);
            }
            else if (x is LineHitbox x2)
            {
                if (y is PointHitbox y1) return Check(x2, y1);
                else if (y is LineHitbox y2) return Check(x2, y2);
                else if (y is CircleHitbox y3) return Check(x2, y3);
                else if (y is AABBHitbox y4) return Check(x2, y4);
                else if (y is RectangleHitbox y5) return Check(x2, y5);
                else if (y is PolygonHitbox y6) return Check(x2, y6);
            }
            else if (x is CircleHitbox x3)
            {
                if (y is PointHitbox y1) return Check(x3, y1);
                else if (y is LineHitbox y2) return Check(x3, y2);
                else if (y is CircleHitbox y3) return Check(x3, y3);
                else if (y is AABBHitbox y4) return Check(x3, y4);
                else if (y is RectangleHitbox y5) return Check(x3, y5);
                else if (y is PolygonHitbox y6) return Check(x3, y6);
            }
            else if (x is AABBHitbox x4)
            {
                if (y is PointHitbox y1) return Check(x4, y1);
                else if (y is LineHitbox y2) return Check(x4, y2);
                else if (y is CircleHitbox y3) return Check(x4, y3);
                else if (y is AABBHitbox y4) return Check(x4, y4);
                else if (y is RectangleHitbox y5) return Check(x4, y5);
                else if (y is PolygonHitbox y6) return Check(x4, y6);
            }
            else if (x is RectangleHitbox x5)
            {
                if (y is PointHitbox y1) return Check(x5, y1);
                else if (y is LineHitbox y2) return Check(x5, y2);
                else if (y is CircleHitbox y3) return Check(x5, y3);
                else if (y is AABBHitbox y4) return Check(x5, y4);
                else if (y is RectangleHitbox y5) return Check(x5, y5);
                else if (y is PolygonHitbox y6) return Check(x5, y6);
            }
            else if (x is PolygonHitbox x6)
            {
                if (y is PointHitbox y1) return Check(x6, y1);
                else if (y is LineHitbox y2) return Check(x6, y2);
                else if (y is CircleHitbox y3) return Check(x6, y3);
                else if (y is AABBHitbox y4) return Check(x6, y4);
                else if (y is RectangleHitbox y5) return Check(x6, y5);
                else if (y is PolygonHitbox y6) return Check(x6, y6);
            }
            return false;
        }
        public static bool Check(PointHitbox a, PointHitbox b) =>
            a.Offset == b.Offset;
        public static bool Check(PointHitbox a, LineHitbox b)
        {
            if (b.Offset.X == b.Target.X || a.Offset.X == b.Target.X)
                return a.Offset.X == b.Offset.X && MathP.Between(b.Offset.Y, a.Offset.Y, b.Target.Y);
            return (b.Target.Y - b.Offset.Y) / (b.Target.X - b.Offset.X) == (b.Target.Y - a.Offset.Y) / (b.Target.X - a.Offset.X) && MathP.Between(b.Offset.X, a.Offset.X, b.Target.X);
        }
        public static bool Check(PointHitbox a, CircleHitbox b) =>
            (b.Offset - a.Offset).Magnitude() <= b.Radius;
        public static bool Check(PointHitbox a, AABBHitbox b) =>
            MathP.Between(b.Offset - b.Size / 2, a.Offset, b.Offset + b.Size / 2);
        public static bool Check(PointHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return Check(a, (AABBHitbox)b);
            return Check(new PointHitbox(PointHitbox.RotateAround(a.Offset, b.Offset, b.Angle)), (AABBHitbox)b);
        }
        public static bool Check(PointHitbox a, PolygonHitbox b)
        {
            if (b.Points.Length == 0) return false;
            if (b.Points.Length == 1) return Check(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return Check(a, new LineHitbox(b.Points[0], b.Points[1]));
            if (!MathP.Between(b.Center - b.Size / 2, a.Offset, b.Center + b.Size / 2)) return false;
            bool inside = false;
            for (int i = 0, j = b.Points.Length - 1; i < b.Points.Length; j = i++)
            {
                if ((b.Points[i].Y > a.Offset.Y) != (b.Points[j].Y > a.Offset.Y) &&
                     a.Offset.X < (b.Points[j].X - b.Points[i].X) * (a.Offset.Y - b.Points[i].Y) / (b.Points[j].Y - b.Points[i].Y) + b.Points[i].X)
                    inside = !inside;
            }
            return inside;
        }
        public static bool Check(LineHitbox a, LineHitbox b)
        {
            if (MathP.Cross(a.Target - a.Offset, b.Target - b.Offset) != 0 || MathP.Cross(b.Offset - a.Offset, a.Target - a.Offset) != 0) return false;
            var rr = Vector2.Dot(b.Target - b.Offset, b.Target - b.Offset);
            var t0 = Vector2.Dot(b.Offset - a.Offset, b.Target - b.Offset) / rr;
            var t1 = t0 + Vector2.Dot(b.Target - b.Offset, a.Target - a.Offset) / rr;
            return MathP.Between(0, t0, 1) || MathP.Between(0, t1, 1) || (t0 < 0 && t1 > 1) || (t1 < 0 && t0 > 1);
        }
        public static bool Check(LineHitbox a, CircleHitbox b) => MathP.DistanceToSegment(a.Offset, a.Target, b.Offset) <= b.Radius;
        public static bool Check(LineHitbox a, AABBHitbox b) =>
            MathP.Between(b.Offset - b.Size / 2, a.Offset, b.Offset + b.Size / 2) || MathP.Between(b.Offset - b.Size / 2, a.Target, b.Offset + b.Size / 2)
            || MathP.Between(a.Offset, b.Offset - b.Size / 2, a.Target) || MathP.Between(a.Offset, b.Offset + b.Size / 2, a.Target);
        public static bool Check(LineHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return Check(a, (AABBHitbox)b);
            return Check(new LineHitbox(PointHitbox.RotateAround(a.Offset, b.Offset, b.Angle), PointHitbox.RotateAround(a.Target, b.Offset, b.Angle)), (AABBHitbox)b);
        }
        public static bool Check(LineHitbox a, PolygonHitbox b)
        {
            if (b.Points.Length == 0) return false;
            if (b.Points.Length == 1) return Check(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return Check(a, new LineHitbox(b.Points[0], b.Points[1]));
            if (Check(new PointHitbox(a.Offset), b)) return true;
            return b.Lines.Any(line => Check(a, line));
        }
        public static bool Check(CircleHitbox a, CircleHitbox b) =>
            (a.Offset - b.Offset).Magnitude() <= a.Radius + b.Radius;
        public static bool Check(CircleHitbox a, AABBHitbox b)
        {
            var circleDistance = MathP.Abs(a.Offset - b.Offset);
            if (circleDistance.X > (b.Size.X / 2 + a.Radius)) { return false; }
            if (circleDistance.Y > (b.Size.Y / 2 + a.Radius)) { return false; }
            if (circleDistance.X <= (b.Size.X / 2)) { return true; }
            if (circleDistance.Y <= (b.Size.Y / 2)) { return true; }
            return MathP.Dist(circleDistance.X - b.Size.X / 2, circleDistance.Y - b.Size.Y / 2) <= a.Radius;
        }
        public static bool Check(CircleHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return Check(a, (AABBHitbox)b);
            return Check(new CircleHitbox(PointHitbox.RotateAround(a.Offset, b.Offset, b.Angle), a.Radius), (AABBHitbox)b);
        }
        public static bool Check(CircleHitbox a, PolygonHitbox b)
        {
            if (b.Points.Length == 0) return false;
            if (b.Points.Length == 1) return Check(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return Check(a, new LineHitbox(b.Points[0], b.Points[1]));
            if (Check(new PointHitbox(a.Offset), b)) return true;
            return b.Lines.Any(line => Check(a, line));
        }
        public static bool Check(AABBHitbox a, AABBHitbox b) =>
            MathP.Between(b.Offset - b.Size / 2, a.Offset - a.Size / 2, b.Offset + b.Size / 2) || MathP.Between(b.Offset - b.Size / 2, a.Offset + a.Size / 2, b.Offset + b.Size / 2)
            || MathP.Between(a.Offset - a.Size / 2, b.Offset - b.Size / 2, a.Offset + a.Size / 2) || MathP.Between(a.Offset - a.Size / 2, b.Offset + b.Size / 2, a.Offset + a.Size / 2);
        public static bool Check(AABBHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return Check(a, (AABBHitbox)b);
            return Check(new RectangleHitbox(a.Offset, a.Size, 0), b);
        }
        public static bool Check(AABBHitbox a, PolygonHitbox b) => Check(new RectangleHitbox(a.Offset, a.Size, 0), b);
        public static bool Check(RectangleHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return Check(a, (AABBHitbox)b);
            return Check((PolygonHitbox)a, (PolygonHitbox)b);
        }
        public static bool Check(RectangleHitbox a, PolygonHitbox b) => Check((PolygonHitbox)a, b);
        public static bool Check(PolygonHitbox a, PolygonHitbox b)
        {
            if (a.Points.Length == 0) return false;
            if (a.Points.Length == 1) return Check(b, new PointHitbox(a.Points[0]));
            if (a.Points.Length == 2) return Check(b, new LineHitbox(a.Points[0], a.Points[1]));
            if (b.Points.Length == 0) return false;
            if (b.Points.Length == 1) return Check(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return Check(a, new LineHitbox(b.Points[0], b.Points[1]));
            if (Check(new PointHitbox(a.Points[0]), b)) return true;
            return b.Lines.Any(line => Check(a, line));
        }
        public static bool Check(LineHitbox a, PointHitbox b) => Check(b, a);
        public static bool Check(CircleHitbox a, LineHitbox b) => Check(b, a);
        public static bool Check(CircleHitbox a, PointHitbox b) => Check(b, a);
        public static bool Check(AABBHitbox a, CircleHitbox b) => Check(b, a);
        public static bool Check(AABBHitbox a, LineHitbox b) => Check(b, a);
        public static bool Check(AABBHitbox a, PointHitbox b) => Check(b, a);
        public static bool Check(RectangleHitbox a, AABBHitbox b) => Check(b, a);
        public static bool Check(RectangleHitbox a, CircleHitbox b) => Check(b, a);
        public static bool Check(RectangleHitbox a, LineHitbox b) => Check(b, a);
        public static bool Check(RectangleHitbox a, PointHitbox b) => Check(b, a);
        public static bool Check(PolygonHitbox a, RectangleHitbox b) => Check(b, a);
        public static bool Check(PolygonHitbox a, AABBHitbox b) => Check(b, a);
        public static bool Check(PolygonHitbox a, CircleHitbox b) => Check(b, a);
        public static bool Check(PolygonHitbox a, LineHitbox b) => Check(b, a);
        public static bool Check(PolygonHitbox a, PointHitbox b) => Check(b, a);
        public static Vector2 GetNormal(Instance a, Instance b) => GetNormal(a.Hitbox?.Transform(a.Position, a.Scale, a.Angle), b.Hitbox?.Transform(b.Position, b.Scale, b.Angle));
        public static Vector2 GetNormal(IHitbox? x, Instance b) => GetNormal(x, b.Hitbox?.Transform(b.Position, b.Scale, b.Angle));
        public static Vector2 GetNormal(Instance a, IHitbox? y) => GetNormal(a.Hitbox?.Transform(a.Position, a.Scale, a.Angle), y);
        public static Vector2 GetNormal(IHitbox? x, IHitbox? y)
        {
            if (x == null || y == null) return Vector2.Zero;
            if (x is PointHitbox x1)
            {
                if (y is PointHitbox y1) return GetNormal(x1, y1);
                else if (y is LineHitbox y2) return GetNormal(x1, y2);
                else if (y is CircleHitbox y3) return GetNormal(x1, y3);
                else if (y is AABBHitbox y4) return GetNormal(x1, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x1, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x1, y6);
            }
            else if (x is LineHitbox x2)
            {
                if (y is PointHitbox y1) return GetNormal(x2, y1);
                else if (y is LineHitbox y2) return GetNormal(x2, y2);
                else if (y is CircleHitbox y3) return GetNormal(x2, y3);
                else if (y is AABBHitbox y4) return GetNormal(x2, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x2, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x2, y6);
            }
            else if (x is CircleHitbox x3)
            {
                if (y is PointHitbox y1) return GetNormal(x3, y1);
                else if (y is LineHitbox y2) return GetNormal(x3, y2);
                else if (y is CircleHitbox y3) return GetNormal(x3, y3);
                else if (y is AABBHitbox y4) return GetNormal(x3, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x3, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x3, y6);
            }
            else if (x is AABBHitbox x4)
            {
                if (y is PointHitbox y1) return GetNormal(x4, y1);
                else if (y is LineHitbox y2) return GetNormal(x4, y2);
                else if (y is CircleHitbox y3) return GetNormal(x4, y3);
                else if (y is AABBHitbox y4) return GetNormal(x4, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x4, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x4, y6);
            }
            else if (x is RectangleHitbox x5)
            {
                if (y is PointHitbox y1) return GetNormal(x5, y1);
                else if (y is LineHitbox y2) return GetNormal(x5, y2);
                else if (y is CircleHitbox y3) return GetNormal(x5, y3);
                else if (y is AABBHitbox y4) return GetNormal(x5, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x5, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x5, y6);
            }
            else if (x is PolygonHitbox x6)
            {
                if (y is PointHitbox y1) return GetNormal(x6, y1);
                else if (y is LineHitbox y2) return GetNormal(x6, y2);
                else if (y is CircleHitbox y3) return GetNormal(x6, y3);
                else if (y is AABBHitbox y4) return GetNormal(x6, y4);
                else if (y is RectangleHitbox y5) return GetNormal(x6, y5);
                else if (y is PolygonHitbox y6) return GetNormal(x6, y6);
            }
            return Vector2.Zero;
        }
        public static Vector2 GetNormal(PointHitbox a, PointHitbox b)
        {
            if (b.Offset == a.Offset) return Vector2.Zero;
            return Vector2.Normalize(b.Offset - a.Offset);
        }
        public static Vector2 GetNormal(PointHitbox a, LineHitbox b)
        {
            if (Check(a, b)) return GetNormal(a, new PointHitbox(MathP.Average(b.Offset, b.Target)));
            var ret = Vector2.Normalize(MathP.Rotate(b.Offset - b.Target, 90));
            return Math.Sign(MathP.Dot(b.Offset - a.Offset, ret)) * ret;
        }
        public static Vector2 GetNormal(PointHitbox a, CircleHitbox b) => GetNormal(a, new PointHitbox(b.Offset));
        public static Vector2 GetNormal(PointHitbox a, AABBHitbox b)
        {
            if (a.Offset == b.Offset) return Vector2.Zero;
            var angle = MathP.Atan2(b.Offset - a.Offset);
            var corner = MathP.Atan2(b.Size);
            var ret = Vector2.Normalize(b.Size);
            if (angle < corner) return Vector2.UnitX;
            if (angle == corner) return ret;
            if (angle < 180 - corner) return Vector2.UnitY;
            if (angle == 180 - corner) return new(-ret.X, ret.Y);
            if (angle < 180 + corner) return -Vector2.UnitX;
            if (angle == 180 + corner) return new(-ret.X, -ret.Y);
            if (angle < 360 - corner) return -Vector2.UnitY;
            if (angle == 360 - corner) return new(ret.X, -ret.Y);
            return Vector2.UnitX;
        }
        public static Vector2 GetNormal(PointHitbox a, RectangleHitbox b) =>
            MathP.Rotate(GetNormal(new PointHitbox(MathP.Rotate(a.Offset - b.Offset, -b.Angle)), (AABBHitbox)b), b.Angle);
        public static Vector2 GetNormal(PointHitbox a, PolygonHitbox b)
        {
            if (b.Points.Length == 0) return Vector2.Zero;
            if (b.Points.Length == 1) return GetNormal(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return GetNormal(a, new LineHitbox(b.Points[0], b.Points[1]));
            var distances = b.Lines.Select(line => MathP.DistanceToSegment(line.Offset, line.Target, a.Offset)).ToArray();
            var distance = distances.Min();
            return MathP.Average(b.Lines.Where((_, i) => distances[i] == distance).Select(x => GetNormal(a, x)).ToArray());
        }
        public static Vector2 GetNormal(LineHitbox a, LineHitbox b)
        {
            // bad lol
            var target = a;
            var source = b;
            if (!(a.Offset.X == a.Target.X && b.Offset.X == b.Target.X) &&
                (a.Offset.X == a.Target.X || b.Offset.X == b.Target.X || // parallel check
                ((a.Target.Y - a.Offset.Y) / (a.Target.X - a.Offset.X)) == ((b.Target.Y - b.Offset.Y) / (b.Target.X - b.Offset.X))))
            {
                var dx = new Vector2(a.Target.X - a.Offset.X, b.Target.X - b.Offset.X);
                var dy = new Vector2(a.Target.Y - a.Offset.Y, b.Target.Y - b.Offset.Y);
                var d = new Vector2(MathP.Cross(a.Target, a.Offset), MathP.Cross(b.Target, b.Offset));
                var v = MathP.Cross(dx, dy);
                var pt = new Vector2(MathP.Cross(d, dx), MathP.Cross(d, dy)) / v;
                if (MathP.Min(MathP.Dist(b.Offset, pt), MathP.Dist(b.Target, pt)) < MathP.Min(MathP.Dist(a.Offset, pt), MathP.Dist(a.Target, pt)))
                {
                    target = b;
                    source = a;
                }
            }
            return GetNormal(new PointHitbox(MathP.Average(source.Offset, source.Target)), target);
        }
        public static Vector2 GetNormal(LineHitbox a, CircleHitbox b) => -GetNormal(new PointHitbox(b.Offset), a);
        public static Vector2 GetNormal(LineHitbox a, AABBHitbox b) => GetNormal(a, (PolygonHitbox)b);
        public static Vector2 GetNormal(LineHitbox a, RectangleHitbox b) => GetNormal(a, (PolygonHitbox)b);
        public static Vector2 GetNormal(LineHitbox a, PolygonHitbox b)
        {
            if (b.Points.Length == 0) return Vector2.Zero;
            if (b.Points.Length == 1) return GetNormal(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return GetNormal(a, new LineHitbox(b.Points[0], b.Points[1]));
            var distances = b.Lines.Select(x => MathP.DistanceBetweenSegments(a.Offset, a.Target, x.Offset, x.Target));
            var distance = distances.Min();
            if (distances.Where(x => x == distance).Count() > 1) return GetNormal(new PointHitbox(b.Center), a);
            return GetNormal(new PointHitbox(MathP.Average(a.Offset, a.Target)), b.Lines[distances.ToList().IndexOf(distance)]);
        }
        public static Vector2 GetNormal(CircleHitbox a, CircleHitbox b) => GetNormal(new PointHitbox(a.Offset), new PointHitbox(b.Offset));
        public static Vector2 GetNormal(CircleHitbox a, AABBHitbox b) => GetNormal(new PointHitbox(a.Offset), b);
        public static Vector2 GetNormal(CircleHitbox a, RectangleHitbox b) => GetNormal(new PointHitbox(a.Offset), b);
        public static Vector2 GetNormal(CircleHitbox a, PolygonHitbox b) => GetNormal(new PointHitbox(a.Offset), b);
        public static Vector2 GetNormal(AABBHitbox a, AABBHitbox b) =>
            GetNormal(new PointHitbox(a.Offset), new AABBHitbox(b.Offset, a.Size + b.Size));
        public static Vector2 GetNormal(AABBHitbox a, RectangleHitbox b)
        {
            if (b.Angle == 0) return GetNormal(a, (AABBHitbox)b);
            return GetNormal((PolygonHitbox)a, (PolygonHitbox)b);
        }
        public static Vector2 GetNormal(AABBHitbox a, PolygonHitbox b) => GetNormal((PolygonHitbox)a, b);
        public static Vector2 GetNormal(RectangleHitbox a, RectangleHitbox b)
        {
            if (a.Angle == b.Angle) return GetNormal((AABBHitbox)a, (AABBHitbox)b);
            return GetNormal((PolygonHitbox)a, (PolygonHitbox)b);
        }
        public static Vector2 GetNormal(RectangleHitbox a, PolygonHitbox b) => GetNormal((PolygonHitbox)a, b);
        public static Vector2 GetNormal(PolygonHitbox a, PolygonHitbox b)
        {
            if (a.Points.Length == 0) return Vector2.Zero;
            if (a.Points.Length == 1) return GetNormal(b, new PointHitbox(a.Points[0]));
            if (a.Points.Length == 2) return GetNormal(b, new LineHitbox(a.Points[0], a.Points[1]));
            if (b.Points.Length == 0) return Vector2.Zero;
            if (b.Points.Length == 1) return GetNormal(a, new PointHitbox(b.Points[0]));
            if (b.Points.Length == 2) return GetNormal(a, new LineHitbox(b.Points[0], b.Points[1]));
            // EXTREMELY inefficient (lol)
            Dictionary<KeyValuePair<int, int>, float> dists = [];
            var al = a.Lines; var bl = b.Lines;
            for (int i = 0; i < al.Length; i++) for (int j = 0; j < bl.Length; j++)
                    dists[new(i, j)] = MathP.DistanceBetweenSegments(al[i].Target, al[i].Offset, bl[j].Target, bl[j].Offset);
            var pair = dists.MinBy(x => x.Value).Key;
            return GetNormal(al[pair.Key], bl[pair.Value]);
        }
        public static Vector2 GetNormal(LineHitbox a, PointHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(CircleHitbox a, LineHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(CircleHitbox a, PointHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(AABBHitbox a, CircleHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(AABBHitbox a, LineHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(AABBHitbox a, PointHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(RectangleHitbox a, AABBHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(RectangleHitbox a, CircleHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(RectangleHitbox a, LineHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(RectangleHitbox a, PointHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(PolygonHitbox a, RectangleHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(PolygonHitbox a, AABBHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(PolygonHitbox a, CircleHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(PolygonHitbox a, LineHitbox b) => -GetNormal(b, a);
        public static Vector2 GetNormal(PolygonHitbox a, PointHitbox b) => -GetNormal(b, a);
    }
    public interface IHitbox { public IHitbox Transform(Vector2 pos, Vector2 size, float angle); }
    public struct PointHitbox(Vector2 offset) : IHitbox
    {
        public Vector2 Offset = offset;
        public PointHitbox(): this(Vector2.Zero) { }
        public PointHitbox(PointHitbox other): this(other.Offset) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle) => new PointHitbox(TransformPoint(Offset, pos, size, angle));
        public static Vector2 TransformPoint(Vector2 x, Vector2 pos, Vector2 size, float angle)
        {
            if (x != Vector2.Zero) x = MathP.Rotate(x, angle) * size;
            x += pos;
            return x;
        }
        public static Vector2 RotateAround(Vector2 target, Vector2 origin, float angle) => MathP.Rotate(target - origin, angle) + origin;
        public static explicit operator Vector2(PointHitbox other) => other.Offset;
        public static explicit operator PolygonHitbox(PointHitbox other) => new(other.Offset);
    }
    public struct LineHitbox(Vector2 target) : IHitbox
    {
        public Vector2 Target = target;
        public Vector2 Offset = Vector2.Zero;
        public LineHitbox(Vector2 offset, Vector2 target) : this(target) { Offset = offset; }
        public LineHitbox(LineHitbox other) : this(other.Offset, other.Target) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle) 
        {
            LineHitbox ret = new(this);
            ret.Offset = PointHitbox.TransformPoint(Offset, pos, size, angle);
            ret.Target = PointHitbox.TransformPoint(Target, pos, size, angle);
            return ret;
        }
        public static explicit operator Vector4(LineHitbox other) => new(other.Offset.X, other.Offset.Y, other.Target.X, other.Target.Y);
        public static explicit operator PolygonHitbox(LineHitbox other) => new(other.Offset, other.Target);
    }
    public struct CircleHitbox(float radius) : IHitbox
    {
        public Vector2 Offset = Vector2.Zero;
        public float Radius = radius;
        public CircleHitbox(Vector2 offset, float radius) : this(radius) { Offset = offset; }
        public CircleHitbox(CircleHitbox other) : this(other.Offset, other.Radius) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle)
        {
            CircleHitbox ret = new(this);
            ret.Offset = PointHitbox.TransformPoint(Offset, pos, size, angle);
            ret.Radius *= MathP.Min(size.X, size.Y);
            return ret;
        }
        public static explicit operator Vector3(CircleHitbox other) => new(other.Offset.X, other.Offset.Y, other.Radius);
    }
    public struct AABBHitbox(Vector2 size) : IHitbox
    {
        public Vector2 Offset = Vector2.Zero;
        public Vector2 Size = size;
        public AABBHitbox(Vector2 offset, Vector2 size) : this(size) { Offset = offset; }
        public AABBHitbox(AABBHitbox other) : this(other.Offset, other.Size) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle)
        {
            AABBHitbox ret = new(this);
            ret.Offset = PointHitbox.TransformPoint(Offset, pos, size, angle);
            ret.Size *= size;
            return ret;
        }
        public static explicit operator Vector4(AABBHitbox other) => new(other.Offset.X, other.Offset.Y, other.Size.X, other.Size.Y);
        public static explicit operator PolygonHitbox(AABBHitbox other) => new(
            other.Offset + new Vector2(-other.Size.X, -other.Size.Y) / 2,
            other.Offset + new Vector2(other.Size.X, -other.Size.Y) / 2,
            other.Offset + new Vector2(other.Size.X, other.Size.Y) / 2,
            other.Offset + new Vector2(-other.Size.X, other.Size.Y) / 2);
    }
    public struct RectangleHitbox(Vector2 size, float angle) : IHitbox
    {
        public Vector2 Offset = Vector2.Zero;
        public Vector2 Size = size;
        public float Angle = angle;
        public RectangleHitbox(Vector2 offset, Vector2 size, float angle) : this(size, angle) { Offset = offset; }
        public RectangleHitbox(RectangleHitbox other): this(other.Offset, other.Size, other.Angle) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle)
        {
            RectangleHitbox ret = new(this);
            ret.Offset = PointHitbox.TransformPoint(Offset, pos, size, angle);
            ret.Size *= size;
            ret.Angle += angle;
            return ret;
        }
        public static explicit operator AABBHitbox(RectangleHitbox other) => new(other.Offset, other.Size);
        public static explicit operator Vector4(RectangleHitbox other) => new(other.Offset.X, other.Offset.Y, other.Size.X, other.Size.Y);
        public static explicit operator PolygonHitbox(RectangleHitbox other) => new(
            other.Offset + MathP.Rotate(new Vector2(-other.Size.X, -other.Size.Y) / 2, other.Angle),
            other.Offset + MathP.Rotate(new Vector2(other.Size.X, -other.Size.Y) / 2, other.Angle),
            other.Offset + MathP.Rotate(new Vector2(other.Size.X, other.Size.Y) / 2, other.Angle),
            other.Offset + MathP.Rotate(new Vector2(-other.Size.X, other.Size.Y) / 2, other.Angle));
    }
    public struct PolygonHitbox(params Vector2[] points): IHitbox
    {
        public Vector2[] Points = points;
        public readonly LineHitbox[] Lines => Points.Select((x, i, arr) => new LineHitbox(arr[i], arr[(i + 1) % arr.Length])).ToArray();
        public readonly float Left => Points.MinBy(x => x.X).X;
        public readonly float Right => Points.MaxBy(x => x.X).X;
        public readonly float Top => Points.MinBy(x => x.Y).Y;
        public readonly float Bottom => Points.MaxBy(x => x.Y).Y;
        public readonly Vector2 Center => new((Right + Left) / 2, (Bottom + Top) / 2);
        public readonly Vector2 Size => new(Right - Left, Bottom - Top);
        public PolygonHitbox(PolygonHitbox other) : this(other.Points) { }
        public readonly IHitbox Transform(Vector2 pos, Vector2 size, float angle) => 
            new PolygonHitbox([..Points.Select(x => PointHitbox.TransformPoint(x, pos, size, angle))]);
    }
}