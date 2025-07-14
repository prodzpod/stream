namespace Gizmo.StreamOverlay.Charity
{
    public class CEValue : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float? addr = WASD.Assert<float>(args[0]);
            float? value = WASD.Assert<float>(args[1]);
            return [NotCE.Change((int)addr, (int)value)];
        }   
    }
}
