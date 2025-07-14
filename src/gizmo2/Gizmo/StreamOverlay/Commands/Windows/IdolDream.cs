using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Raylib_CSharp.Images;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.Windows
{
    public class IdolDream : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[2]);
            float y = WASD.Assert<float>(args[3]);
            string title = WASD.Assert<string>(args[4]);
            string profile = WASD.Assert<string>(args[5]);
            if (title == null || profile == null) return null;
            StreamOverlay.DrawResolve.Add(new(Image.Load(profile), texture => { SpawnProfileWindow(x, y, title, profile, texture); }));
            return null;
        }

        public static Instance SpawnProfileWindow(float x, float y, string title, string profile, Texture2D texture)
        {
            Sprite sprite = new()
            {
                Image = texture,
                Size = new(texture.Width, texture.Height),
                Subimages = Vector2.One
            };
            var i = Elements.Windows.Window.New(new(x, y), title, sprite.Size, sprite);
            i.Set("content", $"<idoldream={profile}>");
            return i;
        }
    }
}
