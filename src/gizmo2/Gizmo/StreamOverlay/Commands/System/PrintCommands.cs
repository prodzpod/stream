using Gizmo.Engine;
using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class PrintCommands : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            Logger.Log(StreamWebSocket.Commands.Select(x => x.Key).Join(", "));
            return null;
        }
    }
}
