using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class DrawWindow : Window
    {
        public static Line? lineInProgress = null;
        public static bool IsTetris = false;
        public static Instance New(Vector2 pos, Vector2 size)
        {
            var i = New(nameof(DrawWindow), pos, "WorsePaint v1.0", size);
            i.Set("pinned", true);
            i.Set("lines", new List<Line>());
            return i;
        }

        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (!self.Get<bool>("pinned")) return;
            if (other != null && other.Element is Mouse && InputP.KeyPressed(0xA2)) // TODO: clientside drawing
            {
                var pos = self.GetRelativePosition(InputP.MousePosition);
                if (lineInProgress == null)
                {
                    lineInProgress = new Line() { a = pos, b = pos, color = ColorP.BLACK };
                    self.Get<List<Line>>("lines").Add(lineInProgress);
                }
                else
                {
                    lineInProgress.b = pos;
                    lineInProgress = null;
                }
            }
        }

        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (lineInProgress != null && self.Get<List<Line>>("lines").Contains(lineInProgress))
            {
                var _l = lineInProgress;
                _l.b = self.GetRelativePosition(InputP.MousePosition);
                lineInProgress = _l;
            }
            self.Alpha = IsTetris ? .1f : 1f;
        }

        public override string Serialize(ref Instance self)
        {
            var a = self.Get<List<Line>>("lines").Select(x => $"{x.a.X}/{x.a.Y}/{x.b.X}/{x.b.Y}/{x.color}").Join(" ");
            return WASD.Pack("window", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("title"), a, "Draw", (int)self.Get<Vector2>("size").X, (int)self.Get<Vector2>("size").Y);
        }

        public override void OnDraw(ref Instance self, float deltaTime)
        {
            base.OnDraw(ref self, deltaTime);
            foreach (var line in self.Get<List<Line>>("lines"))
            {
                var h2 = (LineHitbox)(new LineHitbox(line.a, line.b).Transform(self.Position, self.Scale, self.Angle));
                Engine.Graphic.Sprite.TryCameraWarp((h2.Offset + h2.Target) / 2, h2.Target - h2.Offset, out var meta2);
                GraphicsP.DrawThickLine(meta2.XY() - (meta2.ZW() / 2), meta2.XY() + (meta2.ZW() / 2), line.color, 4);
            }
        }
    }

    public class Line
    {
        public Vector2 a;
        public Vector2 b;
        public ColorP color;
    }
}
