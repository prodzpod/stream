import os, subprocess
FILES = [os.path.join(a, x)[2:] for a, b, c in os.walk(".") for x in c if x.endswith(".ogg")]
for fname in FILES:
    output = subprocess.run("ffmpeg -i .\\" + fname + " -filter:a \"volumedetect\" -map 0:a -f null /dev/null", capture_output=True, text=True)
    # why does it return in stderr
    db = float((([x for x in output.stderr.split("\n") if "max_volume: " in x])[0])[len("[Parsed_volumedetect_0 @ 00000206120e8ac0] max_volume: "):-len(" dB")])
    print("Converting " + fname)
    subprocess.run("ffmpeg -y -i .\\" + fname + " -filter:a \"volume=" + str(-6-db) + "dB\" .\\normalized-" + fname)
print(":3")