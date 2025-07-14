using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Entities
{
    public class Gift : Squareish
    {
        public override float Bounciness(Instance i) => 0.9f;
        public override float Drag(Instance i) => 1;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 3000;
        public override float Friction(Instance i) => 0.9f;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 10;
        }
        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("gift", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("sprite"), self.Get<float>("worth"));
        }
    }
}
