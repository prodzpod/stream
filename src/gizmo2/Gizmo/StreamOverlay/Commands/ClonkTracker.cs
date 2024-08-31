using Gizmo.Engine;
using Gizmo.StreamOverlay.Elements.Windows;
using ProdModel.Puppet;

namespace Gizmo.StreamOverlay.Commands
{
    public class ClonkTracker : Command
    {
        public override object?[]? Execute(params object?[] args)
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
