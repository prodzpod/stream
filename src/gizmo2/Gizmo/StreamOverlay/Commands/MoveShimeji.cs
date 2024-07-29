using Gizmo.Engine;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class MoveShimeji : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? author = WASD.Assert<string>(args[0]);
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            if (author == null) return null;
            if (StreamOverlay.Shimeji.TryGetValue(author, out var i))
            {
                Vector2 pos = new(x.Value, y.Value);
                i.Set("target", pos);
            }
            return null;
        }
    }
}
