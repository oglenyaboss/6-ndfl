(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{5461:function(e,t,l){Promise.resolve().then(l.bind(l,7641))},7641:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return B}});var n=l(7437),s=l(2265),a=l(609),r=l(9242),o=()=>{let e=["M47.4,-34.9C61.2,-20.5,71.9,-0.8,67.2,13.5C62.5,27.8,42.3,36.8,21.3,48.5C0.4,60.2,-21.3,74.7,-38.7,70.2C-56,65.7,-69.1,42.2,-73,18.5C-77,-5.2,-71.7,-29.1,-58,-43.5C-44.3,-57.9,-22.1,-62.8,-2.7,-60.6C16.8,-58.5,33.6,-49.3,47.4,-34.9Z","M45.5,-40.3C56.7,-22.2,62.1,-3.4,59.1,15C56.1,33.5,44.8,51.6,27.5,61.7C10.2,71.8,-13.1,73.8,-34.8,65.8C-56.5,57.8,-76.5,39.9,-79.5,20.1C-82.5,0.3,-68.4,-21.5,-52.3,-40.7C-36.2,-59.9,-18.1,-76.4,-0.5,-76.1C17.1,-75.7,34.3,-58.3,45.5,-40.3Z","M50.8,-38.4C64.3,-23.6,72.6,-2.5,70.5,19.7C68.3,42,55.6,65.6,38.2,70.7C20.7,75.8,-1.5,62.5,-23.7,51.1C-45.9,39.6,-68.1,30.1,-76.6,12C-85.1,-6.1,-80,-32.9,-64.9,-48C-49.9,-63.2,-24.9,-66.8,-3.1,-64.3C18.6,-61.8,37.3,-53.2,50.8,-38.4Z","M58.7,-47.5C67.1,-36.2,58.9,-12.3,53.1,11.5C47.2,35.4,43.5,59.1,28,72C12.4,84.8,-15.1,86.7,-35,75.9C-54.8,65.1,-67,41.6,-71.2,17.8C-75.5,-6.1,-71.8,-30.2,-58.6,-42.6C-45.4,-55.1,-22.7,-55.8,1.2,-56.8C25.1,-57.7,50.2,-58.9,58.7,-47.5Z","M54.1,-45.3C63.3,-31.6,59.3,-9.5,52.6,8.9C45.9,27.2,36.5,41.8,23.1,48.4C9.7,55,-7.7,53.7,-24.2,47C-40.7,40.3,-56.1,28.3,-63.3,10.6C-70.4,-7.2,-69.2,-30.7,-57.2,-45.1C-45.3,-59.4,-22.7,-64.6,-0.1,-64.6C22.4,-64.5,44.9,-59.1,54.1,-45.3Z"],[t]=s.useState(e[Math.floor(Math.random()*e.length)]),l=(0,a.c)(Math.random()*window.innerWidth),o=(0,a.c)(Math.random()*window.innerHeight),i=(0,a.c)((Math.random()-.5)*10),c=(0,a.c)((Math.random()-.5)*10),d=(0,a.c)(360*Math.random()),u=(0,a.c)((Math.random()-.5)*1);return s.useEffect(()=>{let e=l.onChange(e=>{(e<-window.innerWidth/2||e>window.innerWidth)&&i.set(-i.get())}),t=o.onChange(e=>{(e<-window.innerHeight/2||e>window.innerHeight/2)&&c.set(-c.get())});return()=>{e(),t()}},[]),s.useEffect(()=>{let e=setInterval(()=>{l.set(l.get()+i.get()),o.set(o.get()+c.get()),d.set((d.get()+u.get())%360)},1e3/60);return()=>clearInterval(e)},[]),(0,n.jsx)(r.E.svg,{viewBox:"0 0 200 200",xmlns:"http://www.w3.org/2000/svg",className:"absolute",style:{x:l,y:o,rotate:d,scale:.5},children:(0,n.jsx)(r.E.path,{d:t,fill:"#FA4D56",transform:"translate(100 100)",scale:.5})})},i=l(7042),c=l(4769);function d(){for(var e=arguments.length,t=Array(e),l=0;l<e;l++)t[l]=arguments[l];return(0,c.m6)((0,i.W)(t))}let u=s.forwardRef((e,t)=>{let{className:l,type:s,...a}=e;return(0,n.jsx)("input",{type:s,className:d("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",l),ref:t,...a})});u.displayName="Input";var f=l(7256),h=l(9213);let m=(0,h.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),g=s.forwardRef((e,t)=>{let{className:l,variant:s,size:a,asChild:r=!1,...o}=e,i=r?f.g7:"button";return(0,n.jsx)(i,{className:d(m({variant:s,size:a,className:l})),ref:t,...o})});g.displayName="Button";var x=l(1424),p=l(9901);let w=e=>{let{shouldScaleBackground:t=!0,...l}=e;return(0,n.jsx)(p.d.Root,{shouldScaleBackground:t,...l})};w.displayName="Drawer";let v=p.d.Trigger,j=p.d.Portal,b=p.d.Close,y=s.forwardRef((e,t)=>{let{className:l,...s}=e;return(0,n.jsx)(p.d.Overlay,{ref:t,className:d("fixed inset-0 z-50 bg-black/80",l),...s})});y.displayName=p.d.Overlay.displayName;let C=s.forwardRef((e,t)=>{let{className:l,children:s,...a}=e;return(0,n.jsxs)(j,{children:[(0,n.jsx)(y,{}),(0,n.jsxs)(p.d.Content,{ref:t,className:d("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",l),...a,children:[(0,n.jsx)("div",{className:"mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"}),s]})]})});C.displayName="DrawerContent";let N=e=>{let{className:t,...l}=e;return(0,n.jsx)("div",{className:d("grid gap-1.5 p-4 text-center sm:text-left",t),...l})};N.displayName="DrawerHeader";let $=s.forwardRef((e,t)=>{let{className:l,...s}=e;return(0,n.jsx)(p.d.Title,{ref:t,className:d("text-lg font-semibold leading-none tracking-tight",l),...s})});$.displayName=p.d.Title.displayName;let k=s.forwardRef((e,t)=>{let{className:l,...s}=e;return(0,n.jsx)(p.d.Description,{ref:t,className:d("text-sm text-muted-foreground",l),...s})});k.displayName=p.d.Description.displayName;var M=l(6743);let E=(0,h.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),F=s.forwardRef((e,t)=>{let{className:l,...s}=e;return(0,n.jsx)(M.f,{ref:t,className:d(E(),l),...s})});F.displayName=M.f.displayName;let R=l(2831),S=new R.Builder({xmldec:{version:"1.0",encoding:"windows-1251"}}),z=new R.Parser;async function O(e,t){let l=await z.parseStringPromise(e),n=await z.parseStringPromise(t),s=l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"],a=n["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"],r=parseInt(s[s.length-1].$["НомСпр"]);a.forEach((e,t)=>{e.$["НомСпр"]=(r+t+1).toString()});let o=s.concat(a);l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"]=o;let i=null==l?void 0:l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалИсч"],c=null==n?void 0:n["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалИсч"],d=null==l?void 0:l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалУдерж"],u=null==n?void 0:n["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалУдерж"];return null==l||l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалВозвр"],null==n||n["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалВозвр"],l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалИсч"]=+i+ +c,l["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0].$["СумНалУдерж"]=+d+ +u,S.buildObject(l)}async function D(e){console.log("started");let t=await z.parseStringPromise(e),l=null==t?void 0:t["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0],n=l.$["СумНалИсч"],s=l.$["СумНалВозвр"];"0"===s?l.$["СумНалУдерж"]=n:(x.toast.warning("Сумма налога к возврату не равна нулю, проверьте удержанный налог!"),l.$["СумНалУдерж"]=+n+ +s),l.$["СумНалНеУдерж"]=0,l.$["СумНалИзлУдерж"]=0;let a=t["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];return console.log(a),a.forEach(e=>{let t=e["СведДох"],l=t[0]["СумИтНалПер"][0].$["НалИсчисл"],n=t[0]["СумИтНалПер"][0].$["НалВозвр"];void 0!==t[0]["СумИтНалПер"][0].$["НалПер"]&&(t[0]["СумИтНалПер"][0].$["НалПер"]=l),console.log(l),0===n||void 0===n?(t[0]["СумИтНалПер"][0].$["НалУдерж"]=l,t[0]["СумИтНалПер"][0].$["НалУдержЛиш"]=0,console.log(n)):(x.toast.warning("Сумма налога к возврату не равна нулю, проверьте удержанный налог в 2-ндфл!"),t[0]["СумИтНалПер"][0].$["НалУдерж"]=+l+ +n,t[0]["СумИтНалПер"][0].$["НалУдержЛиш"]=0)}),S.buildObject(t)}async function P(e){let t=await z.parseStringPromise(e),l=null==t?void 0:t["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];return console.log(l),l.forEach(e=>{let t;let l=e["СведДох"][0]["ДохВыч"][0]["СвСумДох"],n=e["ПолучДох"][0]["ФИО"][0].$;do t=!1,l.forEach(e=>{let s=parseFloat(e.$["СумДоход"]),a=e.$["КодДоход"];if(s<0){let r=l.findIndex(e=>e.$["КодДоход"]===a&&parseFloat(e.$["СумДоход"])>0);if(-1!==r){let n=parseFloat(l[r].$["СумДоход"])+s;l[r].$["СумДоход"]=n.toFixed(2),0===n&&l.splice(r,1),e.$["СумДоход"]="0",t=!0}else console.log("Не найден код дохода для ".concat(n["Фамил"],", ").concat(n["Имя"],", ").concat(n["Отчество"])),x.toast.warning("Не найден код дохода для ".concat(n["Фамилия"],", ").concat(n["Имя"],", ").concat(n["Отчество"]))}});while(t);e["СведДох"][0]["ДохВыч"][0]["СвСумДох"]=l.filter(e=>0!==parseFloat(e.$["СумДоход"]))}),S.buildObject(t)}async function T(e){let t=await z.parseStringPromise(e),l=null==t?void 0:t["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"],n=0;return console.log(l),l.forEach(e=>{let t=e["СведДох"][0]["СумИтНалПер"][0].$["НалБаза"];if(console.log(t),t<10){let t=e["ПолучДох"][0]["ФИО"][0].$;x.toast.warning("Налоговая база меньше 10 для ".concat(t["Фамилия"],", ").concat(t["Имя"],", ").concat(t["Отчество"])),console.log("Налоговая база меньше 10 для ".concat(t["Фамилия"],", ").concat(t["Имя"],", ").concat(t["Отчество"]))}if(0===t||void 0===t){let t=e["ПолучДох"][0]["ФИО"][0].$;x.toast.warning("Не найдена налоговая база для ".concat(t["Фамилия"],", ").concat(t["Имя"],", ").concat(t["Отчество"])),console.log("Не найдена налоговая база для ".concat(t["Фамилия"],", ").concat(t["Имя"],", ").concat(t["Отчество"]))}e["СведДох"][0]["СумИтНалПер"][0].$["НалИсчисл"]=Math.round(.13*t),n+=Math.round(.13*t)}),(null==t?void 0:t["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]).$["СумНалИсч"]=n,S.buildObject(t)}var B=()=>{let[e,t]=s.useState(null),[l,a]=s.useState(null),[i,c]=s.useState(null);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.E.div,{style:{visibility:"hidden",position:"absolute",left:"-100%"},animate:{left:["-100%","100%"]},transition:{duration:10,repeat:1/0},children:(0,n.jsx)("svg",{children:(0,n.jsxs)("filter",{id:"glass",children:[(0,n.jsx)("feTurbulence",{type:"fractalNoise",baseFrequency:"0.01",numOctaves:"1",result:"warp"}),(0,n.jsx)("feDisplacementMap",{xChannelSelector:"R",yChannelSelector:"G",scale:"50",in:"SourceGraphic",in2:"warp"}),(0,n.jsx)("feGaussianBlur",{stdDeviation:"1"})]})})}),(0,n.jsxs)("div",{className:"flex justify-center items-center h-screen overflow-hidden w-screen glass-effect flex-col",children:[(0,n.jsxs)(w,{children:[(0,n.jsx)(v,{children:(0,n.jsx)(g,{className:"z-10 m-4",asChild:!0,children:(0,n.jsx)("span",{className:"text-white",children:"Объединить отчеты"})})}),(0,n.jsxs)(C,{children:[(0,n.jsx)(b,{children:(0,n.jsx)("span",{className:"text-white",children:"Закрыть"})}),(0,n.jsxs)(N,{children:[(0,n.jsx)($,{children:"Объеденение"}),(0,n.jsx)(k,{children:"В данном разделе вы можете объединить два 6-ндфл в один файл файл"}),(0,n.jsx)(F,{htmlFor:"file",children:"Главный"}),(0,n.jsx)(u,{placeholder:"Загрузите главный отчет",className:"w-1/2",onChange:e=>{var t;let l=null===(t=e.target.files)||void 0===t?void 0:t.item(0);if(l){let e=new FileReader;e.onload=e=>{var t;let l=null===(t=e.target)||void 0===t?void 0:t.result;a(l),console.log(l),x.toast.success("Файл загружен")},e.readAsText(l,"windows-1251")}},type:"file"}),(0,n.jsx)(F,{htmlFor:"file",children:"Вторичный"}),(0,n.jsx)(u,{placeholder:"Загрузите вторичный отчет",className:"w-1/2",onChange:e=>{var t;let l=null===(t=e.target.files)||void 0===t?void 0:t.item(0);if(l){let e=new FileReader;e.onload=e=>{var t;let l=null===(t=e.target)||void 0===t?void 0:t.result;c(l),console.log(l),x.toast.success("Файл загружен")},e.readAsText(l,"windows-1251")}},type:"file"}),(0,n.jsx)(g,{className:"z-10 m-4",disabled:!l||!i,onClick:()=>{try{O(l,i).then(e=>{console.log(e),t(e)})}catch(e){x.toast.error("Ошибка при обработке файла"),console.log(e)}finally{x.toast.success("Файл обработан")}},children:(0,n.jsx)("span",{className:"text-white",children:"Объединить файлы"})})]})]})]}),(0,n.jsx)(o,{},1),(0,n.jsx)(o,{},2),(0,n.jsx)(o,{},3),(0,n.jsx)(o,{},4),(0,n.jsx)(o,{},5),(0,n.jsx)(g,{className:"z-10 m-4",disabled:!e,onClick:()=>{try{D(e).then(e=>{console.log(e),t(e)})}catch(e){x.toast.error("Ошибка при обработке файла"),console.log(e)}finally{x.toast.success("Файл обработан")}},children:(0,n.jsx)("span",{className:"text-white",children:"Выровнять удержанный"})}),(0,n.jsx)(g,{className:"z-10 m-4",disabled:!e,onClick:()=>{try{P(e).then(e=>{console.log(e),t(e)})}catch(e){x.toast.error("Ошибка при обработке файла"),console.log(e)}finally{x.toast.success("Файл обработан")}},children:(0,n.jsx)("span",{className:"text-white",children:"Выровнять доходы"})}),(0,n.jsx)(g,{className:"z-10 m-4",disabled:!e,onClick:()=>{try{T(e).then(e=>{console.log(e),t(e)})}catch(e){x.toast.error("Ошибка при обработке файла"),console.log(e)}finally{x.toast.success("Файл обработан")}},children:(0,n.jsx)("span",{className:"text-white",children:"Выровнять налог"})}),e&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(g,{className:"z-10 m-4",onClick:()=>{let t=new Blob([e],{type:"text/plain"}),l=document.createElement("a");l.href=window.URL.createObjectURL(t),l.download="ndfl.xml",l.click()},children:(0,n.jsx)("span",{className:"text-white",children:"Скачать"})}),(0,n.jsx)(g,{className:"z-10 m-4",onClick:()=>{t(null)},children:(0,n.jsx)("span",{className:"text-white",children:"Очистить"})})]}),(0,n.jsx)(u,{className:"z-10 w-1/4",type:"file",onChange:e=>{var l;let n=null===(l=e.target.files)||void 0===l?void 0:l.item(0);if(n){let e=new FileReader;e.onload=e=>{var l;let n=null===(l=e.target)||void 0===l?void 0:l.result;t(n),console.log(n),x.toast.success("Файл загружен")},e.readAsText(n,"windows-1251")}}})]})]})}}},function(e){e.O(0,[424,959,971,938,744],function(){return e(e.s=5461)}),_N_E=e.O()}]);