using Gizmo.Engine.Data;
using Raylib_CSharp.Interact;
using System.Numerics;
using System.Runtime.InteropServices;

namespace Gizmo.Engine
{
    public class InputP
    {

        public static Vector2 LastMousePosition = Vector2.Zero;
        public static Vector2 MousePosition = Vector2.Zero;
        public static Vector2 MouseWheelDelta = Vector2.Zero;
        public static List<int> LastCodes = [];
        public static List<int> Codes = [];
        public static void OnUpdate()
        {
            LastCodes = [.. Codes];
            LastMousePosition = MousePosition;
            MouseWheelDelta = Vector2.Zero;
            if ((Game.WindowFlag & Raylib_CSharp.Windowing.ConfigFlags.MousePassthroughWindow) != 0 && MetaP.Platform == OSPlatform.Windows) 
                Hacks.OutOfFocusMouseCheck.OnUpdate();
            else
            {
                MousePosition = Input.GetMousePosition();
                if (MousePosition == Vector2.Zero) MousePosition = Input.GetTouchPosition(0);
            }
            var pos = MetaP.GetPosition();
            if (MetaP.BoundMouse && !MathP.Between(pos, MousePosition, pos + Game.Resolution))
            {
                MousePosition = MathP.Clamp(MousePosition, pos, pos + Game.Resolution);
                Input.SetMousePosition((int)MousePosition.X, (int)MousePosition.Y);
            }
        }
        public static bool KeyHeld(int key) => Codes.Contains(key);
        public static bool KeyPressed(int key) => Codes.Contains(key) && !LastCodes.Contains(key);
        public static bool KeyReleased(int key) => !Codes.Contains(key) && LastCodes.Contains(key);
    }
}
