using Gizmo.StreamOverlay;
using PInvoke;
using System.Numerics;

namespace ProdModel.Object
{
    public static class WindowTracker
    {
        public static float Lifetime = 0;
        public static float LastSyncTime = 0;
        public static Dictionary<int, WindowTransform> LastSync = [];
        public static int PRIMARY_MONITOR;
        public static int LEFT_MONITOR; 
        public static void Init()
        {
            PRIMARY_MONITOR = (int)User32.MonitorFromPoint(new POINT { x = 960, y = 540 }, User32.MonitorOptions.MONITOR_DEFAULTTOPRIMARY);
            LEFT_MONITOR = (int)User32.MonitorFromPoint(new POINT { x = -960, y = 540 }, User32.MonitorOptions.MONITOR_DEFAULTTOPRIMARY);
        }
        public static void Update(float time)
        {
            Lifetime += time;
            if (Lifetime - LastSyncTime > 1f)
            {
                // ProdModel.Log("Syncing Windows");
                // get window handles
                List<IntPtr> handles = [];
                IntPtr shellWindow = User32.GetShellWindow();
                User32.EnumWindows(delegate (IntPtr hWnd, IntPtr lParam)
                {
                    if (hWnd == shellWindow) return true;
                    if (!User32.IsWindowVisible(hWnd)) return true;

                    int length = User32.GetWindowTextLength(hWnd);
                    if (length == 0) return true;
                    handles.Add(hWnd);
                    return true;
                }, 0);
                // get the rest of the data
                List<WindowTransform> windows = handles.Select(x => new WindowTransform() { ID = x }).ToList();
                for (int i = 0; i < windows.Count; i++)
                {
                    var w = windows[i];
                    if (!User32.IsWindow(w.ID)) continue;
                    w.Name = User32.GetWindowText(w.ID);
                    User32.GetWindowRect(w.ID, out RECT rect);
                    w.Position = new(rect.left, rect.top);
                    w.Size = new(rect.right - rect.left, rect.bottom - rect.top);
                    var Monitor = (int)User32.MonitorFromWindow((int)w.ID, User32.MonitorOptions.MONITOR_DEFAULTTOPRIMARY);
                    if (Monitor == LEFT_MONITOR) w.Position.X -= 1920;
                    w.Order = i;
                    windows[i] = w;
                }
                // go diff style
                checked
                {
                    List<int> IDsToDestroy = LastSync.Keys.Where(x => !windows.Any(y => (int)y.ID == x)).ToList();
                    List<string> updates = [];
                    foreach (var window in windows)
                    {
                        int id = (int)window.ID;
                        if (!LastSync.ContainsKey(id)) // new
                            updates.Add(WASD.Pack("id:" + id, "name:" + window.Name, "x:" + window.Position.X, "y:" + window.Position.Y, "w:" + window.Size.X, "h:" + window.Size.Y, "i:" + window.Order));
                        else // update?
                        {
                            List<string> txt = new() { "id:" + id };
                            if (window.Name != LastSync[id].Name) txt.Add("name:" + window.Name);
                            if (window.Position.X != LastSync[id].Position.X) txt.Add("x:" + window.Position.X);
                            if (window.Position.Y != LastSync[id].Position.Y) txt.Add("y:" + window.Position.Y);
                            if (window.Size.X != LastSync[id].Size.X) txt.Add("w:" + window.Size.X);
                            if (window.Size.Y != LastSync[id].Size.Y) txt.Add("h:" + window.Size.Y);
                            if (window.Order != LastSync[id].Order) txt.Add("i:" + window.Order);
                            if (txt.Count > 1) updates.Add(WASD.Pack(txt.ToArray()));
                        }
                        // if (updates.Count > 0) ProdModel.Log(updates.Count + ": " + window.Name + " / " + updates[^1]);
                    }
                    if (updates.Count > 0 || IDsToDestroy.Count > 0) StreamWebSocket.Send("windows", WASD.Pack(updates.ToArray()), WASD.Pack(IDsToDestroy.Select(x => x.ToString()).ToArray()));
                }
                // update
                LastSync.Clear();
                checked { foreach (var w in windows) LastSync.Add((int)w.ID, w); }
                LastSyncTime = Lifetime;
            }
        }
        public struct WindowTransform
        {
            public IntPtr ID;
            public string Name;
            public Vector2 Position;
            public Vector2 Size;
            public int Order;
        }
    }
}
