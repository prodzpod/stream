using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;

namespace ProdModel.Object
{
    public class ColorSprite : ISprite
    {
        public Color Color;
        public Vector2 FlipDependence = Vector2.One; // whether to flip the image itself upon flip

        public ColorSprite(Color Color) { this.Color = Color; }

        public Vector2 GetBoundingBox()
        {
            return Vector2.Zero;
        }

        public virtual void Render(Vector4 position, float rotation, float depth)
        {
            ProdModel.Instance._spriteBatch.Draw(ProdModel.PIXEL, new Vector2(position.X, position.Y), null, Color, rotation, Vector2.One, new Vector2(position.Z / 2, position.W / 2), SpriteEffects.None, depth);
        }
    }
}
