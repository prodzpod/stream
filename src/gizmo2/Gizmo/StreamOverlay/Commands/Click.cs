using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using PInvoke;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Click : Command
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
                }
                Game.INSTANCES[i] = instance;
            }
            Pointer.New(new((float)x, (float)y), icon, 1, author, color);
            Audio.Play("screen/click_me");
            return null;
        }
    }
}
