using Gizmo.Engine;
using ProdModel.Puppet;

namespace Gizmo.StreamOverlay.Commands
{
    public class Tracker : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (args.Length == 0) return null;
            string? test = WASD.Assert<string>(args[0]);
            if (test == null) { Logger.Warn("tracker is null"); return null; }
            // tracker here
            ModelHandler.HandleTracker(test);
            return null;
        }
    }
}
