using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Windows;
using static Gizmo.StreamOverlay.Elements.Entities.Shimeji;

namespace Gizmo.StreamOverlay.Commands
{
    public class Peace : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string? attacker = WASD.Assert<string>(args[0]);
            if (!StreamOverlay.Shimeji.ContainsKey(attacker)) return [false, "you are currently not real, use !guy to summon a guy"];
            var hostiles = StreamOverlay.Shimeji[attacker].Get<List<Instance>>("hostiles");
            foreach (var guy in hostiles)
            {
                var _QueuedActions = guy.Get<List<HookRequest>>("QueuedActions");
                _QueuedActions.Add(new HookRequest(guy, "peaced"));
            }
            hostiles.Clear();
            StreamOverlay.Shimeji[attacker].Set("hostiles", hostiles);
            EndCombat(StreamOverlay.Shimeji[attacker]);
            StreamOverlay.Shimeji[attacker].Set("timespeaced", StreamOverlay.Shimeji[attacker].Get<int>("timespeaced") + 1);
            StreamWebSocket.Send("updatehistory", StreamOverlay.Shimeji[attacker].Get<string>("author"), "timespeaced", StreamOverlay.Shimeji[attacker].Get<int>("timespeaced"));
            return [true, "peace has returned to the lands"];
        }
    }
}
