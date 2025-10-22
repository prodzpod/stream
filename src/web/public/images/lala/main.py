import math
import os
NAMES = {
    "hat": 3,
    "glasses": 3,
    "hair": 2,
    "sleeve": 2,
    "leg": 2,
    "tail": 2
}
FILES = [os.path.join(a, x)[2:] for a, b, c in os.walk(".") for x in c if x.endswith(".png")]
for fname in FILES:
    id = int(fname[:-4])
    temp = []
    for g in NAMES.values():
        temp.append(id % g)
        id = math.floor(id / g)
    temp.reverse()
    names = list(NAMES.keys())
    for i in range(len(names)):
        temp[i] = names[i] + str(temp[i])
    name = "_".join(temp)
    os.rename(fname, name + '.png')
