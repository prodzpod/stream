using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements
{
    public class GameElement: Element
    {
        public virtual bool Immortal => false;
        public override string[] InteractsWith => [nameof(Mouse)];
        public virtual float ZFightingChance => .1f;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Set("zfightingchance", ZFightingChance);
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (self.Speed.X < 0 && self.Position.X < (Game.Room.Camera.X - Game.Room.Camera.Z / 2)) Bounce(ref self, 0);
            if (self.Speed.Y > 0 && self.Position.Y > (Game.Room.Camera.Y + Game.Room.Camera.W / 2 - 56)) Bounce(ref self, 90);
            if (self.Speed.X > 0 && self.Position.X > (Game.Room.Camera.X + Game.Room.Camera.Z / 2)) Bounce(ref self, 180);
            if (self.Speed.Y < 0 && self.Position.Y < (Game.Room.Camera.Y - Game.Room.Camera.W / 2)) Bounce(ref self, 270);
            self.Position = MathP.Clamp(self.Position, Vector2.Zero, Game.Resolution);
            if (RandomP.Chance(self.Get<float>("zfightingchance")))
            {
                self.Depth = self.Depth;
                foreach (var i in Game.INSTANCES) 
                    if (i.Element is Graphic && i.Get<Instance>("parent") == self) 
                        i.Depth = i.Depth;
            }
        }
        public static void Bounce(ref Instance self, float v)
        {
            Vector2 component = new(Vector2.Dot(self.Speed, MathP.Theta(v - 90)), Vector2.Dot(self.Speed, MathP.Theta(v)));
            // Logger.Log("pre:", self.Speed, component);
            component.X *= self.Friction;
            component.Y *= -self.Bounciness;
            self.Speed = MathP.Theta(v) * component.Y + MathP.Theta(v - 90) * component.X;
            // Logger.Log("post:", self.Speed, component);
            self.Rotation *= self.Friction;
            self.OnCollide(null);
        }

        public override void OnCollide(ref Instance self, Instance other)
        {
            if (other != null && other.Element is Mouse)
            {
                if (Mouse.Left && StreamOverlay.ClickedInstance == null) OnClick(ref self, other.Position);
                if (Mouse.Right) self.Rotation = MathP.Lerp(self.Rotation, -self.Angle * 5, .5f);
                if (Mouse.Middle && !Immortal) self.Destroy();
            }
            else base.OnCollide(ref self, other);
        }
        public virtual void OnClick(ref Instance self, Vector2 position)
        {
            // Logger.Log("OnClick called");
            StreamOverlay.ClickedInstance = self;
            StreamOverlay.ClickedPosition = self.GetRelativePosition(position);
            Audio.Play("screen/click_me");
        }
        public virtual void OnRelease(ref Instance self, Vector2 position)
        {
            // Logger.Log("OnRelease called");
        }
        public virtual void ApplyForce(ref Instance self, Vector2 origin, Vector2 target) 
        {
            float STRENGTH = 10;
            var dist = target - (self.Position + origin);
            self.Speed = MathP.Lerp(self.Speed, dist * STRENGTH, .5f);
            var angle = MathP.Atan2(dist);
            self.Rotation = MathP.Lerp(self.Rotation, MathP.AngleBetween(self.Angle, angle) * STRENGTH, .5f);
        }
    }
}
