using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Screens;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class Click : Command
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
                if (instance.Element is not GameElement) continue;
                if (HitboxP.Check(instance, new PointHitbox(new Vector2(x.Value, y.Value))))
                {
                    var temp = StreamOverlay.ClickedInstance;
                    ((GameElement)instance.Element).OnClick(ref instance, new(x.Value, y.Value));
                    instance.Rotation = MathP.Lerp(instance.Rotation, -instance.Angle * 5, .5f);
                    StreamOverlay.ClickedInstance = temp;
                    if (instance.Element is Prod && !Prod.Is2D)
                    {
                        Instance.New(nameof(Explosion), StreamOverlay.Prod.Position);
                        Prod.Is2D = true;
                        StreamOverlay.Prod.Gravity = Vector2.UnitY * 3000;
                    }
                    if (instance.Element is RaidBoss) Elements.Entities.Shimeji.Damage(instance, 1, []); // neutral :(
                }
                Game.INSTANCES[i] = instance;
            }
            Elements.Gizmos.Pointer.New(new((float)x, (float)y), icon, 1, author, color);
            Audio.Play("screen/click_me");
            return null;
        }
    }
}
