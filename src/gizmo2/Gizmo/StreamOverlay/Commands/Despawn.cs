using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Rooms;

namespace Gizmo.StreamOverlay.Commands
{
    public class Despawn : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? author = WASD.Assert<string>(args[0]);
            if (author == null) return [0, false];
            if (!StreamOverlay.Shimeji.TryGetValue(author, out var i)) return [0, false];
            i.Destroy();
            return [0, true];
        }
    }
}
