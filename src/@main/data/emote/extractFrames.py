import sys
from PIL import Image

def get_fps(image):
    image.seek(0)
    frames = []
    while True:
        try:
            l = image.info['duration']
            if l <= 0:
                l = 10
            frames.append(l)
            image.seek(image.tell() + 1)
        except EOFError:
            return frames
    return None

fps = get_fps(Image.open(sys.argv[1]))
frames = dict()
prev = None
for i, x in enumerate(fps):
    if prev != x:
        prev = x
        frames[i] = x / 1000  
with open(sys.argv[1] + ".properties", "w") as f:
    f.write("\n".join([str(x) + "=" + str(frames[x]) for x in frames]))