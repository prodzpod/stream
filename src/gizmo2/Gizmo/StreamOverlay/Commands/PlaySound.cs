using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class PlaySound : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? path = WASD.Assert<string>(args[0]);
            if (path != null && Resource.Audios.ContainsKey(path)) Audio.Play(path);
            return ["done!"];
        }
    }
}
