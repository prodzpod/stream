namespace Gizmo.Engine.Data
{
    public class Shader(string vs, string fs)
    {
        public Raylib_CSharp.Shaders.Shader _shader = Raylib_CSharp.Shaders.Shader.LoadFromMemory(vs, fs);
        public event Func<Shader, Shader>? onShader = null;
        public Shader self;
        public const string DEFAULT_VS = "#version 330 core\n\nin vec3 vertexPosition;\nin vec3 vertexNormal;\nin vec4 vertexColor;\n\nout vec3 fragPosition;\nout vec3 fragNormal;\nout vec4 fragColor;\n\nvoid main()\n{\n    fragPosition = vertexPosition;\n    fragNormal = vertexNormal;  \n    fragColor = vertexColor;\n    gl_Position = vertexPosition;\n}";
        public const string DEFAULT_FS = "#version 330\n\nout vec4 finalColor;\n\nin vec3 fragPosition;\nin vec3 fragNormal;\nin vec4 fragColor;\n\nvoid main()\n{\n    finalColor = fragColor;\n} ";
        public static readonly Shader EMPTY = new(DEFAULT_VS, DEFAULT_FS);
        public static void Activate(string shader) => Activate(Resource.Shaders[shader]);
        public static void Activate(Shader? shader)
        {
            if (shader == null) { Logger.Warn("Shader does not exist!"); return; }
            shader.self = shader;
            Game.SHADERS.Remove(shader); // if exists, change order to be last
            Game.SHADERS.Add(shader);
        }
        public static void Deactivate(string shader) => Activate(Resource.Shaders[shader]);
        public static void Deactivate(Shader? shader)
        {
            if (shader == null) { Logger.Warn("Shader does not exist!"); return; }
            Game.SHADERS.Remove(shader);
        }
        public Raylib_CSharp.Shaders.Shader OnShader()
        {
            if (onShader != null) self = onShader(self);
            return self._shader;
        }
    }
}
