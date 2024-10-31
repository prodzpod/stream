using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class ColorReplace : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (args.Length == 0)
            {
                ModelSprite.ColorReplace = [];
                return ["reset all"];
            }
            string? _source = WASD.Assert<string>(args[0]);
            try
            {
                ColorP source = new(_source);
                if (args.Length == 1)
                {
                    ModelSprite.ColorReplace.Remove(source);
                    return ["reset " + source];
                }
                string? _target = WASD.Assert<string>(args[1]);
                ColorP target = new(_target);
                ModelSprite.ColorReplace[source] = target;
                return ["replaced " + source + " with " + target];
            }
            catch { return ["Error"]; }
        }
    }
}
