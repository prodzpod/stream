using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Gizmos;

namespace Gizmo.StreamOverlay.Commands
{
    public class Explode : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? id = WASD.Assert<string>(args[0]);
            if (!Game.INSTANCES.TryFirst(x => x.Get<string>("id") == id, out var ret)) return [false];
            Instance.New(nameof(Explosion), ret.Position);
            ret.Destroy();
            return [true];
        }
    }
}
