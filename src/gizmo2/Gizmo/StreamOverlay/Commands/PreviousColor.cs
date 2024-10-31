using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class PreviousColor : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            return ModelSprite.PreviousColor.Select(x => {
                var ret = x.ToString();
                if (ret.EndsWith("FF")) ret = ret[..(ret.Length - 2)];
                return ret;
            }).ToArray();
        }
    }
}
