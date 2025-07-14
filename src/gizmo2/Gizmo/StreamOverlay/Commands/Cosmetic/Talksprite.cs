using Gizmo.StreamOverlay.Elements.Entities;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class Talksprite : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float enable = WASD.Assert<float>(args[0]);
            StreamOverlay.Prod.Gravity = Vector2.Zero;
            Prod.Is2D = false;
            Prod.Talksprite = enable != 0;
            StreamOverlay.Prod.Scale = Vector2.One * (enable != 0 ? 3 : 1);
            StreamOverlay.Prod.Playback = enable != 0 ? 1f / 6 : 0;
            return null;
        }
    }
}
