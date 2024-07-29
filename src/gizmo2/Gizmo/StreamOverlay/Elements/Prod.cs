using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using ProdModel.Object.Sprite;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements
{
    public class Prod: GameElement
    {
        public override bool Immortal => true;
        public override string Sprite => "other/prod";
        public override IHitbox? Hitbox => new CircleHitbox(200);
        public override string[] InteractsWith => [nameof(Mouse), nameof(Window), nameof(Chat)];
        public override float Mass(Instance i) => 0;
        public override float Drag(Instance i) => .9f;
        public override void OnInit(ref Instance self)
        {
            self.Frame = 4;
            self.Playback = 0;
            self.Depth = -1;
            base.OnInit(ref self);
            self.Position.X = Commands.Chat.Bounds.X + Commands.Chat.Bounds.Z / 2;
            Prod3D = new()
            {
                Image = Texture2D.LoadFromImage(ModelSprite.image),
                Size = new(200, 200),
                Subimages = Vector2.One
            };
        }
        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            self.Set("fallen", true);
            Force2D = false;
            self.Speed = Vector2.Zero;
            self.Frame = 4;
            self.Set("hit", 0f);
        }
        public override void OnRelease(ref Instance self, Vector2 position)
        {
            base.OnRelease(ref self, position);
            if (self == null) return;
            if (position.X < (Commands.Chat.Bounds.X + Commands.Chat.Bounds.Z))
            {
                self.Speed = Vector2.Zero;
                self.Angle = 0;
                self.Rotation = 0;
                self.Position.X = Commands.Chat.Bounds.X + Commands.Chat.Bounds.Z / 2;
                self.Set("fallen", false);
                self.Gravity = Vector2.Zero;
            }
            else self.Gravity = Vector2.UnitY * 2000;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (!self.Get<bool>("fallen")) self.Position.Y = MathP.SExp(self.Position.Y - Commands.Chat.Bounds.Y * .75f, .01f, deltaTime) + Commands.Chat.Bounds.Y * .75f;
        }
        public static Sprite Prod3D;
        public static bool Force2D = false;
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (Force2D || self.Get<bool>("fallen"))
            {
                float hit = self.Get<float>("hit");
                if (hit == 0)
                {
                    if (MathP.Abs(self.Speed.Y) < MetaP.TargetFPS || MathP.Abs(self.Speed.X) < MetaP.TargetFPS)
                        self.Frame = 4;
                    else self.Frame = self.Life * 10 % 2;
                }
                else if (self.Life - self.Get<float>("hit") < .1f)
                {
                    if (MathP.Abs(self.Speed.Y) < MetaP.TargetFPS)
                    {
                        if (MathP.Abs(self.Speed.X) < MetaP.TargetFPS) self.Frame = 4;
                        else self.Frame = 3;
                    }
                    else self.Frame = 2;
                }
                else self.Frame = 3;
                base.OnDraw(ref self, deltaTime);
            }
            else
            {
                if (ModelSprite.Ready)
                {
                    Prod3D.Image = Texture2D.LoadFromImage(ModelSprite.image);
                    ModelSprite.Busy = false;
                    ModelSprite.Ready = false;
                }
                self.Scale *= ModelSprite.Pixels;
                Prod3D.Draw(self);
                self.Scale /= ModelSprite.Pixels;
            }
        }
        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (other == null) self.Set("hit", self.Life);
        }
        public override void ApplyForce(ref Instance self, Vector2 origin, Vector2 target)
        {
            base.ApplyForce(ref self, origin, target);
            self.Set("hit", 0f);
        }
    }
}
