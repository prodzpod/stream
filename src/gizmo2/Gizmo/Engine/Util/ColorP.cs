using Raylib_CSharp.Colors;
using System.Numerics;

namespace Gizmo.Engine.Data
{
    public struct ColorP(Color color): IEquatable<ColorP>, IEquatable<Color>, IEquatable<Vector4>, 
        IEquatable<System.Drawing.Color>, IComparable<ColorP>, ICloneable
    {
        public static readonly ColorP WHITE = new(255, 255, 255, 255);
        public static readonly ColorP BLACK = new(0, 0, 0, 255);
        public static readonly ColorP TRANSPARENT = new(0, 0, 0, 0);
        // input
        public ColorP(byte r, byte g, byte b, byte a) : this(new Color(r, g, b, a)) { }
        public ColorP(byte r, byte g, byte b) : this(r, g, b, (byte)0xFF) { }
        public ColorP(int r, int g, int b, int a) : this((byte)r, (byte)g, (byte)b, (byte)a) { }
        public ColorP(int r, int g, int b) : this(r, g, b, 0xFF) { }
        public ColorP(float r, float g, float b, float a) : this((int)(r * 255), (int)(g * 255), (int)(b * 255), (int)(a * 255)) { }
        public ColorP(float r, float g, float b) : this(r, g, b, 1) { }
        public ColorP(float color, float alpha) : this(color, color, color, alpha) { }
        public ColorP(float color) : this(color, color, color, 1) { }
        public ColorP(ColorP color) : this(color.Color) { }
        public ColorP(System.Drawing.Color color) : this(color.R, color.G, color.B, color.A) { }
        public ColorP(Vector4 color) : this(color.X, color.Y, color.Z, color.W) { }
        public ColorP(Vector3 color) : this(color.X, color.Y, color.Z, 1) { }
        public ColorP(Vector3 color, float alpha) : this(color.X, color.Y, color.Z, alpha) { }
        public ColorP(int code) : this(Color.FromHex((uint)code)) { }
        public ColorP(uint code) : this(Color.FromHex(code)) { }
        public ColorP(string hex) : this(0)
        {
            if (hex == null) return;
            if (hex.StartsWith("#")) hex = hex[1..];
            System.Drawing.Color c = System.Drawing.Color.FromName(hex);
            if (c.IsKnownColor) { Color = new Color(c.R, c.G, c.B, c.A); return; }
            switch (hex.Length)
            {
                case 0: hex = "0"; goto case 1;
                case 1: hex += hex; goto case 2;
                case 2: hex = hex + hex + hex; goto case 6;
                case 3: hex += "F"; goto case 4;
                case 4: hex = hex[0..1] + hex[0..1] + hex[1..2] + hex[1..2] + hex[2..3] + hex[2..3] + hex[3..4] + hex[3..4]; break;
                case 5: hex = "0" + hex; goto case 6;
                case 6: hex += "FF"; break;
                case 7: hex = "0" + hex; break;
                case 8: break;
                default: hex = hex[0..8]; break;
            }
            try
            {
                byte[] ret = [.. (new string[] { hex[0..2], hex[2..4], hex[4..6], hex[6..8] }).Select(x => (byte)int.Parse(x, System.Globalization.NumberStyles.HexNumber))];
                Color = new Color(ret[0], ret[1], ret[2], ret[3]);
            }
            catch { Color = BLACK; }
        }
        public static ColorP FromHSV(Vector3 hsv) => FromHSV(hsv.X, hsv.Y, hsv.Z, 1);
        public static ColorP FromHSV(Vector3 hsv, float a) => FromHSV(hsv.X, hsv.Y, hsv.Z, a);
        public static ColorP FromHSV(Vector4 hsva) => FromHSV(hsva.X, hsva.Y, hsva.Z, hsva.W);
        public static ColorP FromHSV(float h, float s, float v) => FromHSV(h, s, v, 1);
        public static ColorP FromHSV(float h, float s, float v, float a) => new(Color.Alpha(Color.FromHSV(h, s, v), a));

        // output
        public Color Color = color;
        public readonly byte R => Color.R;
        public readonly byte G => Color.G;
        public readonly byte B => Color.B;
        public readonly byte A => Color.A;

        public static implicit operator Color(ColorP color) => color.Color;
        public static implicit operator System.Drawing.Color(ColorP color) => System.Drawing.Color.FromArgb(color.R, color.G, color.B, color.A);
        public static implicit operator Vector4(ColorP color) => Color.Normalize(color.Color);
        public static explicit operator int(ColorP color) => color.GetHashCode();
        public static explicit operator string(ColorP color) => color.ToString();
        public readonly Vector3 HSV => Color.ToHSV(Color);

        // struct stuff
        public override readonly bool Equals(object? obj)
        {
            if (obj == null) return false;
            if (obj is ColorP c) return Equals(c);
            if (obj is Color c2) return Equals(c2);
            if (obj is System.Drawing.Color c3) return Equals(c3);
            if (obj is Vector4 c4) return Equals(c4);
            return false;
        }
        public readonly bool Equals(ColorP other) => other.R == R && other.G == G && other.B == B && other.A == A;
        public readonly bool Equals(Color other) => Equals(new(other));
        public readonly bool Equals(System.Drawing.Color other) => Equals(new(other));
        public readonly bool Equals(Vector4 other) => Equals(new(other));
        public static bool operator ==(ColorP left, object? right) => left.Equals(right);
        public static bool operator !=(ColorP left, object? right) => !left.Equals(right);
        public override readonly string ToString() => $"#{R:X2}{G:X2}{B:X2}{A:X2}";
        public override readonly int GetHashCode() => R << 24 + G << 16 + B << 8 + A;
        public readonly object Clone() => new ColorP(this);
        public readonly int CompareTo(ColorP other) => GetHashCode() - other.GetHashCode();

        // manipulation
        public static ColorP operator *(ColorP left, float right) => new(left.R / 256f, left.G / 256f, left.B / 256f, left.A / 256f * right);
        public static ColorP operator *(ColorP left, ColorP right) => new((Vector4)left * (Vector4)right);
        public static ColorP operator +(ColorP left, ColorP right) => new((Vector4)left + (Vector4)right);
        public readonly ColorP Brightness(float v) => new(Color.Brightness(Color, v));
        public readonly ColorP Contrast(float v) => new(Color.Contrast(Color, v));
        public readonly ColorP Hue(float v)
        {
            var hsv = HSV; hsv.X += v;
            return FromHSV(hsv, Color.A / 256f);
        }
        public readonly ColorP Saturation(float v)
        {
            var hsv = HSV; hsv.Y += v;
            return FromHSV(hsv, Color.A / 256f);
        }
        public readonly ColorP Value(float v)
        {
            var hsv = HSV; hsv.Z += v;
            return FromHSV(hsv, Color.A / 256f);
        }
    }
}
