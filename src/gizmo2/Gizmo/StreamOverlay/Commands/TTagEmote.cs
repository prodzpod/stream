using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Raylib_CSharp.Images;
using Raylib_CSharp.Rendering;
using Raylib_CSharp.Textures;
using System.Numerics;
using static Gizmo.Engine.Builtin.TextTags;

namespace Gizmo.StreamOverlay.Commands
{
    public class TTagEmote : TextTag
    {
        public static Dictionary<string, Sprite> Emotes = [];
        public override string Name => "emote";
        public override TextConductor Execute(ref Dictionary<Font, Dictionary<char, Vector2>> charMap, ref int charNo, TextConductor conductor, ref List<Character> currentLine, ref float currentY, ref List<List<Character>> lines, ref int ptr, ref string text, ref float bounds, Dictionary<string, string> args)
        {
            if (!args.TryGetValue("emote", out var path)) return conductor;
            Helper.SelfClose(ref conductor);
            if (bounds > 0 && conductor.Pen + conductor.Size * 2 > bounds)
                Helper.LineBreak(ref charNo, ref conductor, ref currentLine, ref currentY, ref lines);
            Character ch = new()
            {
                Font = conductor.Font._font[conductor.Style].First(),
                Position = new(conductor.Pen, currentY),
                Text = ' ',
                Angle = conductor.Angle,
                Style = conductor.Style,
                Color = conductor.Color,
                Scale = conductor.Size,
                Size = new(conductor.Size * 2, conductor.Size)
            };
            ch.onDraw += (i, offset, ch) =>
            {
                if (i == null || Emotes == null || !Emotes.TryGetValue(path, out var sprite) || sprite == null || sprite.Size.X == 0 || sprite.Size.Y == 0 || i.Scale.X == 0 || i.Scale.Y == 0 || ch.Scale == 0) return;
                var res = MathP.Min(MathP.Abs(i.Scale * ch.Size / sprite.Size));
                sprite.Draw(i.Frame, i.Position + MathP.Rotate(ch.Position, i.Angle) * i.Scale + offset, Vector2.One * res, i.Angle + ch.Angle, i.Blend * i.Alpha);
            };
            Image i;
            int frames = 1;
            Dictionary<int, float> loop = null;
            if (path.EndsWith(".gif"))
            {
                i = Image.LoadAnim(path, out frames);
                i.Height *= frames;
                loop = new(FileP.Slurp(path + ".properties").Split('\n').Select(x => {
                    var z = x.Trim().Split('=');
                    return new KeyValuePair<int, float>(int.Parse(z[0]), float.Parse(z[1]) * MetaP.TargetFPS);
                }));
            }
            else i = Image.Load(path);
            StreamOverlay.DrawResolve.Add(new(i, texture =>
            {
                if (frames == 1) Emotes[path] = new Sprite() { Image = texture, Size = new Vector2(texture.Width, texture.Height), Subimages = Vector2.One };
                else Emotes[path] = VariableSpeedSprite.Load(texture, 1, frames, loop);
            }));
            currentLine.Add(ch);
            conductor.Pen += conductor.Size;
            return conductor;
        }
    }
}
