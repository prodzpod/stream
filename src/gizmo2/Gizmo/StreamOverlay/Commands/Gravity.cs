using Gizmo.Engine;
using Gizmo.StreamOverlay.Elements;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Gravity : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[0]);
            float y = WASD.Assert<float>(args[1]);
            foreach (var i in Game.INSTANCES.Where(x => x.Element is Squareish))
            {
                if (!i.Var.ContainsKey("originalGravity")) i.Set("originalGravity", i.Gravity);
                i.Gravity = new Vector2(x, y) * 1000;
                i.Speed = Vector2.Zero;
            }
            return null;
        }
    }
}
