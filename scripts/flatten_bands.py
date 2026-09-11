from pathlib import Path
import cv2,numpy as np,json
ROOT=Path(__file__).resolve().parent.parent
reports=[]
for p in sorted((ROOT/'output/scans').glob('*.jpg')):
 src=cv2.imread(str(p));H,W=src.shape[:2]
 im=cv2.resize(src,(int(W*900/H),900));h,w=im.shape[:2]
 hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
 mask=((g>115)&(g<225)&(hsv[:,:,1]<55)).astype('uint8')*255
 mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((4,4),np.uint8))
 mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((5,17),np.uint8))
 mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((3,9),np.uint8))
 scores=np.mean(mask>0,axis=1)
 active=scores>.62
 indices=np.where(active)[0]
 groups=np.split(indices,np.where(np.diff(indices)>12)[0]+1)
 curves=[]
 for group in groups:
  if len(group)<5:continue
  y0=max(0,int(group[0])-14);y1=min(h,int(group[-1])+15)
  if y1-y0>120 or y0>h*.8:continue
  xx=[];yy=[]
  for col in range(int(w*.03),int(w*.97)):
   hits=np.where(mask[y0:y1,col]>0)[0]+y0
   if len(hits)>=7:xx.append(col);yy.append(np.median(hits))
  xx=np.array(xx);yy=np.array(yy)
  if len(xx)<w*.65:continue
  good=np.ones(len(xx),bool)
  for _ in range(4):
   fit=np.polyfit(xx[good],yy[good],3)
   good=abs(yy-np.polyval(fit,xx))<6
  row=np.polyval(fit,np.linspace(0,w-1,W))*H/h
  if np.ptp(row)>H*.06:continue
  curves.append(row)
 curves.sort(key=lambda a:np.median(a))
 curves=[c for k,c in enumerate(curves) if k==0 or np.median(c)-np.median(curves[k-1])>H*.06]
 if curves:
  rows=np.stack([np.zeros(W),*curves,np.full(W,H-1)],axis=0)
  targets=np.median(rows,axis=1)
  mapy=np.empty((H,W),np.float32)
  for k in range(len(targets)-1):
   start=max(0,int(np.ceil(targets[k])));end=min(H,int(np.ceil(targets[k+1]))+1)
   v=(np.arange(start,end)-targets[k])/(targets[k+1]-targets[k])
   mapy[start:end]=rows[k][None,:]*(1-v[:,None])+rows[k+1][None,:]*v[:,None]
  mapx=np.broadcast_to(np.arange(W,dtype=np.float32),(H,W)).copy()
  src=cv2.remap(src,mapx,mapy,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
 cv2.imwrite(str(p),src,[cv2.IMWRITE_JPEG_QUALITY,94])
 reports.append({'file':p.name,'bands':len(curves)})
(ROOT/'data/scan-bands.json').write_text(json.dumps(reports,indent=2))
print('Bandeaux corrigés sur',sum(r['bands']>0 for r in reports),'pages')
