﻿using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class ToggleAccessory : Command
    {
        public override object?[]? Execute(params object?[] args)
        {
            if (args.Length == 0)
            {
                ModelSprite.Accessories = ["skirt_default"];
                return ["reset all"];
            }
            string? source = WASD.Assert<string>(args[0]);
            if (source == null) return null;
            if (ModelSprite.Accessories.Contains(source))
            {
                ModelSprite.Accessories.Remove(source);
                return ["removed " + source];
            }
            else
            {
                ModelSprite.Accessories.Add(source);
                return ["added " + source];
            }
        }
    }
}