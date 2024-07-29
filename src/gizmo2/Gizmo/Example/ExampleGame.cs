using Gizmo.Engine;
using Gizmo.Engine.RoomEditor;

namespace Gizmo.Example
{
    public class ExampleGame : Game
    {
        public override string WorkingDirectory => "../../..";
        public override string InitialRoom => nameof(RoomEditor);

        public override void Init()
        {
            Logger.Info("Resolution:", Resolution);
        }

        public override void Update(float deltaTime)
        {
            Logger.Log("mouse:", InputP.MousePosition);
        }

        public override void Draw(float deltaTime)
        {
        }
    }
}
