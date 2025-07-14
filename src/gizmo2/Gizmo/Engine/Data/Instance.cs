using Gizmo.Engine.Builtin;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.Engine.Data
{
    public class Instance(Element element, Vector2 position)
    {
        public static int IDMax = 0;
        public int ID = IDMax++;
        public Element Element = element;
        public float Life = 0;
        public Dictionary<string, object> Var = [];
        public void Set(string key, object value) => Var[key] = value;
        public T? Get<T>(string key) => Var.TryGetValue(key, out object? value) ? (T)value : default;
        // Basic Draw Stuff
        public IDrawable? Sprite = null;
        public float Frame = 0;
        public float Playback = 1;
        public Vector2 Position = position;
        public Vector2 _Position = position;
        public float Angle = 0;
        public float _Angle = 0;
        public Vector2 Scale = Vector2.One;
        public ColorP Blend = ColorP.WHITE;
        public float Alpha = 1;
        public float _depth = 0;
        public float Depth
        {
            get => _depth;
            set
            {
                _depth = value;
                Game.RefreshDraw(this);
            }
        }
        // Physics
        public Vector2 Speed = Vector2.Zero;
        public float Rotation = 0;
        public float Mass = 1;
        public Vector2 Gravity = Vector2.Zero;
        public float Bounciness = 0;
        public float Friction = 0;
        public float Drag = 1;
        public IHitbox? Hitbox = null;
        public Element[] InteractsWith = [];
        // Events
        public Instance self;
        public bool Destroyed = false;
        private bool _init = false;
        public event Func<bool>? onInit = null;
        public void OnInit()
        {
            var pass = true;
            if (onInit != null) pass = onInit();
            if (!pass) return;
            self.Element.OnInit(ref self);
        }
        public event Func<bool>? onPostInit = null;
        public void OnPostInit()
        {
            var pass = true;
            if (onPostInit != null) pass = onPostInit();
            if (!pass) return;
            self.Element.OnPostInit(ref self);
        }
        public event Func<bool>? onDestroy = null;
        public void OnDestroy()
        {
            var pass = true;
            if (onDestroy != null) pass = onDestroy();
            if (!pass) return;
            self.Element.OnDestroy(ref self);
        }
        public event Func<float, bool>? onUpdate = null;
        public void OnUpdate(float deltaTime)
        {
            if (!_init) { OnPostInit(); _init = true; }
            var pass = true;
            if (onUpdate != null) pass = onUpdate(deltaTime);
            if (!pass) return;
            self.Element.OnUpdate(ref self, deltaTime);
        }
        public event Func<float, bool>? onDraw = null;
        public void OnDraw(float deltaTime)
        {
            var pass = true;
            if (onDraw != null) pass = onDraw(deltaTime);
            if (!pass) return;
            self.Element.OnDraw(ref self, deltaTime);
        }
        public event Func<object[], bool>? onEvent = null;
        public void OnEvent(params object[] param)
        {
            var pass = true;
            if (onEvent != null) pass = onEvent(param);
            if (!pass) return;
            self.Element.OnEvent(ref self, param);
        }
        public event Func<Instance, bool>? onCollide = null;
        public void OnCollide(Instance other)
        {
            var pass = true;
            if (onCollide != null) pass = onCollide(other);
            if (!pass) return;
            self.Element.OnCollide(ref self, other);
        }
        public Instance(string key) : this(key, Vector2.Zero) { }
        public Instance(Element element) : this(element, Vector2.Zero) { }
        public Instance(string key, Vector2 position) : this(Resource.Elements[key], position) { }
        public Instance(Instance from) : this(from.Element, from.Position)
        {
            foreach (var k in from.Var.Keys) Var.Add(k, from.Var[k]);
            Sprite = from.Sprite;
            Frame = from.Frame;
            Playback = from.Playback;
            Angle = from.Angle;
            Scale = from.Scale;
            Blend = from.Blend;
            Alpha = from.Alpha;
            _depth = from._depth;
            Speed = from.Speed;
            Rotation = from.Rotation;
            if (from.onInit != null) onInit += from.onInit;
            if (from.onDestroy != null) onDestroy += from.onDestroy;
            if (from.onUpdate != null) onUpdate += from.onUpdate;
            if (from.onDraw != null) onDraw += from.onDraw;
            if (from.onEvent != null) onEvent += from.onEvent;
            if (from.onCollide != null) onCollide += from.onCollide;
        }
        public static Instance New(string key) => New(key, Vector2.Zero);
        public static Instance New(Element element) => New(element, Vector2.Zero);
        public static Instance New(string key, Vector2 position) => New(Resource.Elements[key], position);
        public static Instance New(Element element, Vector2 position) => New(new Instance(element, position));
        public static Instance New(Instance instance)
        {
            instance.self = instance;
            Game._INSTANCES.Add(instance);
            instance.OnInit();
            Game.RefreshDraw(instance);
            return instance;
        }
        public void Destroy()
        {
            if (Destroyed) return;
            Destroyed = true;
            Game._INSTANCES.Remove(this);
            Game._DRAW_ORDER.Remove(this);
            OnDestroy();
        }
        public Vector2 GetRelativePosition(Vector2 point) => MathP.Rotate(point - Position, -Angle) / Scale;
    }
}
