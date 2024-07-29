using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Chat : Command
    {
        public static Vector4 Bounds = new(54, 352, 352, 674);
        public static float OFFSET = 4;
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? _icon = WASD.Assert<string>(args[0]);
            string? _color = WASD.Assert<string>(args[1]);
            string? _author = WASD.Assert<string>(args[2]);
            string? _content = WASD.Assert<string>(args[3]);
            float? _isFirstMessage = WASD.Assert<float>(args[4]);
            if (_icon == null || _color == null || _author == null || _content == null) return null;
            bool isFirstMessage = _isFirstMessage == 1;
            if (_content == "Joel") 
            {
                Instance j = Elements.Window.New(
                    new(RandomP.Random(Game.Resolution.X), RandomP.Random(Game.Resolution.Y)), 
                    $"{_author}: Joel", Resource.Sprites["other/joel"].Size, Resource.Sprites["other/joel"]);
                j.Get<Instance[]>("children")[1].Playback = 1 / 6f;
                return null; 
            }
            ColorP color = new(_color);
            Text author = Text.Compile(_author, "arcaoblique", 26, Bounds.Z - 32 - OFFSET * 3 - 13, -Vector2.One, color);
            Text content = Text.Compile(_content, "arcaoblique", 26, Bounds.Z - 32 - OFFSET * 3 - 13, -Vector2.One, ColorP.BLACK);
            Sprite icon = Resource.Sprites[_icon];
            float h = author.Size.Y + content.Size.Y + OFFSET * 3;
            foreach (var x in Game.INSTANCES.Where(y => y.Element is Elements.Chat && y.Get<bool>("racked")))
            {
                x.Position.Y -= h;
                var size = x.Get<Vector2>("size");
                if (x.Position.Y - size.Y / 2 < Bounds.Y) x.Destroy();
            }
            Instance i = Elements.Squareish.New(nameof(Elements.Chat), new(Bounds.X + Bounds.Z / 2, Bounds.Y + Bounds.W - h / 2), new(Bounds.Z, h), author, content, icon);
            Audio.Play(isFirstMessage ? "screen/join" : "screen/chat");
            i.Set("racked", !isFirstMessage);
            i.Set("follow", isFirstMessage);
            var children = i.Get<Instance[]>("children");
            children[0].Position = new(-Bounds.Z / 2 + 32 + OFFSET * 2 + 13, -h / 2 + OFFSET + 13);
            children[1].Position = new(-Bounds.Z / 2 + 32 + OFFSET * 2 + 13, -h / 2 + author.Size.Y + OFFSET * 2 + 13);
            children[2].Position = new(-Bounds.Z / 2 + 16 + OFFSET, 0);
            return null;
        }
    }
}
