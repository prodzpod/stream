namespace Gizmo.StreamOverlay.Commands
{
    public class Test : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            return ["test", "test2"];
        }
    }
}
