using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Extra;
using Raylib_CSharp;
using Raylib_CSharp.Audio;
using Raylib_CSharp.Images;
using Raylib_CSharp.Rendering;
using Raylib_CSharp.Textures;
using Raylib_CSharp.Windowing;
using System.Numerics;
using System.Runtime.InteropServices;

namespace Gizmo.Engine
{
    public static class NotGMS
    {
        public static string WorkingDirectory;
        public static double lastTime = 0;
        public static double secondsCounter = 0;
        public static int _drawOperations = 0;
        public static int drawOperations = 0;

        public static void Init(Game game)
        {
            Raylib_CSharp.Logging.Logger.SetTraceLogLevel(Raylib_CSharp.Logging.TraceLogLevel.Warning);
            Logger.Init();
            // Logger.SetLogLevel(-100);
            Logger.Info("Gizmo Online!");
            Logger.Info("//             S T A Y C U T E            //");
            Logger.Info("// gizmo v2 r1: REAL transparency edition //");
            Logger.Info("// // // // // // // // // // // // // // //");
            foreach (var platform in new OSPlatform[] { OSPlatform.Windows, OSPlatform.OSX, OSPlatform.Linux, OSPlatform.FreeBSD }) if (RuntimeInformation.IsOSPlatform(platform)) MetaP.Platform = platform;

            Logger.Info("Loading Window");
            ConfigFlags flag = 0;
            if (game is Transparent) flag |= ConfigFlags.TransparentWindow;
            if (game is Overlay) flag |= ConfigFlags.TopmostWindow | ConfigFlags.AlwaysRunWindow | ConfigFlags.TransparentWindow | ConfigFlags.MousePassthroughWindow | ConfigFlags.UndecoratedWindow;
            Game.WindowFlag = flag;
            Window.Init(1920, 1080, Game.Title);
            Logger.Info("Window Loaded");

            Logger.Info("Loading Resources from " + WorkingDirectory);
            Resource.Init();
            game.ResourceLoaded();
            Logger.Info("Resources Loaded");

            Logger.Info("Starting Initial Room");
            Game.Resolution = Vector2.Zero;
            game.Init();
            var room = Resource.Rooms[game.InitialRoom];
            if (room == null) { Logger.Error("InitialRoom is empty or undefined"); throw new TypeLoadException(); }
            else Game.Room = room;
            MetaP.Mouse = Instance.New(nameof(Mouse));
            MetaP.Mouse.onUpdate += (deltaTime) =>
            {
                if (Game.Room == null) return true;
                Mouse.RealPosition = InputP.MousePosition / Game.Resolution * Game.Room.Camera.ZW() + (Game.Room.Camera.XY() - Game.Resolution / 2);
                Mouse.Left = InputP.KeyHeld(-1);
                Mouse.Right = InputP.KeyHeld(-2);
                Mouse.Middle = InputP.KeyHeld(-3);
                Mouse.X = InputP.KeyHeld(-4);
                Mouse.WheelDelta = InputP.MouseWheelDelta;
                MetaP.Mouse.Position = Mouse.RealPosition;
                return true;
            };
            game.PostInit();
            lastTime = Time.GetTime();
            Main(game);
        }
        public static void Dispose()
        {
            Resource.Dispose();
            Window.Close();
            AudioDevice.Close();
        }
        public static async void Main(Game game)
        {
            while (!Window.ShouldClose())
            {
                double start = Time.GetTime();
                static void apply(int i) { Graphics.BeginShaderMode(Game.SHADERS[i].OnShader()); }
                Game.INSTANCES = [.. Game._INSTANCES];
                Game._DRAW_ORDER = Game._DRAW_ORDER.Intersect(Game._INSTANCES).ToList();
                Game.DRAW_ORDER = [.. Game._DRAW_ORDER];
                // input
                lock (WebSocket.ActiveWSMessages)
                {
                    List<KeyValuePair<WebSocket, byte[]>> z = [.. WebSocket.ActiveWSMessages];
                    foreach (var m in z)
                    {
                        WebSocket.ActiveWSMessages.Remove(m);
                        m.Key.Recieve(m.Value);
                    }
                    WebSocket.ActiveWSMessages.Clear();
                }
                Game.deltaTime = Time.GetFrameTime();
                var time = Time.GetTime();
                secondsCounter += time - lastTime;
                lastTime = time;
                while (secondsCounter >= 1)
                {
                    // Logger.Verbose("Second passed, draw operations:", _drawOperations);
                    secondsCounter -= 1;
                    drawOperations = _drawOperations;
                    _drawOperations = 0;
                }
                InputP.OnUpdate();
                game.PreUpdate(Game.deltaTime);
                // collision
                Game.COLLISION.Clear();
                for (int i = 0; i < Game.INSTANCES.Length; i++)
                {
                    Game.INSTANCES[i].Position += Game.INSTANCES[i].Speed * Game.deltaTime;
                    Game.INSTANCES[i].Angle += Game.INSTANCES[i].Rotation * Game.deltaTime;
                }
                var _i = Game.INSTANCES.Where(x => x.Hitbox != null).Reverse().ToArray();
                foreach (var x in _i) foreach (var y in _i.Where(z => x.InteractsWith.Contains(z.Element) && x != z))
                    {
                        if (!Game.COLLISION.TryGetValue(new(y, x), out bool ch))
                        {
                            ch = HitboxP.Check(x, y);
                            Game.COLLISION[new(x, y)] = ch;
                        }
                        if (ch) x.OnCollide(y);
                        Game.COLLISION[new(x, y)] = ch;
                    }
                // logic
                game.Update(Game.deltaTime);
                Game._Update(Game.deltaTime);
                game.PostUpdate(Game.deltaTime);
                // graphics
                _drawOperations += 1;
                Graphics.BeginDrawing();
                if (MetaP.ClearScreen) Graphics.ClearBackground(ColorP.TRANSPARENT);
                if (Game.SHADERS.Count > 0) apply(0);
                game.Draw(Game.deltaTime);
                Game._Draw(Game.deltaTime);
                game.PostDraw(Game.deltaTime);
                if (Game.SHADERS.Count > 1) for (int i = 1; i < Game.SHADERS.Count; i++)
                    { // bad code for multiple shaders
                        Image temp = Image.LoadFromScreen();
                        Texture2D temp2 = Texture2D.LoadFromImage(temp);
                        Graphics.ClearBackground(ColorP.TRANSPARENT);
                        apply(i);
                        Graphics.DrawTexture(temp2, 0, 0, ColorP.WHITE);
                        temp2.Unload();
                        temp.Unload();
                    }
                if (Game.SHADERS.Count > 0) Graphics.EndShaderMode();
                Graphics.EndDrawing();
                // audio
                Audio._INSTANCES = [.. Audio.INSTANCES];
                foreach (var ae in Audio._INSTANCES) if (!ae.Tick(Game.deltaTime)) Audio.INSTANCES.Remove(ae);
                Game.Time += Game.deltaTime;
                double duration = Time.GetTime() - start;
                double minFrameTime = MetaP.MaxFPS; if (MetaP.MaxFPS <= 0) minFrameTime = MetaP.TargetFPS;
                duration = (1.0 / minFrameTime) - duration;
                if (duration > 0) Time.WaitTime(duration);
            }
        }
    }
}
