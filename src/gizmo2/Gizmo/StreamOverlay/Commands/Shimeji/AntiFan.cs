using Gizmo.Engine;
using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Shimeji
{
    public class AntiFan : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x1 = WASD.Assert<float>(args[2]);
            float? y1 = WASD.Assert<float>(args[3]);
            float? x2 = WASD.Assert<float>(args[4]);
            float? y2 = WASD.Assert<float>(args[5]);
            if (x1 == null || y1 == null || x2 == null || y2 == null) return null;
            SpawnFan(x1.Value, y1.Value, MathP.Atan2(x2.Value - x1.Value, y2.Value - y1.Value), MathP.Dist(new Vector2(x1.Value, x2.Value) * 10, new Vector2(y1.Value, y2.Value)));
            return null;
        }

        public static Instance SpawnFan(float x, float y, float angle, float force = 100)
        {
            Instance i = Elements.Gizmos.AntiFan.New(new Vector2(x, y), 128, angle, force);
            return i;
        }
    }
}
