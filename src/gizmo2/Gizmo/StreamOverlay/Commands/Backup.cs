namespace Gizmo.StreamOverlay.Commands
{
    public class Backup: Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            BackupP.Backup();
            return null;
        }
    }
}
