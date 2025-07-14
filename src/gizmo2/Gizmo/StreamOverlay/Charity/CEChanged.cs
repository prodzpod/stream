namespace Gizmo.StreamOverlay.Charity
{
    public class CEChanged : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float? v = WASD.Assert<float>(args[0]);
            return [NotCE.Changed(v.Value != 0)];
        }   
    }
}
