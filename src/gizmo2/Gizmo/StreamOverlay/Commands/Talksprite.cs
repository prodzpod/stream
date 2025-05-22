using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Talksprite : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float enable = WASD.Assert<float>(args[0]);
            StreamOverlay.Prod.Gravity = Vector2.Zero;
            Prod.Is2D = false;
            Prod.Talksprite = enable != 0;
            StreamOverlay.Prod.Scale = Vector2.One * (enable != 0 ? 3 : 1);
            StreamOverlay.Prod.Playback = enable != 0 ? 1f/6 : 0;
            return null;
        }
    }
}
