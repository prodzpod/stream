using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Gizmos
{
    public class Chat : Squareish
    {
        public override string Sprite => "WHITE";
        public override float Drag(Instance i) => .9f;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 10;
        }
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            self.Blend = new("#d7d0c8");
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (self.Get<bool>("follow")) ((GameElement)self.Element).ApplyForce(ref self, Vector2.Zero, InputP.MousePosition);
        }
        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            self.Set("racked", false);
            self.Set("follow", false);
            self.Gravity = Vector2.UnitY * 3000;
        }

        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("chat", self.Get<string>("id"), (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string[]>("icon"), self.Get<string>("author"), self.Get<string>("color"), self.Get<string>("content").Replace("\n", "<br>"), self.Get<bool>("racked") ? 1 : 0);
        }
    }
}
