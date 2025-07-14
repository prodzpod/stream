namespace Gizmo.StreamOverlay.Commands.System
{
    public class Ping : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return ["pong"];
        }
    }
}
