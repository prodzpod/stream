namespace Gizmo.StreamOverlay.Commands.Shimeji
{
    public class Despawn : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? author = WASD.Assert<string>(args[0]);
            if (author == null) return [0, false];
            if (!StreamOverlay.Shimeji.TryGetValue(author, out var i)) return [0, false];
            i.Set("forcenorespawn", true);
            i.Destroy();
            return [0, true];
        }
    }
}
