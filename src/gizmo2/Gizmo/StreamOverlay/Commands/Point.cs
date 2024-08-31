using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Point : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            string? icon = WASD.Assert<string>(args[4]);
            string? _color = WASD.Assert<string>(args[1]);
            string? author = WASD.Assert<string>(args[0]);
            if (x == null || y == null || icon == null || _color == null || author == null) return null;
            ColorP color = new(_color);
            Instance[] iToCheck = [StreamOverlay.Prod, ..Game.INSTANCES.Where(x => x.Element is Shimeji)];
            Elements.Pointer.New(new((float)x, (float)y), icon, 
               iToCheck.Any(i => HitboxP.Check(i, new PointHitbox(new Vector2(x.Value, y.Value)))) ? 3 : 0, author, color);
            Audio.Play("screen/point");
            return null;
        }
    }
}
