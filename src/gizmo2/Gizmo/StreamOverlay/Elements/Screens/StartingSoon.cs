using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Rooms;

namespace Gizmo.StreamOverlay.Elements.Screens
{
    public class StartingSoon : Element
    {
        public override string Sprite => "layout/startingsoon";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            StreamOverlay.Prod.Alpha = 0;
            self.Depth = -1;
        }
        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            StreamOverlay.Prod.Alpha = 1;
            StreamWebSocket.Send("unbrb");
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (InputP.KeyPressed(-3) || InputP.KeyPressed(0xA3) || InputP.KeyPressed(0x2E))
            {
                self.Destroy();
            }
        }
    }
}
