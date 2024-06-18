using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using Typography.FontCollections;
using Typography.OpenFont;
using Typography.Text;

namespace ProdModel.Utils
{
    public class FontP
    {
        public static InstalledTypefaceCollection s_installedTypefaceCollection;
        public static OpenFontTextService s_textServices; //owner
        public static TextServiceClient _txtServiceClient;

        public static Dictionary<string, InstalledTypeface> Fonts = new();

        public static void Init()
        {
            s_installedTypefaceCollection = new InstalledTypefaceCollection();
            s_installedTypefaceCollection.SetFontNameDuplicatedHandler((_, __) => FontNameDuplicatedDecision.Skip);
            s_installedTypefaceCollection.LoadFontsFromFolder(ProdModel.ResolvePath("Content/fonts"));
            s_installedTypefaceCollection.UpdateUnicodeRanges();
            s_textServices = new OpenFontTextService(s_installedTypefaceCollection);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            _txtServiceClient = s_textServices.CreateNewServiceClient();
            foreach (var f in s_installedTypefaceCollection.GetInstalledFontIter()) Fonts[f.FontName] = f;
            Debug.WriteLine("[FontP] loaded " + Fonts.Keys.Count + " fonts:" + string.Join(", ", Fonts.Keys));
        }
        public static List<Character> Measure(string text, Font font, float size, Vector4 color, Vector2 bbox) => Measure(text, font, size, color, bbox, -Vector2.One, Vector2.Zero);
        public static List<Character> Measure(string text, Font font, float size, Vector4 color, Vector2 bbox, Vector2 align) => Measure(text, font, size, color, bbox, align, Vector2.Zero);
        public static List<Character> Measure(string text, Font font, float size, Vector4 color, Vector2 bbox, Vector2 align, Vector2 space)
        {
            throw new NotImplementedException();
        }
        public static Bitmap Draw(Bitmap image, Character character)
        {
            throw new NotImplementedException();
        }
        public static Vector4 GetOccupiedSpace(IEnumerable<Character> measures)
        {
            IEnumerable<Vector4> bboxes = measures.Select(x => x._bbox);
            var l = bboxes.MinBy(x => x.X);
            var r = bboxes.MaxBy(x => x.X + x.Z);
            var t = bboxes.MinBy(x => x.Y);
            var b = bboxes.MaxBy(x => x.Y + x.W);
            return new(l.X, t.Y, r.X + r.Z - l.X, b.Y + b.W - l.Y);
        }
        public static Typeface ResolveTypeface(InstalledTypeface instTypeface) => s_installedTypefaceCollection.ResolveTypeface(instTypeface);
        public struct Font
        {
            public List<InstalledTypeface> Normal;
            public List<InstalledTypeface> Bold = new();
            public List<InstalledTypeface> Italic = new();
            public List<InstalledTypeface> Both = new();
            public bool Pixelated = true;
            public Font(params string[] fonts) { Normal = fonts.Select(x => Fonts[x]).ToList(); }
            public Font SetPixelated() { Pixelated = true; return this; }
            public Font SetBold(params string[] fonts) { Bold = fonts.Select(x => Fonts[x]).ToList(); return this; }
            public Font SetItalic(params string[] fonts) { Italic = fonts.Select(x => Fonts[x]).ToList(); return this; }
            public Font SetBoth(params string[] fonts) { Both = fonts.Select(x => Fonts[x]).ToList(); return this; }
        }
        public struct Character
        {
            public Vector4 bbox;
            public Vector4 _bbox;
            public float rotation;
            public float _rotation;
            public string character;
            public string _character;
            public Vector4 color;
            public Vector4 _color;
            public Font font;
            public Font _font;
            public float size;
            public float _size;
            public bool bold;
            public bool _bold;
            public bool italic;
            public bool _italic;
            public float life;
            public event Action<Character> onUpdate;
            public Character(Vector4 bbox, float rotation, string character, Vector4 color, Font font, float size, bool bold=false, bool italic=false)
            {
                this.bbox = bbox; _bbox = bbox;
                this.rotation = rotation; _rotation = rotation;
                this.character = character; _character = character; 
                this.color = color; _color = color;
                this.font = font; _font = font;
                this.size = size; _size = size;
                this.bold = bold; _bold = bold;
                this.italic = italic; _italic = italic;
                life = 0;
            }
            public void OnUpdate(float delta)
            {
                life += delta;
                _bbox = bbox;
                _rotation = rotation;
                _character = character;
                _font = font;
                _size = size;
                _bold = bold;
                _italic = italic;
                _color = color;
                onUpdate?.Invoke(this);
            }
        }
        public struct TextBox
        {
            public Vector4 bbox;
            public Font font;
            public float size;
            public Vector4 color = ColorP.RGBA(ColorP.BLACK);
            public Vector2 align = -Vector2.One;
            public Vector2 space = Vector2.Zero;
            public float rotation = 0;
            public List<Character> characters;
            public Bitmap image;
            public Graphics graphic;
            public Texture2D Texture = null;
            public TextBox(Vector4 bbox, Font font, float size, string text) : this(bbox, font, size, 0, ColorP.RGBA(ColorP.BLACK), -Vector2.One, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, float rotation, string text) : this(bbox, font, size, rotation, ColorP.RGBA(ColorP.BLACK), -Vector2.One, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, Vector4 color, string text) : this(bbox, font, size, 0, color, -Vector2.One, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, Vector2 align, string text) : this(bbox, font, size, 0, ColorP.RGBA(ColorP.BLACK), align, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, float rotation, Vector4 color, string text) : this(bbox, font, size, rotation, color, -Vector2.One, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, float rotation, Vector2 align, string text) : this(bbox, font, size, rotation, ColorP.RGBA(ColorP.BLACK), align, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, Vector4 color, Vector2 align, string text) : this(bbox, font, size, 0, color, align, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, float rotation, Vector4 color, Vector2 align, string text) : this(bbox, font, size, rotation, color, align, Vector2.Zero, text) { }
            public TextBox(Vector4 bbox, Font font, float size, float rotation, Vector4 color, Vector2 align, Vector2 space, string text)
            {
                this.bbox = bbox;
                this.font = font;
                this.size = size;
                this.rotation = rotation;
                this.color = color;
                this.align = align;
                this.space = space;
                characters = Measure(text, font, size, color, bbox.ZW());
                image = new Bitmap((int)bbox.Z + 32, (int)bbox.W + 32);
                graphic = Graphics.FromImage(image);
            }
            public void OnUpdate(float deltaTime)
            {
                Texture?.Dispose();
                graphic.Clear(System.Drawing.Color.Magenta);
                foreach (var c in characters)
                {
                    c.OnUpdate(deltaTime);
                    image = Draw(image, c);
                }
                var ms = new MemoryStream();
                image.Save(ms, ImageFormat.Png);
                Texture = Texture2D.FromStream(ProdModel.Instance._graphics.GraphicsDevice, ms);
            }
            public void OnDraw()
            {
                if (Texture != null) ProdModel.Instance._spriteBatch.Draw(Texture, bbox.XY(), null, Microsoft.Xna.Framework.Color.White, rotation, new Vector2(Texture.Width, Texture.Height) / 2, 1, SpriteEffects.None, 0);
            }
        }
    }
}
