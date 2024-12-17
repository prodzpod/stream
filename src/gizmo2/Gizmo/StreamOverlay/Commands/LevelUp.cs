using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Rooms;
using static PInvoke.User32;
using YamlDotNet.Core.Tokens;
using System.Numerics;
using Gizmo.Engine;

namespace Gizmo.StreamOverlay.Commands
{
    public class LevelUp : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string name = WASD.Assert<string>(args[0]);
            string stat = WASD.Assert<string>(args[1]);
            if (name == null || stat == null) return [0, false];
            if (StreamOverlay.Shimeji.TryGetValue(name, out var i))
            {
                var sp = i.Get<int>("statpoint");
                if (sp <= 0) return [0, false];
                i.Set("statpoint", sp - 1);
                var value = stat switch
                {
                    "constitution" => 25,
                    "attack" => 2.5f,
                    "critchance" => 0.01f,
                    _ => 0
                };
                i.Set(stat, i.Get<float>(stat) + value);
                return [0, true];
            }
            return [0, false];        
        }
    }
}
