using Gizmo.Engine;
using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class PlaySound : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? path = WASD.Assert<string>(args[0]);
            if (path != null && Resource.Audios.ContainsKey(path)) Audio.Play(path);
            return ["done!"];
        }
    }
}
