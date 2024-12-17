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
            string? _source = WASD.Assert<string>(args[0]);
            if (_source == null)
            {
                ModelSprite.ColorReplace = [];
                return ["reset all"];
            }
            try
            {
                ColorP source = new(_source);
                string? _target = WASD.Assert<string>(args[1]);
                if (_target == null)
                {
                    ModelSprite.ColorReplace.Remove(source);
                    return ["reset " + source];
                }
                ColorP target = new(_target);
                ModelSprite.ColorReplace[source] = target;
                return ["replaced " + source + " with " + target];
            }
            catch { return ["Error"]; }
        }
    }
}
