using Gizmo.Engine.Data;
using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.Cosmetic
{
    public class ColorReplace : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
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
