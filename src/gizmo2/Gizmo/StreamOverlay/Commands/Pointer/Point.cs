using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class Point : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            Dictionary<string, object?>? iconset = WASD.Assert<Dictionary<string, object?>>(args[4]);
            string? icon = iconset != null ? (string?)iconset["point"] : null;
            string? iconPet = iconset != null ? (string?)iconset["pet"] : null;
            string? _color = WASD.Assert<string>(args[1]);
            string? author = WASD.Assert<string>(args[0]);
            if (x == null || y == null || icon == null || iconPet == null || _color == null || author == null) return null;
            icon = "pointer/" + icon; iconPet = "pointer/" + iconPet;
            ColorP color = new(_color);
            Instance[] iToCheck = [StreamOverlay.Prod, .. Game.INSTANCES.Where(x => x.Element is Elements.Entities.Shimeji)];
            iToCheck = iToCheck.Where(i => HitboxP.Check(i, new PointHitbox(new Vector2(x.Value, y.Value)))).ToArray();
            foreach (var i in iToCheck) if (i.Element is Elements.Entities.Shimeji) i.Set("timespetted", i.Get<int>("timespetted") + 1);
            Elements.Gizmos.Pointer.New(new((float)x, (float)y), iToCheck.Length > 0 ? iconPet : icon, iToCheck.Length > 0 ? 3 : 0, author, color);
            Audio.Play("screen/point");
            return null;
        }
    }
}
