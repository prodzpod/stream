namespace Gizmo.StreamOverlay.Charity
{
    public class CEBetween : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float? v1 = WASD.Assert<float>(args[0]);
            float? v2 = WASD.Assert<float>(args[1]);
            return [NotCE.Between(v1.Value, v2.Value)];
        }   
    }
}
