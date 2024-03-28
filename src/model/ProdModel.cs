using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using ProdModel.Gizmo;
using ProdModel.Object;
using ProdModel.Utils;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using static PInvoke.User32;

// this part sucks bc im like less than 12 hours away from stream sorry LOL

namespace ProdModel
{
    public class ProdModel : Game
    {
        public GraphicsDeviceManager _graphics;
        public SpriteBatch _spriteBatch;
        public static WebSocketP WebSocketModel;
        public static WebSocketP WebSocket;
        public static ProdModel Instance;
        public static Dictionary<string, SpriteFont> FONTS = new();
        public System.Windows.Forms.Form Form;
        public static Texture2D PIXEL;

        public ProdModel()
        {
            Instance = this;
            _graphics = new GraphicsDeviceManager(this)
            {
                PreferredBackBufferWidth = 1920,
                PreferredBackBufferHeight = 1080,
                IsFullScreen = true,
                HardwareModeSwitch = false
            };
            Content.RootDirectory = "Content";
            IsMouseVisible = true;
        }

        protected override void Initialize()
        {
            initialKey = GetWindowLong(Window.Handle, WindowLongIndexFlags.GWL_EXSTYLE);
            ToggleClickthrough();
            Form = System.Windows.Forms.Control.FromHandle(Window.Handle).FindForm();
            Form.TransparencyKey = System.Drawing.Color.FromArgb(Color.Magenta.R, Color.Magenta.G, Color.Magenta.B);
            Form.TopLevel = true;
            Form.TopMost = true;
            // TODO: Add your initialization logic here
            WebSocket = new("ws://localhost:339", ws => {
                ws.Send("model", "register model", msg =>
                {
                    Log("Model Module Set Up.");
                    return "";
                });
            }, Server.HandleData);
            base.Initialize();
        }

        private int initialKey;
        public bool Clickthrough = false;
        public void ToggleClickthrough()
        {
            Clickthrough = !Clickthrough;
            InputP.InputEnabled = !InputP.InputEnabled;
            SetWindowLongFlags flag = (SetWindowLongFlags)(Clickthrough ? (initialKey | 0x80020) : initialKey);
            SetWindowLong(Window.Handle, WindowLongIndexFlags.GWL_EXSTYLE, flag);
        }

        protected override void LoadContent()
        {
            _spriteBatch = new SpriteBatch(GraphicsDevice);
            foreach (var k in new string[] { "alagard", "arcaoblique", "comfortaa", "comfortaa_bold", "iosevka_comfy", "iosevka_comfy_bold", "iosevka_comfy_italic", "iosevka_comfy_bold_italic" })
                FONTS[k] = Content.Load<SpriteFont>("fonts/" + k);
            PIXEL = Texture2D.FromFile(Instance._graphics.GraphicsDevice, ResolvePath("Content/white.png"));
            var prod2d = new Object.Object("prod2d")
                .AddChild(new ImageSprite("Content/sprites/prod5")).SetBoundingBoxes(0).SetPosition(-4, 600).Physics().MakeTopdown().Listen();
            prod2d.Drag = 0.01f;
            new Object.Object("bg").AddChild(new ImageSprite("Content/layout/bg")).SetBoundingBoxes(0).SetPosition(0, 0);
            new Object.Object("phase").AddChild(new ImageSprite("Content/layout/status")).SetBoundingBoxes(0).SetPosition(-4, 4);
            var phase = new Object.Object("phase")
                .AddChild(new ImageSprite("Content/layout/phase"))
                .AddChild(new TextSprite("arcaoblique", "00").SetAlign(1, 0), -8, 4)
                .SetBoundingBoxes(0).SetPosition(4, 4).Listen();
            phase.onWSRecieve += (self, str) =>
            {
                string[] args = WebSocketP.TakeWord(str);
                if (args[0] == "set") ((TextSprite)self.Children[1].Sprite).Content = args[1];
            };
            new Object.Object("tasks").AddChild(new ImageSprite("Content/layout/tasks")).SetBoundingBoxes(0).SetPosition(-212, 4);
            var theme = new Object.Object("theme")
                .AddChild(new NineSliceSprite("Content/layout/making", true, false))
                .AddChild(new TextSprite("arcaoblique", "\"obs filters\"").SetAlign(-1, 0), 138 - 14, 0)
                .SetBoundingBoxes(1, 138, 10).SetBoundingBoxes(-1, 44).SetPosition(-1050, 4).Listen();
            theme.onWSRecieve += (self, str) =>
            {
                string[] args = WebSocketP.TakeWord(str);
                if (args[0] == "set") ((TextSprite)self.Children[1].Sprite).Content = args[1];
                self.SetBoundingBoxes(1, 138, 10).SetBoundingBoxes(-1, 44);
            };
            var window = new Object.Object("window_test")
                .AddChild(new NineSliceSprite("Content/layout/window", true, true))
                .AddChild(new TextSprite("arcaoblique", "imagine i actually\nhooked up openseeface\non a 3d model here").SetAlign(-1, -1), 8, 50)
                .AddChild(new TextSprite("arcaoblique", "big shoe lmfao").SetColor(Color.White).SetAlign(-1, -1), 8, 12)
                .SetBoundingBoxes(1, 20, 54).SetPosition(0, 0).Physics().MakeTopdown().Listen();
            window.Rotatability = 0;
            window.onWSSend += (self) =>
            {
                self.AddWSData("title", ((TextSprite)self.Children[2].Sprite).Content);
                self.AddWSData("content", ((TextSprite)self.Children[1].Sprite).Content);
            };
        }

        protected override void Update(GameTime gameTime)
        {
            InputP.OnUpdate();
            if (InputP.KeyPressed(Keys.NumPad0, true)) ToggleClickthrough();
            for (int i = Object.Object.OBJECTS.Count - 1; i >= 0; i--) // in reverse order so backmost item gets selected
            {
                var o = Object.Object.OBJECTS[i];
                o.OnUpdate(gameTime);
                foreach (var k in InputP.PressedKeys()) o.OnKey(k);
                if (MathP.PositionInBoundingBox(o, InputP.MousePosition))
                {
                    var positionRelative = MathP.RotateAround(InputP.MousePosition - o.Position, -o.Angle);
                    o.OnHover(positionRelative);
                    if (InputP.MousePressed(InputP.Mouses.Left))
                    {
                        o.HeldPosition = positionRelative;
                        o.OnMouse(InputP.Mouses.Left, positionRelative);
                    }
                    if (InputP.MousePressed(InputP.Mouses.Right)) o.OnMouse(InputP.Mouses.Right, positionRelative);
                    if (InputP.MousePressed(InputP.Mouses.Middle)) o.OnMouse(InputP.Mouses.Middle, positionRelative);
                }
                if (InputP.MouseReleased(InputP.Mouses.Left))
                {
                    o.HeldPosition = null;
                    o.OnRelease(InputP.Mouses.Left);
                }
                if (InputP.MouseReleased(InputP.Mouses.Right)) o.OnRelease(InputP.Mouses.Right);
                if (InputP.MouseReleased(InputP.Mouses.Middle)) o.OnRelease(InputP.Mouses.Middle);
                if (o.HeldPosition != null)
                {
                    var point = MathP.RotateAround((Vector2)o.HeldPosition, o.Angle);
                    o.OnDrag(point, (InputP.MousePosition - point - o.Position) * (float)gameTime.ElapsedGameTime.TotalSeconds);
                    o.Speed = (InputP.MousePosition - point - o.Position) * (float)gameTime.ElapsedGameTime.TotalSeconds / 0.01f;
                }
            }
            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Magenta);
            _spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, SamplerState.PointClamp, null, null, null, null);
            foreach (var o in Object.Object.OBJECTS) o.OnDraw(gameTime);
            _spriteBatch.End();
            base.Draw(gameTime);
        }
        public static void Log(params object[] args)
        {
            string txt = string.Join(" ", args.Select(x => x.ToString()));
            WebSocket.Send("main", "log " + txt);
        }

        public static string ResolvePath(params string[] path)
        {
            var fullPath = new List<string> { Directory.GetCurrentDirectory(), "../../../" };
            fullPath.AddRange(path); return Path.Combine(fullPath.ToArray());
        }
    }
}