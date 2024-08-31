using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Fetch : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            return ["windowcount", TaskManager.NumWindows];
        }
    }
}
