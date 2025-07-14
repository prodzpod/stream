using Raylib_CSharp.Audio;
using System.Diagnostics.CodeAnalysis;

namespace Gizmo.Engine.Data
{
    public class Audio
    {
        public string Path = "[Generated]";
        public Sound Sound;
        public float Duration;
        private string group;
        public string Group {
            get { return group; } set
            {
                group = value;
                if (!SoundGroups.ContainsKey(group)) SoundGroups[group] = 1;
            }
        }
        public List<Sound> Aliases;
        public static Audio Load(string path, string group = "") => new(path, group);
        public Audio(string path, string group = "")
        {
            Path = path;
            Wave wave = Wave.Load(path);
            Duration = (float)wave.FrameCount / wave.SampleRate;
            Sound = Sound.LoadFromWave(wave);
            Group = group.ToLowerInvariant();
            Aliases = [];
            for (int i = 0; i < MetaP.DefaultAudioAliases; i++) Aliases.Add(Sound.LoadAlias(Sound));
        }

        public static float MasterVolume = 1; 
        public static Dictionary<string, float> SoundGroups = [];
        public static float GetVolume(Audio audio, float volume = 1)
        {
            if (!SoundGroups.TryGetValue(audio.Group, out float groupVolume)) groupVolume = 1;
            volume *= MasterVolume * groupVolume;
            return volume;
        }
        public static void SetVolume(float vol) => MasterVolume = vol;
        public static void SetVolume(string group, float vol)
        {
            group = group.ToLowerInvariant();
            SoundGroups[group] = vol;
        }
        public static float GetDuration(string path) => GetDuration(Resource.Audios[path]);
        public static float GetDuration(string path, float pitch) => GetDuration(Resource.Audios[path], pitch);
        public static float GetDuration(Audio audio) => audio.Duration;
        public static float GetDuration(Audio audio, float pitch) => audio.Duration * pitch;

        public static List<AudioInstance> INSTANCES = [];

        public static AudioInstance[] _INSTANCES = [];
        public static AudioInstance Play(string path) => Play(Resource.Audios[path], 1, 1, .5f);
        public static AudioInstance Play(string path, float pitch) => Play(Resource.Audios[path], pitch, 1, .5f);
        public static AudioInstance Play(string path, float pitch, float volume) => Play(Resource.Audios[path], pitch, volume, .5f);
        public static AudioInstance Play(string path, float pitch, float volume, float pan) => Play(Resource.Audios[path], pitch, volume, pan);
        public static AudioInstance Play(Audio audio) => Play(audio, 1, 1, .5f);
        public static AudioInstance Play(Audio audio, float pitch) => Play(audio, pitch, 1, .5f);
        public static AudioInstance Play(Audio audio, float pitch, float volume) => Play(audio, pitch, volume, 1);
        public static AudioInstance Play(Audio audio, float pitch, float volume, float pan)
        {
            if (INSTANCES.TryFirst(x => x.Audio == audio && x.Pitch == pitch && x.Pan == pan && x.Progress == GetDuration(audio, pitch), out var ri))
            {
                if (GetVolume(audio, volume) > ri.Volume) ri.Volume = volume;
                return ri;
            }
            return new AudioInstance(audio, pitch, volume, pan);
        }
        public static AudioInstance Loop(string path) => Loop(Resource.Audios[path], 1, 1, .5f);
        public static AudioInstance Loop(string path, float pitch) => Loop(Resource.Audios[path], pitch, 1, .5f);
        public static AudioInstance Loop(string path, float pitch, float volume) => Loop(Resource.Audios[path], pitch, volume, .5f);
        public static AudioInstance Loop(string path, float pitch, float volume, float pan) => Loop(Resource.Audios[path], pitch, volume, pan);
        public static AudioInstance Loop(Audio audio) => Loop(audio, 1, 1, .5f);
        public static AudioInstance Loop(Audio audio, float pitch) => Loop(audio, pitch, 1, .5f);
        public static AudioInstance Loop(Audio audio, float pitch, float volume) => Loop(audio, pitch, volume, 1);
        public static AudioInstance Loop(Audio audio, float pitch, float volume, float pan)
        {
            var ret = Play(audio, pitch, volume, pan);
            ret.onLoop += _ => Loop(audio, pitch, volume, pan);
            return ret;
        }
        public class AudioInstance { 
            public Audio Audio;
            public Sound Sound;
            public Dictionary<string, object> Var = [];
            public float _pitch;
            public float Pitch
            {
                get => _pitch;
                set {
                    if (value <= 0) value = 1;
                    Progress *= value / _pitch;
                    Sound.SetPitch(value);
                    _pitch = value;
                }
            }
            public float _pan;
            public float Pan
            {
                get => _pan;
                set
                {
                    value = MathP.Clamp(value, 0, 1);
                    Sound.SetPan(value);
                    _pan = value;
                }
            }
            public float _volume;
            public float Volume
            {
                get => _volume;
                set
                {
                    if (value <= 0) value = 0;
                    value = GetVolume(Audio, value);
                    Sound.SetVolume(value);
                    _volume = value;
                }
            }
            public float Progress;
            public bool Paused;
            public bool Finished;
            public Action<AudioInstance, float>? onUpdate = null;
            public Action<AudioInstance>? onPaused = null;
            public Action<AudioInstance>? onResumed = null;
            public Action<AudioInstance>? onLoop = null;
            public Action<AudioInstance>? onFinished = null;
            public AudioInstance(Audio audio, float pitch, float volume, float pan)
            {
                Audio = audio;
                _pitch = pitch;
                _pan = pan;
                _volume = GetVolume(Audio, volume);
                Progress = GetDuration(Audio, Pitch);
                Paused = false;
                Finished = false;
                if (!Audio.Aliases.TryFirst(out Sound)) { Logger.Error("Audio Alias is blank!"); Sound = Sound.LoadAlias(Audio.Sound); }
                Audio.Aliases.Remove(Sound);
                if (Audio.Aliases.Count == 0) { Logger.Log("Increasing Audio Alias channels for", Audio.Path); Audio.Aliases.Add(Sound.LoadAlias(Audio.Sound)); }
                Sound.SetPan(Pan);
                Sound.SetPitch(Pitch);
                Sound.SetVolume(Volume);
                Sound.Play();
                INSTANCES.Add(this);
            }
            public bool Equals([NotNullWhen(true)] object? obj) => obj != null && obj is AudioInstance ai && Equals(ai);
            public bool Equals(AudioInstance other) => Audio == other.Audio && Pitch == other.Pitch && Pan == other.Pan && Progress == other.Progress;
            public static bool operator ==(AudioInstance left, AudioInstance right) => left.Equals(right);
            public static bool operator !=(AudioInstance left, AudioInstance right) => !(left == right);
            public int GetHashCode() => HashCode.Combine(Audio.GetHashCode(), Pitch, Pan, Progress);
            public void Stop() { Sound.Stop(); Finished = true; }
            public void Pause() { Sound.Pause(); Paused = true; onPaused?.Invoke(this); }
            public void Resume() { Sound.Resume(); Paused = false; onResumed?.Invoke(this); }
            public bool Tick(float deltaTime) 
            {
                if (!Finished && !Paused)
                {
                    Progress -= deltaTime;
                    onUpdate?.Invoke(this, deltaTime);
                    if (Progress <= 0)
                    {
                        onLoop?.Invoke(this);
                        Finished = true;
                    }
                }
                if (Finished)
                {
                    onFinished?.Invoke(this);
                    Audio.Aliases.Add(Sound); // return
                }
                return !Finished; 
            }
        }
    }
}
