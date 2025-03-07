using Gizmo.Engine;
using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands
{
    public class Volume : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[0]);
            string? category = WASD.Assert<string>(args[1]);
            var v = MathP.Clamp(x / 100, 0, 1);
            if (category == null) Audio.MasterVolume = v;
            else Audio.SetVolume(category, v);
            return null;
        }
    }
}
