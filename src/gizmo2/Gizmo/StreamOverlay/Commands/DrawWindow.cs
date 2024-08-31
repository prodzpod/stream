using Gizmo.Engine;

namespace Gizmo.StreamOverlay.Commands
{
    public class DrawWindow : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            float? x = WASD.Assert<float>(args[2]);
            float? y = WASD.Assert<float>(args[3]);
            float? x2 = WASD.Assert<float>(args[4]);
            float? y2 = WASD.Assert<float>(args[5]);
            if (x == null || y == null || x2 == null || y2 == null) return null;
            Elements.Windows.DrawWindow.New(new(x.Value, y.Value), new(x2.Value, y2.Value));
            return null;
        }
    }
}
