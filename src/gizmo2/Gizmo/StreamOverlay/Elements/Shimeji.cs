using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements
{
    public class Shimeji: GameElement
    {
        public override string[] InteractsWith => [nameof(Mouse), nameof(Window), nameof(Chat)];
        public override float Mass(Instance i) => 0;
        public override float Drag(Instance i) => .9f;
        public override float Friction(Instance i) => 1;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 3000;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 50;
            self.Playback = 0;
            self.Frame = 0;
        }
        public static float MaxSpeed = 500;
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (!self.Var.ContainsKey("target")) return;
            Vector2 target = self.Get<Vector2>("target");
            self.Speed.X = MathP.Clamp((target.X - self.Position.X) * 5 + MathP.SExp(self.Speed.X - (target.X - self.Position.X) * 5, .01f, deltaTime), -MaxSpeed, MaxSpeed);
            if (self.Speed.Y > MetaP.TargetFPS * 2) self.Frame = 3;
            else self.Frame = (self.Frame + deltaTime * self.Speed.X / 16) % 3;
            if (MathP.Abs(self.Speed.Y) < MetaP.TargetFPS) 
                self.Rotation = MathP.Lerp(self.Rotation, -self.Angle * 5, .5f);
        }
        public static float StepAssist = 4;
        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (other == null || other.Element is Mouse) return;
            if (self.Speed.Y > other.Speed.Y) for (int i = 1; i < StepAssist; i++)
                if (!HitboxP.Check(other, new PointHitbox(self.Position - new Vector2(0, i))))
                {
                    self.Position.Y -= i;
                    self.Speed.Y = -self.Speed.Y * self.Bounciness - i * MetaP.TargetFPS;
                    return;
                }
        }

        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (self.Speed.X < 0) self.Scale.X *= -1;
            base.OnDraw(ref self, deltaTime);
            if (self.Speed.X < 0) self.Scale.X *= -1;
        }

        public static Instance New(Sprite sprite, Vector2 pos, string author, ColorP color)
        {
            var i = Instance.New(nameof(Shimeji), pos);
            i.Sprite = sprite;
            i.Hitbox = new CircleHitbox(MathP.Min(sprite.Size.X, sprite.Size.Y) / 2);
            Text t = Text.Compile(author, "arcaoblique", 26, Vector2.Zero, color);
            var nametagBG = Graphic.New(i, Resource.NineSlices["WHITE"]);
            nametagBG.Set("size", t.Size + (Vector2.One * 4));
            var nametag = Graphic.New(i, t);
            nametagBG.Position.X -= 11;
            nametagBG.Position.Y -= sprite.Size.Y / 2 - 13;
            nametagBG.Blend = ColorP.BLACK * .75f;
            nametag.Position.Y -= sprite.Size.Y / 2 - 26;
            return i;
        }
    }
}
