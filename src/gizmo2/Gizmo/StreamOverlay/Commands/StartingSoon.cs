using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Rooms;

namespace Gizmo.StreamOverlay.Commands
{
    public class StartingSoon : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Instance.New(nameof(Elements.Screens.StartingSoon), new(960, 540));
            return null;
        }
    }
}
