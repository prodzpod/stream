import sys;
import mouse;
import keyboard;
import win32con, win32api;
import time;

print(sys.argv)
action = sys.argv[1]
if action == "key":
    keyboard.press_and_release(sys.argv[2])
if action == "wkey":
    win32api.keybd_event(win32con.VK_F8, win32con.WM_KEYDOWN)
elif action == "hold":
    keyboard.press(sys.argv[2])
elif action == "release":
    keyboard.release(sys.argv[2])
elif action == "text":
    keyboard.write(sys.argv[2])
elif action == "move":
    mouse.move(sys.argv[2], sys.argv[3], absolute=True)
elif action == "amove":
    mouse.move(sys.argv[2], sys.argv[3], absolute=True, duration=0.1)
elif action == "click":
    mouse.click()
elif action == "rclick":
    mouse.right_click()
elif action == "mclick":
    mouse.click(mouse.MIDDLE)
elif action == "dclick":
    mouse.double_click()
elif action == "tab":
    keyboard.press("alt")
    keyboard.press_and_release("tab")
    keyboard.release("alt")
else:
    print("Invalid Action Detected: " + str(sys.argv[1]))