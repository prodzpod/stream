using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Windows
{
    public class Window : Command
    {
        public const float OFFSET = 16;
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            string? title = WASD.Assert<string>(args[4]);
            string? _content = WASD.Assert<string>(args[5]);
            float? type = WASD.Assert<float>(args[6]);
            if (x == null || y == null || title == null || _content == null || type == null) return null;
            SpawnWindow(x.Value, y.Value, title, _content, type == null ? 0 : type.Value);
            return null;
        }

        public static Instance SpawnWindow(float x, float y, string title, string _content, float type = 0)
        {
            Text content = Text.Compile(_content, "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.One, StreamOverlay.DefaultTextColor);
            Instance i;
            if (type == 1) i = Elements.Windows.OKWindow.New(new(x, y), title, _content);
            else if (type == 2) i = Elements.Windows.YesNoWindow.New(new(x, y), title, _content, () => { });
            else i = Elements.Windows.Window.New(new(x, y), title, content.Size, content);
            i.Set("content", _content);
            var size = i.Get<Vector2>("size");
            NineSlice? ns = Resource.NineSlices["window_" + StreamOverlay.Theme + "/window"];
            var children = i.Get<Instance[]>("children");
            children[1].Position = new(-size.X / 2 + ns.innerLeft + OFFSET, -size.Y / 2 + ns.innerTop + OFFSET * 1.5f);
            // if (Elements.Windows.DrawWindow.IsTetris) i.Alpha = 0.1f;
            return i;
        }
    }
}
