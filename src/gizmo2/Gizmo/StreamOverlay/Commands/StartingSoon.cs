using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands
{
    public class StartingSoon : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Instance.New(nameof(Elements.StartingSoon), new(960, 540));
            return null;
        }
    }
}
