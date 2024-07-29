using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements
{
    public class BRB: Element
    {
        public override string Sprite => "layout/brbbg";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            self.Depth = -1;
            self.Set("fg", Graphic.New(self, "layout/brb"));
            self.Set("rb", Squareish.New(nameof(RaidBoss), new Vector2(960+350, 540), Resource.Sprites["other/raidboss"].Size));
        }
        public override void OnCollide(ref Instance self, Instance other)
        {
            if (other.Element is Mouse && Mouse.Middle)
            {
                StreamWebSocket.Send("unbrb");
                self.Destroy();
            }
        }
        public override void OnDestroy(ref Instance self)
        {
            self.Get<Instance>("fg").Destroy();
            self.Get<Instance>("rb").Destroy();
            base.OnDestroy(ref self);
        }
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            ((Sprite)self.Sprite).Draw((int)self.Frame, self.Position + new Vector2(self.Life * 32 % 64, self.Life * 32 % 64), self.Scale, self.Angle, self.Blend * self.Alpha);
        }
    }
    public class RaidBoss: Squareish
    {
        public override bool Immortal => true;
        public override string Sprite => "other/raidboss";
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 2;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (self.Life % 7 < 3) self.Frame = 0;
            else self.Frame = (self.Life - 3) * 2;
            if (self.Life % 14 > 7) self.Frame = 8 - self.Frame;
            if (RandomP.Chance(4f * deltaTime))
            {
                var size = ((Sprite)self.Sprite).Size;
                var rpos = new Vector2(RandomP.Random(-size.X / 2, size.X / 2), RandomP.Random(-size.Y / 2, size.Y / 2));
                Pointer.New(MathP.Rotate(rpos, self.Angle) * self.Scale + self.Position, "pointer/cursor", 1, "", new ColorP(RandomP.Random(0f, 1), RandomP.Random(0f, 1), RandomP.Random(0f, 1)));
            }
        }

    }
}
