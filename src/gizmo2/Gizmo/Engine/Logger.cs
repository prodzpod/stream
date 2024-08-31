using Gizmo.Engine.Data;
using Gizmo.Engine.Util;

namespace Gizmo.Engine
{
    public static class Logger
    {
        public static StreamWriter _log;
        public static event Action<int, string>? onLog = null;
        public static int LogLevel = 0;
        public static Dictionary<int, KeyValuePair<string, int>> LogColors = new()
        {
            { -999, new("ALL", -1) },
            { -2, new("VERBOSE", 237) },
            { -1, new("DEBUG", 8) },
            { 0, new("LOG", 15) },
            { 1, new("INFO", 159) },
            { 2, new("WARN", 226) },
            { 3, new("ERROR", 9) },
            { 999, new("NONE", -1) },
        };
        public static void Init() { 
            _log = new(File.Open(FileP.Path("latest.log"), FileMode.Create, FileAccess.Write, FileShare.ReadWrite));  
            var t = new System.Timers.Timer();
            t.Elapsed += (_, __) => { _log.Flush(); };
            t.Interval = 1000;
            t.Start();
        }
        public static void Log(int level, params object[] msg) 
        {
            if (level < LogLevel) return;
            var meta = LogColors.FirstOrGiven(level, new("LOG:" + level, level));
            string text = $"[{meta.Key}] {msg.Select(x => x?.ToString() ?? "").Join(" ")}"; 
            string decoratedText = $"\x1b[38;5;{meta.Value}m{text}\x1b[0m";
            onLog?.Invoke(level, text);
            Console.WriteLine(decoratedText);
            System.Diagnostics.Debug.WriteLine(text);
            _log.WriteLine(text);
        }
        public static void Error(params object[] args) => Log(3, args);
        public static void Warn(params object[] args) => Log(2, args);
        public static void Info(params object[] args) => Log(1, args);
        public static void Log(params object[] args) => Log(0, args);
        public static void Debug(params object[] args) => Log(-1, args);
        public static void Verbose(params object[] args) => Log(-2, args);
        public static void SetLogLevel(int level)
        {
            var meta = LogColors.FirstOrGiven(level, new("LOG:" + level, level));
            LogLevel = level;
            Log(level, "[LOG] Set Log Level to " + meta.Key);
        }
        public static void SetLogLevel(string level)
        {
            if (LogColors.Any(x => x.Value.Key.Equals(level, StringComparison.InvariantCultureIgnoreCase)))
                SetLogLevel(LogColors.First(x => x.Value.Key.Equals(level, StringComparison.InvariantCultureIgnoreCase)).Key);
            else Error($"[LOG] Log Level ${level} does not exist");
        }
    }
}
