using Gizmo.Engine;
using Gizmo.Engine.Util;
using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands
{
    public class Randomize : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? seed = WASD.Assert<string>(args[0]);
            Random rnd;
            if (seed == null) rnd = RandomP.GetRandom(false);
            else rnd = RandomP.GetRandom(seed.GetHashCode());
            foreach (var c in ModelSprite.PreviousColor.ToArray())
                ModelSprite.ColorReplace[c] = new(rnd.NextSingle(), rnd.NextSingle(), rnd.NextSingle(), c.A / 255f);
            ModelSprite.Accessories.Clear();
            var accessories = ModelSprite.PreviousAccessories.ToList();
            var chance = 1f;
            while (rnd.NextSingle() < chance) 
            {
                var temp = RandomP.Random(accessories, rnd); 
                ModelSprite.Accessories.Add(temp); 
                accessories.Remove(temp);
                chance *= 0.7f;
                if (accessories.Count == 0) break;
            }
            return null;
        }
    }
}
