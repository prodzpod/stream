using Gizmo.Engine;
using ProdModel.Object;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class ResetWindows : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            Logger.Info("Resetting WindowTracker");
            WindowTracker.Lifetime = 0;
            WindowTracker.LastSyncTime = 0;
            WindowTracker.LastSync = [];
            return null;
        }
    }
}
