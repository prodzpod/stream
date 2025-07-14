using Gizmo.Engine;
using Gizmo.StreamOverlay.Commands.Windows;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Rooms;

namespace Gizmo.StreamOverlay.Commands.Misc
{
    public class Flip : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            MainRoom.Chat.Position.X = MainRoom.Chat.Position.X == 208 ? 1920 - 208 : 208;
            foreach (var el in Game.INSTANCES)
            {
                if (el.Element is Chat && el.Get<bool>("racked"))
                    el.Position.X = Chat.Bounds.X + MainRoom.Chat.Position.X + Chat.Bounds.Z / 2;
                if (el.Element is Prod && Prod.OnTopOfChat) el.Position.X = Chat.Bounds.X + MainRoom.Chat.Position.X + Chat.Bounds.Z / 2;
            }
            return null;
        }
    }
}
