using Gizmo.Engine.Builtin;
using Gizmo.Engine;
using Gizmo.Engine.Data;
using System.Numerics;
using Gizmo.StreamOverlay.Elements.Entities;

namespace Gizmo.StreamOverlay.Elements.Gizmos
{
    public class AntiFan: Squareish
    {
        public override string Sprite => "window/fan";
        public override IHitbox? Hitbox => new RectangleHitbox(new(2, 256), 0);
        public override string[] InteractsWith => [nameof(Shimeji), nameof(Mouse)];
        public override bool Immortal => false;
        public static Instance New(Vector2 pos, float size, float angle, float force = 100)
        {
            var ret = New(nameof(AntiFan), pos - MathP.Rotate(new(0, 128), angle), Vector2.One);
            ret.Hitbox = Resource.Elements[nameof(AntiFan)].Hitbox;
            ret.Scale = new(size / 2, 1);
            ret.Angle = angle + 90;
            ret.Set("pinned", true);
            ret.Set("force", force);
            ret.Playback = -force / 2000f;
            return ret;
        }
        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (other == null) return;
            var maxy = ((RectangleHitbox)self.Hitbox).Size.Y;
            var pos = (self.GetRelativePosition(other.Position).Y - (maxy / 2)) / maxy;
            float force = self.Get<float>("force");
            other.Speed += MathP.Rotate(new(0, MathP.Max(0, -pos * force)), self.Angle) * Game.deltaTime;
        }
        public override void OnClick(ref Instance self, Vector2 position) { base.OnClick(ref self, position); }
        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("antifan", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Scale.X, self.Get<float>("force"));
        }
    }
}
