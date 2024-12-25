using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using System.Numerics;
using YamlDotNet.Core.Tokens;

namespace Gizmo.StreamOverlay.Commands
{
    public class SpawnShimeji : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? author = WASD.Assert<string>(args[0]);
            string? _color = WASD.Assert<string>(args[1]);
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            Dictionary<string, object?>? _ai = WASD.Assert<Dictionary<string, object?>>(args[4]);
            if (author == null || _color == null || _ai == null) return null;
            Vector2 pos = new(x.Value, y.Value);
            Dictionary<string, float> ai = new(_ai.Select(x => new KeyValuePair<string, float>(x.Key, (float)x.Value)));
            if (StreamOverlay.Shimeji.TryGetValue(author, out var i)) {
                i.Position = pos;
                i.Speed = Vector2.Zero;
                i.Rotation = 0;
                i.Var.Remove("target");
                i.Var["ai"] = ai;
                return null;
            }
            _SpawnShimeji(x.Value, y.Value, author, _color, ai);
            return null;
        }

        public static Instance _SpawnShimeji(float x, float y, string author, string _color, Dictionary<string, float> ai)
        {
            Vector2 pos = new(x, y);
            ColorP color = new(_color);
            if (!Resource.Sprites.TryGetValue("shimeji/" + author, out var sprite))
                sprite = Resource.Sprites["shimeji/default"];
            var i = Shimeji.New(sprite, pos, author, color);
            StreamOverlay.Shimeji[author] = i;
            i.Set("author", author);
            i.Set("color", _color);
            i.Set("ai", ai);
            Audio.Play("screen/join");
            if (Fight.FightingRaidBoss.Contains(author)) StreamWebSocket.Commands["fight"]([author, "prodzpod"]);
            return i;
        }
    }
}
