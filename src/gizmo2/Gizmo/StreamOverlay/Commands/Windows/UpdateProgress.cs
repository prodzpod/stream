using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using System.IO;
using System.Numerics;
using System.Text.RegularExpressions;

namespace Gizmo.StreamOverlay.Commands.Windows
{
    public class UpdateProgress : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            if (Game.Room == null) return null;
            string? id = WASD.Assert<string>(args[0]);
            string? title = WASD.Assert<string>(args[1]);
            string? content = WASD.Assert<string>(args[2]);
            float? max = WASD.Assert<float>(args[3]);
            float? value = WASD.Assert<float>(args[4]);
            if (id == null || title == null || content == null || max == null || value == null) return null;
            ProgressWindow.UpdateProgress(id, title, content, max.Value, value.Value);
            return null;
        }
    }
}
