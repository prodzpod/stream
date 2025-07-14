using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Misc
{
    public class Gift : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? content = WASD.Assert<string>(args[0]);
            float? worth = MathP.Sqr(MathP.Log(WASD.Assert<float>(args[1]), 10) + 1) * 13 * 4;
            float? amount = MathP.Clamp(MathP.Round(WASD.Assert<float>(args[2])), 0, 100);
            Text t = Text.Compile(content, "arcaoblique", worth.Value, ColorP.WHITE);
            var c = Squareish.New(nameof(Squareish), new(RandomP.Random(0, 1920), RandomP.Random(0, 1080)), t.Size * 2, Text.Compile(content, "arcaoblique", worth.Value * 2, ColorP.WHITE));
            c.Speed = new(RandomP.Random(-12000, 12000), RandomP.Random(-12000, 12000));
            c.Rotation = RandomP.Random(-7200, 7200);
            c.onPostInit += () =>
            {
                c.Depth = 10;
                c.Bounciness = 0.99f;
                c.Drag = 1;
                c.Friction = 1;
                c.Gravity = Vector2.UnitY * 3000;
                return false;
            };
            c.Depth = 11;
            c.Set("summoned", 0);
            c.onUpdate += (dt) =>
            {
                var s = c.Get<int>("summoned");
                bool action = false;
                for (int i = 0; i < c.Life / 0.1f - s; i++)
                {
                    action = true;
                    var c2 = SpawnGift(c.Position, c.Angle, content, worth.Value);
                    c2.Speed = c.Speed / 4;
                    c2.Rotation = c.Rotation / 4;
                    s++;
                }
                if (action)
                {
                    c.Set("summoned", s);
                    if (s >= amount) c.Destroy();
                }
                return true;
            };
            c.onCollide += (a) =>
            {
                c.Speed = new(RandomP.Random(-12000, 12000), RandomP.Random(-12000, 12000));
                c.Rotation = RandomP.Random(-7200, 7200);
                return true;
            };
            return null;
        }

        public static Instance SpawnGift(Vector2 position, float angle, string content, float worth)
        {
            Text t = Text.Compile(content, "arcaoblique", worth, ColorP.WHITE);
            Audio.Play("screen/speak", RandomP.Random(.8f, 1.2f));
            var c2 = Squareish.New(nameof(Elements.Entities.Gift), position, t.Size, t);
            c2.Angle = angle;
            c2.Set("sprite", content);
            c2.Set("worth", worth);
            return c2;
        }
    }
}
