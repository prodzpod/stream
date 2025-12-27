using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Screens;
using LibVLCSharp.Shared;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Pointer
{
    public class GHeatClick : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            Dictionary<string, object?>? iconset = WASD.Assert<Dictionary<string, object?>>(args[4]);
            string? _color = WASD.Assert<string>(args[1]);
            string? author = WASD.Assert<string>(args[0]);
            float? isAnonymous = WASD.Assert<float>(args[5]);
            if (x == null || y == null || iconset == null || _color == null || author == null) return null;
            ColorP color = new(_color);
            var _i = Game.INSTANCES.Where(x => x.Element is GameElement && x.Hitbox != null).Reverse().ToArray();
            var frame = 0;
            for (var i = 0; i < _i.Length; i++)
            {
                var instance = _i[i];
                if (HitboxP.Check(instance, new PointHitbox(new Vector2(x.Value, y.Value))))
                {
                    frame = 1;
                    GHeatPointer.Grabbed[author] = instance;
                    var temp = StreamOverlay.ClickedInstance;
                    var temp2 = StreamOverlay.ClickedPosition;
                    ((GameElement)instance.Element).OnClick(ref instance, new(x.Value, y.Value));
                    instance.Set("origin", instance.GetRelativePosition(new(x.Value, y.Value)));
                    instance.Rotation = MathP.Lerp(instance.Rotation, -instance.Angle * 5, .5f);
                    StreamOverlay.ClickedInstance = temp;
                    StreamOverlay.ClickedPosition = temp2;
                    if (instance.Element is Prod && !Prod.Is2D)
                    {
                        Instance.New(nameof(Explosion), StreamOverlay.Prod.Position);
                        Prod.Is2D = true;
                        StreamOverlay.Prod.Gravity = Vector2.UnitY * 3000;
                    }
                    if (instance.Element is RaidBoss) Elements.Entities.Shimeji.Damage(instance, 1, []); // neutral :(
                    _i[i] = instance;
                    break;
                }
            }
            string? icon = iconset != null ? (string?)iconset[frame == 1 ? "click" : "point"] : null;
            icon = "pointer/" + icon;
            GHeatPointer.New(new((float)x, (float)y), icon, frame, author, color, isAnonymous.Value > 0);
            Audio.Play(frame == 1 ? "screen/click_me" : "screen/point");
            BRB.Colors[author] = color;
            if (BRB.Leaderboard.ContainsKey(author)) BRB.Leaderboard[author] += 1;
            else BRB.Leaderboard[author] = 1;
            return null;
        }
    }
}
