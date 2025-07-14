using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Commands.Misc;
using Gizmo.StreamOverlay.Elements.Windows;
using Raylib_CSharp.Images;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Charity2 : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? strs = WASD.Assert<string>(args[0]);
            if (strs == null) return null;
            foreach (var str in strs.Split('\n'))
            {
                var i = Gift.SpawnGift(new(RandomP.Random(1920), RandomP.Random(1080)), 0, $"<color=#00FF00><font=unifont>0x{str}</></>", 13 * 4);
                i.onPostInit += () =>
                {
                    i.Depth = 20;
                    i.Get<Instance[]>("children")[0].Depth = i.Depth;
                    return false;
                };
            }
            return null;
        }
    }
}