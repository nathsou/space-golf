var k=Object.defineProperty;var D=(s,t,e)=>t in s?k(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var l=(s,t,e)=>(D(s,typeof t!="symbol"?t+"":t,e),e);import{c as x,a as R}from"./vendor.be7e0c02.js";const U=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}};U();const z=(s,t)=>s+Math.random()*(s-t),h=(s,t)=>s+Math.floor(Math.random()*(t-s+1)),H=s=>s[Math.floor(Math.random()*s.length)],p=(s,t)=>(Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-2.5)*.5*t+s,B=s=>{for(let t=s.length-1;t>=1;t--){const e=h(0,t);[s[e],s[t]]=[s[t],s[e]]}},v=class{constructor(t,e){l(this,"x");l(this,"y");this.x=t,this.y=e}addMut({x:t,y:e}){return this.x+=t,this.y+=e,this}add({x:t,y:e}){return c(this.x+t,this.y+e)}subMut({x:t,y:e}){return this.x-=t,this.y-=e,this}sub({x:t,y:e}){return c(this.x-t,this.y-e)}timesMut(t){return this.x*=t,this.y*=t,this}times(t){return c(this.x*t,this.y*t)}divMut(t){return this.x/=t,this.y/=t,this}div(t){return c(this.x/t,this.y/t)}distSq({x:t,y:e}){return(t-this.x)**2+(e-this.y)**2}dist(t){return Math.sqrt(this.distSq(t))}length(){return Math.sqrt(this.lengthSq())}lengthSq(){return this.x**2+this.y**2}normalize(){return this.div(this.length())}normalizeMut(){return this.divMut(this.length()),this}copy({x:t,y:e}){return this.x=t,this.y=e,this}set(t,e){return this.x=t,this.y=e,this}clone(){return c(this.x,this.y)}dot({x:t,y:e}){return this.x*t+this.y*e}reflectMut(t){const e=2*this.dot(t);return this.x-=t.x*e,this.y-=t.y*e,this}reflect(t){return this.sub(t.times(2*this.dot(t)))}limitMut(t){return this.lengthSq()>t*t?this.normalizeMut().timesMut(t):this}limit(t){return this.lengthSq()>t*t?this.normalize().timesMut(t):this.clone()}};let f=v;l(f,"v1",new v(0,0)),l(f,"v2",new v(0,0)),l(f,"v3",new v(0,0));const c=(s,t)=>new f(s,t),d=class{constructor(){l(this,"tiles");this.tiles=new Map}setStaticRegion(t,e,o){for(const n of this.visibleTiles(t,e,o))n.static=!0}removeUnused(){const t=Date.now(),e=d.UNUSED_THRESHOLD*Math.exp(-(this.tiles.size-d.MAX_CACHE_SIZE)/90);for(const[o,n]of this.tiles.entries())!n.static&&t-n.lastUsed>e&&this.tiles.delete(o)}createTile(t,e=!1){this.tiles.size>=d.MAX_CACHE_SIZE&&this.removeUnused();const o=[],n=p(20,10);for(let r=0;r<n;r++)o.push({center:c(h(0,d.TILE_SIZE),h(0,d.TILE_SIZE)).addMut(t),radius:Math.floor(p(3,1))});return{stars:o,position:t,lastUsed:Date.now(),static:e}}tileAt(t,e){const o=`${t}:${e}`;if(this.tiles.has(o)){const r=this.tiles.get(o);return r.lastUsed=Date.now(),r}const n=this.createTile(c(t*d.TILE_SIZE,e*d.TILE_SIZE));return this.tiles.set(o,n),n}*visibleTiles(t,e,o){for(let n=t.x-d.TILE_SIZE;n<=t.x+e;n+=d.TILE_SIZE)for(let r=t.y-d.TILE_SIZE;r<=t.y+o;r+=d.TILE_SIZE)yield this.tileAt(Math.floor(n/d.TILE_SIZE),Math.floor(r/d.TILE_SIZE))}clear(){this.tiles.clear()}};let b=d;l(b,"TILE_SIZE",1024),l(b,"MAX_CACHE_SIZE",200),l(b,"UNUSED_THRESHOLD",10*1e3);const P=(s,t)=>s.center.distSq(t.center)<=(s.radius+t.radius+C)**2,q=(s,t,e,o)=>({center:c(h(0,e),h(0,o)),radius:h(s,t)}),F=(s,t,e,o,n,r)=>{const i={retry:()=>{const a=q(t,e,o,n);return s.some(u=>P(a,u))?i.retry():a},shrink:()=>{const a=q(t,e,o,n);for(;s.some(u=>P(a,u))&&a.radius>=t;)a.radius-=1;return a.radius<t?i.shrink():a},exact:()=>{const a=c(h(0,o),h(0,n)),u=Math.min(h(t,e),...s.map(y=>y.center.dist(a)-y.radius));return u<t+C?i.exact():{center:a,radius:u}}};return i[r]()},W=(s,t,e,o,n,r)=>{const i=[];for(let a=0;a<s;a++)i.push(F(i,t,e,o,n,r));return i},G=()=>{const s=H(X);B(s);let t=0;return()=>s[t++%s.length]},X=[["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],["#e63946","#f1faee","#a8dadc","#457b9d","#1d3557"],["#006d77","#83c5be","#edf6f9","#ffddd2","#e29578"],["#ef476f","#ffd166","#06d6a0","#118ab2","#073b4c"],["#f72585","#7209b7","#3a0ca3","#4361ee","#4cc9f0"],["#dec9e9","#dac3e8","#d2b7e5","#c19ee0","#b185db"],["#a06cd5","#9163cb","#815ac0","#7251b5","#6247aa"],["#f79256","#fbd1a2","#7dcfb6","#00b2ca","#1d4e89"],["#1a535c","#4ecdc4","#f7fff7","#ff6b6b","#ffe66d"],["#eddcd2","#fff1e6","#fde2e4","#fad2e1","#c5dedd"],["#dbe7e4","#f0efeb","#d6e2e9","#bcd4e6","#99c1de"],["#27187e","#758bfd","#aeb8fe","#f1f2f6","#ff8600"],["#ffbc42","#d81159","#8f2d56","#218380","#73d2de"],["#f8ffe5","#06d6a0","#1b9aaa","#ef476f","#ffc43d"],["#ddfff7","#93e1d8","#ffa69e","#aa4465","#861657"],["#826aed","#c879ff","#ffb7ff","#3bf4fb","#caff8a"],["#ff00ea","#b300e8","#880dff","#3500e8","#000bff"],["#034732","#008148","#c6c013","#ef8a17","#ef2917"],["#000000","#e4d6a7","#e9b44c","#9b2915","#50a2a7"],["#114b5f","#028090","#e4fde1","#456990","#f45b69"],["#ffffff","#84dcc6","#a5ffd6","#ffa69e","#ff686b"],["#602437","#ff8700","#ffd300","#deff0a","#a1ff0a"],["##0aff99","#0aefff","#147df5","#580aff","#be0aff"],["#90f1ef","#ffd6e0","#ffef9f","#c1fba4","#7bf1a8"],["#5465ff","#788bff","#9bb1ff","#bfd7ff","#e2fdff"],["#ffc2d4","#ff9ebb","#ff7aa2","#e05780","#b9375e","#8a2846","#602437"],["#fffae5","#fff6cc","#fff2b2","#ffee99","#ffe97f"],["#ffe566","#ffe14c","#ffdd32","#ffd819","#ffd400"],["#faa916","#fbfffe","#6d676e","#96031a","#deff0a"],["#d88c9a","#f2d0a9","#f1e3d3","#99c1b9","#8e7dbe"],["#d9f4c7","#f8fa90","#f4ef88","#ac9969","#9dcdc0"],["#be0e57","#3626a7","#657ed4","#ff331f","#fbfbff"],["#1c77c3","#39a9db","#40bcd8","#f39237","#d63230"],["#00568f","#a30000","#ff7700","#efd28d","#00afb5"],["#247ba0","#70c1b3","#b2dbbf","#f3ffbd","#ff1654"],["#8ab1d0","#4c6a94","#e6aace","#f0f4ef","#91a550"],["#0e7c7b","#17bebb","#d4f4dd","#d62246","#933979"],["#6aa0a0","#ffffff","#ffd5c2","#f28f3b","#c8553d"],["#8b8bd0","#764ad3","#402bca","#7180b9","#c4e9ce"],["#24a810","#abff4f","#08bdbd","#f21b3f","#ff9914"],["#6f1d1b","#bb9457","#f5f5f5","#99582a","#ffe6a7"],["#fe4a49","#2ab7ca","#fed766","#858599","#f4f4f8"],["#de6b48","#e5b181","#f4b9b2","#daedbd","#7dbbc3"],["#eef4d4","#daefb3","#ea9e8d","#d64550","#649089"],["#f7b267","#f79d65","#f4845f","#f27059","#f25c54"],["#086788","#07a0c3","#f0c808","#fff1d0","#dd1c1a"],["#b5ffe1","#93e5ab","#65b891","#4e878c","#00A37A"],["#c1c1c1","#2c4251","#d16666","#b6c649","#ffffff"]],m=6,C=m*4,_=s=>s**2*2700,A=(s,t,e=m)=>{const o=z(0,2*Math.PI);return s.add(c(Math.cos(o),Math.sin(o)).times(t+e))},j=(s=10)=>t=>{const e=G();W(s,40,90,window.innerWidth,window.innerHeight,"retry").forEach(({center:o,radius:n},r)=>{const i=t.addEntity([{type:"body",position:o,mass:_(n)},{type:"shape",kind:"circle",color:e(),radius:n},{type:"attractor"}]);r===s-1&&i.add({type:"target",target:A(o,n,0)})})},K=(s=1)=>t=>{const e=t.query("body","shape","attractor"),[{position:o},{radius:n}]=e.find(([r,i,a,u])=>!t.hasComponent(u,"target")||e.length===1);for(let r=0;r<s;r++)t.addEntity([{type:"body",position:A(o,n),mass:_(m)},{type:"movement",acceleration:c(0,0),velocity:c(0,0),prevPosition:c(1/0,1/0)},{type:"shape",kind:"circle",radius:m,color:"rgb(255, 255, 255)"}])},Y=s=>{const{canvas:t,action:e}=s.resources;t.addEventListener("pointerdown",o=>{e.start.set(o.clientX,o.clientY)}),t.addEventListener("pointermove",o=>{e.start.x<1/0&&e.end.set(o.clientX,o.clientY)}),t.addEventListener("pointerup",()=>{const o=f.v1.copy(e.start).subMut(e.end).timesMut(500).limitMut(1e5*.6);if(!isNaN(o.x)&&!isNaN(o.y))for(const[{acceleration:n},r]of s.queryIter("movement"))s.hasComponent(r,"active")||s.addComponent(r,{type:"active"}),n.addMut(o);e.start.set(1/0,1/0),e.end.set(1/0,1/0)}),window.addEventListener("keydown",o=>{o.key===" "&&(s.resources.game.deltaT=1/20)}),window.addEventListener("keyup",o=>{o.key===" "&&(s.resources.game.deltaT=1/60)})},O=2*Math.PI,N=m*2,Z="rgb(9, 7, 56)",$=s=>{const{canvas:t,context:e}=s.resources;e.clearRect(0,0,s.resources.canvas.width,t.height),e.fillStyle=Z,e.fillRect(0,0,t.width,t.height)},E=(s,t,e,o)=>{s.beginPath(),s.fillStyle=o,s.arc(t.x,t.y,e,0,O),s.closePath(),s.fill()},J=s=>{for(const[{position:t},e]of s.queryIter("body","shape","attractor"))e.kind==="circle"&&E(s.resources.context,f.v1.copy(t).addMut(s.resources.game.camera.offset),e.radius,e.color)},Q=s=>{for(const[{position:t},e,o,n]of s.queryIter("body","shape","movement"))if(e.kind==="circle"){const r=f.v1.copy(t).addMut(s.resources.game.camera.offset),i=s.hasComponent(n,"active")?e.color:"lightgrey";E(s.resources.context,r,e.radius,i)}},V=s=>{const{context:t,action:e}=s.resources,o=s.resources.game.camera.offset;if(e.start.x<1/0){const n=f.v1.copy(e.start).subMut(e.end).timesMut(.5).limitMut(e.maxLength);for(const[r,{position:i}]of s.queryIter("movement","body"))t.beginPath(),t.strokeStyle="rgb(255, 255, 255)",t.moveTo(i.x+o.x,i.y+o.y),t.lineTo(i.x+o.x+n.x,i.y+o.y+n.y),t.closePath(),t.stroke()}},tt=s=>{const{context:t}=s.resources,e=s.resources.game.camera.offset;for(const[{target:o}]of s.queryIter("target"))t.beginPath(),t.fillStyle=Z,t.arc(o.x+e.x,o.y+e.y,N,0,O),t.closePath(),t.fill()},et="rgb(234, 231, 163)",st=s=>{const{context:t,stars:e}=s.resources,o=s.resources.game.camera.offset;for(const n of e.visibleTiles(o,t.canvas.width,t.canvas.height))for(const{center:r,radius:i}of n.stars){const a=o.x-r.x+t.canvas.width-b.TILE_SIZE,u=o.y-r.y+t.canvas.height-b.TILE_SIZE;E(t,f.v1.set(a,u),i,et)}},ot=x($,st,J,tt,Q,V),nt=2.4,rt=.02,it=s=>{const t=s.queryIter("active","movement","body"),e=s.resources.game.deltaT;for(const[o,{velocity:n,acceleration:r},{position:i,mass:a}]of t){for(const[u,{position:y,mass:I}]of s.queryIter("attractor","body")){const g=f.v1.copy(y).subMut(i),M=nt*s.resources.screenSizeFactor*(a*I/g.lengthSq()),S=g.normalizeMut().timesMut(M);r.addMut(S.divMut(a))}n.addMut(f.v1.copy(r).timesMut(e)),i.addMut(f.v1.copy(n).timesMut(e)),r.set(0,0)}},at=s=>{const t=s.queryIter("active","movement","body","shape");for(const[e,{velocity:o,prevPosition:n},{position:r},i,a]of t)for(const[u,{position:y},I,g]of s.queryIter("attractor","body","shape")){const M=i.radius+I.radius;if(r.distSq(y)<=M**2){const S=f.v1.copy(r).subMut(y).normalizeMut(),L=f.v2.copy(y).addMut(f.v3.copy(S).timesMut(M));o.subMut(f.v3.copy(o).timesMut(rt)),o.reflectMut(S).timesMut(.76);const w=s.getComponent(g,"target");w&&w.target.distSq(r)<=N**2&&(L.copy(w.target),s.removeComponent(a,"active"),s.resources.game.nextLevel()),r.copy(L),n.distSq(r)<.3&&s.removeComponent(a,"active"),n.copy(r);break}}},ft=x(it,at),ct=100,dt=s=>{const t=s.resources.game.camera,e=s.query("movement","body");if(e.length===1){const[o,{position:n}]=e[0],{canvas:r}=s.resources,i=f.v1.set(0,0);n.x<0&&(i.x=-n.x),n.x>r.width/2&&(i.x=r.width/2-n.x),n.y<0&&(i.y=-n.y),n.y>r.height/2&&(i.y=r.height/2-n.y),(i.x!==0||i.y!==0)&&i.addMut(f.v2.set(r.width/2,r.height/2).subMut(n).normalizeMut().timesMut(ct)),t.targetOffset.copy(i),t.offset.addMut(f.v3.copy(t.targetOffset).subMut(t.offset).timesMut(.05))}};class lt{constructor(){l(this,"app");l(this,"canvas");l(this,"camera");l(this,"deltaT",1/60);const t=document.createElement("canvas");this.canvas=t,t.width=window.innerWidth,t.height=window.innerHeight;const e=t.getContext("2d"),o=window.devicePixelRatio;if(t.style.width=window.innerWidth+"px",t.style.height=window.innerHeight+"px",t.width=Math.floor(window.innerWidth*o),t.height=Math.floor(window.innerHeight*o),e===null)throw"could not get canvas 2d context";e.scale(o,o),this.camera={offset:c(0,0),targetOffset:c(0,0)},this.app=R({canvas:t,context:e,action:{start:c(1/0,1/0),end:c(1/0,1/0),maxLength:180},game:this,stars:new b,screenSizeFactor:1}).addStartupSystem(Y).addSystem(ft).addSystem(ot).addSystem(dt),this.nextLevel(!0)}nextLevel(t=!1){const e=x(j(Math.round(p(4,2))),K(1));setTimeout(()=>{this.app.clearEntities(),this.app.resources.stars.clear(),this.app.resources.stars.setStaticRegion(f.v1.set(0,0),this.canvas.width,this.canvas.height),e(this.app)},t?0:1e3)}run(){this.app.run()}}const T=new lt;T.run();document.body.appendChild(T.canvas);window.game=T;