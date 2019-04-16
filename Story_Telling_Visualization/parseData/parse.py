import pandas as pd
import sklearn
import re

with open('CONTENTS.txt', 'r') as f:
    CONTENTS = f.read()

CONTENTS = CONTENTS.split('\n')
CONTENTS = list(filter(None, CONTENTS))
myrows = []
num = 1
for line in CONTENTS:
    myrows.append([num, line])
    num = num + 1
df = pd.DataFrame(myrows)
df.columns = ['line', 'text']
df.to_csv('CONTENTS.csv', index=False)

def ty(text):
    with open('tales/'+text+'.txt', 'r') as f:
        CAP = f.read()
    regex = r"^$\n"
    subst = ""
    CAP = re.sub(regex, subst, CAP, 0, re.MULTILINE)
    CAP = CAP.replace("“", "")
    CAP = CAP.replace("”", "")

    from string import punctuation
    all_text = ''.join([c for c in CAP if c not in punctuation])
    CAP_new = all_text.split('\n')
    CAP_new = list(filter(None, CAP_new))
    CAP_new = [k for k in CAP_new if k !=' ']
    myrows = []
    num = 1
    for line in CAP_new:
        myrows.append([num, line])
        num = num + 1
    df = pd.DataFrame(myrows)
    df.columns = ['line', 'text']
    df.to_csv(text+'_NEW'+'.csv', index=False)
    
for story in CONTENTS:
    ty(story)