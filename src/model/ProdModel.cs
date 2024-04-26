using FmodForFoxes;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using NotGMS.Util;
using ProdModel.Gizmo;
using ProdModel.Object;
using ProdModel.Object.Audio;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using ProdModel.Utils;
using System;
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
        public INativeFmodLibrary _nativeLibrary = new DesktopNativeFmodLibrary();
        public static WebSocketP WebSocket;
        public static ProdModel Instance;
        public static Dictionary<string, SpriteFont> FONTS = new();
        public System.Windows.Forms.Form Form;
        public static Texture2D PIXEL;

        public const int SCREEN_WIDTH = 1920;
        public const int SCREEN_HEIGHT = 1024;

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
                ws.Send("model", msg =>
                {
                    Log("Model Module Set Up.");
                    return "";
                }, "register", "model");
            }, Server.HandleData);
            Audio.Init();
            ModelHandler.ModelWVRM = new("Content/blend/model_data");
            base.Initialize();
        }

        private int initialKey;
        public bool Clickthrough = false;
        public void ToggleClickthrough()
        {
            Clickthrough = !Clickthrough;
            // InputP.InputEnabled = !InputP.InputEnabled;
            SetWindowLongFlags flag = (SetWindowLongFlags)(Clickthrough ? (initialKey | 0x80020) : initialKey);
            _ = SetWindowLong(Window.Handle, WindowLongIndexFlags.GWL_EXSTYLE, flag);
        }

        protected override void LoadContent()
        {
            _spriteBatch = new SpriteBatch(GraphicsDevice);
            foreach (var k in new string[] { "alagard", "arcaoblique", "comfortaa", "comfortaa_bold", "iosevka_comfy", "iosevka_comfy_bold", "iosevka_comfy_italic", "iosevka_comfy_bold_italic" })
                FONTS[k] = Content.Load<SpriteFont>("fonts/" + k);
            PIXEL = Texture2D.FromFile(Instance._graphics.GraphicsDevice, ResolvePath("Content/white.png"));
            ModelHandler.InitTextures();
            ModelSprite.Init();
            SongHandler.Init();
            new Object.Object("_bg").AddChild(new ImageSprite("Content/layout/bg")).SetBoundingBoxes(0).SetPosition(0, 0);
            new Object.Object("_status").AddChild(new ImageSprite("Content/layout/status")).SetBoundingBoxes(0).SetPosition(-4, 4);
            var phase = new Object.Object("_phase")
                .AddChild(new ImageSprite("Content/layout/phase"))
                .AddChild(new TextSprite("arcaoblique", "00").SetAlign(1, 0), -4, 4)
                .SetBoundingBoxes(0).SetPosition(4, 4).Listen();
            phase.onWSRecieve += (self, str) =>
            {
                string[] args = WASD.Unpack(str);
                if (args[0] == "set") ((TextSprite)self.Children[1].Sprite).Content = args[1];
            };
            new Object.Object("_tasks").AddChild(new ImageSprite("Content/layout/tasks")).SetBoundingBoxes(0).SetPosition(-212, 4);
            var theme = new Object.Object("_theme")
                .AddChild(new NineSliceSprite("Content/layout/making", true, false))
                .AddChild(new TextSprite("arcaoblique", "\"economy\"").SetAlign(-1, 0), 138 - 14, 0)
                .SetBoundingBoxes(1, 138, 10).SetBoundingBoxes(-1, 44).SetPosition(-1050, 4).Listen();
            theme.onWSRecieve += (self, str) =>
            {
                string[] args = WASD.Unpack(str);
                if (args[0] == "set")
                {
                    ((TextSprite)self.Children[1].Sprite).Content = $"\"{args[1]}\"";
                    self.SetBoundingBoxes(1, 138, 10).SetBoundingBoxes(-1, 44).SetPosition(-1050, 4);
                }
            };
            var prod = new Object.Object("_prod")
                .AddChild(new ImageSprite(ModelHandler.Prod2D[4]))
                .AddChild(new ModelSprite()).SetBoundingBoxes(0).SetPosition(-4, 600).Physics().MakeTopdown().SetDepth(-100).Listen();
            ((ImageSprite)prod.Children[0].Sprite).Texture = PIXEL;
            prod.onDrag += (self, pos, drag) =>
            {
                if (self.State == "DEFAULT")
                {
                    Screens.AddExplosion();
                    self.Gravity = new(0, 1);
                }
                self.SetState("FLING");
            };
            prod.onUpdate += (self, time) =>
            {
                if (self.State == "DEFAULT") self.Position = MathP.Lerp(self.Position, new(4, 240), 0.1f);
                if (self.State == "FLING") ((ImageSprite)self.Children[0].Sprite).Texture = ModelHandler.Prod2D[self.Statetime % 0.25f > 0.125f ? 0 : 1];
                if (self.State == "BUMP" && self.Statetime > 0.25f) self.SetState("FLING");
                if (self.State == "CONFUSED" && self.Speed.Y < 0) self.SetState("FLING");
            };
            prod.onState += (self, state) =>
            {
                ModelSprite.ShowModel = state == "DEFAULT";
                if (state == "DEFAULT")
                {
                    Screens.AddExplosion();
                    self.Gravity = new(0, 0);
                    self.Speed = Vector2.Zero;
                    self.Rotation = 0;
                    self.Angle = 0;
                    self.Position.X = 4;
                    ((ImageSprite)self.Children[0].Sprite).Texture = PIXEL;
                }
                if (state == "BUMP") ((ImageSprite)self.Children[0].Sprite).Texture = ModelHandler.Prod2D[2];
                if (state == "CONFUSED") ((ImageSprite)self.Children[0].Sprite).Texture = ModelHandler.Prod2D[3];
                if (state == "CALM") ((ImageSprite)self.Children[0].Sprite).Texture = ModelHandler.Prod2D[4];
            };
            prod.onMouse += (self, mouse, pos) =>
            {
                if (mouse == InputP.Mouses.Right) self.SetState("CALM");
            };
            prod.onBounce += (self, wall) =>
            {
                if (self.State == "BUMP" && wall.Y == 1) self.SetState("CONFUSED");
                if (self.State != "FLING") return;
                else self.SetState("BUMP");
            };
            prod.onRelease += (self, mouse) =>
            {
                if (self.State != "DEFAULT" && 
                mouse == InputP.Mouses.Left && 
                self.HeldPosition != null &&
                InputP.MousePosition.X < 410 && 
                InputP.MousePosition.X < 346) // size of chatzone
                    self.SetState("DEFAULT");
            };
            prod.onKeyDown += (self, key) =>
            {
                switch (key)
                {
                    case Keys.NumPad7:
                        ModelHandler.Pose = "HI";
                        break;
                    case Keys.NumPad8:
                        ModelHandler.Pose = "VV";
                        break;
                    case Keys.NumPad9:
                        ModelHandler.Pose = "PROON";
                        break;
                    case Keys.NumPad6:
                        ModelHandler.Pose = "PREAT";
                        break;
                    case Keys.NumPad4:
                        ModelHandler.Pose = "TPOSE";
                        break;
                    case Keys.NumPad0:
                        Chat.AddChat("lib/icons_win2k_sp4_en/WINNT/system32/ole2.dll_14_DEFICON", Color.Black, "test", "this is a test message");
                        break;
                }
            };
            prod.onKeyUp += (self, key) =>
            {
                switch (key)
                {
                    case Keys.NumPad7:
                        if (ModelHandler.Pose == "HI") ModelHandler.Pose = "IDLE";
                        break;
                    case Keys.NumPad8:
                        if (ModelHandler.Pose == "VV") ModelHandler.Pose = "IDLE";
                        break;
                    case Keys.NumPad9:
                        if (ModelHandler.Pose == "PROON") ModelHandler.Pose = "IDLE";
                        break;
                    case Keys.NumPad6:
                        if (ModelHandler.Pose == "PREAT") ModelHandler.Pose = "IDLE";
                        break;
                    case Keys.NumPad4:
                        if (ModelHandler.Pose == "TPOSE") ModelHandler.Pose = "IDLE";
                        break;
                }
            };
        }

        protected override void Update(GameTime gameTime)
        {
            InputP.OnUpdate();
            Object.Object.OBJECTS.Sort((a, b) => MathF.Sign(a.Depth - b.Depth));
            for (int i = Object.Object.OBJECTS.Count - 1; i >= 0; i--) // in reverse order so backmost item gets selected
            {
                var o = Object.Object.OBJECTS[i];
                o.OnUpdate(gameTime);
                foreach (var k in InputP.HeldKeys()) o.OnKey(k);
                foreach (var k in InputP.PressedKeys()) o.OnKeyDown(k);
                foreach (var k in InputP.ReleasedKeys()) o.OnKeyUp(k);
                if (MathP.PositionInBoundingBox(o, InputP.MousePosition))
                {
                    var positionRelative = MathP.Rotate(InputP.MousePosition - o.Position, -o.Angle);
                    o.OnHover(positionRelative);
                    if (InputP.MousePressed(InputP.Mouses.Left))
                    {
                        o.HeldPosition = positionRelative;
                        o.OnMouse(InputP.Mouses.Left, positionRelative);
                    }
                    if (InputP.MousePressed(InputP.Mouses.Right)) o.OnMouse(InputP.Mouses.Right, positionRelative);
                    if (InputP.MousePressed(InputP.Mouses.Middle)) o.OnMouse(InputP.Mouses.Middle, positionRelative);
                    if (InputP.MouseHeld(InputP.Mouses.Right))
                    {
                        o.Rotation -= o.Angle * 0.1f;
                        o.Angle *= 0.8f;
                    }
                }
                if (InputP.MouseReleased(InputP.Mouses.Left))
                {
                    o.OnRelease(InputP.Mouses.Left);
                    o.HeldPosition = null;
                }
                if (InputP.MouseReleased(InputP.Mouses.Right)) o.OnRelease(InputP.Mouses.Right);
                if (InputP.MouseReleased(InputP.Mouses.Middle)) o.OnRelease(InputP.Mouses.Middle);
                if (o.HeldPosition != null)
                {
                    var point = MathP.Rotate((Vector2)o.HeldPosition, o.Angle);
                    o.OnDrag(point, (InputP.MousePosition - point - o.Position) * (float)gameTime.ElapsedGameTime.TotalSeconds);
                    // o.Speed = (InputP.MousePosition - point - o.Position) * (float)gameTime.ElapsedGameTime.TotalSeconds / 0.01f;
                }
            }
            Audio.Update();
            WindowTracker.Update((float)gameTime.ElapsedGameTime.TotalSeconds);
            ModelHandler.Time += (float)gameTime.ElapsedGameTime.TotalSeconds;
            base.Update(gameTime);
        }
        protected override void UnloadContent()
        {
            Audio.Unload();
            WebSocket.Send("main", "modeloff");
            base.UnloadContent();
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
            WebSocket.Send("main", "log", txt);
        }

        public static string ResolvePath(params string[] path)
        {
            var fullPath = new List<string> { Directory.GetCurrentDirectory(), "../../../" };
            fullPath.AddRange(path); return Path.Combine(fullPath.ToArray());
        }
    }
}