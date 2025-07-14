using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Entities;
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
                graphic.Set("parent", ret);
                children.Add(graphic);
            }
            ret.Set("children", children.ToArray());
            ret.Set("kickedbytime", 0f);
            return ret;
        }

        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            var t = self.Get<float>("kickedbytime");
            if (t <= 0) return;
            t -= deltaTime;
            if (t <= 0) self.Var.Remove("kickedby");
            self.Set("kickedbytime", t);
        }

        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (other == null) return;
            if (other.Element is Shimeji && self.Var.ContainsKey("kickedby"))
            {
                Instance attacker = self.Get<Instance>("kickedby");
                if (attacker.Var.TryGetValue("victim", out object victim) && other == (Instance)victim)
                {
                    var damage = Shimeji.OnAttackNeverMiss(attacker, other);
                    attacker.Set("rangedamagedealt", attacker.Get<float>("rangedamagedealt") + damage);
                }
            }
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
