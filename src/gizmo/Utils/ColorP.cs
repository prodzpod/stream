
using Microsoft.Xna.Framework;
using System;
using System.Diagnostics;
using System.Linq;

namespace NotGMS.Util
{
    public static class ColorP // Unhinged Color Library
    {
        public static readonly Color WHITE = new(255, 255, 255, 255);
        public static readonly Color BLACK = new(0, 0, 0, 255);
        public static readonly Color TRANS = new(0, 0, 0, 0);
        public static Color Hue(float h, float v = 0) { return HSV(h, v >= 0 ? 1 - v : 1, v < 0 ? 1 + v : 1, 1); }
        public static Color Alpha(Color c, float a) { c.A = (byte)(a * 255f); return c; }
        public static Vector4 Alpha(Vector3 c, float a) { if (c.X > 1 || c.Y > 1 || c.Z > 1) a *= 255f; return new Vector4(c.X, c.Y, c.Z, a); }
        public static Vector4 Alpha(Vector4 c, float a) { c.W *= a; return c; }
        public static string Hex(Vector3 rgb) { return Hex(new Vector4(rgb.X, rgb.Y, rgb.Z, 255)); }
        public static string Hex(Vector4 rgb)
        {
            int[] ints = { (int)rgb.X, (int)rgb.Y, (int)rgb.Z, (int)rgb.W };
            return "#" + string.Join("", ints.Select(x => x.ToString("X").PadLeft(2, '0')));
        }
        public static Vector4 Hex(string hex)
        {
            if (hex.StartsWith("#")) hex = hex[1..];
            System.Drawing.Color c = System.Drawing.Color.FromName(hex);
            if (c.IsKnownColor) return new Vector4(c.R, c.G, c.B, c.A);
            switch (hex.Length)
            {
                case 0:
                    hex = "0";
                    goto case 1;
                case 1:
                    hex += hex;
                    goto case 2;
                case 2:
                    hex = hex + hex + hex;
                    goto case 6;
                case 3:
                    hex += "F";
                    goto case 4;
                case 4:
                    hex = hex[0..1] + hex[0..1] + hex[1..2] + hex[1..2] + hex[2..3] + hex[2..3] + hex[3..4] + hex[3..4];
                    break;
                case 5:
                    hex = "0" + hex;
                    goto case 6;
                case 6:
                    hex += "FF";
                    break;
                case 7:
                    hex = "0" + hex;
                    break;
                case 8:
                    break;
                default:
                    hex = hex[0..8];
                    break;
            }
            string[] strings = { hex[0..2], hex[2..4], hex[4..6], hex[6..8] };
            float[] floats = strings.Select(x => (float)int.Parse(x, System.Globalization.NumberStyles.HexNumber)).ToArray();
            return new Vector4(floats[0], floats[1], floats[2], floats[3]);
        }
        public static int Bit(Vector3 rgb) { return Bit(new Vector4(rgb.X, rgb.Y, rgb.Z, 255)); }
        public static int Bit(Vector4 rgb)
        {
            byte r = (byte)rgb.X;
            byte g = (byte)rgb.Y;
            byte b = (byte)rgb.Z;
            byte a = (byte)rgb.W;
            return r << 24 | g << 16 | b << 8 | a;
        }
        public static Vector4 Bit(int bits)
        {
            byte r = (byte)((bits & 0xFF000000) >> 24);
            byte g = (byte)((bits & 0x00FF0000) >> 16);
            byte b = (byte)((bits & 0x0000FF00) >> 8);
            byte a = (byte)(bits & 0x000000FF);
            return new Vector4(r, g, b, a);
        }
        public static Vector3 RGB(this Color color)
        {
            color.Deconstruct(out byte r, out byte g, out byte b);
            return new Vector3(r, g, b);
        }
        public static Vector4 RGBA(this Color color)
        {
            color.Deconstruct(out byte r, out byte g, out byte b, out byte a);
            return new Vector4(r, g, b, a);
        }
        public static Vector3 HSV(this Color color)
        {
            color.DeconstructHSV(out float h, out float s, out float v);
            return new Vector3(h, s, v);
        }
        public static Vector4 HSVA(this Color color)
        {
            color.DeconstructHSV(out float h, out float s, out float v, out float a);
            return new Vector4(h, s, v, a);
        }
        public static Vector3 HSL(this Color color)
        {
            color.DeconstructHSL(out float h, out float s, out float l);
            return new Vector3(h, s, l);
        }
        public static Vector4 HSLA(this Color color)
        {
            color.DeconstructHSL(out float h, out float s, out float l, out float a);
            return new Vector4(h, s, l, a);
        }
        public static Color RGB(float r, float g, float b) { return new Color(r, g, b); }
        public static Color RGB(float r, float g, float b, float a) { return RGBA(r, g, b, a); }
        public static Color RGBA(float r, float g, float b, float a) { return new Color(r, g, b, a); }
        public static Color RGB(byte r, byte g, byte b) { return new Color(r / 255f, g / 255f, b / 255f); }
        public static Color RGB(byte r, byte g, byte b, byte a) { return RGBA(r, g, b, a); }
        public static Color RGBA(byte r, byte g, byte b, byte a) { return new Color(r / 255f, g / 255f, b / 255f, a / 255f); }
        public static Color RGB(Vector3 color) { return new Color(color.X / 255f, color.Y / 255f, color.Z / 255f); }
        public static Color RGB(Vector4 color) { return RGBA(color); }
        public static Color RGBA(Vector4 color) { return new Color(color.X / 255f, color.Y / 255f, color.Z / 255f, color.W / 255f); }
        public static Color HSV(float h, float s, float v) { return HSVA(new Vector4(h, s, v, 1)); }
        public static Color HSV(Vector3 hsv) { return HSVA(new Vector4(hsv.X, hsv.Y, hsv.Z, 1)); }
        public static Color HSV(float h, float s, float v, float a) { return HSVA(new Vector4(h, s, v, a)); }
        public static Color HSV(Vector4 hsv) { return HSVA(hsv); }
        public static Color HSVA(float h, float s, float v, float a) { return HSVA(new Vector4(h, s, v, a)); }
        public static Color HSVA(Vector4 hsv) { return RGB(HSVtoRGB(hsv)); }
        public static Color HSL(float h, float s, float l) { return HSLA(new Vector4(h, s, l, 1)); }
        public static Color HSL(Vector3 hsl) { return HSLA(new Vector4(hsl.X, hsl.Y, hsl.Z, 1)); }
        public static Color HSL(float h, float s, float l, float a) { return HSLA(new Vector4(h, s, l, a)); }
        public static Color HSL(Vector4 hsl) { return HSLA(hsl); }
        public static Color HSLA(float h, float s, float l, float a) { return HSLA(new Vector4(h, s, l, a)); }
        public static Color HSLA(Vector4 hsl) { return RGB(HSLtoRGB(hsl)); }
        public static void DeconstructHSV(this Color color, out float h, out float s, out float v) { color.DeconstructHSV(out h, out s, out v, out _); }
        public static void DeconstructHSV(this Color color, out float h, out float s, out float v, out float a)
        {
            RGBtoHSV(color.R, color.G, color.B, out h, out s, out v);
            a = color.A / 255f;
        }
        public static void DeconstructHSL(this Color color, out float h, out float s, out float l) { color.DeconstructHSL(out h, out s, out l, out _); }
        public static void DeconstructHSL(this Color color, out float h, out float s, out float l, out float a)
        {
            RGBtoHSL(color.R, color.G, color.B, out h, out s, out l);
            a = color.A / 255f;
        }
        public static Vector3 RGBtoHSL(float r, float g, float b) { return RGBtoHSL((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f)); }
        public static Vector3 RGBtoHSL(Vector3 rgb) { return RGBtoHSL((byte)rgb.X, (byte)rgb.Y, (byte)rgb.Z); }
        public static Vector3 RGBtoHSL(byte r, byte g, byte b)
        {
            RGBtoHSL(r, g, b, out float h, out float s, out float l);
            return new Vector3(h, s, l);
        }
        public static Vector4 RGBtoHSL(float r, float g, float b, float a) { return RGBtoHSL((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f), (byte)(a * 255f)); }
        public static Vector4 RGBtoHSL(Vector4 rgb) { return RGBtoHSL((byte)rgb.X, (byte)rgb.Y, (byte)rgb.Z, (byte)rgb.W); }
        public static Vector4 RGBtoHSL(byte r, byte g, byte b, byte a)
        {
            RGBtoHSL(r, g, b, out float h, out float s, out float l);
            return new Vector4(h, s, l, a / 255f);
        }
        public static void RGBtoHSL(float r, float g, float b, out float h, out float s, out float l) { RGBtoHSL((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f), out h, out s, out l); }
        public static void RGBtoHSL(byte r, byte g, byte b, out float h, out float s, out float l)
        {
            System.Drawing.Color c = System.Drawing.Color.FromArgb(255, r, g, b);
            h = c.GetHue() / 360f;
            s = c.GetSaturation();
            l = c.GetBrightness();
        }
        public static Vector3 RGBtoHSV(float r, float g, float b) { return RGBtoHSV((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f)); }
        public static Vector3 RGBtoHSV(Vector3 rgb) { return RGBtoHSV((byte)rgb.X, (byte)rgb.Y, (byte)rgb.Z); }
        public static Vector3 RGBtoHSV(byte r, byte g, byte b)
        {
            RGBtoHSV(r, g, b, out float h, out float s, out float v);
            return new Vector3(h, s, v);
        }
        public static Vector4 RGBtoHSV(float r, float g, float b, float a) { return RGBtoHSV((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f), (byte)(a * 255f)); }
        public static Vector4 RGBtoHSV(Vector4 rgb) { return RGBtoHSV((byte)rgb.X, (byte)rgb.Y, (byte)rgb.Z, (byte)rgb.W); }
        public static Vector4 RGBtoHSV(byte r, byte g, byte b, byte a)
        {
            RGBtoHSV(r, g, b, out float h, out float s, out float v);
            return new Vector4(h, s, v, a / 255f);
        }
        public static void RGBtoHSV(float r, float g, float b, out float h, out float s, out float v) { RGBtoHSV((byte)(r * 255f), (byte)(g * 255f), (byte)(b * 255f), out h, out s, out v); }
        public static void RGBtoHSV(byte r, byte g, byte b, out float h, out float s, out float v)
        {
            RGBtoHSL(r, g, b, out float h0, out float s0, out float l);
            HSLtoHSV(h0, s0, l, out h, out s, out v);
        }
        public static Vector3 HSLtoHSV(Vector3 hsl)
        {
            HSLtoHSV(hsl.X, hsl.Y, hsl.Z, out float h, out float s, out float v);
            return new Vector3(h, s, v);
        }
        public static Vector4 HSLtoHSV(Vector4 hsl)
        {
            HSLtoHSV(hsl.X, hsl.Y, hsl.Z, out float h, out float s, out float v);
            return new Vector4(h, s, v, hsl.W);
        }
        public static void HSLtoHSV(float h0, float s0, float l, out float h, out float s, out float v)
        {
            h = h0;
            v = s0 * MathF.Min(l, 1 - l) + l;
            if (v == 0) s = 0;
            else s = 2 - 2 * l / v;
        }
        public static Vector3 HSVtoHSL(Vector3 hsv)
        {
            HSVtoHSL(hsv.X, hsv.Y, hsv.Z, out float h, out float s, out float l);
            return new Vector3(h, s, l);
        }
        public static Vector4 HSVtoHSL(Vector4 hsv)
        {
            HSVtoHSL(hsv.X, hsv.Y, hsv.Z, out float h, out float s, out float l);
            return new Vector4(h, s, l, hsv.W);
        }
        public static void HSVtoHSL(float h0, float s0, float v, out float h, out float s, out float l)
        {
            h = h0;
            l = v - v * s0 / 2;
            float m = MathF.Min(l, 1 - l);
            if (m == 0) s = 0;
            else s = (v - l) / m;
        }
        public static Vector3 HSLtoRGB(Vector3 hsl) { return HSVtoRGB(HSLtoHSV(hsl)); }
        public static void HSLtoRGB(Vector3 hsl, out byte r, out byte g, out byte b) { HSVtoRGB(HSLtoHSV(hsl), out r, out g, out b); }
        public static void HSLtoRGB(Vector3 hsl, out float r, out float g, out float b) { HSVtoRGB(HSLtoHSV(hsl), out r, out g, out b); }
        public static Vector4 HSLtoRGB(Vector4 hsl) { return HSVtoRGB(HSLtoHSV(hsl)); }
        public static void HSLtoRGB(Vector4 hsl, out byte r, out byte g, out byte b, out byte a) { HSVtoRGB(HSLtoHSV(hsl), out r, out g, out b, out a); }
        public static void HSLtoRGB(Vector4 hsl, out float r, out float g, out float b, out float a) { HSVtoRGB(HSLtoHSV(hsl), out r, out g, out b, out a); }
        public static Vector3 HSVtoRGB(Vector3 hsv)
        {
            HSVtoRGB(hsv.X, hsv.Y, hsv.Z, out byte r, out byte g, out byte b);
            return new Vector3(r, g, b);
        }
        public static void HSVtoRGB(Vector3 hsv, out byte r, out byte g, out byte b)
        {
            Vector3 rgb = HSVtoRGB(hsv);
            r = (byte)rgb.X;
            g = (byte)rgb.Y;
            b = (byte)rgb.Z;
        }
        public static void HSVtoRGB(Vector3 hsv, out float r, out float g, out float b)
        {
            HSVtoRGB(hsv, out byte r0, out byte g0, out byte b0);
            r = r0 / 255f;
            g = g0 / 255f;
            b = b0 / 255f;
        }
        public static Vector4 HSVtoRGB(Vector4 hsv)
        {
            HSVtoRGB(hsv.X, hsv.Y, hsv.Z, out byte r, out byte g, out byte b);
            return new Vector4(r, g, b, hsv.W * 255f);
        }
        public static void HSVtoRGB(Vector4 hsv, out byte r, out byte g, out byte b, out byte a)
        {
            Vector4 rgb = HSVtoRGB(hsv);
            r = (byte)rgb.X;
            g = (byte)rgb.Y;
            b = (byte)rgb.Z;
            a = (byte)rgb.W;
        }
        public static void HSVtoRGB(Vector4 hsv, out float r, out float g, out float b, out float a)
        {
            HSVtoRGB(hsv, out byte r0, out byte g0, out byte b0, out byte a0);
            r = r0 / 255f;
            g = g0 / 255f;
            b = b0 / 255f;
            a = a0 / 255f;
        }
        public static void HSVtoRGB(float h, float s, float v, out byte r, out byte g, out byte b)
        {
            HSVtoRGB(h, s, v, out float r0, out float g0, out float b0);
            r = (byte)(r0 * 255f);
            g = (byte)(g0 * 255f);
            b = (byte)(b0 * 255f);
        }
        public static void HSVtoRGB(float h, float s, float v, out float r, out float g, out float b)
        {
            int i; float f, p, q, t;
            i = (int)(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6)
            {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
                default: r = 0; g = 0; b = 0; break;
            }
        }
    }
}
