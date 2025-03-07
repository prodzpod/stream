using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Entities
{
    public class Prod : GameElement
    {
        public override bool Immortal => true;
        public override string Sprite => "other/prod";
        public override IHitbox? Hitbox => new CircleHitbox(200);
        public override string[] InteractsWith => [nameof(Mouse), nameof(Window), nameof(Chat)];
        public override float Mass(Instance i) => 0;
        public override float Drag(Instance i) => .9f;

        public static Sprite Prod3D;
        public static bool Is2D = false;
        public static bool OnTopOfChat = true;
        private static string _Pose = "IDLE";
        public static string Pose
        {
            get => _Pose;
            set
            {
                _Pose = value;
                Logger.Log("Setting pose to " + _Pose);
            }
        }
        public override void OnInit(ref Instance self)
        {
            self.Frame = 4;
            self.Playback = 0;
            self.Depth = -1;
            base.OnInit(ref self);
            self.Position.X = (Commands.Chat.Bounds.X + MainRoom.Chat.Position.X) + Commands.Chat.Bounds.Z / 2;
            Prod3D = new()
            {
                Image = Texture2D.LoadFromImage(ModelSprite.image),
                Size = new(ModelSprite.Width, ModelSprite.Height),
                Subimages = Vector2.One
            };
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (!OnTopOfChat && !Is2D) { self.Angle = 0; self.Gravity = Vector2.Zero; }
            if (OnTopOfChat) self.Position.Y = MathP.SExp(self.Position.Y - (Commands.Chat.Bounds.Y + MainRoom.Chat.Position.Y) * .75f, .01f, deltaTime) + (Commands.Chat.Bounds.Y + MainRoom.Chat.Position.Y) * .75f;
            if (OnTopOfChat && Is2D) self.Frame = 4;
            if (OnTopOfChat) ModelHandler.Pose = Pose;
            else
            {
                if (Pose == "HI") ModelHandler.Pose = "SIT_HI";
                else if (Pose == "POINT") ModelHandler.Pose = "SIT_POINT";
                else if (Pose == "BLUSH") ModelHandler.Pose = "SIT_BLUSH";
                else ModelHandler.Pose = "SIT";
            }
        }
        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            OnTopOfChat = false;
            self.Speed = Vector2.Zero;
            self.Set("hit", 0f);
        }
        public override void OnRelease(ref Instance self, Vector2 position)
        {
            base.OnRelease(ref self, position);
            if (self == null) return;
            if (!MainRoom.COLLAB_MODE && (
                MainRoom.Chat.Position.X > (1920 / 2) ?
                position.X > (Commands.Chat.Bounds.X + MainRoom.Chat.Position.X) - Commands.Chat.Bounds.Z :
                position.X < (Commands.Chat.Bounds.X + MainRoom.Chat.Position.X) + Commands.Chat.Bounds.Z
                ))
            {
                Is2D = false;
                OnTopOfChat = true;
                self.Speed = Vector2.Zero;
                self.Angle = 0;
                self.Rotation = 0;
                self.Position.X = (Commands.Chat.Bounds.X + MainRoom.Chat.Position.X) + Commands.Chat.Bounds.Z / 2;
                self.Gravity = Vector2.Zero;
            }
            if (Is2D && !OnTopOfChat) self.Gravity = Vector2.UnitY * 2000;
        }
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (self.Alpha == 0) return;
            if (Is2D)
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
