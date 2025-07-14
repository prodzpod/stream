using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Gizmos
{
    public class Pointer : Element
    {
        public override float Bounciness(Instance i) => 0;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 99;
            self.Playback = 0;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (!self.Get<bool>("expired"))
            {
                self.Position = MathP.SLerp(self.Position, self.Get<Vector2>("target"), .01f, deltaTime);
                if (self.Life > 2)
                {
                    self.Speed = new(RandomP.Random(-1000, 1000), RandomP.Random(0, -2000));
                    self.Rotation = RandomP.Random(-3600, 3600);
                    self.Gravity = Vector2.UnitY * 3000;
                    self.Set("expired", true);
                }
            }
            else
            {
                self.Rotation -= 360 * deltaTime * Math.Sign(self.Rotation);
                if (self.Position.Y >= Game.Resolution.Y) self.Destroy();
            }
        }
        public static Instance New(Vector2 pos, string icon, int frame, string author, ColorP color)
        {
            var i = Instance.New(nameof(Pointer));
            i.Sprite = Resource.Sprites[icon];
            i.Frame = frame;
            i.Position = pos + new Vector2(RandomP.Random(-256, 256), RandomP.Random(-256, 256));
            i.Set("target", pos);
            if (!icon.StartsWith("pointer/+")) i.Blend = color;
            else
            {
                var i2 = Graphic.New(i, Resource.Sprites[icon + "_inner"]);
                i2.Frame = frame;
                i2.Position = pos;
                i2.Blend = color;
            }
            if (!string.IsNullOrWhiteSpace(author)) Graphic.New(i, Text.Compile(author, "arcaoblique", 26, -Vector2.One, color));
            return i;
        }
    }   
}
