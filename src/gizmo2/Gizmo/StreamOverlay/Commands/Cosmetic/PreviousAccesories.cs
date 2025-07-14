using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class PreviousAccessories : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return ModelSprite.PreviousAccessories.ToArray();
        }
    }
}
