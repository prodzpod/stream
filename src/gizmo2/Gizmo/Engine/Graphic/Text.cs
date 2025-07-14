using Gizmo.Engine.Data;
using Raylib_CSharp.Rendering;
using System.Numerics;
using static Gizmo.Engine.Builtin.TextTags;
namespace Gizmo.Engine.Graphic
{
    public class Text : IDrawable
    {
        public static Dictionary<string, TextTag> Tags = [];
        public Character[] Characters = [];
        public Vector2 Size;
        public static Text Compile(string text, Font font, float size, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, 0, -Vector2.One, color, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, 0, -Vector2.One, color, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, Vector2 align, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, 0, align, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, Vector2 align, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, 0, align, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, Vector2 align, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, 0, align, color, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, Vector2 align, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, 0, align, color, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, float bounds = 0, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, bounds, -Vector2.One, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, float bounds = 0, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, bounds, -Vector2.One, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, float bounds, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, bounds, -Vector2.One, color, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, float bounds, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, bounds, -Vector2.One, color, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, float bounds, Vector2 align, float lineHeight = 1, float charSpace = 0)
            => Compile(text, font, size, bounds, align, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, float bounds, Vector2 align, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, bounds, align, ColorP.WHITE, lineHeight, charSpace);
        public static Text Compile(string text, string font, float size, float bounds, Vector2 align, ColorP color, float lineHeight = 1, float charSpace = 0)
            => Compile(text, Resource.Fonts[font], size, bounds, align, color, lineHeight, charSpace);
        public static Text Compile(string text, Font font, float size, float bounds, Vector2 align, ColorP color, float lineHeight = 1, float charSpace = 0)
        {
            text = text.Replace("\n", "<br>");
            TextConductor conductor = new() { Font = font, Size = size, Spacing = new(charSpace, lineHeight), Color = color };
            List<List<Character>> lines = [];
            List<Character> currentLine = [];
            Dictionary<Font, Dictionary<char, Vector2>> charMap = [];
            int charNo = 0;
            float currentY = 0;
            for (int ptr = 0; ptr < text.Length; ptr++)
            {
                if (text[ptr] == '\\' && ptr < (text.Length - 1)) ptr++;
                else if (text[ptr] == '<')
                {
                    var start = ptr;
                    var end = text.IndexOf('>', ptr);
                    if (end == -1) end = text.Length;
                    var args = text[(ptr + 1)..end].Split(' ');
                    string command = args[0].ToLowerInvariant();
                    Dictionary<string, string> vars = [];
                    for (int i = 0; i < args.Length; i++)
                    {
                        var kv = args[i].Split('=');
                        var k = kv[0];
                        string v = "";
                        if (kv.Length > 1) v = kv[1];
                        if (i == 0) { k = k.ToLowerInvariant(); command = k; } // Lord Kelvin is my opp (\u212A.ToLowerInvariant == "k")
                        vars[k] = v;
                    }
                    ptr = end;
                    if (!Tags.TryGetValue(command, out TextTag? tag)) { Logger.Warn("Tag " + command + " does not exist!"); ptr = start; }
                    else
                    {
                        try
                        {
                            conductor = tag.Execute(
                                ref charMap,
                                ref charNo,
                                new(conductor),
                                ref currentLine,
                                ref currentY,
                                ref lines,
                                ref ptr,
                                ref text,
                                ref bounds,
                                vars);
                        }
                        catch (Exception ex) { Logger.Error("Tag Parsing Error:", ex.StackTrace ?? ex.Message); }
                        continue;
                    }
                }
                Character ch = new() { Text = text[ptr], Angle = conductor.Angle, Style = conductor.Style, Color = conductor.Color, Scale = conductor.Size };
                if (!charMap.ContainsKey(conductor.Font)) charMap[conductor.Font] = [];
                if (!charMap[conductor.Font].TryGetValue(text[ptr], out Vector2 sz))
                {
                    sz = conductor.Font.Measure(text[ptr], 72);
                    charMap[conductor.Font][text[ptr]] = sz;
                }
                var frag = conductor.Font.GetFragment(text[ptr], ch.Style);
                if (frag == null) { ch.Font = conductor.Font._font[ch.Style].First(); ch.Text = ' '; }
                else ch.Font = frag;
                ch.Size = sz * ch.Scale / 72;
                if (bounds > 0 && conductor.Pen + ch.Size.X > bounds) Helper.LineBreak(ref charNo, ref conductor, ref currentLine, ref currentY, ref lines);
                ch.Position = new(conductor.Pen, currentY);
                conductor.Pen += ch.Size.X + conductor.Spacing.X;
                foreach (var fn in conductor.CurrentOnUpdates) ch.onUpdate += fn(conductor, charNo);
                foreach (var fn in conductor.CurrentOnDraw) ch.onDraw += fn(conductor, charNo);
                currentLine.Add(ch);
                charNo++;
            }
            if (currentLine.Count > 0) lines.Add(currentLine);
            if (lines.Where(x => x.Count > 0).Count() == 0) { Logger.Warn("Empty Text was generated?!"); return new(); }
            var _totalX = lines.Where(x => x.Count > 0).MaxBy(x => x.Last().Position.X + x.Last().Size.X).Last();
            float totalX = _totalX.Position.X + _totalX.Size.X;
            var _totalY = lines.Last().MaxBy(x => x.Size.Y);
            float totalY = _totalY.Position.Y + _totalY.Size.Y;
            for (int i = 0; i < lines.Count; i++)
            {
                if (lines[i].Count == 0) continue;
                var line = lines[i];
                float maxX = line.Last().Position.X + line.Last().Size.X;
                float maxY = line.MaxBy(x => x.Size.Y).Size.Y;
                for (int j = 0; j < line.Count; j++)
                {
                    var ch = line[j];
                    ch.Position.X -= maxX * (align.X + 1) / 2;
                    ch.Position.Y += maxY - ch.Size.Y - totalY * (align.Y + 1) / 2; // bottom align
                    ch.Total = new(totalX, totalY); ch.Max = new(maxX, maxY);
                    line[j] = ch;
                }
                lines[i] = line;
            }
            List<Character> ret = []; foreach (var line in lines) ret.AddRange(line);
            return new() { Characters = [.. ret], Size = new(totalX, totalY) };
        }
        public void Draw(Instance i) => Draw(i, Vector2.Zero);
        public void Draw(Instance i, Vector2 offset)
        {
            foreach (var _ch in Characters)
            {
                var ch = _ch.OnUpdate(i);
                Sprite.TryCameraWarp(MathP.Rotate(ch.Position, i.Angle) * i.Scale + i.Position + offset, ch.Size * i.Scale, i.Angle + ch.Angle, out Vector4 m);
                if (!char.IsWhiteSpace(ch.Text)) Graphics.DrawTextPro(ch.Font.font, ch.Text.ToString(), m.XY(), m.ZW() / 2, ch.Angle + i.Angle, ch.Scale * m.Z / ch.Size.X, 0, ch.Color * i.Blend * i.Alpha);
                ch.OnDraw(i, offset);
            }
        }
    }

    public class TextConductor
    {
        public TextConductor? Previous = null;
        public Font Font;
        public float Pen = 0;
        public Vector2 Spacing = Vector2.Zero;
        public float Size = 16;
        public float Angle = 0;
        public Font.Style Style = Font.Style.REGULAR;
        public ColorP Color = ColorP.WHITE;
        // List<>: list of
        // Func<TC, int>: functions that take current TC and # of char being processed
        // Func<I, C, C>: that produces a function to apply to onUpdate
        public List<Func<TextConductor, int, Func<Instance, Character, Character>>> CurrentOnUpdates = [];
        public List<Func<TextConductor, int, Action<Instance, Vector2, Character>>> CurrentOnDraw = [];
        public TextConductor() { }
        public TextConductor(TextConductor other) 
        { 
            Previous = other;
            Pen = other.Pen;
            Font = other.Font;
            Size = other.Size;
            Angle = other.Angle;
            Style = other.Style;
            Color = other.Color;
            Spacing = other.Spacing;
            CurrentOnUpdates = [..other.CurrentOnUpdates];
            CurrentOnDraw = [..other.CurrentOnDraw];
        }
    }

    public struct Character(FontFragment font, char text, Vector2 position, float scale, Vector2 size, float angle, Font.Style style, ColorP color)
    {
        public FontFragment Font = font;
        public char Text = text;
        public Vector2 Position = position;
        public float Scale = scale;
        public Vector2 Size = size;
        public float Angle = angle;
        public Font.Style Style = style;
        public ColorP Color = color;
        public event Func<Instance, Character, Character>? onUpdate = null;
        public event Action<Instance, Vector2, Character>? onDraw = null;
        public Vector2 Max;
        public Vector2 Total;
        public Character(Character other): this(other.Font, other.Text, other.Position, other.Scale, other.Size, other.Angle, other.Style, other.Color) 
        {
            onUpdate = other.onUpdate;
            onDraw = other.onDraw;
        }
        public readonly Character OnUpdate(Instance i) => onUpdate == null ? this : onUpdate(i, this);
        public readonly void OnDraw(Instance i, Vector2 offset) => onDraw?.Invoke(i, offset, this);
    }
    public abstract class TextTag
    {
        public abstract string Name { get; }
        public abstract TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args);
        public TextTag() { Text.Tags.Add(Name, this); }
    }
}
