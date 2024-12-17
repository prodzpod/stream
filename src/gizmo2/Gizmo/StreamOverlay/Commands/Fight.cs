using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Screens;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Fight : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? attacker = WASD.Assert<string>(args[0]);
            string? defender = WASD.Assert<string>(args[1]);
            if (!StreamOverlay.Shimeji.ContainsKey(attacker) || !StreamOverlay.Shimeji.ContainsKey(defender))
                return [false];
            if (!StreamOverlay.Shimeji[defender].Var.ContainsKey("victim") || StreamOverlay.Shimeji[defender].Element is RaidBoss)
            {
                StreamOverlay.Shimeji[attacker].Set("victim", StreamOverlay.Shimeji[defender]);
                StreamOverlay.Shimeji[attacker].Set("incombat", true);
                StreamOverlay.Shimeji[attacker].Set("target", StreamOverlay.Shimeji[defender].Position);
                return [true];
            }
            return [false];
        }
    }
}
