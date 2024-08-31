using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Ping : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            return ["pong"];
        }
    }
}
