using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Rooms;

namespace Gizmo.StreamOverlay.Commands
{
    public class BRB : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Instance.New(nameof(Elements.Screens.BRB), new(960, 540));
            return null;
        }
    }
}
