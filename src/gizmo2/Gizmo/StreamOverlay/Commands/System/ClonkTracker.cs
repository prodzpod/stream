using Gizmo.Engine;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class ClonkTracker : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (args.Length == 0) return null;
            string? test = WASD.Assert<string>(args[0]);
            if (test == null) { Logger.Warn("tracker is null"); return null; }
            // tracker here
            ClonkWindow.Tracker(test);
            return null;
        }
    }
}
