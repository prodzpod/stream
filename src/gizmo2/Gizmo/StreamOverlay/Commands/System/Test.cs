namespace Gizmo.StreamOverlay.Commands.System
{
    public class Test : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return ["test", "test2"];
        }
    }
}
