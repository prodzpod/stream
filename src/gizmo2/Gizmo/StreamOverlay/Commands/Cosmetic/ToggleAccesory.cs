using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class ToggleAccessory : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? source = WASD.Assert<string>(args[0]);
            if (source == null)
            {
                ModelSprite.Accessories = [.. ModelSprite.FixedAccessories];
                return ["reset all"];
            }
            if (ModelSprite.Accessories.Contains(source))
            {
                ModelSprite.Accessories.Remove(source);
                return ["removed " + source];
            }
            else
            {
                ModelSprite.Accessories.Add(source);
                return ["added " + source];
            }
        }
    }
}
