using Gizmo.Engine.Data;

namespace Gizmo.StreamOverlay.Commands
{
    public class Volume : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[0]);
            Audio.MasterVolume = MathP.Clamp(x / 100, 0, 1);
            return null;
        }
    }
}
