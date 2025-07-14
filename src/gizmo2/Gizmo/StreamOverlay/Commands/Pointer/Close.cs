using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Screens;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class Close : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            Dictionary<string, object?>? iconset = WASD.Assert<Dictionary<string, object?>>(args[4]);
            string? icon = iconset != null ? (string?)iconset["click"] : null;
            string? _color = WASD.Assert<string>(args[1]);
            string? author = WASD.Assert<string>(args[0]);
            if (x == null || y == null || icon == null || _color == null || author == null) return null;
            icon = "pointer/" + icon;
            ColorP color = new(_color);
            for (var i = 0; i < Game.INSTANCES.Length; i++)
            {
                var instance = Game.INSTANCES[i];
                if (instance.Element is not GameElement || ((GameElement)instance.Element).Immortal) continue;
                if (HitboxP.Check(instance, new PointHitbox(new Vector2(x.Value, y.Value))))
                    instance.Destroy();
                Game.INSTANCES[i] = instance;
                if (instance.Element is RaidBoss) Elements.Entities.Shimeji.Damage(instance, 1, []); // neutral :(
            }
            Elements.Gizmos.Pointer.New(new((float)x, (float)y), icon, 1, author, color);
            Audio.Play("screen/click");
            return null;
        }
    }
}
