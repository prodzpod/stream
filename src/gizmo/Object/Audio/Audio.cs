using FMOD;
using FmodForFoxes;
using NotGMS.Util;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProdModel.Object.Audio
{
    public class Audio
    {
        public const float GLOBAL_FADE = 0.02f;
        public const float FADE_GRANULARITY = 0.005f;
        public const float GLOBAL_DELAY = 0f;
        public static List<PitchedSound> SoundsPlayedThisFrame = new();
        public static PitchedSound Play(string path, float pitch = 1, float volume = 1) => Play(path, false, pitch, volume);
        public static PitchedSound Play(string path, bool loop, float pitch = 1, float volume = 1)
        {
            if (path.StartsWith("Content/")) path = path["Content/".Length..];
            if (path.StartsWith("Content")) path = path["Content".Length..];
            if (!path.Contains('.')) path += ".ogg";
            PitchedSound k = new(path, pitch);
            if (SoundsPlayedThisFrame.TryFirst(x => x == k, out var ret)) return ret;
            k.sound = LoadStreamedSound(path);
            k.sound.Looping = loop;
            k.sound.Pitch = pitch;
            k.sound.Volume = loop ? 0 : volume;
            k.channel = k.sound.Play();
            k.channel.VolumeRamp = true;
            if (loop) Fade(k, 0, volume);
            SoundsPlayedThisFrame.Add(k);
            return k;
        }
        public static async void Stop(PitchedSound sound)
        {
            await Fade(sound, sound.channel.Volume, 0, GLOBAL_FADE);
            sound.channel.Stop();
        }
        public static async Task Fade(PitchedSound sound, float from, float to, float time = GLOBAL_FADE)
        {
            await Task.Delay((int)(GLOBAL_DELAY * 1000));
            for (float i = 0; i < time; i += FADE_GRANULARITY)
            {
                sound.channel.Volume = EaseP.OutCirc()(from, to, i / time);
                // ProdModel.Log("fade called: " + sound.channel.Volume);
                await Task.Delay((int)(FADE_GRANULARITY * 1000));
            }
            sound.channel.Volume = to;
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
            ProdModel.Log("Audio Module Loaded");
            CoreSystem.Native.getOutput(out OUTPUTTYPE type);
            ProdModel.Log("Output Type: " + type);
            CoreSystem.Native.getDriver(out int driver);
            ProdModel.Log("Output Index: " + driver);
        }

        public static void Update()
        {
            FmodManager.Update();
            SoundsPlayedThisFrame.Clear();
        }

        public static void Unload()
        {
            FmodManager.Unload();
            ProdModel.Log("Audio Module Unloaded");
        }

        public static FmodForFoxes.Sound LoadStreamedSound(string path) => CoreSystem.LoadSound(path);
        public struct PitchedSound : IEquatable<PitchedSound>
        {
            public string path;
            public float pitch;
            public FmodForFoxes.Sound sound;
            public FmodForFoxes.Channel channel;
            public PitchedSound(string path, float pitch) { this.path = path; this.pitch = pitch; }
            public bool Equals(PitchedSound other) => path == other.path && pitch == other.pitch;
            public override bool Equals(object obj) => obj is PitchedSound && Equals((PitchedSound)obj);
            public static bool operator ==(PitchedSound left, PitchedSound right) => left.Equals(right);
            public static bool operator !=(PitchedSound left, PitchedSound right) => !(left == right);
            public override int GetHashCode() => path.GetHashCode() + pitch.GetHashCode();
        }
    }
}
