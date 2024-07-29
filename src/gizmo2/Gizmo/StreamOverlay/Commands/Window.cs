using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Window : Command
    {
        public const float OFFSET = 16;
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            string? title = WASD.Assert<string>(args[4]);
            string? _content = WASD.Assert<string>(args[5]);
            if (x == null || y == null || title == null || _content == null) return null;
            Text content = Text.Compile(_content, "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.One, ColorP.BLACK);
            Instance i = Elements.Window.New(new((float)x, (float)y), title, content.Size, content);
            var size = i.Get<Vector2>("size");
            NineSlice? ns = Resource.NineSlices["window/window"];
            var children = i.Get<Instance[]>("children");
            children[1].Position = new(-size.X / 2 + ns.innerLeft + OFFSET, -size.Y / 2 + ns.innerTop + OFFSET * 1.5f);
            return null;
        }
    }
}
