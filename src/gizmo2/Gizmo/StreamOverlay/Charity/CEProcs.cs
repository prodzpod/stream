namespace Gizmo.StreamOverlay.Charity
{
    public class CEProcs : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return [NotCE.Procs()];
        }   
    }
}
