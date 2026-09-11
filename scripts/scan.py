"""Non-generative scan processing. Original JPEGs are never overwritten."""
from pathlib import Path
import cv2,numpy as np,json
from scipy.ndimage import median_filter,percentile_filter,gaussian_filter
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent.parent
# Page boundaries reviewed against the 84 source photographs; fractions of image width.
limits={219:(0,.968),220:(.04,.965),221:(.008,.995),222:(.02,.99),223:(.04,.995),224:(.055,.945),225:(.055,.99),226:(.05,.91),227:(.04,.97),228:(.04,.94),229:(.08,.99),230:(.03,.93),231:(.065,.97),232:(.035,.98),233:(.055,.99),234:(.04,.97),235:(.02,.99),236:(.06,.95),237:(.075,.99),238:(.025,.97),239:(.025,.985),240:(.045,.93),241:(.085,.995),242:(.04,.92),243:(.03,.99),244:(.045,.965),245:(.055,.99),246:(.03,.97),247:(.055,.96),248:(.02,.97),249:(.04,.98),250:(.035,.945),251:(.07,.99),252:(.035,.96),253:(.03,.97),254:(.025,.94),255:(.04,.995),256:(.02,.97),257:(.06,.96),258:(.06,.925),259:(.05,.99),260:(.025,.92),261:(.035,.95),262:(.025,.91),263:(.065,.965),264:(.04,.91),265:(.08,.94),266:(.04,.935),267:(.065,.96),268:(.045,.985),269:(.085,.98),270:(.02,.945),271:(.065,.985),272:(.02,.975),273:(.02,.98),274:(.05,.99),275:(.065,.97),276:(.07,.92),277:(.055,.99),278:(.045,.97),279:(.04,.99),280:(.04,.935),281:(.035,.985),282:(.04,.96),283:(.035,.97),284:(.025,.94),285:(.06,.99),286:(.025,.98),287:(.055,.99),288:(.025,.945),289:(.035,.97),290:(.02,.975),291:(.055,.98),292:(.02,.94),293:(.075,.98),294:(.035,.93),295:(.055,.995),296:(.035,.98),297:(.055,.94),298:(.025,.95),299:(.05,.99),300:(.025,.93),301:(.03,.99),302:(.025,.94)}
def robust_curve(xs,ys,degree=4):
 good=np.isfinite(ys)
 for _ in range(6):
  coeff=np.polyfit(xs[good],ys[good],degree)
  residual=ys-np.polyval(coeff,xs)
  scale=max(4,float(np.median(abs(residual[good])))*2.5)
  good=np.isfinite(ys)&(abs(residual)<scale)
 return coeff
reports=[]
for path in sorted((ROOT/'data/original-photos').glob('*.jpg')):
 n=int(path.stem.split('_')[1]);src=cv2.imread(str(path));H,W=src.shape[:2];l,r=limits[n];l=max(0,l-.012);r=min(1,r+.008);x0=int(W*l);x1=int(W*r)
 small=cv2.resize(src,(int(W*800/H),800));h,w=small.shape[:2]
 gray=cv2.cvtColor(small,cv2.COLOR_BGR2GRAY);hsv=cv2.cvtColor(small,cv2.COLOR_BGR2HSV)
 mask=((gray>105)&(hsv[:,:,1]<100)).astype('uint8')*255
 mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((19,13),np.uint8))
 count,labels,stats,_=cv2.connectedComponentsWithStats(mask)
 biggest=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
 mask=(labels==biggest).astype('uint8')*255
 a=int(w*l);b=int(w*r);xs=np.arange(a+3,b-3);top=[];bottom=[]
 for x in xs:
  col=mask[:,x]>0
  runs=np.convolve(col.astype(float),np.ones(13)/13,'same')>.92
  t=np.where(runs[:int(.38*h)])[0];bt=np.where(runs[int(.65*h):int(.985*h)])[0]+int(.65*h)
  top.append(t[0] if len(t) else np.nan);bottom.append(bt[-1] if len(bt) else np.nan)
 top=np.array(top,dtype=float);bottom=np.array(bottom,dtype=float)
 # Robust fitting ignores fingers and small binding/cover discontinuities.
 tp=robust_curve(xs,top);bp=robust_curve(xs,bottom)
 outW=x1-x0;coords=np.linspace(a,b,outW);tops=np.polyval(tp,coords)*H/h+3;bots=np.polyval(bp,coords)*H/h-3
 outH=int(np.median(bots-tops));v=np.linspace(0,1,outH,dtype=np.float32)[:,None]
 mapx=np.broadcast_to(np.linspace(x0,x1-1,outW,dtype=np.float32),(outH,outW)).copy()
 mapy=(tops[None,:]*(1-v)+bots[None,:]*v).astype(np.float32)
 flat=cv2.remap(src,mapx,mapy,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
 # Estimate paper illumination at low resolution, without thresholding text or redrawing content.
 mini=cv2.resize(flat,(max(1,outW//8),max(1,outH//8))).astype(np.float32)
 background=cv2.GaussianBlur(cv2.morphologyEx(mini,cv2.MORPH_CLOSE,np.ones((21,21),np.uint8)),(0,0),9)
 background=cv2.resize(background,(outW,outH),interpolation=cv2.INTER_CUBIC)
 normalized=np.clip(flat.astype(np.float32)*250/np.maximum(background,120),0,255)
 # Gentle contrast: retain printed greys, pale diagrams and original colors.
 normalized=np.clip((normalized-8)*255/247,0,255).astype('uint8')
 cv2.imwrite(str(ROOT/'output/scans'/path.name),normalized,[cv2.IMWRITE_JPEG_QUALITY,94])
 overlay=small.copy();cv2.polylines(overlay,[np.column_stack((coords*w/W*W/w,np.polyval(tp,coords))).astype('int32')],False,(0,0,255),2)
 cv2.polylines(overlay,[np.column_stack((coords,np.polyval(bp,coords))).astype('int32')],False,(0,0,255),2)
 cv2.line(overlay,(a,0),(a,h-1),(0,0,255),1);cv2.line(overlay,(b,0),(b,h-1),(0,0,255),1)
 cv2.imwrite(str(ROOT/'output/scan-controles'/path.name),overlay)
 reports.append(dict(file=path.name,width=outW,height=outH,crop=[l,r],top_range=[float(tops.min()),float(tops.max())],bottom_range=[float(bots.min()),float(bots.max())]))
(ROOT/'data/scan-report.json').write_text(json.dumps(reports,indent=2))
for k in range(3):
 sheet=Image.new('RGB',(1400,1600),'#ced3d9');d=ImageDraw.Draw(sheet)
 for i,p in enumerate(sorted((ROOT/'output/scans').glob('*.jpg'))[k*28:(k+1)*28]):
  im=Image.open(p);im.thumbnail((190,365));x=i%7*200;y=i//7*400;sheet.paste(im,(x,y+23));d.text((x+8,y+4),p.stem,fill='black')
 sheet.save(ROOT/'output'/f'scans-contact-{k}.jpg')
print('84 scans prepared')
