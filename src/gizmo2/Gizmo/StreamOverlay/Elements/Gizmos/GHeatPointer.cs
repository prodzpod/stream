using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Gizmos
{
    public class GHeatPointer : Element
    {
        public static Dictionary<string, Instance> Pointers = [];
        public static Dictionary<string, Instance> Grabbed = [];
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
            if (self.Get<bool>("expired"))
            {
                self.Rotation -= 360 * deltaTime * Math.Sign(self.Rotation);
                if (self.Position.Y >= Game.Resolution.Y) self.Destroy();
            }
            else
            {
                self.Position = MathP.SLerp(self.Position, self.Get<Vector2>("target"), .001f, deltaTime);
                if (Grabbed.TryGetValue(self.Get<string>("author"), out var instance))
                {
                    if (instance.Get<bool>("dragged")) instance.Set("dragged", false);
                    else
                    {
                        var origin = self.Get<Vector2>("origin");
                        (instance.Element as GameElement).ApplyForce(ref instance, origin, self.Position);
                    }
                }
                if (Pointers.ContainsKey(self.Get<string>("author")) && Pointers[self.Get<string>("author")] != self) Release(self);
            }
        }
        public static Instance New(Vector2 pos, string icon, int frame, string author, ColorP color, bool anonymous)
        {
            var i = Instance.New(nameof(GHeatPointer));
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
            if (!anonymous && !string.IsNullOrWhiteSpace(author)) Graphic.New(i, Text.Compile(author, "arcaoblique", 26, -Vector2.One, color));
            if (Pointers.ContainsKey("author")) Release(author);
            Pointers[author] = i;
            i.Set("author", author);
            return i;
        }
        public static void Drag(string author, Vector2 pos)
        {
            if (!Pointers.TryGetValue(author, out Instance? self)) return;
            if (Grabbed.TryGetValue(author, out Instance? instance))
            {
                if (instance == null || instance.Destroyed) Grabbed.Remove(author);
                else
                {
                    var origin = self.Get<Vector2>("origin");
                    (instance.Element as GameElement).ApplyForce(ref instance, origin, pos);
                }
            }
            self.Set("target", pos);
            self.Set("dragged", true);
        }
        public static void Release(string author)
        {
            if (!Pointers.TryGetValue(author, out Instance? self)) return;
            if (Grabbed.TryGetValue(author, out Instance? instance))
            {
                if (instance != null && !instance.Destroyed) 
                {
                    var previous = self.Get<Vector2>("target");
                    (instance.Element as GameElement).OnRelease(ref instance, previous);
                }
                Grabbed.Remove(author);
            }
            Release(self);
            Pointers.Remove(author);
        }
        public static void Release(Instance self)
        {
            self.Speed = new(RandomP.Random(-1000, 1000), RandomP.Random(0, -2000));
            self.Rotation = RandomP.Random(-3600, 3600);
            self.Gravity = Vector2.UnitY * 3000;
            self.Set("expired", true);
        }
    }
}
