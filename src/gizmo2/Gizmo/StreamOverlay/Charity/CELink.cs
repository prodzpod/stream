namespace Gizmo.StreamOverlay.Charity
{
    public class CELink : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? link = WASD.Assert<string>(args[0]);
            if (link == null) return [false];
            return [NotCE.Link(link)];
        }   
    }
}
