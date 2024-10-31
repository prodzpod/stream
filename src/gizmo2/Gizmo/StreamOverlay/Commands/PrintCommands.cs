using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class PrintCommands : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Logger.Log(StreamWebSocket.Commands.Select(x => x.Key).Join(", "));
            return null;
        }
    }
}
