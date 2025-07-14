using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class RaidWindow : Window
    {
        public override float Drag(Instance i) => .9f;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 3000;
        public static Instance New(Vector2 pos, string _title, Sprite pfp, int viewers, string title = "<wave>welcome raid ers!")
        {
            var ret = New(nameof(RaidWindow), pos, "<wave>" + _title, pfp.Size, true, pfp);
            Audio.Play("screen/join");
            ret.Speed = new(RandomP.Random(-12000, 12000), RandomP.Random(-12000, 12000));
            ret.Rotation = RandomP.Random(-7200, 7200);
            ret.Set("viewers", RandomP.Random(4, 10) + viewers);
            ret.Set("viewer", 0);
            ret.Set("title2", title);
            return ret;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            int viewers = self.Get<int>("viewers");
            int viewer = self.Get<int>("viewer");
            if (viewer < viewers && self.Life > viewer * (0.1f + 0.8f / (1 + viewers)))
            {
                var joel = New(nameof(Window), self.Position, self.Get<string>("title2")!, Resource.Sprites["other/joel"].Size, true, Resource.Sprites["other/joel"]);
                Audio.Play("screen/join", RandomP.Random(.8f, 1.2f), MathP.Clamp((35 - viewers) / 30, .2f, 1f));
                joel.Angle = self.Angle;
                joel.Set("title", self.Get<string>("title2")!);
                joel.Set("content", "Joel");
                viewer++;
                self.Set("viewer", viewer);
            }
        }
        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            int viewers = self.Get<int>("viewers");
            int viewer = self.Get<int>("viewer");
            if (viewer < viewers)
            {
                self.Speed = new(RandomP.Random(-12000, 12000), RandomP.Random(-12000, 12000));
                self.Rotation = RandomP.Random(-7200, 7200);
            }
        }
    }
}
