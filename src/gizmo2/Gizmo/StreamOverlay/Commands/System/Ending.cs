using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class Ending : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            Audio.Play("screen/tv");
            return null;
        }
    }
}
