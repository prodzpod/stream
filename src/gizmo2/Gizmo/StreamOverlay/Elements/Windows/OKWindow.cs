using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class OKWindow : Window
    {
        public static Instance New(Vector2 pos, string title, string _content)
        {
            NineSlice? nsWindow = Resource.NineSlices["window_" + StreamOverlay.Theme + "/window"];
            NineSlice? nsButton = Resource.NineSlices["window_" + StreamOverlay.Theme + "/button"];
            Text content = Text.Compile(_content, "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.One, StreamOverlay.DefaultTextColor);
            Text yesText = Text.Compile("OK", "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.UnitY, StreamOverlay.DefaultTextColor);
            float sizeX = MathP.Max(content.Size.X, yesText.Size.X + 4);
            float sizeY = content.Size.Y + yesText.Size.Y + 4;
            var i = New(nameof(OKWindow), pos, title, new(sizeX, sizeY), content, nsButton, yesText);
            i.Set("content", _content);
            var children = i.Get<Instance[]>("children");
            var size = i.Get<Vector2>("size");
            children[1].Position = new(-size.X / 2 + nsWindow.innerLeft + Commands.Windows.Window.OFFSET, -size.Y / 2 + nsWindow.innerTop + Commands.Windows.Window.OFFSET * 1.5f);
            float buttonY = -size.Y / 2 + nsWindow.innerTop + content.Size.Y + Commands.Windows.Window.OFFSET * 1.5f;
            children[2].Position = new(0, buttonY - (nsButton.innerBottom - nsButton.innerTop) / 2);
            children[3].Position = new(13 / 2 - 1, buttonY + 13 / 2);
            children[2].Set("size", yesText.Size + new Vector2(nsButton.innerLeft + nsButton.innerRight, nsButton.innerTop + nsButton.innerBottom) + Vector2.One * 4);
            return i;
        }

        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            var children = self.Get<Instance[]>("children");
            if (HitboxP.Check(new PointHitbox(self.GetRelativePosition(position)), new AABBHitbox(children[2].Position, children[2].Get<Vector2>("size")))) self.Destroy();
        }

        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("window", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("title"), self.Get<string>("content").Replace("\n", "<br>"), "OK");
        }
    }
}
