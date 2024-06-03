using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;
using System;
using System.Linq;

namespace ProdModel.Utils
{
    public static class InputP
    {
        public static bool InputEnabled = true;
        public static KeyboardState statePrevious = new();
        public static KeyboardState stateCurrent = new();
        public static MouseState stateMousePrevious = new();
        public static MouseState stateMouseCurrent = new();

        public static void OnUpdate()
        {
            statePrevious = stateCurrent;
            stateCurrent = Keyboard.GetState();
            stateMousePrevious = stateMouseCurrent;
            stateMouseCurrent = Mouse.GetState();
        }

        public static Vector2 GetDrag()
        {
            if (!(MouseHeld(Mouses.Left) && MouseGet(stateMousePrevious, Mouses.Left))) return Vector2.Zero;
            return MousePosition - stateMousePrevious.Position.ToVector2();
        }

        public static bool KeyHeld(Keys k) => InputEnabled && stateCurrent.IsKeyDown(k);
        public static bool KeyPressed(Keys k, bool force = false) => (force || InputEnabled) && statePrevious.IsKeyUp(k) && stateCurrent.IsKeyDown(k);
        public static bool KeyReleased(Keys k) => InputEnabled && statePrevious.IsKeyDown(k) && stateCurrent.IsKeyUp(k);
        public static Keys[] HeldKeys() => InputEnabled ? stateCurrent.GetPressedKeys() : Array.Empty<Keys>();
        public static Keys[] PressedKeys() => InputEnabled ? stateCurrent.GetPressedKeys().Except(statePrevious.GetPressedKeys()).ToArray() : Array.Empty<Keys>();
        public static Keys[] ReleasedKeys() => InputEnabled ? statePrevious.GetPressedKeys().Except(stateCurrent.GetPressedKeys()).ToArray() : Array.Empty<Keys>();
        public static Vector2 MousePosition => stateMouseCurrent.Position.ToVector2();
        public static bool MouseGet(MouseState state, Mouses k)
        {
            if (!InputEnabled) return false;
            switch (k)
            {
                case Mouses.Left:
                    return state.LeftButton == ButtonState.Pressed;
                case Mouses.Right:
                    return state.RightButton == ButtonState.Pressed;
                case Mouses.Middle:
                    return state.MiddleButton == ButtonState.Pressed;
                case Mouses.X1:
                    return state.XButton1 == ButtonState.Pressed;
                case Mouses.X2:
                    return state.XButton2 == ButtonState.Pressed;
                case Mouses.ScrollUp:
                    return state.ScrollWheelValue < stateMousePrevious.ScrollWheelValue;
                case Mouses.ScrollDown:
                    return state.ScrollWheelValue > stateMousePrevious.ScrollWheelValue;
            }
            return false;
        }
        public static bool MouseHeld(Mouses k) => MouseGet(stateMouseCurrent, k);
        public static bool MousePressed(Mouses k) => !MouseGet(stateMousePrevious, k) && MouseGet(stateMouseCurrent, k);
        public static bool MouseReleased(Mouses k) => MouseGet(stateMousePrevious, k) && !MouseGet(stateMouseCurrent, k);
        public enum Mouses
        {
            Left,
            Right,
            Middle,
            X1,
            X2,
            ScrollUp,
            ScrollDown
        };
    }
}
