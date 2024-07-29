using Gizmo.Engine.Data;
using Raylib_CSharp;
using Raylib_CSharp.Interact;
using Raylib_CSharp.Windowing;
using System.Numerics;
using System.Runtime.InteropServices;

namespace Gizmo.Engine
{
    public class MetaP
    {
        public static bool ClearScreen = true;
        public static bool BoundMouse = false;
        public static int MaxPhysicsChecks = 10000;
        public static int DefaultAudioAliases = 4;
        public static Instance Mouse;
        public static Vector2 GetPosition() => Window.GetPosition();
        public static Vector2 GetResolution() => GetResolution(Window.GetCurrentMonitor());
        public static Vector2 GetResolution(int monitor) => new(Window.GetMonitorWidth(monitor), Window.GetMonitorHeight(monitor));
        public static void SetPosition(Vector2 pos) => Window.SetPosition((int)pos.X, (int)pos.Y);
        public static Vector2 SetResolution(Vector2 size) => SetResolution(Window.GetCurrentMonitor(), size);
        public static Vector2 SetResolution(int monitor, Vector2 size)
        {
            Vector2 res = GetResolution(monitor);
            size = MathP.Abs(size);
            if (size.X == 0 && size.Y == 0) size = res;
            else if (size.X == 0) size.X = size.Y / res.Y * res.X;
            else if (size.Y == 0) size.Y = size.X / res.X * res.Y;
            if (size == Game.Resolution) return size;
            bool isFullScreen = size == res;
            if ((Game.WindowFlag & ConfigFlags.UndecoratedWindow) == 0 && isFullScreen == ((Game.WindowFlag & ConfigFlags.BorderlessWindowMode) == 0))
            {
                if (isFullScreen) Game.WindowFlag |= ConfigFlags.BorderlessWindowMode;
                else Game.WindowFlag &= ~ConfigFlags.BorderlessWindowMode;
            }
            Window.SetSize((int)size.X, (int)size.Y);
            return size;
        }
        public static int _targetfps = 60;
        public static int TargetFPS {
            get => _targetfps;
            set {
                if (_targetfps <= 0) { Logger.Error("Target FPS is not positive"); return; }
                _targetfps = value;
                Time.SetTargetFPS(value);
            }
        }
        public static int GetFPS() => Time.GetFPS();
        public static string GetClipboard() => Window.GetClipboardText();
        public static void SetClipbord(string str) => Window.SetClipboardText(str);
        public static OSPlatform Platform = default;
    }
}
