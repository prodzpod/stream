using FMOD;
using FmodForFoxes;
using System.Collections.Generic;
using System.Linq;

namespace ProdModel.Object.Audio
{
    public class Audio
    {
        public static Dictionary<string, FmodForFoxes.Sound> Cache = new();
        public static List<string> SoundsPlayedThisFrame = new();
        public static FmodForFoxes.Sound Play(string path, string _pathoverride = "") => Play(path, false, 1, 1, _pathoverride);
        public static FmodForFoxes.Sound Play(string path, float pitch, string _pathoverride = "") => Play(path, false, pitch, 1, _pathoverride);
        public static FmodForFoxes.Sound Play(string path, float pitch, float volume, string _pathoverride = "") => Play(path, false, volume, pitch, _pathoverride);
        public static FmodForFoxes.Sound Play(string path, bool loop, float pitch = 1, float volume = 1, string _pathoverride = "")
        {
            if (path.StartsWith("Content/")) path = path["Content/".Length..];
            if (path.StartsWith("Content")) path = path["Content".Length..];
            if (!path.Contains('.')) path += ".ogg";
            string ppath = pitch.ToString() + path;
            if (!string.IsNullOrWhiteSpace(_pathoverride)) ppath = _pathoverride;
            if (!Cache.ContainsKey(ppath)) Cache[ppath] = LoadStreamedSound(path);
            if (SoundsPlayedThisFrame.Contains(ppath)) return Cache[ppath];
            Cache[ppath].Looping = loop;
            Cache[ppath].Volume = volume;
            Cache[ppath].Pitch = pitch;
            Cache[ppath].Play();
            SoundsPlayedThisFrame.Add(ppath);
            return Cache[ppath];
        }
        public static void Stop(string path, float pitch = 1)
        {
            if (path.StartsWith("Content/")) path = path["Content/".Length..];
            if (path.StartsWith("Content")) path = path["Content".Length..];
            if (!path.Contains('.')) path += ".ogg";
            _Stop(pitch.ToString() + path);
        }
        public static void _Stop(string ppath)
        {
            if (Cache.TryGetValue(ppath, out FmodForFoxes.Sound sound))
            {
                sound.Dispose();
                Cache.Remove(ppath);
            }
        }
        public static void Stop(FmodForFoxes.Sound sound)
        {
            if (!Cache.ContainsValue(sound)) return;
            var key = Cache.First(x => x.Value == sound).Key;
            Cache.Remove(key);
            sound.Dispose();
        }

        public const string OUTPUT_NAME = "INPUT: recording";
        public static void Init()
        {
            FmodManager.Init(ProdModel.Instance._nativeLibrary, FmodInitMode.Core, "Content", preInitAction: () =>
            {
                CoreSystem.Native.getNumDrivers(out int numDrivers);
                for (int i = 0; i < numDrivers; i++)
                {
                    CoreSystem.Native.getDriverInfo(i, out string name, 64, out _, out _, out _, out _);
                    if (name.Contains(OUTPUT_NAME))
                    {
                        CoreSystem.Native.setDriver(i);
                        break;
                    }
                }
            });
            System.Diagnostics.Debug.WriteLine("Audio Module Loaded");
            CoreSystem.Native.getOutput(out OUTPUTTYPE type);
            System.Diagnostics.Debug.WriteLine("Output Type: " + type);
            CoreSystem.Native.getDriver(out int driver);
            System.Diagnostics.Debug.WriteLine("Output Index: " + driver);
        }

        public static void Update()
        {
            FmodManager.Update();
            SoundsPlayedThisFrame.Clear();
        }

        public static void Unload()
        {
            FmodManager.Unload();
            System.Diagnostics.Debug.WriteLine("Audio Module Unloaded");
        }

        public static FmodForFoxes.Sound LoadStreamedSound(string path)
        {
            return CoreSystem.LoadStreamedSound(path);
        }
    }
}
