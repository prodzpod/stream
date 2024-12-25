using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Commands;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using ProdModel.Object;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using Raylib_CSharp.Images;
using Raylib_CSharp.Textures;
using System.Drawing;
using System.Numerics;
using System.Runtime.InteropServices;

namespace Gizmo.StreamOverlay
{
    public class StreamOverlay : Game, Overlay
    {
        public override string InitialRoom => nameof(MainRoom);
        public override string WorkingDirectory => "../../../StreamOverlay";
        public static Instance? ClickedInstance = null;
        public static Vector2 ClickedPosition = Vector2.Zero;
        public static Instance? Prod;
        public static Dictionary<string, Instance> Shimeji = [];
        public static List<string> Models = [];
        public override void Init()
        {
            Models = FileP.ListFiles("../../../model").Where(x => x.EndsWith(".json")).ToList();
            var main = Models.FindIndex(x => x.EndsWith("model_data.json"));
            Models = [.. Models[main..], .. Models[0..main]];
            ModelHandler.ModelWVRM = new(Models[ModelHandler.modelNumber]);
            StreamWebSocket.Init();
            if (MetaP.Platform == OSPlatform.Windows)
            {
                TaskManager.CPUCounter = new("Processor", "% Processor Time", "_Total");
                TaskManager.RAMCounter = new("Memory", "Available MBytes");
            }
        }
        public override void PostInit()
        {
            base.PostInit();
            if (FileP.Exists("backup.txt") && FileP.Slurp("backup.txt").Length > 0)
            {
                BackupP.BackupEnabled = false;
                var i = YesNoWindow.New(new(960, 540), "Backup Found", "Restore from backup?", () =>
                {
                    // TODO: make this a popup with two buttons (w graphic)
                    foreach (var lines in FileP.Slurp("backup.txt").Split('\n'))
                        BackupP.Restore(WASD.Unpack(lines));
                });
                i.Set("pinned", true);
                i.onDestroy += () => BackupP.BackupEnabled = true;
            }
        }

        public override void PreUpdate(float deltaTime)
        {
            base.PreUpdate(deltaTime);
            if (InputP.Codes.Contains(0xA2)) Mouse.Left = true;
            if (InputP.Codes.Contains(0xA3) || InputP.Codes.Contains(0x2E)) Mouse.Middle = true;
        }

        public override void Update(float deltaTime)
        {
            if (InputP.KeyPressed(0x68)) StreamWebSocket.Send("echo", 127);
            if (InputP.KeyReleased(0x68)) StreamWebSocket.Send("echo", 0);
            if (InputP.KeyHeld(0x61) && InputP.Codes.Count > InputP.LastCodes.Count) Logger.Log("Keyboard:", InputP.Codes.Except(InputP.LastCodes).Select(x => $"0x{x:X2}").Join(", "));
            if (!ModelSprite.Busy && InputP.KeyPressed(0x64))
            {
                ModelSprite.Width -= 10;
                ModelSprite.Height -= 10;
                Logger.Log("Resized to", ModelSprite.Width, ModelSprite.Height);
                Elements.Entities.Prod.Prod3D.Size = new(ModelSprite.Width, ModelSprite.Height);
                ModelSprite.image = Image.GenColor(ModelSprite.Width, ModelSprite.Height, ColorP.TRANSPARENT);
            }
            if (!ModelSprite.Busy && InputP.KeyPressed(0x65))
            {
                ModelSprite.Width += 10;
                ModelSprite.Height += 10;
                Logger.Log("Resized to", ModelSprite.Width, ModelSprite.Height);
                Elements.Entities.Prod.Prod3D.Size = new(ModelSprite.Width, ModelSprite.Height);
                ModelSprite.image = Image.GenColor(ModelSprite.Width, ModelSprite.Height, ColorP.TRANSPARENT);
            }
            if (InputP.KeyPressed(0x67)) Elements.Entities.Prod.Pose = "HI";
            else if (InputP.KeyReleased(0x67)) Elements.Entities.Prod.Pose = "IDLE";
            if (InputP.KeyPressed(0x68)) Elements.Entities.Prod.Pose = "PROON";
            else if (InputP.KeyReleased(0x68)) Elements.Entities.Prod.Pose = "IDLE";
            if (InputP.KeyPressed(0x69)) Elements.Entities.Prod.Pose = Elements.Entities.Prod.Pose == "POINT" ? "IDLE" : "POINT";
            if (InputP.KeyPressed(0x66)) Elements.Entities.Prod.Pose = "PREAT";
            else if (InputP.KeyReleased(0x66)) Elements.Entities.Prod.Pose = "IDLE";
            if (InputP.KeyPressed(0x63))
            {
                ModelHandler.modelNumber += 1;
                if (ModelHandler.modelNumber == Models.Count) ModelHandler.modelNumber = 0;
                ModelHandler.ModelWVRM = new(Models[ModelHandler.modelNumber]);
            }
            if (!Mouse.Left && ClickedInstance != null)
            {
                ((GameElement)ClickedInstance.Element).OnRelease(ref ClickedInstance, InputP.MousePosition);
                ClickedInstance = null;
            }
            var mouseDelta = InputP.MousePosition - InputP.LastMousePosition;
            if (ClickedInstance != null) ((GameElement)ClickedInstance.Element).ApplyForce(ref ClickedInstance, ClickedPosition, InputP.MousePosition);
            WindowTracker.Update(deltaTime);
            if (Time > BackupP._backupTime && BackupP.BackupEnabled)
            {
                BackupP.Backup();
                BackupP._backupTime += BackupP.BackupTime;
            }
        }

        public static List<KeyValuePair<Image, Action<Texture2D>>> DrawResolve = [];
        public override void Draw(float deltaTime)
        {
            foreach (var i in DrawResolve) 
            {
                Texture2D texture = Texture2D.LoadFromImage(i.Key);
                i.Value(texture);
            }
            DrawResolve.Clear();
        }
    }
}
