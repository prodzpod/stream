using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;

namespace ProdModel.Object
{
    public class ModelSprite : ImageSprite
    {
        public bool ShowModel = true;

        public ModelSprite(string Path) : base(Path)
        {
            FlipDependence = Vector2.One; // whether to flip the image itself upon flip
        }

        public override void Render(Vector4 position, float rotation, float depth)
        {
            ProdModel.Instance._spriteBatch.Draw(Texture, new Vector2(position.X, position.Y), null, Color.White, rotation, new Vector2(position.Z / 2, position.W / 2), Vector2.One, SpriteEffects.None, depth);
        }
    }
}
