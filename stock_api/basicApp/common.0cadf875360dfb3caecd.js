"use strict";(self.webpackChunkbasic_app=self.webpackChunkbasic_app||[]).push([[592],{4581:(y,m,h)=>{h.d(m,{E:()=>r});let p=1;const v=Promise.resolve(),s={};function a(u){return u in s&&(delete s[u],!0)}const l={setImmediate(u){const e=p++;return s[e]=!0,v.then(()=>a(e)&&u()),e},clearImmediate(u){a(u)}};var d=h(6465),c=h(6102);const r=new class extends c.v{flush(e){this.active=!0,this.scheduled=void 0;const{actions:n}=this;let t,b=-1,w=n.length;e=e||n.shift();do{if(t=e.execute(e.state,e.delay))break}while(++b<w&&(e=n.shift()));if(this.active=!1,t){for(;++b<w&&(e=n.shift());)e.unsubscribe();throw t}}}(class extends d.o{constructor(e,n){super(e,n),this.scheduler=e,this.work=n}requestAsyncId(e,n,t=0){return null!==t&&t>0?super.requestAsyncId(e,n,t):(e.actions.push(this),e.scheduled||(e.scheduled=l.setImmediate(e.flush.bind(e,null))))}recycleAsyncId(e,n,t=0){if(null!==t&&t>0||null===t&&this.delay>0)return super.recycleAsyncId(e,n,t);0===e.actions.length&&(l.clearImmediate(n),e.scheduled=void 0)}})},8239:(y,m,h)=>{function p(s,a,l,f,d,o,c){try{var i=s[o](c),r=i.value}catch(A){return void l(A)}i.done?a(r):Promise.resolve(r).then(f,d)}function v(s){return function(){var a=this,l=arguments;return new Promise(function(f,d){var o=s.apply(a,l);function c(r){p(o,f,d,c,i,"next",r)}function i(r){p(o,f,d,c,i,"throw",r)}c(void 0)})}}h.d(m,{Z:()=>v})}}]);