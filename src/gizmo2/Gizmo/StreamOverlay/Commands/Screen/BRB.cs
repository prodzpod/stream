using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands.Screen
{
    public class BRB : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            Instance.New(nameof(Elements.Screens.BRB), new(960, 540));
            return null;
        }
    }
}
