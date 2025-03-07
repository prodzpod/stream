using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Windows;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using Raylib_CSharp.Images;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Camera : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Dictionary<string, object?>? _data = WASD.Assert<Dictionary<string, object?>>(args[0]);
            Dictionary<string, float> data = [];
            if (_data == null) return null;
            foreach (var k in _data.Keys) data[k.ToLower().Trim()] = (float)_data[k]!;
            if (data.ContainsKey("reset"))
            {
                ModelSprite.Pixels = 4;
                if (ModelSprite.Width != 200 || ModelSprite.Height != 200) ModelSprite.ResolutionUpdated = true;
                ModelSprite.Width = 200;
                ModelSprite.Height = 200;
                ModelSprite.CameraTranslation = Vector3.Zero;
                ModelSprite.CameraRotation = Vector3.Zero;
                ModelSprite.CameraZoom = 1;
            }
            float kd(string key, float def) => data.TryGetValue(key, out float ret) ? ret : def;
            Vector3 trans = new(kd("x", 0), kd("y", 0), kd("z", 0));
            Vector3 rot = new(kd("rx", 0), kd("ry", 0), kd("rz", 0));
            if (trans != Vector3.Zero) ModelSprite.CameraTranslation += trans;
            if (rot != Vector3.Zero) ModelSprite.CameraRotation += rot;
            if (data.ContainsKey("zoom")) ModelSprite.CameraZoom += data["zoom"];
            if (data.ContainsKey("pixel"))
            {
                ModelSprite.CameraTranslation.X += (int)data["pixel"] / (float)(ModelSprite.Pixels + 1);
                ModelSprite.CameraTranslation.Y -= (int)data["pixel"] / (float)(ModelSprite.Pixels + 1);
                var newPixel = MathP.Max(ModelSprite.Pixels + (int)data["pixel"], 1);
                ModelSprite.ResolutionUpdated = true;
                ModelSprite.Width = MathP.Ceiling((float)ModelSprite.Width / newPixel * ModelSprite.Pixels);
                ModelSprite.Height = MathP.Ceiling((float)ModelSprite.Height / newPixel * ModelSprite.Pixels);
                ModelSprite.Pixels = newPixel;
            }
            if (data.ContainsKey("vw"))
            {
                ModelSprite.ResolutionUpdated = true;
                ModelSprite.Width = MathP.Clamp(ModelSprite.Width + (int)data["vw"], 1, (int)(Game.Resolution.X * Game.Room.Camera.Z));
            }
            if (data.ContainsKey("vh"))
            {
                ModelSprite.ResolutionUpdated = true;
                ModelSprite.Height = MathP.Clamp(ModelSprite.Height + (int)data["vh"], 1, (int)(Game.Resolution.Y * Game.Room.Camera.W));
            }
            Logger.Info(ModelSprite.CameraTranslation, ModelSprite.Width, ModelSprite.Height);
            return null;
        }
    }
}
