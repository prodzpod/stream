using Gizmo.Engine;
using ProdModel.Puppet;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class Tracker : Command
    {
        public static string LastTrackerString = "";
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (args.Length == 0) return null;
            string? test = WASD.Assert<string>(args[0]);
            if (test == null) { Logger.Warn("tracker is null"); return null; }
            // tracker here
            LastTrackerString = test;
            ModelHandler.HandleTracker(test);
            return null;
        }
    }
}
