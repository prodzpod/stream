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
            MetaP.MaxFPS = 120;
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
        public static bool BackupCalled = false;

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
            if (InputP.KeyPressed(0x64)) Elements.Entities.Prod.Pose = "BLUSH";
            else if (InputP.KeyReleased(0x64)) Elements.Entities.Prod.Pose = "IDLE";
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
            // 
            if (InputP.KeyReleased(0x64)) StreamWebSocket.Send("specialbutton", "veadotube", "left");
            if (InputP.KeyReleased(0x65)) StreamWebSocket.Send("specialbutton", "veadotube", "right");
            if (InputP.KeyReleased(0x67)) StreamWebSocket.Send("specialbutton", "veadotube", "leftmost");
            if (InputP.KeyReleased(0x68)) StreamWebSocket.Send("specialbutton", "veadotube", "rightmost");
            if (InputP.KeyReleased(0x69)) StreamWebSocket.Send("specialbutton", "veadotube", "madmoney");
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
