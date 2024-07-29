using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Raylib_CSharp.Rendering;
using Raylib_CSharp.Textures;
using System;
using System.Numerics;

namespace Gizmo.Engine.Builtin
{
    public static class TextTags { 
        public class TTagBack : TextTag
        {
            public override string Name => "/";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                Helper.SelfClose(ref conductor);
                Helper.SelfClose(ref conductor);
                return conductor;
            }
        }
        public class TTagReset : TextTag
        {
            public override string Name => "reset";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                var original = conductor;
                while (Helper.SelfClose(ref conductor));
                conductor.Previous = original;
                return conductor;
            }
        }
        public class TTagLineBreak : TextTag
        {
            public override string Name => "br";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                Helper.SelfClose(ref conductor);
                Helper.LineBreak(ref charNo, ref conductor, ref currentLine, ref currentY, ref lines);
                return conductor;
            }
        }
        public class TTagGraphic : TextTag
        {
            public override string Name => "sprite";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("x", out var _x) || !args.TryGetValue("y", out var _y)) return conductor;
                Helper.SelfClose(ref conductor);
                Character ch = new()
                {
                    Font = conductor.Font._font[conductor.Style].First(),
                    Text = ' ',
                    Angle = conductor.Angle,
                    Style = conductor.Style,
                    Color = conductor.Color,
                    Scale = conductor.Size,
                    Size = new(float.Parse(_x), float.Parse(_y))
                };
                if (bounds > 0 && conductor.Pen + ch.Size.X > bounds)
                    Helper.LineBreak(ref charNo, ref conductor, ref currentLine, ref currentY, ref lines);
                ch.Position = new(conductor.Pen, currentY);
                currentLine.Add(ch);
                conductor.Pen += ch.Size.X + conductor.Spacing.X;
                int frame = 0, speed = 0;
                if (args.TryGetValue("frame", out var _frame)) frame = int.Parse(_frame);
                if (args.TryGetValue("speed", out var _speed)) speed = int.Parse(_speed);
                if (!string.IsNullOrWhiteSpace(args["sprite"]) && Resource.Sprites.TryGetValue(args["sprite"], out var sprite))
                {
                    ch.onDraw += (i, offset, ch) =>
                    {
                        if (sprite.Image == null || !Sprite.TryCameraWarp(MathP.Rotate(ch.Position, i.Angle) + i.Position + offset, ch.Size * i.Scale, out var meta)) return;
                        int fr = frame + (int)(speed * i.Frame);
                        var frameOffset = sprite.Size * sprite.GetSubimage(frame);
                        Raylib_CSharp.Transformations.Rectangle source = new(frameOffset.X, frameOffset.Y, sprite.Size.X, sprite.Size.Y);
                        Raylib_CSharp.Transformations.Rectangle target = new(meta.X, meta.Y, meta.Z, meta.W);
                        Graphics.DrawTexturePro((Texture2D)sprite.Image, source, target, new(target.Width / 2, target.Height / 2), ch.Angle + i.Angle, ch.Color * i.Blend * i.Alpha);
                    };
                }
                return conductor;
            }
        }
        public class TTagBold : TextTag
        {
            public override string Name => "b";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (conductor.Style == Font.Style.ITALIC || conductor.Style == Font.Style.BOTH) conductor.Style = Font.Style.BOTH;
                else conductor.Style = Font.Style.BOLD;
                return conductor;
            }
        }
        public class TTagItalic : TextTag
        {
            public override string Name => "i";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (conductor.Style == Font.Style.BOLD || conductor.Style == Font.Style.BOTH) conductor.Style = Font.Style.BOTH;
                else conductor.Style = Font.Style.ITALIC;
                return conductor;
            }
        }
        public class TTagUnderline : TextTag
        {
            public override string Name => "u";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                conductor.CurrentOnDraw.Add((tc, n) => (i, offset, ch) => {
                    Vector2 pt1 = new(ch.Position.X - (ch.Size.X / 2), ch.Position.Y + (ch.Size.Y / 2));
                    Vector2 pt2 = pt1 + new Vector2(ch.Size.X, 0);
                    pt1 = MathP.Rotate(pt1, i.Angle) + i.Position + offset;
                    pt2 = MathP.Rotate(pt2, i.Angle) + i.Position + offset;
                    var size = MathP.Abs(pt1 - pt2) * i.Scale;
                    Sprite.TryCameraWarp(pt1, size, out var l1);
                    Sprite.TryCameraWarp(pt2, size, out var l2);
                    Graphics.DrawLine((int)l1.X, (int)l1.Y, (int)l2.X, (int)l2.Y, ch.Color);
                });
                return conductor;
            }
        }
        public class TTagStrikethrough : TextTag
        {
            public override string Name => "s";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                conductor.CurrentOnDraw.Add((tc, n) => (i, offset, ch) => {
                    Vector2 pt1 = new(ch.Position.X - (ch.Size.X / 2), ch.Position.Y + (ch.Size.Y / 2) - (ch.Max.Y / 2));
                    Vector2 pt2 = pt1 + new Vector2(ch.Size.X, 0);
                    pt1 = MathP.Rotate(pt1, i.Angle) + i.Position + offset;
                    pt2 = MathP.Rotate(pt2, i.Angle) + i.Position + offset;
                    var size = MathP.Abs(pt1 - pt2) * i.Scale;
                    Sprite.TryCameraWarp(pt1, size, out var l1);
                    Sprite.TryCameraWarp(pt2, size, out var l2);
                    Graphics.DrawLine((int)l1.X, (int)l1.Y, (int)l2.X, (int)l2.Y, ch.Color);
                });
                return conductor;
            }
        }
        public class TTagColor : TextTag
        {
            public override string Name => "color";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("color", out var color)) return conductor;
                conductor.Color = new(color);
                return conductor;
            }
        }
        public class TTagTilt : TextTag
        {
            public override string Name => "tilt";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("tilt", out var tilt)) return conductor;
                conductor.Angle = float.Parse(tilt);
                return conductor;
            }
        }
        public class TTagSize : TextTag
        {
            public override string Name => "size";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("size", out var size)) return conductor;
                conductor.Size = MathP.Max(float.Parse(size), 0);
                return conductor;
            }
        }
        public class TTagCharSpace : TextTag
        {
            public override string Name => "charspace";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("charspace", out var charspace)) return conductor;
                conductor.Spacing.X = float.Parse(charspace);
                return conductor;
            }
        }
        public class TTagLineHeight : TextTag
        {
            public override string Name => "lineheight";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("lineheight", out var lineheight)) return conductor;
                conductor.Spacing.Y = float.Parse(lineheight);
                return conductor;
            }
        }
        public class TTagFont : TextTag
        {
            public override string Name => "font";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                if (!args.TryGetValue("font", out var _font) || !Resource.Fonts.TryGetValue(_font, out var font)) return conductor;
                conductor.Font = font;
                return conductor;
            }
        }
        public class TTagWave : TextTag
        {
            public override string Name => "wave";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                float amp = Helper.TryGet(args, "amp", 4);
                float period = Helper.TryGet(args, "period", 16);
                float freq = Helper.TryGet(args, "freq", 1); freq /= MetaP.TargetFPS;
                conductor.CurrentOnUpdates.Add((conductor, textNo) => (i, ch) =>
                {
                    ch.Position.Y += amp * MathP.Sin(360 * ((i.Frame * freq) + (textNo / period)));
                    return ch;
                });
                return conductor;
            }
        }
        public class TTagShake : TextTag
        {
            public override string Name => "shake";
            public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
            {
                float amp = Helper.TryGet(args, "amp", 1);
                conductor.CurrentOnUpdates.Add((conductor, textNo) => (i, ch) =>
                {
                    ch.Position.X += RandomP.Random(-amp, amp);
                    ch.Position.Y += RandomP.Random(-amp, amp);
                    return ch;
                });
                return conductor;
            }
        }

        public class Helper
        {
            public static float TryGet(Dictionary<string, string> args, string key, float def)
            {
                if (!args.TryGetValue(key, out var s) || !float.TryParse(s, out float f)) return def;
                return f;
            }
            public static string TryGet(Dictionary<string, string> args, string key, string def)
            {
                if (!args.TryGetValue(key, out string? value) || string.IsNullOrWhiteSpace(value)) return def;
                return value;
            }
            public static void LineBreak(ref int charNo, ref TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines)
            {
                lines.Add(currentLine);
                charNo = 0;
                currentY += currentLine.MaxBy(x => x.Size.Y).Size.Y * conductor.Spacing.Y;
                currentLine = [];
                conductor.Pen = 0;
            }
            public static bool SelfClose(ref TextConductor conductor) 
            {
                var pen = conductor.Pen;
                var ret = conductor.Previous != null;
                if (ret) conductor = conductor.Previous; 
                conductor.Pen = pen;
                return ret;
            }
        }
    }
}
