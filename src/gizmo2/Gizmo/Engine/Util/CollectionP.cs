﻿using System.Numerics;

namespace Gizmo.Engine.Data
{
    public static class CollectionP
    {
        public static IEnumerable<T> Remove<T>(this IEnumerable<T> l, params T[] e) => l.Remove((IEnumerable<T>)e);
        public static IEnumerable<T> Remove<T>(this IEnumerable<T> l, IEnumerable<T> e) => l.Where(x => !e.Contains(x));
        public static Dictionary<K, V> ToDictionaryReal<K, V>(this IEnumerable<KeyValuePair<K, V>> c) where K : notnull
        {
            Dictionary<K, V> d = new Dictionary<K, V>();
            foreach (var x in c) d.Add(x.Key, x.Value);
            return d;
        }
        public static bool IsEmpty<T>(IEnumerable<T> l) => !l.Any();
        public static bool Intersects<T>(this IEnumerable<T> a, IEnumerable<T> b) => a.Intersect(b).Any();
        public static int[] Iota(int r) { int[] ret = new int[r]; for (int i = 0; i < r; i++) ret[i] = i; return ret; }
        public static Vector2 Map(this Vector2 orig, Func<float, float> fn) => new(fn(orig.X), fn(orig.Y));
        public static Vector3 Map(this Vector3 orig, Func<float, float> fn) => new(fn(orig.X), fn(orig.Y), fn(orig.Z));
        public static Vector4 Map(this Vector4 orig, Func<float, float> fn) => new(fn(orig.X), fn(orig.Y), fn(orig.Z), fn(orig.W));
        public static Vector2 Composite(this Vector2 a, Vector2 b, Func<float, float, float> fn) => new(fn(a.X, b.X), fn(a.Y, b.Y));
        public static Vector3 Composite(this Vector3 a, Vector3 b, Func<float, float, float> fn) => new(fn(a.X, b.X), fn(a.Y, b.Y), fn(a.Z, b.Z));
        public static Vector4 Composite(this Vector4 a, Vector4 b, Func<float, float, float> fn) => new(fn(a.X, b.X), fn(a.Y, b.Y), fn(a.Z, b.Z), fn(a.W, b.W));
        public static Vector2 Composite(this Vector2 a, Vector2 b, Vector2 c, Func<float, float, float, float> fn) => new(fn(a.X, b.X, c.X), fn(a.Y, b.Y, c.Y));
        public static Vector3 Composite(this Vector3 a, Vector3 b, Vector3 c, Func<float, float, float, float> fn) => new(fn(a.X, b.X, c.X), fn(a.Y, b.Y, c.Y), fn(a.Z, b.Z, c.Z));
        public static Vector4 Composite(this Vector4 a, Vector4 b, Vector4 c, Func<float, float, float, float> fn) => new(fn(a.X, b.X, c.X), fn(a.Y, b.Y, c.Y), fn(a.Z, b.Z, c.Z), fn(a.W, b.W, c.W));
        public static Vector2 Composite(this Vector2 a, Vector2 b, Vector2 c, Vector2 d, Func<float, float, float, float, float> fn) => new(fn(a.X, b.X, c.X, d.X), fn(a.Y, b.Y, c.Y, d.Y));
        public static Vector3 Composite(this Vector3 a, Vector3 b, Vector3 c, Vector3 d, Func<float, float, float, float, float> fn) => new(fn(a.X, b.X, c.X, d.X), fn(a.Y, b.Y, c.Y, d.Y), fn(a.Z, b.Z, c.Z, d.Z));
        public static Vector4 Composite(this Vector4 a, Vector4 b, Vector4 c, Vector4 d, Func<float, float, float, float, float> fn) => new(fn(a.X, b.X, c.X, d.X), fn(a.Y, b.Y, c.Y, d.Y), fn(a.Z, b.Z, c.Z, d.Z), fn(a.W, b.W, c.W, d.W));
        public static TSource? FirstOrGiven<TSource>(this IEnumerable<TSource> source, TSource _default)
        {
            foreach (var z in source) if (z != null) return z; return _default;
        }
        public static bool TryFirst<TSource>(this IEnumerable<TSource> source, out TSource? ret)
        {
            foreach (var z in source) if (z != null) { ret = z; return true; } ret = default; return false;
        }
        public static TSource? FirstOrGiven<TSource>(this IEnumerable<TSource> source, TSource target, TSource _default)
        {
            if (target == null) return default;
            foreach (var z in source) if (target.Equals(z)) return z; return _default;
        }
        public static bool TryFirst<TSource>(this IEnumerable<TSource> source, TSource target, out TSource? ret)
        {
            if (target == null) { ret = default; return false; }
            foreach (var z in source) if (target.Equals(z)) { ret = z; return true; } ret = default; return false;
        }
        public static TSource? FirstOrGiven<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> fn, TSource _default)
        {
            foreach (var z in source) if (fn(z)) return z; return _default;
        }
        public static bool TryFirst<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> fn, out TSource? ret)
        {
            foreach (var z in source) if (fn(z)) { ret = z; return true; } ret = default; return false;
        }
        public static TValue? FirstOrGiven<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, TKey key, TValue _default)
        {
            if (key == null) return default;
            foreach (var z in source) if (key.Equals(z.Key)) return z.Value; return _default;
        }
        public static bool TryFirst<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, TKey key, out TValue? ret)
        {
            if (key == null) { ret = default; return false; }
            foreach (var z in source) if (key.Equals(z.Key)) { ret = z.Value; return true; } ret = default; return false;
        }
        public static TValue? FirstOrGiven<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TKey, bool> fn, TValue _default)
        {
            foreach (var z in source) if (fn(z.Key)) return z.Value; return _default;
        }
        public static bool TryFirst<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TKey, bool> fn, out TValue? ret)
        {
            foreach (var z in source) if (fn(z.Key)) { ret = z.Value; return true; } ret = default; return false;
        }
        public static TValue? FirstOrGiven<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TValue, bool> fn, TValue _default)
        {
            foreach (var z in source) if (fn(z.Value)) return z.Value; return _default;
        }
        public static bool TryFirst<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TValue, bool> fn, out TValue? ret)
        {
            foreach (var z in source) if (fn(z.Value)) { ret = z.Value; return true; } ret = default; return false;
        }
        public static TValue? FirstOrGiven<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TKey, TValue, bool> fn, TValue _default)
        {
            foreach (var z in source) if (fn(z.Key, z.Value)) return z.Value; return _default;
        }
        public static bool TryFirst<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>> source, Func<TKey, TValue, bool> fn, out TValue? ret)
        {
            foreach (var z in source) if (fn(z.Key, z.Value)) { ret = z.Value; return true; } ret = default; return false;
        }
        public static bool All<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
        {
            TSource[] arr = [.. source];
            for (var i = 0; i < arr.Length; i++) if (!predicate(arr[i], i)) return false;
            return true;
        }
        public static bool Any<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
        {
            TSource[] arr = [.. source];
            for (var i = 0; i < arr.Length; i++) if (predicate(arr[i], i)) return true;
            return false;
        }
        public static bool All<TSource>(this IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TSource>, bool> predicate)
        {
            TSource[] arr = [.. source];
            for (var i = 0; i < arr.Length; i++) if (!predicate(arr[i], i, arr)) return false;
            return true;
        }
        public static bool Any<TSource>(this IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TSource>, bool> predicate)
        {
            TSource[] arr = [.. source];
            for (var i = 0; i < arr.Length; i++) if (predicate(arr[i], i, arr)) return true;
            return false;
        }
        public static IEnumerable<TResult> Select<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, int, TSource[], TResult> selector)
        {
            List<TResult> ret = [];
            for (var i = 0; i < source.Count(); i++) ret.Add(selector(source.ElementAt(i), i, source.ToArray()));
            return ret;
        }
        public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, int, TSource[], bool> selector)
        {
            List<TSource> ret = [];
            for (var i = 0; i < source.Count(); i++) if (selector(source.ElementAt(i), i, source.ToArray())) ret.Add(source.ElementAt(i));
            return ret;
        }

        #region SWIZZLE INSANITY

        // generic
        public static Vector2 XX(this float x) => new(x, x);
        public static Vector2 XY(float x, float y) => new(x, y);
        public static Vector3 XXX(this float x) => new(x, x, x);
        public static Vector3 XXY(float x, float y) => new(x, x, y);
        public static Vector3 XYX(float x, float y) => new(x, y, x);
        public static Vector3 XYY(float x, float y) => new(x, y, y);
        public static Vector3 XYZ(float x, float y, float z) => new(x, y, z);
        public static Vector4 XXXX(this float x) => new(x, x, x, x);
        public static Vector4 XXXY(float x, float y) => new(x, x, x, y);
        public static Vector4 XXYX(float x, float y) => new(x, x, y, x);
        public static Vector4 XYXX(float x, float y) => new(x, y, x, x);
        public static Vector4 XXYY(float x, float y) => new(x, x, y, y);
        public static Vector4 XYXY(float x, float y) => new(x, y, x, y);
        public static Vector4 XYYX(float x, float y) => new(x, y, y, x);
        public static Vector4 XYYY(float x, float y) => new(x, y, y, y);
        public static Vector4 XXYZ(float x, float y, float z) => new(x, x, y, z);
        public static Vector4 XYXZ(float x, float y, float z) => new(x, y, x, z);
        public static Vector4 XYYZ(float x, float y, float z) => new(x, y, y, z);
        public static Vector4 XYZX(float x, float y, float z) => new(x, y, z, x);
        public static Vector4 XYZY(float x, float y, float z) => new(x, y, z, y);
        public static Vector4 XYZZ(float x, float y, float z) => new(x, y, z, z);
        public static Vector4 XYZW(float x, float y, float z, float w) => new(x, y, z, w);

        // Source: Vector2, Target: Vector2
        public static Vector2 XX(this Vector2 v) => new(v.X, v.X);
        public static Vector2 YX(this Vector2 v) => new(v.Y, v.X);
        public static Vector2 XY(this Vector2 v) => new(v.X, v.Y);
        public static Vector2 YY(this Vector2 v) => new(v.Y, v.Y);

        // Source: Vector3, Target: Vector2
        public static Vector2 XX(this Vector3 v) => new(v.X, v.X);
        public static Vector2 YX(this Vector3 v) => new(v.Y, v.X);
        public static Vector2 ZX(this Vector3 v) => new(v.Z, v.X);
        public static Vector2 XY(this Vector3 v) => new(v.X, v.Y);
        public static Vector2 YY(this Vector3 v) => new(v.Y, v.Y);
        public static Vector2 ZY(this Vector3 v) => new(v.Z, v.Y);
        public static Vector2 XZ(this Vector3 v) => new(v.X, v.Z);
        public static Vector2 YZ(this Vector3 v) => new(v.Y, v.Z);
        public static Vector2 ZZ(this Vector3 v) => new(v.Z, v.Z);

        // Source: Vector4, Target: Vector2
        public static Vector2 XX(this Vector4 v) => new(v.X, v.X);
        public static Vector2 YX(this Vector4 v) => new(v.Y, v.X);
        public static Vector2 ZX(this Vector4 v) => new(v.Z, v.X);
        public static Vector2 WX(this Vector4 v) => new(v.W, v.X);
        public static Vector2 XY(this Vector4 v) => new(v.X, v.Y);
        public static Vector2 YY(this Vector4 v) => new(v.Y, v.Y);
        public static Vector2 ZY(this Vector4 v) => new(v.Z, v.Y);
        public static Vector2 WY(this Vector4 v) => new(v.W, v.Y);
        public static Vector2 XZ(this Vector4 v) => new(v.X, v.Z);
        public static Vector2 YZ(this Vector4 v) => new(v.Y, v.Z);
        public static Vector2 ZZ(this Vector4 v) => new(v.Z, v.Z);
        public static Vector2 WZ(this Vector4 v) => new(v.W, v.Z);
        public static Vector2 XW(this Vector4 v) => new(v.X, v.W);
        public static Vector2 YW(this Vector4 v) => new(v.Y, v.W);
        public static Vector2 ZW(this Vector4 v) => new(v.Z, v.W);
        public static Vector2 WW(this Vector4 v) => new(v.W, v.W);

        // Source: Vector2, Target: Vector3
        public static Vector3 XXX(this Vector2 v) => new(v.X, v.X, v.X);
        public static Vector3 YXX(this Vector2 v) => new(v.Y, v.X, v.X);
        public static Vector3 XYX(this Vector2 v) => new(v.X, v.Y, v.X);
        public static Vector3 YYX(this Vector2 v) => new(v.Y, v.Y, v.X);
        public static Vector3 XXY(this Vector2 v) => new(v.X, v.X, v.Y);
        public static Vector3 YXY(this Vector2 v) => new(v.Y, v.X, v.Y);
        public static Vector3 XYY(this Vector2 v) => new(v.X, v.Y, v.Y);
        public static Vector3 YYY(this Vector2 v) => new(v.Y, v.Y, v.Y);

        // Source: Vector3, Target: Vector3
        public static Vector3 XXX(this Vector3 v) => new(v.X, v.X, v.X);
        public static Vector3 YXX(this Vector3 v) => new(v.Y, v.X, v.X);
        public static Vector3 ZXX(this Vector3 v) => new(v.Z, v.X, v.X);
        public static Vector3 XYX(this Vector3 v) => new(v.X, v.Y, v.X);
        public static Vector3 YYX(this Vector3 v) => new(v.Y, v.Y, v.X);
        public static Vector3 ZYX(this Vector3 v) => new(v.Z, v.Y, v.X);
        public static Vector3 XZX(this Vector3 v) => new(v.X, v.Z, v.X);
        public static Vector3 YZX(this Vector3 v) => new(v.Y, v.Z, v.X);
        public static Vector3 ZZX(this Vector3 v) => new(v.Z, v.Z, v.X);
        public static Vector3 XXY(this Vector3 v) => new(v.X, v.X, v.Y);
        public static Vector3 YXY(this Vector3 v) => new(v.Y, v.X, v.Y);
        public static Vector3 ZXY(this Vector3 v) => new(v.Z, v.X, v.Y);
        public static Vector3 XYY(this Vector3 v) => new(v.X, v.Y, v.Y);
        public static Vector3 YYY(this Vector3 v) => new(v.Y, v.Y, v.Y);
        public static Vector3 ZYY(this Vector3 v) => new(v.Z, v.Y, v.Y);
        public static Vector3 XZY(this Vector3 v) => new(v.X, v.Z, v.Y);
        public static Vector3 YZY(this Vector3 v) => new(v.Y, v.Z, v.Y);
        public static Vector3 ZZY(this Vector3 v) => new(v.Z, v.Z, v.Y);
        public static Vector3 XXZ(this Vector3 v) => new(v.X, v.X, v.Z);
        public static Vector3 YXZ(this Vector3 v) => new(v.Y, v.X, v.Z);
        public static Vector3 ZXZ(this Vector3 v) => new(v.Z, v.X, v.Z);
        public static Vector3 XYZ(this Vector3 v) => new(v.X, v.Y, v.Z);
        public static Vector3 YYZ(this Vector3 v) => new(v.Y, v.Y, v.Z);
        public static Vector3 ZYZ(this Vector3 v) => new(v.Z, v.Y, v.Z);
        public static Vector3 XZZ(this Vector3 v) => new(v.X, v.Z, v.Z);
        public static Vector3 YZZ(this Vector3 v) => new(v.Y, v.Z, v.Z);
        public static Vector3 ZZZ(this Vector3 v) => new(v.Z, v.Z, v.Z);

        // Source: Vector4, Target: Vector3
        public static Vector3 XXX(this Vector4 v) => new(v.X, v.X, v.X);
        public static Vector3 YXX(this Vector4 v) => new(v.Y, v.X, v.X);
        public static Vector3 ZXX(this Vector4 v) => new(v.Z, v.X, v.X);
        public static Vector3 WXX(this Vector4 v) => new(v.W, v.X, v.X);
        public static Vector3 XYX(this Vector4 v) => new(v.X, v.Y, v.X);
        public static Vector3 YYX(this Vector4 v) => new(v.Y, v.Y, v.X);
        public static Vector3 ZYX(this Vector4 v) => new(v.Z, v.Y, v.X);
        public static Vector3 WYX(this Vector4 v) => new(v.W, v.Y, v.X);
        public static Vector3 XZX(this Vector4 v) => new(v.X, v.Z, v.X);
        public static Vector3 YZX(this Vector4 v) => new(v.Y, v.Z, v.X);
        public static Vector3 ZZX(this Vector4 v) => new(v.Z, v.Z, v.X);
        public static Vector3 WZX(this Vector4 v) => new(v.W, v.Z, v.X);
        public static Vector3 XWX(this Vector4 v) => new(v.X, v.W, v.X);
        public static Vector3 YWX(this Vector4 v) => new(v.Y, v.W, v.X);
        public static Vector3 ZWX(this Vector4 v) => new(v.Z, v.W, v.X);
        public static Vector3 WWX(this Vector4 v) => new(v.W, v.W, v.X);
        public static Vector3 XXY(this Vector4 v) => new(v.X, v.X, v.Y);
        public static Vector3 YXY(this Vector4 v) => new(v.Y, v.X, v.Y);
        public static Vector3 ZXY(this Vector4 v) => new(v.Z, v.X, v.Y);
        public static Vector3 WXY(this Vector4 v) => new(v.W, v.X, v.Y);
        public static Vector3 XYY(this Vector4 v) => new(v.X, v.Y, v.Y);
        public static Vector3 YYY(this Vector4 v) => new(v.Y, v.Y, v.Y);
        public static Vector3 ZYY(this Vector4 v) => new(v.Z, v.Y, v.Y);
        public static Vector3 WYY(this Vector4 v) => new(v.W, v.Y, v.Y);
        public static Vector3 XZY(this Vector4 v) => new(v.X, v.Z, v.Y);
        public static Vector3 YZY(this Vector4 v) => new(v.Y, v.Z, v.Y);
        public static Vector3 ZZY(this Vector4 v) => new(v.Z, v.Z, v.Y);
        public static Vector3 WZY(this Vector4 v) => new(v.W, v.Z, v.Y);
        public static Vector3 XWY(this Vector4 v) => new(v.X, v.W, v.Y);
        public static Vector3 YWY(this Vector4 v) => new(v.Y, v.W, v.Y);
        public static Vector3 ZWY(this Vector4 v) => new(v.Z, v.W, v.Y);
        public static Vector3 WWY(this Vector4 v) => new(v.W, v.W, v.Y);
        public static Vector3 XXZ(this Vector4 v) => new(v.X, v.X, v.Z);
        public static Vector3 YXZ(this Vector4 v) => new(v.Y, v.X, v.Z);
        public static Vector3 ZXZ(this Vector4 v) => new(v.Z, v.X, v.Z);
        public static Vector3 WXZ(this Vector4 v) => new(v.W, v.X, v.Z);
        public static Vector3 XYZ(this Vector4 v) => new(v.X, v.Y, v.Z);
        public static Vector3 YYZ(this Vector4 v) => new(v.Y, v.Y, v.Z);
        public static Vector3 ZYZ(this Vector4 v) => new(v.Z, v.Y, v.Z);
        public static Vector3 WYZ(this Vector4 v) => new(v.W, v.Y, v.Z);
        public static Vector3 XZZ(this Vector4 v) => new(v.X, v.Z, v.Z);
        public static Vector3 YZZ(this Vector4 v) => new(v.Y, v.Z, v.Z);
        public static Vector3 ZZZ(this Vector4 v) => new(v.Z, v.Z, v.Z);
        public static Vector3 WZZ(this Vector4 v) => new(v.W, v.Z, v.Z);
        public static Vector3 XWZ(this Vector4 v) => new(v.X, v.W, v.Z);
        public static Vector3 YWZ(this Vector4 v) => new(v.Y, v.W, v.Z);
        public static Vector3 ZWZ(this Vector4 v) => new(v.Z, v.W, v.Z);
        public static Vector3 WWZ(this Vector4 v) => new(v.W, v.W, v.Z);
        public static Vector3 XXW(this Vector4 v) => new(v.X, v.X, v.W);
        public static Vector3 YXW(this Vector4 v) => new(v.Y, v.X, v.W);
        public static Vector3 ZXW(this Vector4 v) => new(v.Z, v.X, v.W);
        public static Vector3 WXW(this Vector4 v) => new(v.W, v.X, v.W);
        public static Vector3 XYW(this Vector4 v) => new(v.X, v.Y, v.W);
        public static Vector3 YYW(this Vector4 v) => new(v.Y, v.Y, v.W);
        public static Vector3 ZYW(this Vector4 v) => new(v.Z, v.Y, v.W);
        public static Vector3 WYW(this Vector4 v) => new(v.W, v.Y, v.W);
        public static Vector3 XZW(this Vector4 v) => new(v.X, v.Z, v.W);
        public static Vector3 YZW(this Vector4 v) => new(v.Y, v.Z, v.W);
        public static Vector3 ZZW(this Vector4 v) => new(v.Z, v.Z, v.W);
        public static Vector3 WZW(this Vector4 v) => new(v.W, v.Z, v.W);
        public static Vector3 XWW(this Vector4 v) => new(v.X, v.W, v.W);
        public static Vector3 YWW(this Vector4 v) => new(v.Y, v.W, v.W);
        public static Vector3 ZWW(this Vector4 v) => new(v.Z, v.W, v.W);
        public static Vector3 WWW(this Vector4 v) => new(v.W, v.W, v.W);

        // Source: Vector2, Target: Vector4
        public static Vector4 XXXX(this Vector2 v) => new(v.X, v.X, v.X, v.X);
        public static Vector4 YXXX(this Vector2 v) => new(v.Y, v.X, v.X, v.X);
        public static Vector4 XYXX(this Vector2 v) => new(v.X, v.Y, v.X, v.X);
        public static Vector4 YYXX(this Vector2 v) => new(v.Y, v.Y, v.X, v.X);
        public static Vector4 XXYX(this Vector2 v) => new(v.X, v.X, v.Y, v.X);
        public static Vector4 YXYX(this Vector2 v) => new(v.Y, v.X, v.Y, v.X);
        public static Vector4 XYYX(this Vector2 v) => new(v.X, v.Y, v.Y, v.X);
        public static Vector4 YYYX(this Vector2 v) => new(v.Y, v.Y, v.Y, v.X);
        public static Vector4 XXXY(this Vector2 v) => new(v.X, v.X, v.X, v.Y);
        public static Vector4 YXXY(this Vector2 v) => new(v.Y, v.X, v.X, v.Y);
        public static Vector4 XYXY(this Vector2 v) => new(v.X, v.Y, v.X, v.Y);
        public static Vector4 YYXY(this Vector2 v) => new(v.Y, v.Y, v.X, v.Y);
        public static Vector4 XXYY(this Vector2 v) => new(v.X, v.X, v.Y, v.Y);
        public static Vector4 YXYY(this Vector2 v) => new(v.Y, v.X, v.Y, v.Y);
        public static Vector4 XYYY(this Vector2 v) => new(v.X, v.Y, v.Y, v.Y);
        public static Vector4 YYYY(this Vector2 v) => new(v.Y, v.Y, v.Y, v.Y);

        // Source: Vector3, Target: Vector4
        public static Vector4 XXXX(this Vector3 v) => new(v.X, v.X, v.X, v.X);
        public static Vector4 YXXX(this Vector3 v) => new(v.Y, v.X, v.X, v.X);
        public static Vector4 ZXXX(this Vector3 v) => new(v.Z, v.X, v.X, v.X);
        public static Vector4 XYXX(this Vector3 v) => new(v.X, v.Y, v.X, v.X);
        public static Vector4 YYXX(this Vector3 v) => new(v.Y, v.Y, v.X, v.X);
        public static Vector4 ZYXX(this Vector3 v) => new(v.Z, v.Y, v.X, v.X);
        public static Vector4 XZXX(this Vector3 v) => new(v.X, v.Z, v.X, v.X);
        public static Vector4 YZXX(this Vector3 v) => new(v.Y, v.Z, v.X, v.X);
        public static Vector4 ZZXX(this Vector3 v) => new(v.Z, v.Z, v.X, v.X);
        public static Vector4 XXYX(this Vector3 v) => new(v.X, v.X, v.Y, v.X);
        public static Vector4 YXYX(this Vector3 v) => new(v.Y, v.X, v.Y, v.X);
        public static Vector4 ZXYX(this Vector3 v) => new(v.Z, v.X, v.Y, v.X);
        public static Vector4 XYYX(this Vector3 v) => new(v.X, v.Y, v.Y, v.X);
        public static Vector4 YYYX(this Vector3 v) => new(v.Y, v.Y, v.Y, v.X);
        public static Vector4 ZYYX(this Vector3 v) => new(v.Z, v.Y, v.Y, v.X);
        public static Vector4 XZYX(this Vector3 v) => new(v.X, v.Z, v.Y, v.X);
        public static Vector4 YZYX(this Vector3 v) => new(v.Y, v.Z, v.Y, v.X);
        public static Vector4 ZZYX(this Vector3 v) => new(v.Z, v.Z, v.Y, v.X);
        public static Vector4 XXZX(this Vector3 v) => new(v.X, v.X, v.Z, v.X);
        public static Vector4 YXZX(this Vector3 v) => new(v.Y, v.X, v.Z, v.X);
        public static Vector4 ZXZX(this Vector3 v) => new(v.Z, v.X, v.Z, v.X);
        public static Vector4 XYZX(this Vector3 v) => new(v.X, v.Y, v.Z, v.X);
        public static Vector4 YYZX(this Vector3 v) => new(v.Y, v.Y, v.Z, v.X);
        public static Vector4 ZYZX(this Vector3 v) => new(v.Z, v.Y, v.Z, v.X);
        public static Vector4 XZZX(this Vector3 v) => new(v.X, v.Z, v.Z, v.X);
        public static Vector4 YZZX(this Vector3 v) => new(v.Y, v.Z, v.Z, v.X);
        public static Vector4 ZZZX(this Vector3 v) => new(v.Z, v.Z, v.Z, v.X);
        public static Vector4 XXXY(this Vector3 v) => new(v.X, v.X, v.X, v.Y);
        public static Vector4 YXXY(this Vector3 v) => new(v.Y, v.X, v.X, v.Y);
        public static Vector4 ZXXY(this Vector3 v) => new(v.Z, v.X, v.X, v.Y);
        public static Vector4 XYXY(this Vector3 v) => new(v.X, v.Y, v.X, v.Y);
        public static Vector4 YYXY(this Vector3 v) => new(v.Y, v.Y, v.X, v.Y);
        public static Vector4 ZYXY(this Vector3 v) => new(v.Z, v.Y, v.X, v.Y);
        public static Vector4 XZXY(this Vector3 v) => new(v.X, v.Z, v.X, v.Y);
        public static Vector4 YZXY(this Vector3 v) => new(v.Y, v.Z, v.X, v.Y);
        public static Vector4 ZZXY(this Vector3 v) => new(v.Z, v.Z, v.X, v.Y);
        public static Vector4 XXYY(this Vector3 v) => new(v.X, v.X, v.Y, v.Y);
        public static Vector4 YXYY(this Vector3 v) => new(v.Y, v.X, v.Y, v.Y);
        public static Vector4 ZXYY(this Vector3 v) => new(v.Z, v.X, v.Y, v.Y);
        public static Vector4 XYYY(this Vector3 v) => new(v.X, v.Y, v.Y, v.Y);
        public static Vector4 YYYY(this Vector3 v) => new(v.Y, v.Y, v.Y, v.Y);
        public static Vector4 ZYYY(this Vector3 v) => new(v.Z, v.Y, v.Y, v.Y);
        public static Vector4 XZYY(this Vector3 v) => new(v.X, v.Z, v.Y, v.Y);
        public static Vector4 YZYY(this Vector3 v) => new(v.Y, v.Z, v.Y, v.Y);
        public static Vector4 ZZYY(this Vector3 v) => new(v.Z, v.Z, v.Y, v.Y);
        public static Vector4 XXZY(this Vector3 v) => new(v.X, v.X, v.Z, v.Y);
        public static Vector4 YXZY(this Vector3 v) => new(v.Y, v.X, v.Z, v.Y);
        public static Vector4 ZXZY(this Vector3 v) => new(v.Z, v.X, v.Z, v.Y);
        public static Vector4 XYZY(this Vector3 v) => new(v.X, v.Y, v.Z, v.Y);
        public static Vector4 YYZY(this Vector3 v) => new(v.Y, v.Y, v.Z, v.Y);
        public static Vector4 ZYZY(this Vector3 v) => new(v.Z, v.Y, v.Z, v.Y);
        public static Vector4 XZZY(this Vector3 v) => new(v.X, v.Z, v.Z, v.Y);
        public static Vector4 YZZY(this Vector3 v) => new(v.Y, v.Z, v.Z, v.Y);
        public static Vector4 ZZZY(this Vector3 v) => new(v.Z, v.Z, v.Z, v.Y);
        public static Vector4 XXXZ(this Vector3 v) => new(v.X, v.X, v.X, v.Z);
        public static Vector4 YXXZ(this Vector3 v) => new(v.Y, v.X, v.X, v.Z);
        public static Vector4 ZXXZ(this Vector3 v) => new(v.Z, v.X, v.X, v.Z);
        public static Vector4 XYXZ(this Vector3 v) => new(v.X, v.Y, v.X, v.Z);
        public static Vector4 YYXZ(this Vector3 v) => new(v.Y, v.Y, v.X, v.Z);
        public static Vector4 ZYXZ(this Vector3 v) => new(v.Z, v.Y, v.X, v.Z);
        public static Vector4 XZXZ(this Vector3 v) => new(v.X, v.Z, v.X, v.Z);
        public static Vector4 YZXZ(this Vector3 v) => new(v.Y, v.Z, v.X, v.Z);
        public static Vector4 ZZXZ(this Vector3 v) => new(v.Z, v.Z, v.X, v.Z);
        public static Vector4 XXYZ(this Vector3 v) => new(v.X, v.X, v.Y, v.Z);
        public static Vector4 YXYZ(this Vector3 v) => new(v.Y, v.X, v.Y, v.Z);
        public static Vector4 ZXYZ(this Vector3 v) => new(v.Z, v.X, v.Y, v.Z);
        public static Vector4 XYYZ(this Vector3 v) => new(v.X, v.Y, v.Y, v.Z);
        public static Vector4 YYYZ(this Vector3 v) => new(v.Y, v.Y, v.Y, v.Z);
        public static Vector4 ZYYZ(this Vector3 v) => new(v.Z, v.Y, v.Y, v.Z);
        public static Vector4 XZYZ(this Vector3 v) => new(v.X, v.Z, v.Y, v.Z);
        public static Vector4 YZYZ(this Vector3 v) => new(v.Y, v.Z, v.Y, v.Z);
        public static Vector4 ZZYZ(this Vector3 v) => new(v.Z, v.Z, v.Y, v.Z);
        public static Vector4 XXZZ(this Vector3 v) => new(v.X, v.X, v.Z, v.Z);
        public static Vector4 YXZZ(this Vector3 v) => new(v.Y, v.X, v.Z, v.Z);
        public static Vector4 ZXZZ(this Vector3 v) => new(v.Z, v.X, v.Z, v.Z);
        public static Vector4 XYZZ(this Vector3 v) => new(v.X, v.Y, v.Z, v.Z);
        public static Vector4 YYZZ(this Vector3 v) => new(v.Y, v.Y, v.Z, v.Z);
        public static Vector4 ZYZZ(this Vector3 v) => new(v.Z, v.Y, v.Z, v.Z);
        public static Vector4 XZZZ(this Vector3 v) => new(v.X, v.Z, v.Z, v.Z);
        public static Vector4 YZZZ(this Vector3 v) => new(v.Y, v.Z, v.Z, v.Z);
        public static Vector4 ZZZZ(this Vector3 v) => new(v.Z, v.Z, v.Z, v.Z);

        // Source: Vector4, Target: Vector4
        public static Vector4 XXXX(this Vector4 v) => new(v.X, v.X, v.X, v.X);
        public static Vector4 YXXX(this Vector4 v) => new(v.Y, v.X, v.X, v.X);
        public static Vector4 ZXXX(this Vector4 v) => new(v.Z, v.X, v.X, v.X);
        public static Vector4 WXXX(this Vector4 v) => new(v.W, v.X, v.X, v.X);
        public static Vector4 XYXX(this Vector4 v) => new(v.X, v.Y, v.X, v.X);
        public static Vector4 YYXX(this Vector4 v) => new(v.Y, v.Y, v.X, v.X);
        public static Vector4 ZYXX(this Vector4 v) => new(v.Z, v.Y, v.X, v.X);
        public static Vector4 WYXX(this Vector4 v) => new(v.W, v.Y, v.X, v.X);
        public static Vector4 XZXX(this Vector4 v) => new(v.X, v.Z, v.X, v.X);
        public static Vector4 YZXX(this Vector4 v) => new(v.Y, v.Z, v.X, v.X);
        public static Vector4 ZZXX(this Vector4 v) => new(v.Z, v.Z, v.X, v.X);
        public static Vector4 WZXX(this Vector4 v) => new(v.W, v.Z, v.X, v.X);
        public static Vector4 XWXX(this Vector4 v) => new(v.X, v.W, v.X, v.X);
        public static Vector4 YWXX(this Vector4 v) => new(v.Y, v.W, v.X, v.X);
        public static Vector4 ZWXX(this Vector4 v) => new(v.Z, v.W, v.X, v.X);
        public static Vector4 WWXX(this Vector4 v) => new(v.W, v.W, v.X, v.X);
        public static Vector4 XXYX(this Vector4 v) => new(v.X, v.X, v.Y, v.X);
        public static Vector4 YXYX(this Vector4 v) => new(v.Y, v.X, v.Y, v.X);
        public static Vector4 ZXYX(this Vector4 v) => new(v.Z, v.X, v.Y, v.X);
        public static Vector4 WXYX(this Vector4 v) => new(v.W, v.X, v.Y, v.X);
        public static Vector4 XYYX(this Vector4 v) => new(v.X, v.Y, v.Y, v.X);
        public static Vector4 YYYX(this Vector4 v) => new(v.Y, v.Y, v.Y, v.X);
        public static Vector4 ZYYX(this Vector4 v) => new(v.Z, v.Y, v.Y, v.X);
        public static Vector4 WYYX(this Vector4 v) => new(v.W, v.Y, v.Y, v.X);
        public static Vector4 XZYX(this Vector4 v) => new(v.X, v.Z, v.Y, v.X);
        public static Vector4 YZYX(this Vector4 v) => new(v.Y, v.Z, v.Y, v.X);
        public static Vector4 ZZYX(this Vector4 v) => new(v.Z, v.Z, v.Y, v.X);
        public static Vector4 WZYX(this Vector4 v) => new(v.W, v.Z, v.Y, v.X);
        public static Vector4 XWYX(this Vector4 v) => new(v.X, v.W, v.Y, v.X);
        public static Vector4 YWYX(this Vector4 v) => new(v.Y, v.W, v.Y, v.X);
        public static Vector4 ZWYX(this Vector4 v) => new(v.Z, v.W, v.Y, v.X);
        public static Vector4 WWYX(this Vector4 v) => new(v.W, v.W, v.Y, v.X);
        public static Vector4 XXZX(this Vector4 v) => new(v.X, v.X, v.Z, v.X);
        public static Vector4 YXZX(this Vector4 v) => new(v.Y, v.X, v.Z, v.X);
        public static Vector4 ZXZX(this Vector4 v) => new(v.Z, v.X, v.Z, v.X);
        public static Vector4 WXZX(this Vector4 v) => new(v.W, v.X, v.Z, v.X);
        public static Vector4 XYZX(this Vector4 v) => new(v.X, v.Y, v.Z, v.X);
        public static Vector4 YYZX(this Vector4 v) => new(v.Y, v.Y, v.Z, v.X);
        public static Vector4 ZYZX(this Vector4 v) => new(v.Z, v.Y, v.Z, v.X);
        public static Vector4 WYZX(this Vector4 v) => new(v.W, v.Y, v.Z, v.X);
        public static Vector4 XZZX(this Vector4 v) => new(v.X, v.Z, v.Z, v.X);
        public static Vector4 YZZX(this Vector4 v) => new(v.Y, v.Z, v.Z, v.X);
        public static Vector4 ZZZX(this Vector4 v) => new(v.Z, v.Z, v.Z, v.X);
        public static Vector4 WZZX(this Vector4 v) => new(v.W, v.Z, v.Z, v.X);
        public static Vector4 XWZX(this Vector4 v) => new(v.X, v.W, v.Z, v.X);
        public static Vector4 YWZX(this Vector4 v) => new(v.Y, v.W, v.Z, v.X);
        public static Vector4 ZWZX(this Vector4 v) => new(v.Z, v.W, v.Z, v.X);
        public static Vector4 WWZX(this Vector4 v) => new(v.W, v.W, v.Z, v.X);
        public static Vector4 XXWX(this Vector4 v) => new(v.X, v.X, v.W, v.X);
        public static Vector4 YXWX(this Vector4 v) => new(v.Y, v.X, v.W, v.X);
        public static Vector4 ZXWX(this Vector4 v) => new(v.Z, v.X, v.W, v.X);
        public static Vector4 WXWX(this Vector4 v) => new(v.W, v.X, v.W, v.X);
        public static Vector4 XYWX(this Vector4 v) => new(v.X, v.Y, v.W, v.X);
        public static Vector4 YYWX(this Vector4 v) => new(v.Y, v.Y, v.W, v.X);
        public static Vector4 ZYWX(this Vector4 v) => new(v.Z, v.Y, v.W, v.X);
        public static Vector4 WYWX(this Vector4 v) => new(v.W, v.Y, v.W, v.X);
        public static Vector4 XZWX(this Vector4 v) => new(v.X, v.Z, v.W, v.X);
        public static Vector4 YZWX(this Vector4 v) => new(v.Y, v.Z, v.W, v.X);
        public static Vector4 ZZWX(this Vector4 v) => new(v.Z, v.Z, v.W, v.X);
        public static Vector4 WZWX(this Vector4 v) => new(v.W, v.Z, v.W, v.X);
        public static Vector4 XWWX(this Vector4 v) => new(v.X, v.W, v.W, v.X);
        public static Vector4 YWWX(this Vector4 v) => new(v.Y, v.W, v.W, v.X);
        public static Vector4 ZWWX(this Vector4 v) => new(v.Z, v.W, v.W, v.X);
        public static Vector4 WWWX(this Vector4 v) => new(v.W, v.W, v.W, v.X);
        public static Vector4 XXXY(this Vector4 v) => new(v.X, v.X, v.X, v.Y);
        public static Vector4 YXXY(this Vector4 v) => new(v.Y, v.X, v.X, v.Y);
        public static Vector4 ZXXY(this Vector4 v) => new(v.Z, v.X, v.X, v.Y);
        public static Vector4 WXXY(this Vector4 v) => new(v.W, v.X, v.X, v.Y);
        public static Vector4 XYXY(this Vector4 v) => new(v.X, v.Y, v.X, v.Y);
        public static Vector4 YYXY(this Vector4 v) => new(v.Y, v.Y, v.X, v.Y);
        public static Vector4 ZYXY(this Vector4 v) => new(v.Z, v.Y, v.X, v.Y);
        public static Vector4 WYXY(this Vector4 v) => new(v.W, v.Y, v.X, v.Y);
        public static Vector4 XZXY(this Vector4 v) => new(v.X, v.Z, v.X, v.Y);
        public static Vector4 YZXY(this Vector4 v) => new(v.Y, v.Z, v.X, v.Y);
        public static Vector4 ZZXY(this Vector4 v) => new(v.Z, v.Z, v.X, v.Y);
        public static Vector4 WZXY(this Vector4 v) => new(v.W, v.Z, v.X, v.Y);
        public static Vector4 XWXY(this Vector4 v) => new(v.X, v.W, v.X, v.Y);
        public static Vector4 YWXY(this Vector4 v) => new(v.Y, v.W, v.X, v.Y);
        public static Vector4 ZWXY(this Vector4 v) => new(v.Z, v.W, v.X, v.Y);
        public static Vector4 WWXY(this Vector4 v) => new(v.W, v.W, v.X, v.Y);
        public static Vector4 XXYY(this Vector4 v) => new(v.X, v.X, v.Y, v.Y);
        public static Vector4 YXYY(this Vector4 v) => new(v.Y, v.X, v.Y, v.Y);
        public static Vector4 ZXYY(this Vector4 v) => new(v.Z, v.X, v.Y, v.Y);
        public static Vector4 WXYY(this Vector4 v) => new(v.W, v.X, v.Y, v.Y);
        public static Vector4 XYYY(this Vector4 v) => new(v.X, v.Y, v.Y, v.Y);
        public static Vector4 YYYY(this Vector4 v) => new(v.Y, v.Y, v.Y, v.Y);
        public static Vector4 ZYYY(this Vector4 v) => new(v.Z, v.Y, v.Y, v.Y);
        public static Vector4 WYYY(this Vector4 v) => new(v.W, v.Y, v.Y, v.Y);
        public static Vector4 XZYY(this Vector4 v) => new(v.X, v.Z, v.Y, v.Y);
        public static Vector4 YZYY(this Vector4 v) => new(v.Y, v.Z, v.Y, v.Y);
        public static Vector4 ZZYY(this Vector4 v) => new(v.Z, v.Z, v.Y, v.Y);
        public static Vector4 WZYY(this Vector4 v) => new(v.W, v.Z, v.Y, v.Y);
        public static Vector4 XWYY(this Vector4 v) => new(v.X, v.W, v.Y, v.Y);
        public static Vector4 YWYY(this Vector4 v) => new(v.Y, v.W, v.Y, v.Y);
        public static Vector4 ZWYY(this Vector4 v) => new(v.Z, v.W, v.Y, v.Y);
        public static Vector4 WWYY(this Vector4 v) => new(v.W, v.W, v.Y, v.Y);
        public static Vector4 XXZY(this Vector4 v) => new(v.X, v.X, v.Z, v.Y);
        public static Vector4 YXZY(this Vector4 v) => new(v.Y, v.X, v.Z, v.Y);
        public static Vector4 ZXZY(this Vector4 v) => new(v.Z, v.X, v.Z, v.Y);
        public static Vector4 WXZY(this Vector4 v) => new(v.W, v.X, v.Z, v.Y);
        public static Vector4 XYZY(this Vector4 v) => new(v.X, v.Y, v.Z, v.Y);
        public static Vector4 YYZY(this Vector4 v) => new(v.Y, v.Y, v.Z, v.Y);
        public static Vector4 ZYZY(this Vector4 v) => new(v.Z, v.Y, v.Z, v.Y);
        public static Vector4 WYZY(this Vector4 v) => new(v.W, v.Y, v.Z, v.Y);
        public static Vector4 XZZY(this Vector4 v) => new(v.X, v.Z, v.Z, v.Y);
        public static Vector4 YZZY(this Vector4 v) => new(v.Y, v.Z, v.Z, v.Y);
        public static Vector4 ZZZY(this Vector4 v) => new(v.Z, v.Z, v.Z, v.Y);
        public static Vector4 WZZY(this Vector4 v) => new(v.W, v.Z, v.Z, v.Y);
        public static Vector4 XWZY(this Vector4 v) => new(v.X, v.W, v.Z, v.Y);
        public static Vector4 YWZY(this Vector4 v) => new(v.Y, v.W, v.Z, v.Y);
        public static Vector4 ZWZY(this Vector4 v) => new(v.Z, v.W, v.Z, v.Y);
        public static Vector4 WWZY(this Vector4 v) => new(v.W, v.W, v.Z, v.Y);
        public static Vector4 XXWY(this Vector4 v) => new(v.X, v.X, v.W, v.Y);
        public static Vector4 YXWY(this Vector4 v) => new(v.Y, v.X, v.W, v.Y);
        public static Vector4 ZXWY(this Vector4 v) => new(v.Z, v.X, v.W, v.Y);
        public static Vector4 WXWY(this Vector4 v) => new(v.W, v.X, v.W, v.Y);
        public static Vector4 XYWY(this Vector4 v) => new(v.X, v.Y, v.W, v.Y);
        public static Vector4 YYWY(this Vector4 v) => new(v.Y, v.Y, v.W, v.Y);
        public static Vector4 ZYWY(this Vector4 v) => new(v.Z, v.Y, v.W, v.Y);
        public static Vector4 WYWY(this Vector4 v) => new(v.W, v.Y, v.W, v.Y);
        public static Vector4 XZWY(this Vector4 v) => new(v.X, v.Z, v.W, v.Y);
        public static Vector4 YZWY(this Vector4 v) => new(v.Y, v.Z, v.W, v.Y);
        public static Vector4 ZZWY(this Vector4 v) => new(v.Z, v.Z, v.W, v.Y);
        public static Vector4 WZWY(this Vector4 v) => new(v.W, v.Z, v.W, v.Y);
        public static Vector4 XWWY(this Vector4 v) => new(v.X, v.W, v.W, v.Y);
        public static Vector4 YWWY(this Vector4 v) => new(v.Y, v.W, v.W, v.Y);
        public static Vector4 ZWWY(this Vector4 v) => new(v.Z, v.W, v.W, v.Y);
        public static Vector4 WWWY(this Vector4 v) => new(v.W, v.W, v.W, v.Y);
        public static Vector4 XXXZ(this Vector4 v) => new(v.X, v.X, v.X, v.Z);
        public static Vector4 YXXZ(this Vector4 v) => new(v.Y, v.X, v.X, v.Z);
        public static Vector4 ZXXZ(this Vector4 v) => new(v.Z, v.X, v.X, v.Z);
        public static Vector4 WXXZ(this Vector4 v) => new(v.W, v.X, v.X, v.Z);
        public static Vector4 XYXZ(this Vector4 v) => new(v.X, v.Y, v.X, v.Z);
        public static Vector4 YYXZ(this Vector4 v) => new(v.Y, v.Y, v.X, v.Z);
        public static Vector4 ZYXZ(this Vector4 v) => new(v.Z, v.Y, v.X, v.Z);
        public static Vector4 WYXZ(this Vector4 v) => new(v.W, v.Y, v.X, v.Z);
        public static Vector4 XZXZ(this Vector4 v) => new(v.X, v.Z, v.X, v.Z);
        public static Vector4 YZXZ(this Vector4 v) => new(v.Y, v.Z, v.X, v.Z);
        public static Vector4 ZZXZ(this Vector4 v) => new(v.Z, v.Z, v.X, v.Z);
        public static Vector4 WZXZ(this Vector4 v) => new(v.W, v.Z, v.X, v.Z);
        public static Vector4 XWXZ(this Vector4 v) => new(v.X, v.W, v.X, v.Z);
        public static Vector4 YWXZ(this Vector4 v) => new(v.Y, v.W, v.X, v.Z);
        public static Vector4 ZWXZ(this Vector4 v) => new(v.Z, v.W, v.X, v.Z);
        public static Vector4 WWXZ(this Vector4 v) => new(v.W, v.W, v.X, v.Z);
        public static Vector4 XXYZ(this Vector4 v) => new(v.X, v.X, v.Y, v.Z);
        public static Vector4 YXYZ(this Vector4 v) => new(v.Y, v.X, v.Y, v.Z);
        public static Vector4 ZXYZ(this Vector4 v) => new(v.Z, v.X, v.Y, v.Z);
        public static Vector4 WXYZ(this Vector4 v) => new(v.W, v.X, v.Y, v.Z);
        public static Vector4 XYYZ(this Vector4 v) => new(v.X, v.Y, v.Y, v.Z);
        public static Vector4 YYYZ(this Vector4 v) => new(v.Y, v.Y, v.Y, v.Z);
        public static Vector4 ZYYZ(this Vector4 v) => new(v.Z, v.Y, v.Y, v.Z);
        public static Vector4 WYYZ(this Vector4 v) => new(v.W, v.Y, v.Y, v.Z);
        public static Vector4 XZYZ(this Vector4 v) => new(v.X, v.Z, v.Y, v.Z);
        public static Vector4 YZYZ(this Vector4 v) => new(v.Y, v.Z, v.Y, v.Z);
        public static Vector4 ZZYZ(this Vector4 v) => new(v.Z, v.Z, v.Y, v.Z);
        public static Vector4 WZYZ(this Vector4 v) => new(v.W, v.Z, v.Y, v.Z);
        public static Vector4 XWYZ(this Vector4 v) => new(v.X, v.W, v.Y, v.Z);
        public static Vector4 YWYZ(this Vector4 v) => new(v.Y, v.W, v.Y, v.Z);
        public static Vector4 ZWYZ(this Vector4 v) => new(v.Z, v.W, v.Y, v.Z);
        public static Vector4 WWYZ(this Vector4 v) => new(v.W, v.W, v.Y, v.Z);
        public static Vector4 XXZZ(this Vector4 v) => new(v.X, v.X, v.Z, v.Z);
        public static Vector4 YXZZ(this Vector4 v) => new(v.Y, v.X, v.Z, v.Z);
        public static Vector4 ZXZZ(this Vector4 v) => new(v.Z, v.X, v.Z, v.Z);
        public static Vector4 WXZZ(this Vector4 v) => new(v.W, v.X, v.Z, v.Z);
        public static Vector4 XYZZ(this Vector4 v) => new(v.X, v.Y, v.Z, v.Z);
        public static Vector4 YYZZ(this Vector4 v) => new(v.Y, v.Y, v.Z, v.Z);
        public static Vector4 ZYZZ(this Vector4 v) => new(v.Z, v.Y, v.Z, v.Z);
        public static Vector4 WYZZ(this Vector4 v) => new(v.W, v.Y, v.Z, v.Z);
        public static Vector4 XZZZ(this Vector4 v) => new(v.X, v.Z, v.Z, v.Z);
        public static Vector4 YZZZ(this Vector4 v) => new(v.Y, v.Z, v.Z, v.Z);
        public static Vector4 ZZZZ(this Vector4 v) => new(v.Z, v.Z, v.Z, v.Z);
        public static Vector4 WZZZ(this Vector4 v) => new(v.W, v.Z, v.Z, v.Z);
        public static Vector4 XWZZ(this Vector4 v) => new(v.X, v.W, v.Z, v.Z);
        public static Vector4 YWZZ(this Vector4 v) => new(v.Y, v.W, v.Z, v.Z);
        public static Vector4 ZWZZ(this Vector4 v) => new(v.Z, v.W, v.Z, v.Z);
        public static Vector4 WWZZ(this Vector4 v) => new(v.W, v.W, v.Z, v.Z);
        public static Vector4 XXWZ(this Vector4 v) => new(v.X, v.X, v.W, v.Z);
        public static Vector4 YXWZ(this Vector4 v) => new(v.Y, v.X, v.W, v.Z);
        public static Vector4 ZXWZ(this Vector4 v) => new(v.Z, v.X, v.W, v.Z);
        public static Vector4 WXWZ(this Vector4 v) => new(v.W, v.X, v.W, v.Z);
        public static Vector4 XYWZ(this Vector4 v) => new(v.X, v.Y, v.W, v.Z);
        public static Vector4 YYWZ(this Vector4 v) => new(v.Y, v.Y, v.W, v.Z);
        public static Vector4 ZYWZ(this Vector4 v) => new(v.Z, v.Y, v.W, v.Z);
        public static Vector4 WYWZ(this Vector4 v) => new(v.W, v.Y, v.W, v.Z);
        public static Vector4 XZWZ(this Vector4 v) => new(v.X, v.Z, v.W, v.Z);
        public static Vector4 YZWZ(this Vector4 v) => new(v.Y, v.Z, v.W, v.Z);
        public static Vector4 ZZWZ(this Vector4 v) => new(v.Z, v.Z, v.W, v.Z);
        public static Vector4 WZWZ(this Vector4 v) => new(v.W, v.Z, v.W, v.Z);
        public static Vector4 XWWZ(this Vector4 v) => new(v.X, v.W, v.W, v.Z);
        public static Vector4 YWWZ(this Vector4 v) => new(v.Y, v.W, v.W, v.Z);
        public static Vector4 ZWWZ(this Vector4 v) => new(v.Z, v.W, v.W, v.Z);
        public static Vector4 WWWZ(this Vector4 v) => new(v.W, v.W, v.W, v.Z);
        public static Vector4 XXXW(this Vector4 v) => new(v.X, v.X, v.X, v.W);
        public static Vector4 YXXW(this Vector4 v) => new(v.Y, v.X, v.X, v.W);
        public static Vector4 ZXXW(this Vector4 v) => new(v.Z, v.X, v.X, v.W);
        public static Vector4 WXXW(this Vector4 v) => new(v.W, v.X, v.X, v.W);
        public static Vector4 XYXW(this Vector4 v) => new(v.X, v.Y, v.X, v.W);
        public static Vector4 YYXW(this Vector4 v) => new(v.Y, v.Y, v.X, v.W);
        public static Vector4 ZYXW(this Vector4 v) => new(v.Z, v.Y, v.X, v.W);
        public static Vector4 WYXW(this Vector4 v) => new(v.W, v.Y, v.X, v.W);
        public static Vector4 XZXW(this Vector4 v) => new(v.X, v.Z, v.X, v.W);
        public static Vector4 YZXW(this Vector4 v) => new(v.Y, v.Z, v.X, v.W);
        public static Vector4 ZZXW(this Vector4 v) => new(v.Z, v.Z, v.X, v.W);
        public static Vector4 WZXW(this Vector4 v) => new(v.W, v.Z, v.X, v.W);
        public static Vector4 XWXW(this Vector4 v) => new(v.X, v.W, v.X, v.W);
        public static Vector4 YWXW(this Vector4 v) => new(v.Y, v.W, v.X, v.W);
        public static Vector4 ZWXW(this Vector4 v) => new(v.Z, v.W, v.X, v.W);
        public static Vector4 WWXW(this Vector4 v) => new(v.W, v.W, v.X, v.W);
        public static Vector4 XXYW(this Vector4 v) => new(v.X, v.X, v.Y, v.W);
        public static Vector4 YXYW(this Vector4 v) => new(v.Y, v.X, v.Y, v.W);
        public static Vector4 ZXYW(this Vector4 v) => new(v.Z, v.X, v.Y, v.W);
        public static Vector4 WXYW(this Vector4 v) => new(v.W, v.X, v.Y, v.W);
        public static Vector4 XYYW(this Vector4 v) => new(v.X, v.Y, v.Y, v.W);
        public static Vector4 YYYW(this Vector4 v) => new(v.Y, v.Y, v.Y, v.W);
        public static Vector4 ZYYW(this Vector4 v) => new(v.Z, v.Y, v.Y, v.W);
        public static Vector4 WYYW(this Vector4 v) => new(v.W, v.Y, v.Y, v.W);
        public static Vector4 XZYW(this Vector4 v) => new(v.X, v.Z, v.Y, v.W);
        public static Vector4 YZYW(this Vector4 v) => new(v.Y, v.Z, v.Y, v.W);
        public static Vector4 ZZYW(this Vector4 v) => new(v.Z, v.Z, v.Y, v.W);
        public static Vector4 WZYW(this Vector4 v) => new(v.W, v.Z, v.Y, v.W);
        public static Vector4 XWYW(this Vector4 v) => new(v.X, v.W, v.Y, v.W);
        public static Vector4 YWYW(this Vector4 v) => new(v.Y, v.W, v.Y, v.W);
        public static Vector4 ZWYW(this Vector4 v) => new(v.Z, v.W, v.Y, v.W);
        public static Vector4 WWYW(this Vector4 v) => new(v.W, v.W, v.Y, v.W);
        public static Vector4 XXZW(this Vector4 v) => new(v.X, v.X, v.Z, v.W);
        public static Vector4 YXZW(this Vector4 v) => new(v.Y, v.X, v.Z, v.W);
        public static Vector4 ZXZW(this Vector4 v) => new(v.Z, v.X, v.Z, v.W);
        public static Vector4 WXZW(this Vector4 v) => new(v.W, v.X, v.Z, v.W);
        public static Vector4 XYZW(this Vector4 v) => new(v.X, v.Y, v.Z, v.W);
        public static Vector4 YYZW(this Vector4 v) => new(v.Y, v.Y, v.Z, v.W);
        public static Vector4 ZYZW(this Vector4 v) => new(v.Z, v.Y, v.Z, v.W);
        public static Vector4 WYZW(this Vector4 v) => new(v.W, v.Y, v.Z, v.W);
        public static Vector4 XZZW(this Vector4 v) => new(v.X, v.Z, v.Z, v.W);
        public static Vector4 YZZW(this Vector4 v) => new(v.Y, v.Z, v.Z, v.W);
        public static Vector4 ZZZW(this Vector4 v) => new(v.Z, v.Z, v.Z, v.W);
        public static Vector4 WZZW(this Vector4 v) => new(v.W, v.Z, v.Z, v.W);
        public static Vector4 XWZW(this Vector4 v) => new(v.X, v.W, v.Z, v.W);
        public static Vector4 YWZW(this Vector4 v) => new(v.Y, v.W, v.Z, v.W);
        public static Vector4 ZWZW(this Vector4 v) => new(v.Z, v.W, v.Z, v.W);
        public static Vector4 WWZW(this Vector4 v) => new(v.W, v.W, v.Z, v.W);
        public static Vector4 XXWW(this Vector4 v) => new(v.X, v.X, v.W, v.W);
        public static Vector4 YXWW(this Vector4 v) => new(v.Y, v.X, v.W, v.W);
        public static Vector4 ZXWW(this Vector4 v) => new(v.Z, v.X, v.W, v.W);
        public static Vector4 WXWW(this Vector4 v) => new(v.W, v.X, v.W, v.W);
        public static Vector4 XYWW(this Vector4 v) => new(v.X, v.Y, v.W, v.W);
        public static Vector4 YYWW(this Vector4 v) => new(v.Y, v.Y, v.W, v.W);
        public static Vector4 ZYWW(this Vector4 v) => new(v.Z, v.Y, v.W, v.W);
        public static Vector4 WYWW(this Vector4 v) => new(v.W, v.Y, v.W, v.W);
        public static Vector4 XZWW(this Vector4 v) => new(v.X, v.Z, v.W, v.W);
        public static Vector4 YZWW(this Vector4 v) => new(v.Y, v.Z, v.W, v.W);
        public static Vector4 ZZWW(this Vector4 v) => new(v.Z, v.Z, v.W, v.W);
        public static Vector4 WZWW(this Vector4 v) => new(v.W, v.Z, v.W, v.W);
        public static Vector4 XWWW(this Vector4 v) => new(v.X, v.W, v.W, v.W);
        public static Vector4 YWWW(this Vector4 v) => new(v.Y, v.W, v.W, v.W);
        public static Vector4 ZWWW(this Vector4 v) => new(v.Z, v.W, v.W, v.W);
        public static Vector4 WWWW(this Vector4 v) => new(v.W, v.W, v.W, v.W);

        #endregion
    }
}
