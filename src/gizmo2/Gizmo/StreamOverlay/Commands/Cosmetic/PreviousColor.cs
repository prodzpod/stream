using Gizmo.Engine.Data;
using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class PreviousColor : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return ModelSprite.PreviousColor.Select(x =>
            {
                var ret = x.ToString();
                if (ret.EndsWith("FF")) ret = ret[..(ret.Length - 2)];
                return ret;
            }).ToArray();
        }
    }
}
