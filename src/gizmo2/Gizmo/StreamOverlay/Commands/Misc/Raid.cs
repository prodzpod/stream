using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Windows;
using Raylib_CSharp.Images;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Misc
{
    public class Raid : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string name = WASD.Assert<string>(args[0]);
            float viewer = WASD.Assert<float>(args[1]);
            string profile = WASD.Assert<string>(args[2]);
            if (name == null || profile == null) return null;
            StreamOverlay.DrawResolve.Add(new(Image.Load(profile), texture =>
            {
                Sprite sprite = new()
                {
                    Image = texture,
                    Size = new(texture.Width, texture.Height),
                    Subimages = Vector2.One
                };
                var i = RaidWindow.New(new(960, 540), $"{name} raid!", sprite, (int)viewer);
                i.Set("content", $"<idoldream={profile}>");
            }));
            return null;
        }
    }
}
