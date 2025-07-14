using System.Numerics;

namespace Gizmo.Engine.Data
{
    public class Room
    {
        public Vector4 Camera;
        public virtual Instance[] InitialInstances => [];
        public virtual void OnEnter(Room? room)
        {
            foreach (var i in InitialInstances) Instance.New(i);
            Camera = new(Game.Resolution.X / 2, Game.Resolution.Y / 2, Game.Resolution.X, Game.Resolution.Y);
        }
        public virtual void OnLeave(Room? room)
        {
            foreach (var i in Game.INSTANCES.Where(x => x.Element is not Persistent)) i.Destroy();
        }

        public static void SetRoom(Room? room)
        {
            if (room == null) { Logger.Warn("Attempted to switch to NULL room!"); return; }
            Logger.Debug("Switching Room to", room.GetType().Name);
            Game.Room?.OnLeave(room);
            room.OnEnter(room);
        }
    }
}
