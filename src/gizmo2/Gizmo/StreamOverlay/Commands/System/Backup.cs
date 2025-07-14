namespace Gizmo.StreamOverlay.Commands.System
{
    public class Backup : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            BackupP.Backup();
            return null;
        }
    }
}
