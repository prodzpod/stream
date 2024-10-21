using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Gizmos
{
    public class Squareish : GameElement
    {
        public override string[] InteractsWith => [nameof(Mouse)];
        public override float Mass(Instance i) => i.Get<Vector2>("size").Product();
        public static Instance New(string type, Vector2 pos, Vector2 size, params IDrawable[] sprites)
        {
            var ret = Instance.New(type, pos);
            List<Instance> children = [];
            ret.Set("size", size);
            ret.Hitbox = new RectangleHitbox(size, 0);
            foreach (var sprite in sprites)
            {
                var graphic = Graphic.New(ret, sprite);
                graphic.Depth = ret.Depth;
                children.Add(graphic);
            }
            ret.Set("children", children.ToArray());
            return ret;
        }

        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            if (self.Var.ContainsKey("originalGravity"))
            {
                self.Speed = Vector2.Zero;
                self.Gravity = self.Get<Vector2>("originalGravity");
                self.Var.Remove("originalGravity");
            }
        }
    }
}
