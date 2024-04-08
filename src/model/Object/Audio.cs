using FMOD;
using FmodForFoxes;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace ProdModel.Object
{
    public class Audio
    {
        public static Dictionary<string, FmodForFoxes.Sound> Cache = new();
        public static List<FmodForFoxes.Sound> SoundsPlayedThisFrame = new();
        public static FmodForFoxes.Sound Play(string path, float volume = 1, float pitch = 1) => Play(path, false, volume, pitch);
        public static FmodForFoxes.Sound Play(string path, bool loop, float volume = 1, float pitch = 1)
        {
            if (path.StartsWith("Content/")) path = path["Content/".Length..];
            if (path.StartsWith("Content")) path = path["Content".Length..];
            if (!path.Contains('.')) path += ".ogg";
            if (!Cache.ContainsKey(path)) Cache[path] = LoadStreamedSound(path);
            if (SoundsPlayedThisFrame.Contains(Cache[path])) return Cache[path];
            Cache[path].Looping = loop;
            Cache[path].Volume = volume;
            Cache[path].Pitch = pitch;
            Cache[path].Play();
            SoundsPlayedThisFrame.Add(Cache[path]);
            return Cache[path];
        }

        public const string OUTPUT_NAME = "VoiceMeeter Aux Input";
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
