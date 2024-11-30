using Gizmo.Engine;
using Gizmo.StreamOverlay.Elements.Windows;
using ProdModel.Object.Sprite;
using ProdModel.Puppet;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Camera : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            float x = WASD.Assert<float>(args[0]);
            float y = WASD.Assert<float>(args[1]);
            float z = WASD.Assert<float>(args[2]);
            float zoom = WASD.Assert<float>(args[3]);
            if (x == 0 && y == 0 && z == 0 && zoom == 0)
            {
                ModelSprite.CameraRotation = Vector3.Zero;
                ModelSprite.CameraZoom = 1;
            }
            else
            {
                ModelSprite.CameraRotation += new System.Numerics.Vector3(x, y, z);
                ModelSprite.CameraZoom += zoom;
            }
            return null;
        }
    }
}
