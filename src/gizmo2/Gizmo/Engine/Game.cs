using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Raylib_CSharp;
using Raylib_CSharp.Windowing;
using System.Numerics;

namespace Gizmo.Engine
{
    public abstract class Game : IDisposable
    {
        public static Room? _room = null;
        public static Room? Room
        {
            get => _room;
            set
            {
                if (_room == value) return;
                Room.SetRoom(value);
                _room = value;
            }
        }
        public static List<Instance> _INSTANCES = [];
        public static List<Instance> _DRAW_ORDER = [];
        public static Instance[] INSTANCES = [];
        public static Instance[] DRAW_ORDER = [];
        public static Dictionary<KeyValuePair<Instance, Instance>, bool> COLLISION = [];
        public static Dictionary<string, object> Global = [];
        public static List<Shader> SHADERS = [];
        public static float Time = 0;
        public static float deltaTime;
        public virtual string WorkingDirectory => ".";
        public abstract string InitialRoom { get; }
        private static Vector2 _resolution = Vector2.Zero;
        public static Vector2 Resolution
        {
            get => _resolution;
            set
            {
                var v = MetaP.SetResolution(value);
                if (_resolution == v) return; _resolution = v;
            }
        }
        private static ConfigFlags _windowFlag = 0;
        public static ConfigFlags WindowFlag {
            get => _windowFlag;
            set {
                if (_windowFlag == value) return;
                Logger.Log("Window Flags Set:", value);
                Raylib.SetConfigFlags(value);
                _windowFlag = value;
            }
        }
        private static string _title = "NotGMS";
        public static string Title {
            get => _title;
            set {
                if (value == _title) return;
                Window.SetTitle(value);
                _title = value;
            }
        }
        public Game()
        {
            NotGMS.WorkingDirectory = FileP.ToAbsolute(WorkingDirectory);
            NotGMS.Init(this);
        }
        public abstract void Init();
        public virtual void PostInit() { }
        public virtual void OnResource(Type type, string key) { }
        public virtual void ResourceLoaded() { }
        public virtual void PreUpdate(float deltaTime) { }
        public abstract void Update(float deltaTime);
        public virtual void PostUpdate(float deltaTime) { }
        public static void _Update(float deltaTime) { foreach (var i in INSTANCES) i.OnUpdate(deltaTime); }
        public abstract void Draw(float deltaTime);
        public static void _Draw(float deltaTime) { foreach (var i in DRAW_ORDER) i?.OnDraw(deltaTime); }
        public virtual void PostDraw(float deltaTime) { }
        public static void RefreshDraw(Instance self)
        {
            _DRAW_ORDER.Remove(self);
            for (int i = 0; i < _DRAW_ORDER.Count; i++) if (_DRAW_ORDER[i] != null && i < _DRAW_ORDER.Count && _DRAW_ORDER[i].Depth > self.Depth)
            {
                _DRAW_ORDER.Insert(i, self);
                return;
            }
            _DRAW_ORDER.Add(self);
        }
        public virtual void Dispose()
        {
            NotGMS.Dispose();
            GC.SuppressFinalize(this);
        }
    }
    public interface Transparent { }
    public interface Overlay { }
}
