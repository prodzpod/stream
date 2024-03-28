using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using ProdModel.Utils;
using System;
using System.Diagnostics;
using System.Reflection.Metadata;

namespace ProdModel.Object
{
    public class TextSprite : ISprite
    {
        public string Content = "";
        public SpriteFont Font;
        public float Size = 2; // multiplier
        public float Thickness = 0; // in px
        public Color Outline = Color.Black;
        public Color Fill = Color.Black;
        public Vector2 Align = Vector2.Zero; // -1: left/top, 0: center/middle, 1: right/bottom
        public Vector2 FlipDependence = Vector2.Zero; // whether to flip the image itself upon flip

        public TextSprite(string font) : this(font, "") { }
        public TextSprite(string font, string content) { Font = ProdModel.FONTS[font]; Content = content; }
        public TextSprite SetSize(float size) { Size = size; return this; }
        public TextSprite SetColor(Color color) { Fill = color; return this; }
        public TextSprite SetOutline(float size) => SetOutline(size, Fill == Color.Black ? Color.White : Color.Black);
        public TextSprite SetOutline(float size, Color color) { Size = size; Outline = color; return this; }
        public TextSprite SetAlign(int x, int y) => SetAlign(new(x, y));
        public TextSprite SetAlign(Vector2 align) { Align = align; return this; }
        public TextSprite BreakWord(float w)
        {
            string lines = "";
            string line = "";
            string[] words = Content.Split(' ');
            for (int i = 0; i < words.Length; i++)
            {
                if (Font.MeasureString(line + " " + words[i]).X * Size + (2 * Thickness) > w)
                {
                    if (line == "") lines += words[i] + "\n";
                    else
                    {
                        lines += line + "\n";
                        line = "";
                        i--;
                    }
                }
                else line += " " + words[i];
            }
            lines += line;
            Content = lines.Trim();
            return this;
        }
        public float GetWidth() => Font.MeasureString(Content).X * Size + (2 * Thickness);
        public Vector2 GetBoundingBox() => Font.MeasureString(Content) * Size + new Vector2(2 * Thickness, 2 * Thickness);
        public void Render(Vector4 position, float rotation, float depth)
        {
            var size = GetBoundingBox();
            ProdModel.Instance._spriteBatch.DrawString(Font, Content,
                position.XY() + (Align * (position.ZW() - size) / 2), Fill, rotation, size / (2 * Size), Size, SpriteEffects.None, depth);
        }
    }
}
