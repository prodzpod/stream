using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Screens
{
    public class StartingSoon : Element
    {
        public override string Sprite => "layout/cafe_bg";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            StreamOverlay.Prod.Alpha = 0;
            self.Depth = -1;
            for (int i = 0; i < 17; i++)
            {
                var stars = Graphic.New(self, "layout/stars");
                stars.Position = new(-700, 540);
                stars.Angle = RandomP.Random(0, 360f);
                stars.Rotation = MathP.Sqr(RandomP.Random(0, 1f)) * .5f;
                var scale = RandomP.Random(2f, 4f);
                stars.Scale = new(scale, scale);                stars.Blend = ColorP.FromHSV(RandomP.Random(0, 360), RandomP.Random(0, 1), 1);
                stars.Alpha = MathP.Sqr(RandomP.Random(0, 1f));
                stars.Set("amp", RandomP.Random(0, 32f));
                stars.Set("freq", RandomP.Random(4f, 15f));
                stars.onUpdate += deltaTime =>
                {
                    stars.Position.Y = MathP.Sin(stars.Life * 360 / stars.Get<float>("freq")) * stars.Get<float>("amp");
                    return true;
                };
            }
            self.Set("fg", Graphic.New(self, "layout/cafe_fg"));
        }        public override void OnDestroy(ref Instance self)
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
