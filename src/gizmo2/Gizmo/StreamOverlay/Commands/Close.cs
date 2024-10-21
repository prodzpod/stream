using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Close : Command
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
            for (var i = 0; i < Game.INSTANCES.Length; i++)
            {
                var instance = Game.INSTANCES[i];
                if (instance.Element is not GameElement || ((GameElement)instance.Element).Immortal) continue;
                if (HitboxP.Check(instance, new PointHitbox(new Vector2(x.Value, y.Value))))
                    instance.Destroy();
                Game.INSTANCES[i] = instance;
            }
            Pointer.New(new((float)x, (float)y), icon, 1, author, color);
            Audio.Play("screen/click");
            return null;
        }
    }
}
