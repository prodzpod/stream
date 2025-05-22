using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Screens;
using Gizmo.StreamOverlay.Elements.Windows;

namespace Gizmo.StreamOverlay.Commands
{
    public class Fight : Command
    {
        public static List<string> FightingRaidBoss = [];
        public override object?[]? Execute(params object?[] args)
        {
            string? attacker = WASD.Assert<string>(args[0]);
            string? defender = WASD.Assert<string>(args[1]);
            if (!StreamOverlay.Shimeji.ContainsKey(attacker)) return [false, "you are currently not real, use !guy to summon a guy"];
            if (!StreamOverlay.Shimeji.ContainsKey(defender)) return [false, "the target is currently not real"];
            if (defender == "prodzpod" && StreamOverlay.Shimeji[defender].Get<bool>("raidboss") && !FightingRaidBoss.Contains(attacker)) FightingRaidBoss.Add(attacker);
            //
            var hostiles = StreamOverlay.Shimeji[attacker].Get<List<Instance>>("hostiles");
            if (!hostiles.Contains(StreamOverlay.Shimeji[defender])) hostiles.Add(StreamOverlay.Shimeji[defender]);
            StreamOverlay.Shimeji[attacker].Set("hostiles", hostiles);
            StreamOverlay.Shimeji[attacker].Set("incombatfor", 0f);
            StreamWebSocket.Send("updatehistory", StreamOverlay.Shimeji[attacker].Get<string>("author"), "timesattacked", 1);
            return [true, "combat initiated"];
        }
    }
}
