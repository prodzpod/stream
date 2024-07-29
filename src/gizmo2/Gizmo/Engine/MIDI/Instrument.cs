using Gizmo.Engine.Data;
using static Gizmo.Engine.Data.Audio;
using static Gizmo.Engine.MIDI.Instrument;
using static Gizmo.Engine.MIDI.InstrumentFragment;

namespace Gizmo.Engine.MIDI
{
    public class Instrument
    {
        public List<InstrumentFragmentEx> Instruments = [];
        public void AddInstrument(string path) => AddInstrument(Resource.InstrumentFragments[path], 0, 120, 60);
        public void AddInstrument(string path, int pivot) => AddInstrument(Resource.InstrumentFragments[path], pivot, pivot, pivot);
        public void AddInstrument(string path, int min, int max) => AddInstrument(Resource.InstrumentFragments[path], min, max, (min + max) / 2);
        public void AddInstrument(string path, int min, int max, int pivot) => AddInstrument(Resource.InstrumentFragments[path], min, max, pivot);
        public void AddInstrument(InstrumentFragment fragment) => AddInstrument(fragment, 0, 120, 60);
        public void AddInstrument(InstrumentFragment fragment, int pivot) => AddInstrument(fragment, pivot, pivot, pivot);
        public void AddInstrument(InstrumentFragment fragment, int min, int max) => AddInstrument(fragment, min, max, (min + max) / 2);
        public void AddInstrument(InstrumentFragment fragment, int min, int max, int pivot)
        {
            Instruments.Add(new InstrumentFragmentEx() { Fragment = fragment, min = min, max = max, pivot = pivot });
        }
        public static InstrumentInstance? Play(string path, float pitch = 60, float duration = 0, float volume = 1, float pan = .5f, bool noAttack = false, bool noRelease = false)
            => Play(Resource.Instruments[path], pitch, duration, volume, pan, noAttack, noRelease);
        public static InstrumentInstance? Play(Instrument i, float pitch = 60, float duration = 0, float volume = 1, float pan = .5f, bool noAttack = false, bool noRelease = false)
        {
            if (!i.Instruments.TryFirst(x => MathP.Between(x.min - .5f, pitch, x.max + .5f), out var inst)) return null;
            return InstrumentFragment.Play(inst.Fragment, duration, MathP.Pow(2, (pitch - inst.pivot) / 12), volume, pan, noAttack, noRelease);
        }
        public static float GetDuration(string path, float duration) => GetDuration(Resource.Instruments[path], duration);
        public static float GetDuration(string path, float duration, float pitch) => GetDuration(Resource.Instruments[path], duration, pitch);
        public static float GetDuration(Instrument i, float duration) => GetDuration(i, duration, 60);
        public static float GetDuration(Instrument i, float duration, float pitch)
        {
            if (!i.Instruments.TryFirst(x => MathP.Between(x.min - .5f, pitch, x.max + .5f), out var inst)) return 0;
            return GetDuration(inst, duration, pitch);
        }
        public static float GetDuration(InstrumentFragmentEx fragment, float duration) => GetDuration(fragment, duration, fragment.pivot);
        public static float GetDuration(InstrumentFragmentEx fragment, float duration, float pitch) => GetDuration(fragment.Fragment, duration, MathP.Pow(2, (pitch - fragment.pivot) / 12));
        public static float GetDuration(InstrumentFragment fragment, float duration) => GetDuration(fragment, duration, 1);
        public static float GetDuration(InstrumentFragment fragment, float duration, float pitch)
        {
            float ret = 0;
            if (fragment.attack != null) ret += Audio.GetDuration(fragment.attack, pitch);
            if (fragment.main != null) ret += duration;
            if (fragment.release != null) ret += Audio.GetDuration(fragment.release, pitch);
            return ret;
        }
        public class InstrumentInstance
        {
            public AudioInstance Instance;
            public float Progress = 0;
            public bool Finished = false;
            public Dictionary<string, object> Var = [];
            public Action<InstrumentInstance, float>? onUpdate = null;
            public Action<InstrumentInstance>? onPaused = null;
            public Action<InstrumentInstance>? onResumed = null;
            public Action<InstrumentInstance>? onFinished = null;
            public void Stop() { onFinished?.Invoke(this); Instance.Stop(); Finished = true; }
            public void Pause() => Instance.Pause();
            public void Resume() => Instance.Resume();
        }
    }
    public class InstrumentFragmentEx
    {
        public InstrumentFragment Fragment;
        public int min;
        public int max;
        public int pivot;
    }
    public class InstrumentFragment
    {
        public Audio? attack;
        public Audio? main;
        public Audio? release;
        public InstrumentFragment() 
        {
            attack = null;
            main = null;
            release = null;
        }
        public static InstrumentInstance? Play(string path, float duration = 0, float pitch = 1, float volume = 1, float pan = .5f, bool noAttack = false, bool noRelease = false)
            => Play(Resource.InstrumentFragments[path], duration, pitch, volume, pan, noAttack, noRelease);
        public static InstrumentInstance? Play(InstrumentFragment i, float duration = 0, float pitch = 1, float volume = 1, float pan = .5f, bool noAttack = false, bool noRelease = false)
        {
            var main = new InstrumentInstance { Progress = duration };
            if (!noAttack && i.attack != null) main.Instance = spawnAttack(pitch, volume, pan);
            else if (i.main != null) main.Instance = spawnMain(pitch, volume, pan);
            else if (!noRelease && i.release != null) main.Instance = spawnRelease(pitch, volume, pan);
            else return null;
            AudioInstance spawnAttack(float pitch, float volume, float pan)
            {
                var ret = Audio.Play(i.attack, pitch, volume, pan);
                ret.onUpdate += (_, deltaTime) => main.onUpdate?.Invoke(main, deltaTime);
                ret.onLoop += self =>
                {
                    if (i.main != null) main.Instance = spawnMain(self.Pitch, self.Volume, self.Pan);
                    else if (!noRelease && i.release != null) main.Instance = spawnRelease(self.Pitch, self.Volume, self.Pan);
                    else
                    {
                        main.onFinished?.Invoke(main);
                        main.Finished = true;
                    }
                };
                ret.onPaused += _ => main.onPaused?.Invoke(main);
                ret.onResumed += _ => main.onPaused?.Invoke(main);
                return ret;
            }
            AudioInstance spawnMain(float pitch, float volume, float pan)
            {
                var ret = Audio.Play(i.main, pitch, volume, pan);
                ret.onUpdate += (self, deltaTime) => {
                    if (self.Paused) return;
                    main.onUpdate?.Invoke(main, deltaTime);
                    main.Progress -= deltaTime;
                    if (main.Progress <= 0) {
                        if (!noRelease && i.release != null) main.Instance = spawnRelease(self.Pitch, self.Volume, self.Pan);
                        else
                        {
                            main.onFinished?.Invoke(main);
                            main.Finished = true;
                        }
                        self.Stop();
                    }
                };
                ret.onPaused += _ => main.onPaused?.Invoke(main);
                ret.onResumed += _ => main.onPaused?.Invoke(main);
                ret.onLoop += self => main.Instance = spawnMain(self.Pitch, self.Volume, self.Pan);
                return ret;
            }
            AudioInstance spawnRelease(float pitch, float volume, float pan)
            {
                var ret = Audio.Play(i.release, pitch, volume, pan);
                ret.onUpdate += (_, deltaTime) => main.onUpdate?.Invoke(main, deltaTime);
                ret.onPaused += _ => main.onPaused?.Invoke(main);
                ret.onResumed += _ => main.onPaused?.Invoke(main);
                ret.onLoop += _ =>
                {
                    main.onFinished?.Invoke(main);
                    main.Finished = true;
                };
                return ret;
            }
            return main;
        }
    }
}
