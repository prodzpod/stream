using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;

namespace ProdModel.Object
{
    public class ImageSprite : ISprite
    {
        public string Path = "";
        public Texture2D Texture;
        public Vector2 FlipDependence = Vector2.One; // whether to flip the image itself upon flip
        public Color Color = Color.White;

        public ImageSprite(string Path) : this(Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath(Path + ".png"))) { this.Path = Path; }
        public ImageSprite(Texture2D Texture)
        {
            this.Texture = Texture;
        }

        public static ImageSprite FromIcon(string Path)
        {
            return new(Path) { FlipDependence = Vector2.Zero };
        }

        public Vector2 GetBoundingBox()
        {
            return new(Texture.Width, Texture.Height);
        }

        public virtual void Render(Vector4 position, float rotation)
        {
            ProdModel.Instance._spriteBatch.Draw(Texture, position.XY(), null, Color, MathP.DegToRad(rotation), GetBoundingBox() / 2, Vector2.One, SpriteEffects.None, 0);
        }
    }
}
