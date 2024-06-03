using Microsoft.Xna.Framework;

namespace ProdModel.Object.Sprite
{
    public interface ISprite { public Vector2 GetBoundingBox(); public void Render(Vector4 position, float rotation); }
}
