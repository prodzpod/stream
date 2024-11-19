using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using ProdModel.Puppet;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands
{
    public class HandTracker : Command
    {
        public static MatrixP HandCorrection = new(
            -33.0302f, 0.766167f, -5.34993f, 0,
            -20.6515f, 0.904192f, -18.0583f, 0,
            -11.6795f, -9.2001f, -7.86466f, 0,
            1.31335f, 0.738134f, 1.71615f, 1
        );
        public static Vector3 lasthand = Vector3.Zero;
        public override object?[]? Execute(params object?[] args)
        {
            string hand = WASD.Assert<string>(args[0]);
            float _wristx = WASD.Assert<float>(args[1]);
            float _wristy = WASD.Assert<float>(args[2]);
            float _wristz = WASD.Assert<float>(args[3]);
            float _palmx = WASD.Assert<float>(args[4]);
            float _palmy = WASD.Assert<float>(args[5]);
            float _palmz = WASD.Assert<float>(args[6]);
            MatrixP corr = HandCorrection * MatrixP.Scale(.2f) * MatrixP.Translate(0, 0, .75f);
            Vector3 palm = corr * new Vector3(_palmx, _palmy, 0.25f);
            Vector3 wrist = corr * new Vector3(_wristx, _wristy, 0.25f);
            Logger.Log($"Hand: {hand} @ {wrist}");
            Vector3 elbow = wrist - (palm - wrist) / .08f * .25f;
            Vector3 shoulder = hand == "Right" ? ModelHandler.LastRightShoulderPosition : ModelHandler.LastLeftShoulderPosition;
            // shoulder to elbow = (-0.35, 0, 0)
            // elbow to wrist = (-0.25, 0, 0)
            var offset = (Vector3.Normalize(elbow - shoulder) * .35f) - elbow;
            elbow += offset; wrist += offset;
            var r1 = GetRotations(shoulder, elbow);
            wrist = shoulder + MathP.InverseRotate(wrist - shoulder, r1);
            elbow = shoulder + MathP.InverseRotate(elbow - shoulder, r1);
            var r2 = GetRotations(elbow, wrist);
            if (hand == "Right") { ModelHandler.RightArmAngle = r1; ModelHandler.RightArmAngle2 = r2; }
            else { ModelHandler.LeftArmAngle = r1; ModelHandler.LeftArmAngle2 = r2; }
            ModelHandler.ArmTime = 0;
            lasthand = wrist;
            return null;
        }

        public static Vector3 GetRotations(Vector3 from, Vector3 to)
        {
            return new Vector3(
                MathP.AngleBetween(from.YZ(), to.YZ()),
                MathP.AngleBetween(from.ZX(), to.ZX()),
                MathP.AngleBetween(from.XY(), to.XY())
            );
        }
    }
}
