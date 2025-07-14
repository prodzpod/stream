using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine;
using System.Numerics;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class Draw : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            float? x2 = WASD.Assert<float>(args[4]);
            float? y2 = WASD.Assert<float>(args[5]);
            Dictionary<string, object?>? iconset = WASD.Assert<Dictionary<string, object?>>(args[6]);
            string? icon = iconset != null ? (string?)iconset["click"] : null;
            string? _color = WASD.Assert<string>(args[1]);
            string? author = WASD.Assert<string>(args[0]);
            if (x == null || y == null || icon == null || _color == null || author == null) return null;
            icon = "pointer/" + icon;
            ColorP color = new(_color);
            for (var i = 0; i < Game.INSTANCES.Length; i++)
            {
                var instance = Game.INSTANCES[i];
                if (instance.Element is not Elements.Windows.DrawWindow
                    || !instance.Get<bool>("pinned")) continue;
                if (HitboxP.Check(instance, new PointHitbox(new Vector2(x.Value, y.Value))))
                {
                    Logger.Log("Adding Line");
                    instance.Get<List<Line>>("lines").Add(new Line()
                    {
                        a = instance.GetRelativePosition(new(x.Value, y.Value)),
                        b = instance.GetRelativePosition(new(x2.Value, y2.Value)),
                        color = color
                    });
                }
                Game.INSTANCES[i] = instance;
            }
            var p = Elements.Gizmos.Pointer.New(new(x.Value, y.Value), icon, 1, author, color);
            p.Position = new(x.Value, y.Value);
            p.Set("target", new Vector2(x2.Value, y2.Value));
            Audio.Play("screen/click");
            return null;
        }
    }
}
