using Gizmo.Engine;

namespace Gizmo.StreamOverlay.Commands
{
    public class Room : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? room = WASD.Assert<string>(args[0]);
            if (room == null) return null;
            Game.Room = Resource.Rooms[room];
            return null;
        }
    }
}
