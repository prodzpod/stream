#nullable enable
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;
using ProdModel.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Object
{
    public class Object
    {
        public static List<Object> OBJECTS = new();

        // ws
        public string Name = "";
        public WebSocketP? WebSocket = null;
        public float LastWSSend = 0;
        public bool Destroyed = false;

        // physics
        public bool EnablePhysics = false;

        public Vector2 Position = new();
        public float Angle = 0;

        public Vector2 Speed = Vector2.Zero;
        public float Rotation = 0;
        public Vector2 Gravity = new(0, 0.2f);
        public float Drag = 0; // speed is multiplied to this at the end

        public Vector2? HeldPosition = null;
        public float Bounce = 0.7f;
        public float Slide = 0.99f;
        public float Rotatability = 0.02f;

        // drawing
        public List<Drawable> Children = new();
        public float Depth = 0;
        public Vector2 BoundingBoxSize = new(-1, -1);
        public string State = "DEFAULT";
        public float Lifetime = 0;
        public Vector2 FlipDependence = Vector2.One; // flip global position based on flip

        public Object(string name) { Name = name; }
        public Object AddChild(ISprite Sprite) => AddChild(Sprite, new Vector4(0, 0, -1, -1));
        public Object AddChild(ISprite Sprite, float x, float y) => AddChild(Sprite, new Vector4(x, y, -1, -1));
        public Object AddChild(ISprite Sprite, Vector2 Position) => AddChild(Sprite, new Vector4(Position.X, Position.Y, -1, -1));
        public Object AddChild(ISprite Sprite, float x, float y, float z, float w) => AddChild(Sprite, new Vector4(x, y, z, w));
        public Object AddChild(ISprite Sprite, Vector4 BoundingBox)
        {
            Children.Add(new(this, Sprite, BoundingBox));
            OnInit();
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
        public Object MakeTopdown() { Gravity = Vector2.Zero; Drag = 0.2f; return this; }
        public Object Physics() { EnablePhysics = true; Speed = Vector2.Zero; Rotation = 0; return this; }
        public Object Listen() { WebSocket = new("ws://localhost:449", ws => { ws.Send("449", "register " + Name); }, OnWSRecieve); return this; }
        public Object SetDepth(float depth) { Depth = depth; return this;}

        public Vector2[] GetCorners()
        {
            Vector2[] corners = new Vector2[4];
            corners[0] = new(Position.X - (BoundingBoxSize.X / 2), Position.Y - (BoundingBoxSize.Y / 2));
            corners[1] = new(Position.X + (BoundingBoxSize.X / 2), Position.Y - (BoundingBoxSize.Y / 2));
            corners[2] = new(Position.X + (BoundingBoxSize.X / 2), Position.Y + (BoundingBoxSize.Y / 2));
            corners[3] = new(Position.X - (BoundingBoxSize.X / 2), Position.Y + (BoundingBoxSize.Y / 2));
            return corners.Select(x => MathP.RotateAround(x, Position, Angle)).ToArray();
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

        public event Action onDestroy;
        public virtual void OnDestroy()
        {
            OBJECTS.Remove(this);
            onDestroy?.Invoke();
            WebSocket?.WebSocket.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, null, System.Threading.CancellationToken.None);
            Destroyed = true;
        }

        public event Action<Object, GameTime> onUpdate;
        public virtual void OnUpdate(GameTime gameTime)
        {
            Lifetime += (float)gameTime.ElapsedGameTime.TotalSeconds;
            if (EnablePhysics)
            {
                AddMoment(Vector2.Zero, Gravity);
                Position += Speed;
                Angle += Rotation / 180 * (float)Math.PI;
                var lrtb = new Vector4(BoundingBoxSize.X, 1920 * 2 - BoundingBoxSize.X, BoundingBoxSize.Y, 1080 * 2 - BoundingBoxSize.Y) / 2;
                if (Position.X < lrtb.X) { Position.X = lrtb.X; Speed.X = Math.Abs(Speed.X) * Bounce; Speed.Y *= Slide; }
                if (Position.X > lrtb.Y) { Position.X = lrtb.Y; Speed.X = -Math.Abs(Speed.X) * Bounce; Speed.Y *= Slide; }
                if (Position.Y < lrtb.Z) { Position.Y = lrtb.Z; Speed.Y = Math.Abs(Speed.Y) * Bounce; Speed.X *= Slide; }
                if (Position.Y > lrtb.W) { Position.Y = lrtb.W; Speed.Y = -Math.Abs(Speed.Y) * Bounce; Speed.X *= Slide; }
                Speed *= Drag * -1 + 1;
            }
            if (WebSocket != null && Lifetime - LastWSSend > 0.1f) {

                _txt = "";
                AddWSData("name", Name);
                AddWSData("x", Position.X);
                AddWSData("y", Position.Y);
                AddWSData("w", BoundingBoxSize.X);
                AddWSData("h", BoundingBoxSize.Y);
                AddWSData("a", Angle);
                if (onWSSend != null) onWSSend(this);
                WebSocket.Send("449", "update " + _txt);
                LastWSSend = Lifetime;
            }
            onUpdate?.Invoke(this, gameTime);
        }
        public event Action<Object> onWSSend;
        private string _txt = "";
        public void AddWSData(string k, object v) { if (!string.IsNullOrWhiteSpace(_txt)) _txt += "&"; _txt += k + "=" + v.ToString(); }

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
            if (onWSRecieve != null) onWSRecieve(this, str);
        }

        public void SetState(string state)
        {
            State = state;
            OnState(state);
        }
        public event Action<Object, string> onState;
        public virtual void OnState(string state)
        {
            onState?.Invoke(this, state);
        }

        public event Action<Object, GameTime> onDraw;
        public virtual void OnDraw(GameTime gameTime)
        {
            Children.ForEach(x => x.Render(Position, Angle, Depth));
            onDraw?.Invoke(this, gameTime);
        }

        public event Action<Object, Keys> onKey;
        public virtual void OnKey(Keys key)
        {
            onKey?.Invoke(this, key);
        }

        public event Action<Object, InputP.Mouses, Vector2> onMouse;
        public virtual void OnMouse(InputP.Mouses button, Vector2 position)
        {
            if (Name != "bg" && button == InputP.Mouses.Middle) OnDestroy();
            onMouse?.Invoke(this, button, position);
        }
        public event Action<Object, Vector2, Vector2> onDrag;
        public virtual void OnDrag(Vector2 position, Vector2 drag)
        {
            // TODO: if drag, apply physics
            if (EnablePhysics) AddMoment(position, drag);
            onDrag?.Invoke(this, position, drag);
        }
        public event Action<Object, InputP.Mouses> onRelease;
        public virtual void OnRelease(InputP.Mouses button)
        {
            onRelease?.Invoke(this, button);
        }

        public event Action<Object, Vector2> onHover;
        public virtual void OnHover(Vector2 position)
        {
            onHover?.Invoke(this, position);
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
            public Vector2 Speed = Vector2.Zero;
            public float Rotation = 0;
            public Vector2 FlipDependence = Vector2.One; // flip delta position based on flip

            public Drawable(Object Parent, ISprite Sprite, Vector4 BoundingBox) { this.Parent = Parent; this.Sprite = Sprite; this.BoundingBox = BoundingBox; }

            public Vector4 GetBoundingBox()
            {
                Vector4 size = BoundingBox;
                if (size.Z == -1) size.Z = Parent.BoundingBoxSize.X;
                if (size.W == -1) size.W = Parent.BoundingBoxSize.Y;
                return size;
            }

            public void Render(Vector2 position, float angle, float depth)
            {
                var bbox = GetBoundingBox();
                Sprite.Render(new(position.X + bbox.X, position.Y + bbox.Y, bbox.Z, bbox.W), angle + Angle, depth);
            }
        }

        public event Action<Object, string> onData;
        public void HandleObject(string data)
        {
            onData?.Invoke(this, data);
        }

        public void AddMoment(Vector2 position, Vector2 force)
        {
            Speed += force;
            var dist = Vector2.Distance(force, Vector2.Zero);
            if (dist == 0) return;
            Rotation = Math.Clamp(MathP.Cross(force, position) * Rotatability / dist, -90, 90);
        }
    }
}
