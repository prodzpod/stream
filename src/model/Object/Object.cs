#nullable enable
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;
using NotGMS.Util;
using ProdModel.Gizmo;
using ProdModel.Object.Sprite;
using ProdModel.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.WebSockets;

namespace ProdModel.Object
{
    public class Object
    {
        public static List<Object> OBJECTS = new();
        public static int ID = 0;

        // ws
        public string Name = "";    
        public WebSocketP? WebSocket = null;
        public Dictionary<string, string> LastWSSent;
        public float LastWSSend = 0;
        public bool WSSendForce = true;
        public bool Destroyed = false;
        public Dictionary<string, object> Extra = new();

        // physics
        public bool EnablePhysics = false;

        public Vector2 Position = new();
        public float Angle = 0;

        public Vector2 Speed = Vector2.Zero;
        public float Rotation = 0;
        public Vector2 Gravity = new(0, 1f);
        public float Drag = 0; // speed is multiplied to this at the end

        public Vector2? HeldPosition = null;
        public float Bounce = 0.9f;
        public float Slide = 0.95f;
        public float Rotatability = 0.02f;

        // drawing
        public List<Drawable> Children = new();
        public float Depth = 0;
        public Vector2 BoundingBoxSize = new(-1, -1);
        public string State = "DEFAULT";
        public float Lifetime = 0;
        public float Statetime = 0;
        public Vector2 FlipDependence = Vector2.One; // flip global position based on flip

        public Object(string name) { Name = name; OnInit(); }
        public Object AddChild(ISprite Sprite) => AddChild(Sprite, new Vector4(0, 0, -1, -1));
        public Object AddChild(ISprite Sprite, float x, float y) => AddChild(Sprite, new Vector4(x, y, -1, -1));
        public Object AddChild(ISprite Sprite, Vector2 Position) => AddChild(Sprite, new Vector4(Position.X, Position.Y, -1, -1));
        public Object AddChild(ISprite Sprite, float x, float y, float z, float w) => AddChild(Sprite, new Vector4(x, y, z, w));
        public Object AddChild(ISprite Sprite, Vector4 BoundingBox)
        {
            Children.Add(new(this, Sprite, BoundingBox));
            return this;
        }
        public Object SetBoundingBoxes(int index) => SetBoundingBoxes(index, Vector2.Zero);
        public Object SetBoundingBoxes(int index, float x, float y) => SetBoundingBoxes(index, new(x, y));
        public Object SetBoundingBoxes(int index, Vector2 offset) { BoundingBoxSize = Children[index].Sprite.GetBoundingBox() + offset; return this; }
        public Object SetBoundingBoxes(float x, float y) => SetBoundingBoxes(new Vector2(x, y));
        public Object SetBoundingBoxes(Vector2 value) { if (value.X != -1) BoundingBoxSize.X = value.X; if (value.Y != -1) BoundingBoxSize.Y = value.Y; return this; }
        public Object SetPosition(float x, float y) => SetPosition(new(x, y));
        public Object SetPosition(Vector2 position)
        {
            Position = new Vector2(960, 540) + new Vector2(MathF.Sign(position.X) * (960 - MathF.Abs(position.X) - (BoundingBoxSize.X / 2)), MathF.Sign(position.Y) * (540 - MathF.Abs(position.Y) - (BoundingBoxSize.Y / 2)));
            return this;
        }
        public Object MakeTopdown() { Gravity = Vector2.Zero; Drag = 0.01f; return this; }
        public Object Physics() { EnablePhysics = true; Speed = Vector2.Zero; Rotation = 0; return this; }
        public Object Listen() { LastWSSent = new(); WebSocket = new("ws://localhost:449", ws => { ws.Send("449", "register", Name); }, OnWSRecieve); return this; }
        public Object SetDepth(float depth) { Depth = depth; return this; }

        public Vector2[] GetCorners()
        {
            Vector2[] corners = new Vector2[4];
            corners[0] = new(Position.X - (BoundingBoxSize.X / 2), Position.Y - (BoundingBoxSize.Y / 2));
            corners[1] = new(Position.X + (BoundingBoxSize.X / 2), Position.Y - (BoundingBoxSize.Y / 2));
            corners[2] = new(Position.X + (BoundingBoxSize.X / 2), Position.Y + (BoundingBoxSize.Y / 2));
            corners[3] = new(Position.X - (BoundingBoxSize.X / 2), Position.Y + (BoundingBoxSize.Y / 2));
            return corners.Select(x => MathP.Rotate(x, Position, Angle)).ToArray();
        }
        public Vector2[][] GetEdges()
        {
            Vector2[] corners = GetCorners();
            Vector2[][] edges = new Vector2[4][];
            for (var i = 0; i < corners.Length; i++) edges[i] = new Vector2[] { corners[i], corners[(i + 1) % corners.Length] };
            return edges;
        }

        public event Action onInit;
        public virtual void OnInit()
        {
            OBJECTS.Add(this);
            onInit?.Invoke();
        }

        public event Action<Object> onDestroy;
        public virtual void OnDestroy()
        {
            OBJECTS.Remove(this);
            WebSocket = null; 
            onDestroy?.Invoke(this);
            Destroyed = true;
            Server.Sync(false);
        }

        public event Action<Object, GameTime> onUpdate;
        public event Action<Object, Vector2> onBounce;
        public virtual void OnUpdate(GameTime gameTime)
        {
            Lifetime += (float)gameTime.ElapsedGameTime.TotalSeconds;
            Statetime += (float)gameTime.ElapsedGameTime.TotalSeconds;
            if (EnablePhysics)
            {
                Position += Speed;
                Angle += Rotation;
                Angle %= 360;
                var lrtb = new Vector4(BoundingBoxSize.X, ProdModel.SCREEN_WIDTH * 2 - BoundingBoxSize.X, BoundingBoxSize.Y, ProdModel.SCREEN_HEIGHT * 2 - BoundingBoxSize.Y) / 2;
                if (Position.X < lrtb.X) { Position.X = lrtb.X; Speed.X = Math.Abs(Speed.X) * Bounce; Speed.Y *= Slide; Rotation *= Slide; onBounce?.Invoke(this, new(-1, 0)); }
                if (Position.X > lrtb.Y) { Position.X = lrtb.Y; Speed.X = -Math.Abs(Speed.X) * Bounce; Speed.Y *= Slide; Rotation *= Slide; onBounce?.Invoke(this, new(1, 0)); }
                if (Position.Y < lrtb.Z) { Position.Y = lrtb.Z; Speed.Y = Math.Abs(Speed.Y) * Bounce; Speed.X *= Slide; Rotation *= Slide; onBounce?.Invoke(this, new(0, -1)); }
                if (Position.Y > lrtb.W) { Position.Y = lrtb.W; Speed.Y = -Math.Abs(Speed.Y) * Bounce; Speed.X *= Slide; Rotation *= Slide; onBounce?.Invoke(this, new(0, 1)); }
                Speed *= Drag * -1 + 1;
                Speed += Gravity;
            }
            if (WebSocket != null && Lifetime - LastWSSend > 0.1f) {
                _txt = "";
                AddWSData("x", Position.X, trunc);
                AddWSData("y", Position.Y, trunc);
                AddWSData("w", BoundingBoxSize.X, trunc);
                AddWSData("h", BoundingBoxSize.Y, trunc);
                AddWSData("a", Angle, writeAngle);
                onWSSend?.Invoke(this);
                if (_txt != "")
                {
                    AddWSData("name", Name, true);
                    // Debug.WriteLine("Sending: " +  _txt);
                    WebSocket.Send("449", "update", _txt);
                }
                LastWSSend = Lifetime;
                WSSendForce = false;
            }
            onUpdate?.Invoke(this, gameTime);
            if (MathP.Between(-1 / 256f, Rotation, 1 / 256f)) Rotation = 0;
        }
        public event Action<Object> onWSSend;
        private string _txt = "";
        public static string trunc(object x) => ((int)(float)x).ToString() ?? ""; // this is stupid lmfao
        public static string writeAngle(object x) => ((int)((float)x * 256f) / 256f).ToString() ?? "";
        public void AddWSData(string k, object v, bool force = false) => AddWSData(k, v, _v => _v?.ToString() ?? "", force);
        public void AddWSData(string k, object _v, Func<object, string> fn, bool force = false)
        {
            bool isnew = false;
            string v = fn(_v);
            if (!LastWSSent.ContainsKey(k)) { isnew = true; LastWSSent.Add(k, v); }
            if (!force && !WSSendForce && !isnew && LastWSSent[k] == v) return; // data sent already
            if (!string.IsNullOrWhiteSpace(_txt)) _txt += "&"; _txt += k + "=" + v;
            LastWSSent[k] = v;
        }

        public event Action<Object, string> onWSRecieve;
        public void OnWSRecieve(string str)
        {
            str = str.Trim();
            if (str == "delete") OnDestroy();
            else if (str.StartsWith("addMoment")) {
                var fs = str.Split(" ").Skip(1).Select(float.Parse).ToArray();
                AddMoment(new Vector2(fs[0], fs[1]) - Position, new Vector2(fs[2], fs[3]));
            }
            else if (str == "click") {
                var fs = str.Split(" ").Skip(1).Select(float.Parse).ToArray();
                OnMouse(InputP.Mouses.Left, new Vector2(fs[0], fs[1]) - Position);
            }
            onWSRecieve?.Invoke(this, str);
        }

        public void SetState(string state)
        {
            OnState(state);
            State = state;
            Statetime = 0;
        }
        public event Action<Object, string> onState;
        public virtual void OnState(string state)
        {
            onState?.Invoke(this, state);
        }

        public event Action<Object, GameTime> onDraw;
        public virtual void OnDraw(GameTime gameTime)
        {
            Children.ForEach(x => x.Render(Position, Angle));
            onDraw?.Invoke(this, gameTime);
        }

        public event Action<Object, Keys> onKey;
        public virtual bool OnKey(Keys key)
        {
            onKey?.Invoke(this, key);
            return onKey != null;
        }

        public event Action<Object, Keys> onKeyDown;
        public virtual bool OnKeyDown(Keys key)
        {
            onKeyDown?.Invoke(this, key);
            return onKeyDown != null;
        }

        public event Action<Object, Keys> onKeyUp;
        public virtual bool OnKeyUp(Keys key)
        {
            onKeyUp?.Invoke(this, key);
            return onKeyUp != null;
        }

        public event Action<Object, InputP.Mouses, Vector2> onMouse;
        public virtual bool OnMouse(InputP.Mouses button, Vector2 position)
        {
            if (button == InputP.Mouses.Left) Audio.Audio.Play("audio/click_me");
            if (!Name.StartsWith("_") && button == InputP.Mouses.Middle) OnDestroy();
            onMouse?.Invoke(this, button, position);
            return onMouse != null;
        }
        public event Action<Object, Vector2, Vector2> onDrag;
        public virtual bool OnDrag(Vector2 position, Vector2 drag)
        {
            if (EnablePhysics) AddMoment(position, drag);
            onDrag?.Invoke(this, position, drag);
            return onDrag != null;
        }
        public event Action<Object, InputP.Mouses> onRelease;
        public virtual bool OnRelease(InputP.Mouses button)
        {
            onRelease?.Invoke(this, button);
            return onRelease != null;
        }

        public event Action<Object, Vector2> onHover;
        public virtual bool OnHover(Vector2 position)
        {
            onHover?.Invoke(this, position);
            return onHover != null;
        }

        public virtual void SetFlip(Vector2 flip)
        {
            // TODO: manage flips
        }

        public struct Drawable
        {
            public ISprite Sprite;
            public Object Parent;
            public Vector4 BoundingBox; // fix center, -1 w/h (adaptive)
            public float Angle = 0;
            public Vector2 FlipDependence = Vector2.One; // flip delta position based on flip

            public Drawable(Object Parent, ISprite Sprite, Vector4 BoundingBox) { this.Parent = Parent; this.Sprite = Sprite; this.BoundingBox = BoundingBox; }

            public Vector4 GetBoundingBox()
            {
                Vector4 size = BoundingBox;
                if (size.Z == -1) size.Z = Parent.BoundingBoxSize.X;
                if (size.W == -1) size.W = Parent.BoundingBoxSize.Y;
                return size;
            }

            public void Render(Vector2 position, float angle)
            {
                var bbox = GetBoundingBox();
                var pos = MathP.Rotate(position.X + bbox.X, position.Y + bbox.Y, position.X, position.Y, angle);
                Sprite.Render(new(pos.X, pos.Y, bbox.Z, bbox.W), angle + Angle);
            }
        }

        public event Action<Object, string> onData;
        public void HandleObject(string data)
        {
            onData?.Invoke(this, data);
        }

        public void AddMoment(Vector2 position, Vector2 force)
        {
            Speed = MathP.Lerp(Speed, force, 1 - Drag) * 10;
            var dist = Vector2.Distance(force, Vector2.Zero);
            if (dist == 0) return;
            Vector2 positionRA = new(Vector2.Distance(position, Vector2.Zero), MathP.Atan2(position.X, position.Y));
            Vector2 pSpeed = Speed + MathP.Rotate(position, Rotation) - position;
            Vector2 pSpeedRA = new(Vector2.Distance(pSpeed, Vector2.Zero), MathP.Atan2(pSpeed.X, pSpeed.Y));
            float adiff = MathP.AngleBetween(pSpeedRA.Y + 180, positionRA.Y);
            // TODO: compare speed and force, if speed >> force pointer at back, if force >> speed pointer in front
            Rotation = MathP.Lerp(Rotation * -1f, adiff * (positionRA.X / Vector2.Distance(BoundingBoxSize, Vector2.Zero)) * (1 + MathF.Log10(pSpeedRA.X + 1)), 0.1f);
            // MathP.Lerp(1f, pra.X * sra.X * Drag, Rotatability)
        }
    }
}
