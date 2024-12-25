using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;
using System.Text.RegularExpressions;

namespace Gizmo.StreamOverlay.Commands
{
    public class Chat : Command
    {
        public static Vector4 Bounds = new(54 - 208, 352 - 689, 352, 674);
        public static float OFFSET = 4;
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? id = WASD.Assert<string>(args[0]);
            object?[]? _icon = WASD.Assert<object?[]>(args[1]);
            string? _color = WASD.Assert<string>(args[2]);
            string? _author = WASD.Assert<string>(args[3]);
            string? _content = WASD.Assert<string>(args[4]);
            float? _isFirstMessage = WASD.Assert<float>(args[5]);
            if (id == null || _icon == null || _color == null || _author == null || _content == null) return null;
            if (Shimeji.Guys.ContainsKey(_author)) Shimeji.Guys[_author] = Game.Time;
            bool isFirstMessage = _isFirstMessage == 1;
            bool isEmote = new Regex(@"^<emote=[^>]+>$").IsMatch(_content);
            if (isEmote && _content.EndsWith("emote/7tv/Joel.gif>")) 
            {
                SpawnJoel($"{_author}: Joel");
                return null;
            }
            SpawnChat(id, _color, _author, _content, _icon.Select(x => (string)x).ToArray(), isFirstMessage, isEmote);
            return null;
        }

        public static Instance SpawnChat(string id, string _color, string _author, string _content, string[] _icon, bool isFirstMessage, bool isEmote)
        {
            float fontSize = isEmote ? 52 : 26;
            ColorP color = new(_color);
            Text author = Text.Compile(_author, "arcaoblique", 26, Bounds.Z - 32 - OFFSET * 3 - 13, -Vector2.One, color);
            Text content = Text.Compile(_content, "arcaoblique", fontSize, Bounds.Z - 32 - OFFSET * 3 - (fontSize / 2), -Vector2.One, ColorP.BLACK);
            Sprite[] icons = [.._icon.Select(x => Resource.Sprites[x])];
            float h = author.Size.Y + content.Size.Y + OFFSET * 3;
            foreach (var x in Game.INSTANCES.Where(y => y.Element is Elements.Gizmos.Chat && y.Get<bool>("racked")))
            {
                x.Position.Y -= h;
                var size = x.Get<Vector2>("size");
                if (x.Position.Y - size.Y / 2 < (Bounds.Y + MainRoom.Chat.Position.Y)) x.Destroy();
            }
            IDrawable[] _i = [author, content, ..icons];
            Instance i = Squareish.New(nameof(Elements.Gizmos.Chat), new((Bounds.X + MainRoom.Chat.Position.X) + Bounds.Z / 2, (Bounds.Y + MainRoom.Chat.Position.Y) + Bounds.W - h / 2), new(Bounds.Z, h), _i);
            Audio.Play(isFirstMessage ? "screen/join" : "screen/chat");
            Logger.Log("Chat Recieved:", id);
            i.Set("id", id);
            i.Set("icon", _icon);
            i.Set("author", _author);
            i.Set("color", _color);
            i.Set("content", _content);
            i.Set("racked", !isFirstMessage);
            i.Set("follow", isFirstMessage);
            var children = i.Get<Instance[]>("children");
            children[0].Position = new(-Bounds.Z / 2 + 32 + OFFSET * 2 + 13, -h / 2 + OFFSET + 13);
            children[1].Position = new(-Bounds.Z / 2 + 32 + OFFSET * 2 + (fontSize / 2), -h / 2 + author.Size.Y + OFFSET * 2 + (fontSize / 2));
            children[2].Position = new(-Bounds.Z / 2 + 16 + OFFSET, 0);
            return i;
        }
        public static Instance SpawnJoel(string title)
        {
            Instance j = Elements.Windows.Window.New(
                new(RandomP.Random(Game.Resolution.X), RandomP.Random(Game.Resolution.Y)),
                title, Resource.Sprites["other/joel"].Size, Resource.Sprites["other/joel"]);
            j.Set("content", "Joel");
            j.Get<Instance[]>("children")[1].Playback = 1 / 6f;
            return j;

        }
    }
}
