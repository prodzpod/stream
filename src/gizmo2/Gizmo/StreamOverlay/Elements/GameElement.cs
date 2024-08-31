using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Raylib_CSharp.Rendering;
using System.Diagnostics.Metrics;
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
            if (self.Get<bool>("pinned")) { self.Speed = Vector2.Zero; self.Rotation = 0; }
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
                if (InputP.KeyPressed(0x6D)) self.Set("pinned", false);
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
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            base.OnDraw(ref self, deltaTime);
            if (InputP.KeyHeld(0x62))
            {
                var RED = new ColorP(255, 0, 0, 255);
                if (self.Hitbox == null) return;
                if (self.Hitbox is PointHitbox _h1) 
                {
                    var h1 = (PointHitbox)_h1.Transform(self.Position, self.Scale, self.Angle);
                    if (!Engine.Graphic.Sprite.TryCameraWarp(h1.Offset, Vector2.One * 4, out var meta1)) return;
                    Graphics.DrawCircleV(meta1.XY(), MathP.Abs(meta1.Z), RED);
                }
                else if (self.Hitbox is LineHitbox _h2) 
                {
                    var h2 = (LineHitbox)_h2.Transform(self.Position, self.Scale, self.Angle);
                    if (!Engine.Graphic.Sprite.TryCameraWarp((h2.Offset + h2.Target) / 2, h2.Target - h2.Offset, out var meta2)) return;
                    Graphics.DrawLineV(meta2.XY() - (meta2.ZW() / 2), meta2.XY() + (meta2.ZW() / 2), RED);
                }
                else if (self.Hitbox is CircleHitbox _h3)
                {
                    var h3 = (CircleHitbox)_h3.Transform(self.Position, self.Scale, self.Angle);
                    if (!Engine.Graphic.Sprite.TryCameraWarp(h3.Offset, Vector2.One * h3.Radius, out var meta3)) return;
                    Graphics.DrawCircleV(meta3.XY(), MathP.Abs(meta3.Z), RED * .5f);
                }
                else if (self.Hitbox is AABBHitbox _h4)
                {
                    var h4 = (AABBHitbox)_h4.Transform(self.Position, self.Scale, self.Angle);
                    if (!Engine.Graphic.Sprite.TryCameraWarp(h4.Offset, h4.Size, out var meta4)) return;
                    Graphics.DrawRectangleV(meta4.XY(), MathP.Abs(meta4.ZW()), RED * .5f);
                }
                else if (self.Hitbox is RectangleHitbox _h5)
                {
                    var h5 = (RectangleHitbox)_h5.Transform(self.Position, self.Scale, self.Angle);
                    if (!Engine.Graphic.Sprite.TryCameraWarp(h5.Offset, h5.Size, h5.Angle, out var meta5)) return;
                    Graphics.DrawRectanglePro(new(meta5.X, meta5.Y, meta5.Z, meta5.W), meta5.ZW() / 2, h5.Angle, RED * .5f);
                }
                else if (self.Hitbox is PolygonHitbox _h6)
                {
                    var h6 = (PolygonHitbox)_h6.Transform(self.Position, self.Scale, self.Angle);
                    if (h6.Points.Length < 2) return;
                    var lines = h6.Lines;
                    foreach (var line in lines)
                    {
                        if (!Engine.Graphic.Sprite.TryCameraWarp((line.Offset + line.Target) / 2, line.Target - line.Offset, out var meta)) continue;
                        Graphics.DrawLineV(meta.XY() - (meta.ZW() / 2), meta.XY() + (meta.ZW() / 2), RED);
                    }
                }
            }
        }
        public virtual string Serialize(ref Instance self) => "";
    }
}
