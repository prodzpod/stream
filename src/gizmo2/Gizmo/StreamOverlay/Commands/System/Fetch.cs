using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using ProdModel.Object.Sprite;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class Fetch : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string? subject = WASD.Assert<string>(args[0]);
            return subject switch
            {
                "windowcount" => [TaskManager.NumWindows],
                "palette" => [ModelSprite.ColorReplace.Select(kv => kv.Key.ToString() + " -> " + kv.Value.ToString())],
                "accessory" => [ModelSprite.Accessories],
                "guys" => [Elements.Entities.Shimeji.Guys.Keys],
                "camera" => ["pixels", ModelSprite.Pixels, "width", ModelSprite.Width, "height", ModelSprite.Height, "x", ModelSprite.CameraTranslation.X, "y", ModelSprite.CameraTranslation.Y, "z", ModelSprite.CameraTranslation.Z, "rx", ModelSprite.CameraRotation.X, "ry", ModelSprite.CameraRotation.Y, "rz", ModelSprite.CameraRotation.Z, "zoom", ModelSprite.CameraZoom],
                "flip" => [MainRoom.Chat.Position.X != 208],
                "volume" => ["system", Audio.SoundGroups["system"], "message", Audio.SoundGroups["message"], "click", Audio.SoundGroups["click"], "window", Audio.SoundGroups["window"], "song", Audio.SoundGroups["song"], "kick", Audio.SoundGroups["kick"], "gong", Audio.SoundGroups["gong"], "speech", Audio.SoundGroups["speech"]],
                "tracker" => [Tracker.LastTrackerString],
                "chatcount" => [Game.INSTANCES.Where(x => x.Element is Chat).Count()],
                "pointercount" => [Game.INSTANCES.Where(x => x.Element is Elements.Gizmos.Pointer).Count()],
                _ => ["invalid subject"],
            };
        }
    }
}
