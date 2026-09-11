"""Compile hand-authored comprehension questions; never use OCR as an answer key."""
from pathlib import Path
import json,random
root=Path(__file__).resolve().parent.parent
quizzes={}
for number,line in enumerate((root/'data/questions.tsv').read_text().splitlines(),1):
 if not line.strip():continue
 fields=line.split('\t')
 assert len(fields)==6,(number,len(fields))
 page,question,answer,wrong1,wrong2,explanation=fields
 options=[answer,wrong1,wrong2]
 assert len(set(options))==3,number
 random.Random(number*37+int(page)).shuffle(options)
 quizzes.setdefault(page,[]).append(dict(question=question,options=options,answer=options.index(answer),explanation=explanation))
pages=json.loads((root/'dist/pages.js').read_text().removeprefix('window.PAGES = ').strip().removesuffix(';'))
assert set(quizzes)=={str(p['id']) for p in pages if p['category']!='Sommaires'}
assert all(len(q)>=2 for q in quizzes.values())
(root/'dist/quizzes.js').write_text('window.QUIZZES = '+json.dumps(quizzes,ensure_ascii=False,indent=2)+';\n')
print(len(quizzes),'exercices,',sum(map(len,quizzes.values())),'questions')
