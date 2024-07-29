using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands
{
    public class RemoveTriangle : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[0]);
            if (x <= 0) x = 1;
            ModelSprite.TriangleRemoved += (int)x;
            return null;
        }
    }
}
