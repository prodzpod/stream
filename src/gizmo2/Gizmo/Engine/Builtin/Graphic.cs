using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;

namespace Gizmo.Engine.Builtin
{
    public class Graphic : Element
    {
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (!self.Var.ContainsKey("parent")) { base.OnDraw(ref self, deltaTime); return; }
            Instance other = self.Get<Instance>("parent");
            if (other == default) return;
            if (other.Destroyed) { self.Destroy(); return; }
            var _pos = self.Position;
            var _ang = self.Angle;
            var _scl = self.Scale;
            var _alp = self.Alpha;
            self.Position = MathP.Rotate(self.Position, other.Angle) * other.Scale + other.Position;
            self.Angle += other.Angle;
            self.Scale *= other.Scale;
            self.Alpha *= other.Alpha;
            base.OnDraw(ref self, deltaTime);
            self.Position = _pos;
            self.Angle = _ang;
            self.Scale = _scl;
            self.Alpha = _alp;
        }
        public static Instance New(Instance? other, string name) => New(other, Resource.Sprites[name]);
        public static Instance New(Instance? other, IDrawable sprite)
        {
            var ret = Instance.New(nameof(Graphic));
            ret.Sprite = sprite;
            if (other != null) {
                ret.Set("parent", other);
                ret.Depth = other.Depth;
            }
            return ret;
        }
    }
}
