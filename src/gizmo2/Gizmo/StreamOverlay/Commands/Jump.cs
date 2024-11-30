using Gizmo.Engine;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Jump : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? author = WASD.Assert<string>(args[0]);
            if (author == null) return null;
            if (StreamOverlay.Shimeji.TryGetValue(author, out var i)) i.Set("forcejump", true);
            return null;
        }
    }
}
