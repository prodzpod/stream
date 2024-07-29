using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Rooms;
using ProdModel.Object;
using ProdModel.Puppet;
using Raylib_CSharp.Images;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.StreamOverlay
{
    public class StreamOverlay : Game, Overlay
    {
        public override string InitialRoom => nameof(MainRoom);
        public override string WorkingDirectory => "../../../StreamOverlay";
        public static Instance? ClickedInstance = null;
        public static Vector2 ClickedPosition = Vector2.Zero;
        public static Instance Prod;
        public static Dictionary<string, Instance> Shimeji = [];
        public override void Init()
        {
            ModelHandler.ModelWVRM = new("../../../model/model_data.json");
            StreamWebSocket.Init();
            Logger.Log(Audio.GetDuration("screen/click_me"));
        }

        public override void PreUpdate(float deltaTime)
        {
            base.PreUpdate(deltaTime);
            if (InputP.Codes.Contains(0xA2)) Mouse.Left = true;
            if (InputP.Codes.Contains(0xA3)) Mouse.Middle = true;
        }

        public override void Update(float deltaTime)
        {
            if (!Mouse.Left && ClickedInstance != null)
            {
                ((GameElement)ClickedInstance.Element).OnRelease(ref ClickedInstance, InputP.MousePosition);
                ClickedInstance = null;
            }
            var mouseDelta = InputP.MousePosition - InputP.LastMousePosition;
            if (ClickedInstance != null) ((GameElement)ClickedInstance.Element).ApplyForce(ref ClickedInstance, ClickedPosition, InputP.MousePosition);
            WindowTracker.Update(deltaTime);
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
