using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using ProdModel.Utils;
using System;

namespace ProdModel.Object
{
    public class ImageSprite : ISprite
    {
        public Texture2D Texture;
        public Vector2 FlipDependence = Vector2.One; // whether to flip the image itself upon flip

        public ImageSprite(string Path)
        {
            Texture = Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath(Path + ".png"));
        }

        public static ImageSprite FromIcon(string Path)
        {
            return new(Path) { FlipDependence = Vector2.Zero };
        }

        public Vector2 GetBoundingBox()
        {
            return new(Texture.Width, Texture.Height);
        }

        public virtual void Render(Vector4 position, float rotation, float depth)
        {
            ProdModel.Instance._spriteBatch.Draw(Texture, position.XY(), null, Color.White, rotation, GetBoundingBox() / 2, Vector2.One, SpriteEffects.None, depth);
        }
    }
}
