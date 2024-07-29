using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands
{
    public class BRB : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Instance.New(nameof(Elements.BRB), new(960, 540));
            return null;
        }
    }
}
