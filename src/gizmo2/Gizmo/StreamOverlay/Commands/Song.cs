using Gizmo.StreamOverlay.Elements;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Song : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float? x = WASD.Assert<float>(args[0]);
            float? y = WASD.Assert<float>(args[1]);
            string? title = WASD.Assert<string>(args[2]);
            string? path = WASD.Assert<string>(args[3]);
            if (x == null || y == null || title == null || path == null) return null;
            SongWindow.New(new Vector2(x.Value, y.Value), title, path);
            return null;
        }
    }
}
