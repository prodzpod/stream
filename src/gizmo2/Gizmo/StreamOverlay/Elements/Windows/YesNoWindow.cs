using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class YesNoWindow : Window
    {
        public static Instance New(Vector2 pos, string title, string _content, Action onYes)
        {
            NineSlice? nsWindow = Resource.NineSlices["window/window"];
            NineSlice? nsButton = Resource.NineSlices["window/button"];
            Text content = Text.Compile(_content, "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.One, ColorP.BLACK);
            Text yesText = Text.Compile("Yes", "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.UnitY, ColorP.BLACK);
            Text noText = Text.Compile("No", "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.UnitY, ColorP.BLACK);
            float sizeX = MathP.Max(content.Size.X, yesText.Size.X + noText.Size.X + Commands.Window.OFFSET + 8);
            float sizeY = content.Size.Y + yesText.Size.Y + 4;
            var i = New(nameof(YesNoWindow), pos, title, new(sizeX, sizeY), content, nsButton, yesText, nsButton, noText);
            i.Set("content", _content);
            var children = i.Get<Instance[]>("children");
            var size = i.Get<Vector2>("size");
            children[1].Position = new(-size.X / 2 + nsWindow.innerLeft + Commands.Window.OFFSET, -size.Y / 2 + nsWindow.innerTop + Commands.Window.OFFSET * 1.5f);
            float buttonX = (yesText.Size.X - noText.Size.X - Commands.Window.OFFSET) / 2;
            float buttonY = -size.Y / 2 + nsWindow.innerTop + content.Size.Y + Commands.Window.OFFSET * 1.5f;
            children[2].Position = new(buttonX - yesText.Size.X - (nsButton.innerRight - nsButton.innerLeft) / 2, buttonY - (nsButton.innerBottom - nsButton.innerTop) / 2);
            children[3].Position = new(buttonX - yesText.Size.X + 13 / 2 - 1, buttonY + 13 / 2);
            children[2].Set("size", yesText.Size + new Vector2(nsButton.innerLeft + nsButton.innerRight, nsButton.innerTop + nsButton.innerBottom) + Vector2.One * 4);
            children[4].Position = new(noText.Size.X - buttonX + (nsButton.innerRight - nsButton.innerLeft) / 2, buttonY + (nsButton.innerBottom - nsButton.innerTop) / 2);
            children[5].Position = new(noText.Size.X - buttonX + 13 / 2, buttonY + 13 / 2);
            children[4].Set("size", noText.Size + new Vector2(nsButton.innerLeft + nsButton.innerRight, nsButton.innerTop + nsButton.innerBottom) + Vector2.One * 4);
            i.Set("onYes", onYes);
            return i;
        }

        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            var children = self.Get<Instance[]>("children");
            if (HitboxP.Check(new PointHitbox(self.GetRelativePosition(position)), new AABBHitbox(children[2].Position, children[2].Get<Vector2>("size"))))
            {
                self.Get<Action>("onYes")?.Invoke();
                self.Destroy();
            }
            else if (HitboxP.Check(new PointHitbox(self.GetRelativePosition(position)), new AABBHitbox(children[4].Position, children[4].Get<Vector2>("size")))) self.Destroy();
        }

        public override string Serialize(ref Instance self) => "";
    }
}
