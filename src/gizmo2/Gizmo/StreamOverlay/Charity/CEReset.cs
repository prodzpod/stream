namespace Gizmo.StreamOverlay.Charity
{
    public class CEReset : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float? v = WASD.Assert<float>(args[0]);
            return [NotCE.FirstScan(v.Value != 0)];
        }   
    }
}
