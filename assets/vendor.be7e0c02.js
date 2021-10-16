const l=(...u)=>e=>{for(let s=0;s<u.length;s++)u[s](e)};class a{constructor(e){Object.defineProperty(this,"entities",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"components",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"startupSystems",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"systems",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"nextId",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"resources",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"running",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!0,writable:!0,value:()=>{this.running&&(this.step(),requestAnimationFrame(this.loop))}}),this.resources=e,this.entities=new Set,this.components=new Map,this.startupSystems=[],this.systems=[]}addEntity(e){const s=this.nextId++;this.entities.add(s);for(const r of e)this.addComponent(s,r);const t={add:r=>(this.addComponent(s,r),t),id:s};return t}addComponent(e,s){var t;const r=s.type;return this.components.has(r)||this.components.set(r,new Map),(t=this.components.get(r))===null||t===void 0||t.set(e,s),this}removeComponent(e,s){var t;return(t=this.components.get(s))===null||t===void 0||t.delete(e),this}removeEntity(e){var s;for(const t of this.components.keys())(s=this.components.get(t))===null||s===void 0||s.delete(e);return this.entities.delete(e),this}getComponent(e,s){var t;return(t=this.components.get(s))===null||t===void 0?void 0:t.get(e)}hasComponent(e,s){var t,r;return(r=(t=this.components.get(s))===null||t===void 0?void 0:t.has(e))!==null&&r!==void 0?r:!1}addSystem(e){return this.systems.push(e),this}addStartupSystem(e){return this.startupSystems.push(e),this}removeSystem(e,s=!1){const t=s?this.startupSystems:this.systems;for(let r=0;r<t.length;r++)if(t[r]===e){t.splice(r,1);break}return this}getEntities(){return this.entities[Symbol.iterator]()}clearEntities(){this.entities.clear(),this.components.clear()}clearSystems(){this.systems=[],this.startupSystems=[]}clear(){this.clearEntities(),this.clearSystems()}storeQueryTuple(e,s,t,r){r[0]=this.getComponent(t,e);for(let n=0;n<s.length;n++){const i=s[n];r[n+1]=this.getComponent(t,i)}r[s.length+1]=t}query(e,...s){var t,r;const n=[];for(const i of(r=(t=this.components.get(e))===null||t===void 0?void 0:t.keys())!==null&&r!==void 0?r:[])if(s.every(o=>this.hasComponent(i,o))){const o=new Array(s.length+2);this.storeQueryTuple(e,s,i,o),n.push(o)}return n}*queryIter(e,...s){var t,r;const n=new Array(s.length+2);for(const i of(r=(t=this.components.get(e))===null||t===void 0?void 0:t.keys())!==null&&r!==void 0?r:[])s.every(o=>this.hasComponent(i,o))&&(this.storeQueryTuple(e,s,i,n),yield n)}step(){for(let e=0;e<this.systems.length;e++)this.systems[e](this)}run(){return this.running=!0,this.startupSystems.forEach(e=>{e(this)}),this.loop(),this}stop(){return this.running=!1,this}}const h=u=>new a(u);export{h as a,l as c};
