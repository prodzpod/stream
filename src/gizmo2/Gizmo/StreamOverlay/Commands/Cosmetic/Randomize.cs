using Gizmo.Engine.Util;
using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class Randomize : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? seed = WASD.Assert<string>(args[0]);
            Random rnd;
            if (seed == null) rnd = RandomP.GetRandom(false);
            else rnd = RandomP.GetRandom(seed.GetHashCode());
            foreach (var c in ModelSprite.PreviousColor.ToArray())
                ModelSprite.ColorReplace[c] = new(rnd.NextSingle(), rnd.NextSingle(), rnd.NextSingle(), c.A / 255f);
            ModelSprite.Accessories = [.. ModelSprite.FixedAccessories];
            if (ModelSprite.Accessories.Count == 0) return null;
            var accessories = ModelSprite.PreviousAccessories.ToList();
            var chance = 1f;
            while (rnd.NextSingle() < chance && accessories.Count > 0)
            {
                var temp = RandomP.Random(accessories, rnd);
                ModelSprite.Accessories.Add(temp);
                accessories.Remove(temp);
                chance *= 0.7f;
            }
            return null;
        }
    }
}
