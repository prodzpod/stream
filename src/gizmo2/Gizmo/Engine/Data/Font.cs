using Raylib_CSharp.Fonts;
using SharpFont;
using System.Numerics;

namespace Gizmo.Engine.Data
{
    public class Font
    {
        public static readonly Encoding[] Encodings = [Encoding.Unicode, Encoding.Sjis, Encoding.Wansung, Encoding.AdobeStandard, Encoding.AdobeExpert, Encoding.AdobeLatin1, Encoding.AppleRoman, Encoding.MicrosoftSymbol, Encoding.Johab, Encoding.GB2312, Encoding.Big5];
        public Dictionary<Style, FontFragment[]> _font = [];
        public FontFragment[] Regular => _font[Style.REGULAR];
        public FontFragment[] Bold => _font[Style.BOLD];
        public FontFragment[] Italic => _font[Style.ITALIC];
        public FontFragment[] Both => _font[Style.BOTH];
        public FontFragment? GetFragment(char c, Style s = Style.REGULAR)
        {
            foreach (FontFragment f in _font[s]) if (f.codeRanges.Any(x => MathP.Between(x.Key, c, x.Value))) return f;
            return null;
        }
        public FontFragment?[] GetFragment(string s, Style st = Style.REGULAR) => s.ToCharArray().Select(x => GetFragment(x, st)).ToArray();
        public Vector2 Measure(char c, float size, Style s = Style.REGULAR) {
            var frag = GetFragment(c, s);
            if (frag == null) return TextManager.MeasureTextEx(_font[s][0].font, " ", size, 0);
            return TextManager.MeasureTextEx(frag.font, c.ToString(), size, 0);
        }
        public Vector2[] Measure(string s, float size, Style st = Style.REGULAR) => s.ToCharArray().Select(x => Measure(x, size, st)).ToArray();
        public enum Style
        {
            REGULAR,
            BOLD,
            ITALIC,
            BOTH
        }
    }

    public class FontFragment
    {
        public string path;
        public Raylib_CSharp.Fonts.Font font;
        public int size = 72;
        public KeyValuePair<int, int>[] codeRanges;
        public static FontFragment EMPTY = new();
        // public static FontFragment DEFAULT = new() { font = Raylib_CSharp.Fonts.Font.GetDefault(), size = 8, path = "", codeRanges =  };
        public FontFragment() : this("") { }
        public FontFragment(string path)
        {
            this.path = path;
            codeRanges = [];
        }
        public FontFragment(string path, IEnumerable<uint> codepoints) : this(path, 72, codepoints) { }
        public FontFragment(string path, IEnumerable<int> codepoints) : this(path, 72, codepoints) { }
        public FontFragment(string path, int size, IEnumerable<uint> codepoints) : this(path, size, codepoints.Select(x => (int)x)) { }
        public FontFragment(string path, int size, IEnumerable<int> codepoints)
        {
            this.path = path;
            int start = -1, end = -1;
            List<KeyValuePair<int, int>> ranges = [];
            foreach (int code in codepoints)
            {
                if (start == -1) { start = code; end = start; }
                else if (code == end + 1) end = code;
                else { ranges.Add(new(start, end)); start = code; end = start; }
            }
            if (start != -1) ranges.Add(new(start, end));
            codeRanges = [..ranges];
            Logger.Debug("Ranges:", codeRanges.Length);
            this.size = size;
            font = Raylib_CSharp.Fonts.Font.LoadEx(path, size, [.. codepoints]);
        }
        public static FontFragment Load(string path)
        {
            Logger.Debug("Loading:", path);
            Face font = new(Resource.Library, path);
            uint ch = 0;
            foreach (var e in Font.Encodings)
            {
                try
                {
                    font.SelectCharmap(e);
                    font.GetFirstChar(out ch);
                    if (ch != 0) break;
                    Logger.Debug("Selected Encoding", e.ToString());
                }
                catch { }
            }
            if (ch == 0) { Logger.Warn("Font is empty? Something may have gone wrong"); return new(path); }
            uint i = 1; List<uint> codes = [];
            while (i != 0)
            {
                codes.Add(ch);
                ch = font.GetNextChar(ch, out i);
            }
            Logger.Debug("Loaded", codes.Count, "Glyphs");
            return new FontFragment(path, codes);
        }
        public bool[] Contains(string z) => z.ToCharArray().Select(Contains).ToArray();
        public bool Contains(char z)
        {
            int code = z.GetHashCode();
            foreach (var r in codeRanges) if (MathP.Between(r.Key, code, r.Value)) return true;
            return false;
        }
    }
}
