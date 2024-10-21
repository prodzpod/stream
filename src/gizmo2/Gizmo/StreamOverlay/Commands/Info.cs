using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Info : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string subject = WASD.Assert<string>(args[0]);
            float phase = WASD.Assert<float>(args[1]);
            string game = WASD.Assert<string>(args[2]);
            if (subject == null) return null;
            var text = Text.Compile($"\"{subject}\"", "arcaoblique", 26, -Vector2.One, ColorP.BLACK);
            var ns = Resource.NineSlices["window/making"];
            MainRoom.MakingText.Sprite = text;
            var x = ns.innerLeft + text.Size.X + ns.innerRight;
            MainRoom.Making.Set("size", new Vector2(x, 44));
            MainRoom.Making.Position = new(748 + x / 2, 1056);
            MainRoom.MakingText.Position = new((Resource.NineSlices["window/making"].innerLeft - text.Size.X) / 2, 4);
            MainRoom.Phase.Sprite = Text.Compile(phase.ToString().PadLeft(2, '0'), "arcaoblique", 26, -Vector2.One, ColorP.BLACK);
            Elements.Windows.DrawWindow.IsTetris = game != "Software and Game Development" && game != "Linux for PlayStation 2";
            return null;
        }
    }
}
