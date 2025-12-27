using Gizmo.Engine;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class GHeatDrag : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[1]);
            float? y = WASD.Assert<float>(args[2]);
            string? author = WASD.Assert<string>(args[0]);
            if (x == null || y == null || author == null) return null;
            if (!GHeatPointer.Pointers.ContainsKey(author)) return null;
            GHeatPointer.Drag(author, new Vector2(x.Value, y.Value));
            return null;
        }
    }
}
