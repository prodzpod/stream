using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Rooms;
using Raylib_CSharp.Audio;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Flip : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            MainRoom.Chat.Position.X = MainRoom.Chat.Position.X == 208 ? 1920 - 208 : 208;
            foreach (var el in Game.INSTANCES)
            {
                if (el.Element is Elements.Gizmos.Chat && el.Get<bool>("racked"))
                    el.Position.X = Chat.Bounds.X + MainRoom.Chat.Position.X + (Chat.Bounds.Z / 2);
                if (el.Element is Prod && Prod.OnTopOfChat) el.Position.X = (Chat.Bounds.X + MainRoom.Chat.Position.X) + Chat.Bounds.Z / 2;
            }
            return null;
        }
    }
}
