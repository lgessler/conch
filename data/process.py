import sys
with open(sys.argv[1], 'r') as f:
    i = 0
    accum = ""
    for line in f:
        accum += line
        i += 1
        if (i % 5000 == 0) and (i != 0):
            with open("".join(['corpex-files/', format(i, '012d'), '.cxf']), 'w') as o:
                o.write(accum)
            accum = ""

print("Successfully finished writing files.")
