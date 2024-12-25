using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Windows;
using Raylib_CSharp.Images;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Donate : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            string name = WASD.Assert<string>(args[0]);
            string profile = WASD.Assert<string>(args[1]);
            float value = WASD.Assert<float>(args[2]);
            string currency = WASD.Assert<string>(args[3]);
            string comment = WASD.Assert<string>(args[4]);
            if (name == null || profile == null || currency == null || comment == null) return null;
            StreamOverlay.DrawResolve.Add(new(Image.Load(profile), texture =>
            {
                Sprite sprite = new()
                {
                    Image = texture,
                    Size = new(texture.Width, texture.Height),
                    Subimages = Vector2.One
                };
                var i = RaidWindow.New(new(960, 540), $"{name} donated {value} {currency} to Gamer's Outreach!", sprite, MathP.Max(1, (int)value), "<wave>" + comment);
                i.Set("content", $"<idoldream={profile}>");
            }));
            return null;
        }
    }
}
