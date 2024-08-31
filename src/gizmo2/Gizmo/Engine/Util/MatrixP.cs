using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.Engine.Util
{
    public struct MatrixP(Matrix4x4 Matrix) : IEquatable<MatrixP>, IEquatable<Matrix4x4>, 
        IEquatable<Vector4[]>, IEquatable<Vector3[]>, IEquatable<IEnumerable<float>>, 
        IEquatable<IEnumerable<IEnumerable<float>>>, ICloneable
    {
        public static MatrixP IDENTITY = new();
        // input
        public MatrixP() : this(Matrix4x4.Identity) { }
        public MatrixP(
            float M11, float M12, float M13, float M14,
            float M21, float M22, float M23, float M24,
            float M31, float M32, float M33, float M34,
            float M41, float M42, float M43, float M44) : this(
                new Matrix4x4(M11, M12, M13, M14,
                    M21, M22, M23, M24,
                    M31, M32, M33, M34,
                    M41, M42, M43, M44)) { }
        public MatrixP(
            float M11, float M12, float M13, float M14,
            float M21, float M22, float M23, float M24,
            float M31, float M32, float M33, float M34) : this(
                M11, M12, M13, M14, M21, M22, M23, M24, M31, M32, M33, M34, 0, 0, 0, 1) { }
        public MatrixP(
            float M11, float M12, float M13,
            float M21, float M22, float M23,
            float M31, float M32, float M33) : this(
                M11, M12, M13, 0, M21, M22, M23, 0, M31, M32, M33, 0, 0, 0, 0, 1) { }
        public MatrixP(IEnumerable<float> _MS) : this() 
        {
            float[] MS = [.._MS];
            switch (MS.Length)
            {
                case 9: Matrix = new(MS[0], MS[1], MS[2], 0, MS[3], MS[4], MS[5], 0, MS[6], MS[7], MS[8], 0, 0, 0, 0, 1); break;
                case 12: Matrix = new(MS[0], MS[1], MS[2], MS[3], MS[4], MS[5], MS[6], MS[7], MS[8], MS[9], MS[10], MS[11], 0, 0, 0, 1); break;
                case 16: Matrix = new(MS[0], MS[1], MS[2], MS[3], MS[4], MS[5], MS[6], MS[7], MS[8], MS[9], MS[10], MS[11], MS[12], MS[13], MS[14], MS[15]); break;
            }
        }
        public MatrixP(IEnumerable<IEnumerable<float>> _M) : this() {
            float[][] M = [.. _M.Select(x => x.ToArray())];
            switch (M.Length * M[0].Length)
            {
                case 9: Matrix = new(M[0][0], M[0][1], M[0][2], 0, M[1][0], M[1][1], M[1][2], 0, M[2][0], M[2][1], M[2][2], 0, 0, 0, 0, 1); break;
                case 12: Matrix = new(M[0][0], M[0][1], M[0][2], M[0][3], M[1][0], M[1][1], M[1][2], M[1][3], M[2][0], M[2][1], M[2][2], M[2][3], 0, 0, 0, 1); break;
                case 16: Matrix = new(M[0][0], M[0][1], M[0][2], M[0][3], M[1][0], M[1][1], M[1][2], M[1][3], M[2][0], M[2][1], M[2][2], M[2][3], M[3][0], M[3][1], M[3][2], M[3][3]); break;
            }
        }
        public MatrixP(Vector3 M1, Vector3 M2, Vector3 M3) : this(M1.X, M1.Y, M1.Z, M2.X, M2.Y, M2.Z, M3.X, M3.Y, M3.Z) { }
        public MatrixP(Vector4 M1, Vector4 M2, Vector4 M3) : this(M1.X, M1.Y, M1.Z, M1.W, M2.X, M2.Y, M2.Z, M2.W, M3.X, M3.Y, M3.Z, M3.W) { }
        public MatrixP(Vector4 M1, Vector4 M2, Vector4 M3, Vector4 M4) : this(M1.X, M1.Y, M1.Z, M1.W, M2.X, M2.Y, M2.Z, M2.W, M3.X, M3.Y, M3.Z, M3.W, M4.X, M4.Y, M4.Z, M4.W) { }
        public MatrixP(IEnumerable<Vector3> M) : this(M.Select(x => new float[] { x.X, x.Y, x.Z })) { }
        public MatrixP(IEnumerable<Vector4> M) : this(M.Select(x => new float[] { x.X, x.Y, x.Z, x.W })) { }

        // output
        public Matrix4x4 Matrix = Matrix;
        public readonly float M11 => Matrix.M11; public readonly float M12 => Matrix.M12; public readonly float M13 => Matrix.M13; public readonly float M14 => Matrix.M14;
        public readonly float M21 => Matrix.M21; public readonly float M22 => Matrix.M22; public readonly float M23 => Matrix.M23; public readonly float M24 => Matrix.M24;
        public readonly float M31 => Matrix.M31; public readonly float M32 => Matrix.M32; public readonly float M33 => Matrix.M33; public readonly float M34 => Matrix.M34;
        public readonly float M41 => Matrix.M41; public readonly float M42 => Matrix.M42; public readonly float M43 => Matrix.M43; public readonly float M44 => Matrix.M44;
        public readonly float[] R1 => [M11, M12, M13, M14]; public readonly float[] R2 => [M21, M22, M23, M24]; public readonly float[] R3 => [M31, M32, M33, M34]; public readonly float[] R4 => [M41, M42, M43, M44];
        public readonly Vector4 V1 => new(R1); public readonly Vector4 V2 => new(R2); public readonly Vector4 V3 => new(R3); public readonly Vector4 V4 => new(R4);
        public readonly float[] C1 => [M11, M21, M31, M41]; public readonly float[] C2 => [M12, M22, M32, M42]; public readonly float[] C3 => [M13, M23, M33, M43]; public readonly float[] C4 => [M14, M24, M34, M44];
        public readonly float[] D => [M11, M22, M33, M44];
        public readonly float Determinant => Matrix.GetDeterminant();
        public readonly MatrixP Transpose() => new(M11, M21, M31, M41, M12, M22, M32, M42, M13, M23, M33, M43, M14, M24, M34, M44);
        public readonly bool TryInverse(out MatrixP ret)
        {
            // stackoverflow GO (2)
            ret = new(M22 * M33 * M44 - M22 * M34 * M43 - M32 * M23 * M44 + M32 * M24 * M43 + M42 * M23 * M34 - M42 * M24 * M33,
                -M12 * M33 * M44 + M12 * M34 * M43 + M32 * M13 * M44 - M32 * M14 * M43 - M42 * M13 * M34 + M42 * M14 * M33,
                M12 * M23 * M44 - M12 * M24 * M43 - M22 * M13 * M44 + M22 * M14 * M43 + M42 * M13 * M24 - M42 * M14 * M23,
                -M12 * M23 * M34 + M12 * M24 * M33 + M22 * M13 * M34 - M22 * M14 * M33 - M32 * M13 * M24 + M32 * M14 * M23,
                -M21 * M33 * M44 + M21 * M34 * M43 + M31 * M23 * M44 - M31 * M24 * M43 - M41 * M23 * M34 + M41 * M24 * M33,
                M11 * M33 * M44 - M11 * M34 * M43 - M31 * M13 * M44 + M31 * M14 * M43 + M41 * M13 * M34 - M41 * M14 * M33,
                -M11 * M23 * M44 + M11 * M24 * M43 + M21 * M13 * M44 - M21 * M14 * M43 - M41 * M13 * M24 + M41 * M14 * M23,
                M11 * M23 * M34 - M11 * M24 * M33 - M21 * M13 * M34 + M21 * M14 * M33 + M31 * M13 * M24 - M31 * M14 * M23,
                M21 * M32 * M44 - M21 * M34 * M42 - M31 * M22 * M44 + M31 * M24 * M42 + M41 * M22 * M34 - M41 * M24 * M32,
                -M11 * M32 * M44 + M11 * M34 * M42 + M31 * M12 * M44 - M31 * M14 * M42 - M41 * M12 * M34 + M41 * M14 * M32,
                M11 * M22 * M44 - M11 * M24 * M42 - M21 * M12 * M44 + M21 * M14 * M42 + M41 * M12 * M24 - M41 * M14 * M22,
                -M11 * M22 * M34 + M11 * M24 * M32 + M21 * M12 * M34 - M21 * M14 * M32 - M31 * M12 * M24 + M31 * M14 * M22,
                -M21 * M32 * M43 + M21 * M33 * M42 + M31 * M22 * M43 - M31 * M23 * M42 - M41 * M22 * M33 + M41 * M23 * M32,
                M11 * M32 * M43 - M11 * M33 * M42 - M31 * M12 * M43 + M31 * M13 * M42 + M41 * M12 * M33 - M41 * M13 * M32,
                -M11 * M22 * M43 + M11 * M23 * M42 + M21 * M12 * M43 - M21 * M13 * M42 - M41 * M12 * M23 + M41 * M13 * M22,
                M11 * M22 * M33 - M11 * M23 * M32 - M21 * M12 * M33 + M21 * M13 * M32 + M31 * M12 * M23 - M31 * M13 * M22);
            if (Determinant == 0) return false;
            ret /= Determinant;
            return true;
        }
        public static MatrixP Translate(Vector2 v) => Translate(v.X, v.Y, 0);
        public static MatrixP Translate(Vector3 v) => Translate(v.X, v.Y, v.Z);
        public static MatrixP Translate(float x, float y) => Translate(x, y, 0);
        public static MatrixP Translate(float x, float y, float z) => new(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        public static MatrixP Scale(float a) => Scale(a, a, a);
        public static MatrixP Scale(Vector2 v) => Scale(v.X, v.Y, 0);
        public static MatrixP Scale(Vector3 v) => Scale(v.X, v.Y, v.Z);
        public static MatrixP Scale(float x, float y) => Scale(x, y, 0);
        public static MatrixP Scale(float x, float y, float z) => new(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        public static MatrixP Rotate(float a) => Rotate(0, 0, a);
        public static MatrixP Rotate(Vector3 v) => Rotate(v.X, v.Y, v.Z);
        public static MatrixP Rotate(float z, float y, float x) => new(
            MathP.Cos(x) * MathP.Cos(y),
            MathP.Cos(x) * MathP.Sin(y) * MathP.Sin(z) - MathP.Sin(x) * MathP.Cos(z),
            MathP.Cos(x) * MathP.Sin(y) * MathP.Cos(z) + MathP.Sin(x) * MathP.Sin(z),
            MathP.Sin(x) * MathP.Cos(y),
            MathP.Sin(x) * MathP.Sin(y) * MathP.Sin(z) + MathP.Cos(x) * MathP.Cos(z),
            MathP.Sin(x) * MathP.Sin(y) * MathP.Cos(z) - MathP.Cos(x) * MathP.Sin(z),
            -MathP.Sin(y),
            MathP.Cos(y) * MathP.Sin(z),
            MathP.Cos(y) * MathP.Cos(z));
        public static MatrixP InverseRotate(float a) => Rotate(0, 0, -a);
        public static MatrixP InverseRotate(Vector3 v) => InverseRotate(v.X, v.Y, v.Z);
        public static MatrixP InverseRotate(float x, float y, float z)
        {
            if (!Rotate(x, y, z).TryInverse(out var ret)) Logger.Warn("InverseRotate", x, y, z, "has 0 determinant! Rotation is inaccurate...");
            return ret;
        }
        public static MatrixP RotateAround(float a, Vector2 point) =>
            Translate(point) * Rotate(a) * Translate(-point);
        public static MatrixP RotateAround(Vector3 a, Vector3 point) =>
            Translate(point) * Rotate(a) * Translate(-point);
        public static MatrixP InverseRotateAround(float a, Vector2 point) =>
            Translate(point) * InverseRotate(a) * Translate(-point);
        public static MatrixP InverseRotateAround(Vector3 a, Vector3 point) =>
            Translate(point) * InverseRotate(a) * Translate(-point);

        public static implicit operator Matrix4x4(MatrixP m) => m.Matrix;
        public static explicit operator float[][](MatrixP m) => [m.R1, m.R2, m.R3, m.R4];
        public static explicit operator Vector4[](MatrixP m) => [
            new(m.M11, m.M12, m.M13, m.M14),
            new(m.M21, m.M22, m.M23, m.M24),
            new(m.M31, m.M32, m.M33, m.M34),
            new(m.M41, m.M42, m.M43, m.M44)];
        public static explicit operator Vector3[](MatrixP m) => [
            new(m.M11, m.M12, m.M13),
            new(m.M21, m.M22, m.M23),
            new(m.M31, m.M32, m.M33)];
        public static explicit operator string(MatrixP m) => m.ToString();

        // struct stuff
        public override readonly bool Equals(object? obj)
        {
            if (obj == null) return false;
            if (obj is MatrixP c) return Equals(c);
            if (obj is Matrix4x4 c2) return Equals(c2);
            if (obj is Vector4[] c3) return Equals(c3);
            if (obj is Vector3[] c4) return Equals(c4);
            if (obj is IEnumerable<float> c5) return Equals(c5);
            if (obj is IEnumerable<IEnumerable<float>> c6) return Equals(c6);
            return false;
        }
        public readonly bool Equals(MatrixP other) => Matrix == other.Matrix;
        public readonly bool Equals(Matrix4x4 other) => Matrix == other;
        public readonly bool Equals(Vector4[]? other)
        {
            if (other == null) return false;
            return Equals(new MatrixP(other));
        }
        public readonly bool Equals(Vector3[]? other)
        {
            if (other == null) return false;
            return Equals(new MatrixP(other));
        }
        public readonly bool Equals(IEnumerable<float>? other)
        {
            if (other == null) return false;
            return Equals(new MatrixP(other));
        }
        public readonly bool Equals(IEnumerable<IEnumerable<float>>? other)
        {
            if (other == null) return false;
            return Equals(new MatrixP(other));
        }
        public static bool operator ==(MatrixP left, object? right) => left.Equals(right);
        public static bool operator !=(MatrixP left, object? right) => !left.Equals(right);
        public override readonly string ToString() => $"{{{V1}, {V2}, {V3}, {V4}}}";
        public override readonly int GetHashCode() => Matrix.GetHashCode();
        public readonly object Clone() => new MatrixP(Matrix);

        // manipulation
        public static MatrixP operator -(MatrixP left) => new(-left.Matrix);
        public static MatrixP operator +(MatrixP left, MatrixP right) => new(left.Matrix + right.Matrix);
        public static MatrixP operator -(MatrixP left, MatrixP right) => new(left.Matrix - right.Matrix);
        public static MatrixP operator *(MatrixP left, MatrixP right) => new(left.Matrix * right.Matrix);
        public static MatrixP operator +(MatrixP left, Vector3 right) => left + Translate(right);
        public static MatrixP operator -(MatrixP left, Vector3 right) => left - Translate(right);
        public static Vector3 operator *(MatrixP left, Vector3 right) => (left * new Vector4(right, 1)).XYZ();
        public static Vector4 operator *(MatrixP left, Vector4 right) => new(MathP.Sum(left.V1 * right), MathP.Sum(left.V2 * right), MathP.Sum(left.V3 * right), MathP.Sum(left.V4 * right));
        public static Vector3 operator *(Vector3 left, MatrixP right) => right * left;
        public static Vector4 operator *(Vector4 left, MatrixP right) => right * left;
        public static MatrixP operator *(MatrixP left, float right) => new(left.Matrix * right);
        public static MatrixP operator /(MatrixP left, float right) => new(left.Matrix * (1 / right));
    }
}
