using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Peace : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? attacker = WASD.Assert<string>(args[0]);
            string? defender = WASD.Assert<string>(args[1]);
            if (!StreamOverlay.Shimeji.ContainsKey(attacker) || !StreamOverlay.Shimeji.ContainsKey(defender))
                return [false];
            var attackerHP = StreamOverlay.Shimeji[attacker].Get<float>("hp") / StreamOverlay.Shimeji[attacker].Get<float>("maxhp");
            var defenderHP = StreamOverlay.Shimeji[defender].Get<float>("hp") / StreamOverlay.Shimeji[defender].Get<float>("maxhp");
            if (attackerHP >= defenderHP)
            {
                StreamOverlay.Shimeji[attacker].Var.Remove("victim");
                StreamOverlay.Shimeji[defender].Var.Remove("victim");
                StreamOverlay.Shimeji[attacker].Set("incombat", false);
                StreamOverlay.Shimeji[defender].Set("incombat", false);
                return [true];
            }
            else return [false];
        }
    }
}
