using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Peace : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? attacker = WASD.Assert<string>(args[0]);
            if (!StreamOverlay.Shimeji.ContainsKey(attacker)) return [false, "you are currently not real, use !guy to summon a guy"];
            string? defender = StreamOverlay.Shimeji[attacker].Get<Instance>("victim")?.Get<string>("author");
            if (defender == null || !StreamOverlay.Shimeji.ContainsKey(defender)) return [false, "the target is currently not real"];
            var attackerHP = StreamOverlay.Shimeji[attacker].Get<float>("hp") / StreamOverlay.Shimeji[attacker].Get<float>("maxhp");
            var defenderHP = StreamOverlay.Shimeji[defender].Get<float>("hp") / StreamOverlay.Shimeji[defender].Get<float>("maxhp");
            if (attackerHP >= defenderHP)
            {
                StreamOverlay.Shimeji[attacker].Var.Remove("victim");
                StreamOverlay.Shimeji[defender].Var.Remove("victim");
                StreamOverlay.Shimeji[attacker].Set("incombat", false);
                StreamOverlay.Shimeji[defender].Set("incombat", false);
                return [true, "peace has returned to the lands"];
            }
            else return [false, "running away is futile (you are currently losing)"];
        }
    }
}
