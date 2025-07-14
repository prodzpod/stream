namespace Gizmo.StreamOverlay.Charity
{
    public class CEList : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            return [NotCE.List()];
        }   
    }
}
