using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using PInvoke;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class Ending : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            Audio.Play("screen/tv");
            return null;
        }
    }
}
