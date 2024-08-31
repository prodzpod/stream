using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.MIDI;
using LibVLCSharp.Shared;
using PInvoke;
using ProdModel.Gizmo;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class SongWindow : Window
    {
        public static Instance New(Vector2 pos, string _title, string path) => New(pos, _title, SongHandler.ParseSong(path));
        public static Instance New(Vector2 pos, string _title, Note[] notes)
        {
            if (notes.Length == 0) return Instance.New(nameof(Graphic), pos);
            NineSlice? ns = Resource.NineSlices["window/window"];
            Sprite s1 = Resource.Sprites["window/song_1"];
            Instance ret = New(nameof(SongWindow), pos, _title, s1.Size, s1, Resource.Sprites["window/song_2"]);
            var children = ret.Get<Instance[]>("children");
            children[2].Position = new(-s1.Size.X / 2 + 8, ns.innerTop / 2 - 13);
            ret.Set("notes", notes);
            ret.Set("note", 0);
            ret.Set("nowPlaying", new List<Instrument.InstrumentInstance>());
            ret.Set("life", notes.Select(x => x.startTime + Instrument.GetDuration(x.instrument, x.duration, x.pitch)).Max());
            return ret;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            Note[] notes = self.Get<Note[]>("notes") ?? [];
            int note = self.Get<int>("note");
            float life = self.Get<float>("life");
            List<Instrument.InstrumentInstance> nowPlaying = self.Get<List<Instrument.InstrumentInstance>>("nowPlaying") ?? [];
            bool changed = false;
            while (note < notes.Length && notes[note].startTime <= self.Life)
            {
                var ii = Instrument.Play(notes[note].instrument, notes[note].pitch, notes[note].duration, 1, .5f, notes[note].cutHead, notes[note].cutFeet);
                if (ii != null) nowPlaying.Add(ii);
                note++;
                changed = true;
            }
            if (note >= notes.Length && self.Life > life) self.Destroy();
            if (changed)
            {
                self.Set("note", note);
                self.Set("nowPlaying", nowPlaying);
            }
            if (life != 0)
            {
                Sprite s1 = Resource.Sprites["window/song_1"];
                var children = self.Get<Instance[]>("children");
                children[2].Position.X = MathP.Lerp(-s1.Size.X / 2 + 8, s1.Size.X / 2 - 7, self.Life / life);
            }
        }
        public override void OnDestroy(ref Instance self)
        {
            List<Instrument.InstrumentInstance> nowPlaying = self.Get<List<Instrument.InstrumentInstance>>("nowPlaying") ?? [];
            foreach (var n in nowPlaying.ToArray()) if (!n.Finished) n.Stop();
            base.OnDestroy(ref self);
        }

        public override string Serialize(ref Instance self) => "";
    }
}
