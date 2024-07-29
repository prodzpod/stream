using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Elements
{
    public class StartingSoon: Element
    {
        public override string Sprite => "layout/startingsoon";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = -1;
        }
        public override void OnCollide(ref Instance self, Instance other)
        {
            if (other.Element is Mouse && Mouse.Middle)
            {
                StreamWebSocket.Send("unbrb");
                self.Destroy();
            }
        }
    }
}
