using Gizmo.Engine.Data;
using PInvoke;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace Gizmo.Engine.Hacks
{
    public class OutOfFocusMouseCheck
    {
        public static bool hooked = false;
        public static User32.SafeHookHandle _kb;
        public static User32.SafeHookHandle _ms;
        public static List<int> PressedThisFrame = [];
        public static List<int> ReleasedThisFrame = [];
        public static void Press(int k)
        {
            if (!ReleasedThisFrame.Remove(k)) PressedThisFrame.Add(k);
        }
        public static void Release(int k)
        {
            ReleasedThisFrame.Add(k);
        }
        public static void OnUpdate()
        {
            if (!hooked) OnInit();
            User32.GetCursorPos(out var POINT);
            InputP.MousePosition = new(POINT.x, POINT.y);
            InputP.Codes.AddRange(PressedThisFrame);
            InputP.Codes.RemoveAll(x => ReleasedThisFrame.Contains(x) && !PressedThisFrame.Contains(x));
            ReleasedThisFrame = [.. ReleasedThisFrame.Where(PressedThisFrame.Contains)];
            PressedThisFrame = [];
        }
        public static void OnInit()
        {
            using (Process curProcess = Process.GetCurrentProcess())
            using (ProcessModule curModule = curProcess.MainModule)
            {
                if (curModule == null) return;
                _ms = User32.SetWindowsHookEx(User32.WindowsHookType.WH_MOUSE_LL, OnMouse, Kernel32.GetModuleHandle(curModule.ModuleName), 0);
                _kb = User32.SetWindowsHookEx(User32.WindowsHookType.WH_KEYBOARD_LL, OnKeyboard, Kernel32.GetModuleHandle(curModule.ModuleName), 0);
            }
            hooked = true;
        }
        private static int OnMouse(int nCode, nint wParam, nint lParam)
        {
            if (nCode == HC_ACTION)
            {
                if (wParam == WM_LBUTTONDOWN || wParam == WM_NCLBUTTONDOWN) Press(-1);
                if (wParam == WM_RBUTTONDOWN || wParam == WM_NCRBUTTONDOWN) Press(-2);
                if (wParam == WM_MBUTTONDOWN || wParam == WM_NCMBUTTONDOWN) Press(-3);
                if (wParam == WM_XBUTTONDOWN || wParam == WM_NCXBUTTONDOWN) Press(-4);
                if (wParam == WM_LBUTTONUP || wParam == WM_NCLBUTTONUP) Release(-1);
                if (wParam == WM_RBUTTONUP || wParam == WM_NCRBUTTONUP) Release(-2);
                if (wParam == WM_MBUTTONUP || wParam == WM_NCMBUTTONUP) Release(-3);
                if (wParam == WM_XBUTTONUP || wParam == WM_NCXBUTTONUP) Release(-4);
                if (wParam == WM_MOUSEWHEEL)
                {
                    MSG? l = Marshal.PtrToStructure<MSG>(lParam);
                    var m = new MSG(); if (l != null) m = (MSG)l;
                    var dir = BitConverter.GetBytes(m.wParam)[3];
                    if (dir == 0) InputP.MouseWheelDelta.Y -= 1;
                    else if (dir == 255) InputP.MouseWheelDelta.Y += 1;
                }
            }
            return User32.CallNextHookEx((nint)User32.WindowsHookType.WH_MOUSE_LL, nCode, wParam, lParam);
        }
        private static int OnKeyboard(int nCode, nint wParam, nint lParam)
        {
            var l = GetMSG(lParam)[0];
            if (wParam == WM_KEYDOWN && !InputP.Codes.Contains(l)) Press(l);
            if (wParam == WM_KEYUP) Release(l);
            return User32.CallNextHookEx((nint)User32.WindowsHookType.WH_KEYBOARD_LL, nCode, wParam, lParam);
        }
        public const int HC_ACTION = 0;
        public const nint WM_LBUTTONDBLCLK = 0x0203;
        public const nint WM_LBUTTONDOWN = 0x0201;
        public const nint WM_LBUTTONUP = 0x0202;
        public const nint WM_MBUTTONDBLCLK = 0x0209;
        public const nint WM_MBUTTONDOWN = 0x0207;
        public const nint WM_MBUTTONUP = 0x0208;
        public const nint WM_MOUSEACTIVATE = 0x0021;
        public const nint WM_MOUSEHOVER = 0x02A1;
        public const nint WM_MOUSEHWHEEL = 0x020E;
        public const nint WM_MOUSELEAVE = 0x02A3;
        public const nint WM_MOUSEMOVE = 0x0200;
        public const nint WM_MOUSEWHEEL = 0x020A;
        public const nint WM_NCHITTEST = 0x0084;
        public const nint WM_NCLBUTTONDBLCLK = 0x00A3;
        public const nint WM_NCLBUTTONDOWN = 0x00A1;
        public const nint WM_NCLBUTTONUP = 0x00A2;
        public const nint WM_NCMBUTTONDBLCLK = 0x00A9;
        public const nint WM_NCMBUTTONDOWN = 0x00A7;
        public const nint WM_NCMBUTTONUP = 0x00A8;
        public const nint WM_NCMOUSEHOVER = 0x02A0;
        public const nint WM_NCMOUSELEAVE = 0x02A2;
        public const nint WM_NCMOUSEMOVE = 0x00A0;
        public const nint WM_NCRBUTTONDBLCLK = 0x00A6;
        public const nint WM_NCRBUTTONDOWN = 0x00A4;
        public const nint WM_NCRBUTTONUP = 0x00A5;
        public const nint WM_NCXBUTTONDBLCLK = 0x00AD;
        public const nint WM_NCXBUTTONDOWN = 0x00AB;
        public const nint WM_NCXBUTTONUP = 0x00AC;
        public const nint WM_RBUTTONDBLCLK = 0x0206;
        public const nint WM_RBUTTONDOWN = 0x0204;
        public const nint WM_RBUTTONUP = 0x0205;
        public const nint WM_XBUTTONDBLCLK = 0x020D;
        public const nint WM_XBUTTONDOWN = 0x020B;
        public const nint WM_XBUTTONUP = 0x020C;
        public const nint WM_KEYDOWN = 0x0100;
        public const nint WM_KEYUP = 0x0101;
        public struct MSG
        {
            public nint lResult;
            public nint wParam;
            public nint lParam;
            public uint message;
            public nint hwnd;
        }
        public static byte[] GetMSG(nint lParam)
        {
            MSG? l = Marshal.PtrToStructure<MSG>(lParam);
            var m = new MSG(); if (l != null) m = (MSG)l;
            return BitConverter.GetBytes(m.lResult);
        }
    }
}
