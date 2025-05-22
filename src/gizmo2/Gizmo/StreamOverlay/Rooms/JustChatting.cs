using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using System.Diagnostics;
using System.Drawing;
using System.Numerics;

namespace Gizmo.StreamOverlay.Rooms
{
    public class JustChatting : Room
    {
        public static int[] Index = [0, 0];
        public static string[] AudioRecognition = [
            "Hello, everybody.",
            "Hello? High everybody.",
            "Hi. Hi. Hi everybody.",
            "Hi everybody. How's everyone doing.",
            "How's, How. How's everyone doing. How's. How. How's everyone holding up.",
            "Wow wow wow wow wow",
            "Hello icky. Hello, halo.",
            "Great to see you, great to, see",
            "No. welcome the broadcast today. Actually, no. No, no, we're, we're doing this. We're doing this instead.",
            "I don't know, proud kind of deep. Proud kinda, rod panda didn't show up.",
            "So were doing, doing something productive today. Doing, doing stuff. Doing stuff for, you know.",
            "Okay. Okay, where are we going. Where are we going, where are we.",
            "Where, where, wow wow. Where are are we going. What are are listening to today?",
            "You want Kevin? We can. We can. Weewee can Kevin. We can Kevin. We can Kevin. We can Kevin.",
            "Okay. Okay. Okay. Kevin. Kevin. Okay. Okay. Kevin.",
            "Kevin. Kevin Kevin.",
            "So I was at the doctor today. My urethra felt panda world. Right. So I wet",
            "No, I did not start hiss hacking. I do not",
            "They went and checked up on,",
            "Found out that I'm some kind of an \"Impostor\" creature. Like, from among us?",
            "Like that's wild, that's crazy. ",
            "So I was like. Brother. What? I was like. I was like. What do you mean I'm an impostor creature.",
            "Wait, why are they here. Why are, ahh, help! Help, ahh, ahh.",
            "My overlay, oh my god. Hold on. Where's the reset button. Wheres the. Wheres the. Wheres the. ahhh.",
            "Oh my god the chat box. The chat box.",
            "I can't find anything. Ahh, haha!",
            "Oh my god, haha! ahh, ahh.",
            "Ahh! ahh.",
        ];
        public static string[] TTS = [
            "",
            "wau wau wau",
            "welcome to the broadcast",
            "D:",
            "!kevin",
            "!kevin",
            "DID YOU START PISS STACKING AS WELL",
            "!guy",
            "!guy",
            "",
            ""
        ];
        public static Instance? ChatTop = null;
        public static Instance? ChatBottom = null;
        public override void OnEnter(Room? room)
        {
            base.OnEnter(room);
            Instance Spawn(string sprite, Vector2 pos, float depth)
            {
                Sprite s = Resource.Sprites[sprite]!;
                var t = Squareish.New(nameof(Squareish), pos, s.Size, s);
                t.Depth = depth; t.Get<Instance[]>("children")![0].Depth = depth;
                return t;
            }
            Instance t, t2;
            t = Graphic.New(null, "forrest/2/bg"); t.Position = new(960, 540); t.Depth = -100;
            // albums
            t = Spawn("forrest/2/album_6", new(176, 757), -99); t.Scale = new(136f / 900, 136f / 900); t.Angle = -12.5f;
            t = Spawn("forrest/2/album_5", new(51, 804), -99); t.Scale = new(163f / 900, 163f / 900); t.Angle = -45f;
            t = Spawn("forrest/2/album_4", new(78, 976), -99); t.Scale = new(159f / 900, 159f / 900); t.Angle = 25f;
            t = Spawn("forrest/2/album_3", new(1786, 271), -99); t.Scale = new(155f / 900, 155f / 900); t.Angle = 23.5f;
            t = Spawn("forrest/2/album_1", new(1885, 214), -99); t.Scale = new(152f / 900, 152f / 900); t.Angle = -20f;
            t = Spawn("forrest/2/album_2", new(1828, 69), -99); t.Scale = new(174f / 900, 174f / 900); t.Angle = -10f;
            // chats
            Sprite stop = Resource.Sprites["forrest/2/chat_top"]!;
            t = Squareish.New(nameof(Squareish), new(237+(1485/2f), 18+(188/2f)), stop.Size, stop, Text.Compile("", "forresttts", 48, stop.Size.X, -Vector2.One, ColorP.WHITE));
            t.Depth = -90; foreach (var c in t.Get<Instance[]>("children")!) c.Depth = -90;
            t.Get<Instance[]>("children")![1].Position = -stop.Size / 2 + (new Vector2(2f, .4f) * 48); t.Set("pinned", true);
            ChatTop = t.Get<Instance[]>("children")![1];
            t2 = Graphic.New(t, "forrest/2/tuner"); t2.Playback /= 6;
            t2.Position = new(1555+(72/2)-(237+(1485/2f)), 168+(98/2)-(18+(188/2f)));
            Sprite sbot = Resource.Sprites["forrest/2/chat_bottom"]!;
            t = Squareish.New(nameof(Squareish), new(192+(1530/2f), 924+(144/2f)), sbot.Size, sbot, Text.Compile("", "forresttts", 48, stop.Size.X, -Vector2.One, ColorP.WHITE));
            t.Depth = -90; foreach (var c in t.Get<Instance[]>("children")!) c.Depth = -90;
            t.Get<Instance[]>("children")![1].Position = -sbot.Size / 2 + (new Vector2(.5f, .4f) * 48); t.Set("pinned", true);
            ChatBottom = t.Get<Instance[]>("children")![1];
            // objects
            Spawn("forrest/2/button_1", new(9+(264/2f), 387+(72/2f)), -50);
            Spawn("forrest/2/button_2", new(9+(264/2f), 459+(72/2f)), -50);
            Spawn("forrest/2/button_3", new(9+(264/2f), 531+(66/2f)), -50);
            Spawn("forrest/2/button_4", new(9+(264/2f), 597+(78/2f)), -50);
            Spawn("forrest/2/button_5", new(1647+(264/2f), 378+(72/2f)), -50);
            Spawn("forrest/2/button_6", new(1647+(264/2f), 450+(72/2f)), -50);
            Spawn("forrest/2/button_7", new(1647+(264/2f), 522+(66/2f)), -50);
            Spawn("forrest/2/button_8", new(1647+(264/2f), 588+(78/2f)), -50);
            t = Spawn("forrest/2/metronome", new(198+(576/16f), 825+(99/2f)), -50);
            t.Get<Instance[]>("children")![0].Playback /= 6;
            // livewindow
            t = Spawn("forrest/2/window_top", new(19 + (1248 / 8f), 0 + (1476 / 8f)), -1); t.Get<Instance[]>("children")![0].Playback /= 6;
            t2 = Graphic.New(t, "forrest/2/distort"); t2.Position = new(49+(435/10f) - t.Position.X, 6+(27/2f) - t.Position.Y); t2.Depth = -1; t2.Playback /= 6;
            t = Spawn("forrest/2/window_bottom", new(1599+(1284/8f), 686+(1440/8f)), -1); t.Get<Instance[]>("children")![0].Playback /= 6;
            t2 = Graphic.New(t, "forrest/2/distort"); t2.Position = new(1783+(435/10f) - t.Position.X, 683+(27/2f) - t.Position.Y); t2.Scale = new(-1, 1); t2.Depth = -1; t2.Playback /= 6;
            // guys
            StreamOverlay.Prod = Instance.New(nameof(Prod));
            StreamOverlay.Prod.Depth = 0;
            ModelHandler.modelNumber = StreamOverlay.Models.FindIndex(x => x.Contains("forrest"));
            ModelHandler.ModelWVRM = new(StreamOverlay.Models[ModelHandler.modelNumber]);
            ModelSprite.Width = 100; ModelSprite.Height = 100;
            ModelSprite.CameraZoom = 2.8f; ModelSprite.CameraTranslation = new(-0.05f, 0, -0.25f);
            StreamOverlay.Prod.Position = new(343.5f, 368f);
            StreamWebSocket.Send("forrest", "justchatting");
        }
        public static Audio.AudioInstance? RecentTTSAudio = null;
        public static async void UpdateTop(bool immediate = false)
        {
            Index[0]++;
            if (Index[0] >= 1 && Index[0] < TTS.Length && !immediate)
            {
                var z = Audio.Play("forrest/tts" + Index[0]);
                if (Index[0] == 5 || Index[0] == 8) { RecentTTSAudio?.Stop(); RecentTTSAudio = z; }
                await Task.Delay(RandomP.Random(200, 600));
            }
            if (Index[0] >= 0 && Index[0] < TTS.Length && ChatTop != null) ChatTop.Sprite = Text.Compile(
                TTS[Index[0]], "forresttts", 48,
                Resource.Sprites["forrest/2/chat_top"]!.Size.X, -Vector2.One, ColorP.WHITE);
            if (!immediate) switch (Index[0])
            {
                case 1:
                    StreamWebSocket.Send("forrest", "justchatting");
                    break;
                case 7: 
                    StreamWebSocket.Send("forrest", "guy");
                    ChatTop.Get<Instance>("parent").Set("pinned", false);
                    ChatBottom.Get<Instance>("parent").Set("pinned", false);
                    break;
                case 8: 
                    StreamWebSocket.Send("forrest", "final"); 
                    break;
                case 9: 
                    StreamWebSocket.Send("forrest", "fadeout");
                    RecentTTSAudio?.Stop();
                    ModelHandler.modelNumber = StreamOverlay.Models.FindIndex(x => x.Contains("model"));
                    ModelHandler.ModelWVRM = new(StreamOverlay.Models[ModelHandler.modelNumber]);
                    break;
                case 10:
                    ModelSprite.Width = 200; ModelSprite.Height = 200; ModelSprite.ResolutionUpdated = true;
                    Prod.Prod3D.Size = new(ModelSprite.Width, ModelSprite.Height);
                    StreamOverlay.Prod.Position = new(960, 540);
                    ModelSprite.CameraZoom = 1f; ModelSprite.CameraTranslation = Vector3.Zero;
                    ModelSprite.Accessories.Add("wizard_hat");
                    StreamWebSocket.Send("forrest", "interview");
                    break;
            }
        }
        public static async void UpdateBottom(bool immediate = false)
        {
            Index[1]++;
            if (Index[1] >= 0 && Index[1] < AudioRecognition.Length)
            {
                var ts = AudioRecognition[Index[1]].Split(" ").ToList();
                if (!immediate)
                {
                    if (ChatBottom != null) ChatBottom.Sprite = Text.Compile("", "forresttts", 48,
                        Resource.Sprites["forrest/2/chat_bottom"]!.Size.X, -Vector2.One, ColorP.WHITE);
                    await Task.Delay(RandomP.Random(50, 200));
                }
                var t = "";
                for (int i = 0; i < ts.Count;)
                {
                    var c = RandomP.Random(1, 3);
                    if (!immediate) await Task.Delay(RandomP.Random(50, 400) * c);
                    t += ts.Slice(i, MathP.Min(ts.Count - i, c)).Join(" ") + " ";
                    if (ChatBottom != null) ChatBottom.Sprite = Text.Compile(t, "forresttts", 48,
                        Resource.Sprites["forrest/2/chat_bottom"]!.Size.X, -Vector2.One, ColorP.WHITE);
                    i = i + c;
                }
            }
        }
    }
}
