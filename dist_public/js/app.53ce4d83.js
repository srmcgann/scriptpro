(function(){"use strict";var t={430:function(t,e,n){var r=n(963),s=n(252);function i(t,e,n,r,i,o){const a=(0,s.up)("Main");return(0,s.wg)(),(0,s.j4)(a,{state:i.state},null,8,["state"])}const o={class:"main"},a=["innerHTML"],u={id:"debug",ref:"debug"};function l(t,e,n,r,i,l){return(0,s.wg)(),(0,s.iD)("div",o,[(0,s._)("div",{innerHTML:n.state.headerText},null,8,a),(0,s._)("textarea",{spellcheck:"false",ref:"scriptInput",id:"scriptInput",onInput:e[0]||(e[0]=t=>l.processInput())},null,544),(0,s._)("div",u,null,512)])}var c={name:"Main",props:["state"],data(){return{goodClass:"goodClass",badClass:"badClass"}},methods:{redraw(t,e){let n,r,s=this.tokenize(t),i=this.tokenize(e),o="",a="";this.$refs["debug"].innerHTML="";for(let u=0;u<t.length;u++){let e=t[u];if((n=s.filter((t=>t.pos==u))).length)if(r=i.filter((t=>t.pos==u)),r.length)a='<span class="',a+=n[0].value===r[0].value?this.goodClass:this.badClass,a+='">'+n[0].value+"</span>",u+=Math.max(0,n[0].value.length-1);else switch(e){case"\n":a="<br>";break;default:a=e;break}else switch(e){case"\n":a="<br>";break;default:a=e;break}o+=a}this.$refs["debug"].innerHTML=o},getCorrection(){if(!this.state.scriptInput.value)return void(this.$refs["debug"].innerHTML="");let t={tokens:this.state.scriptInput.value};fetch("https://"+this.state.rootDomain+"/autosyntax/autocorrect.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((t=>t.text())).then((e=>{e[0]?this.redraw(t.tokens,e[0]):this.redraw("","")}))},tokenize(t){if(!t)return;let e=[],n={pos:0,value:""};return t.split("").map(((t,r)=>{/[a-zA-Z]/.test(t)||/[0-9]/.test(t)||"_"==t||"-"==t?n.value+=t:(e=[...e,n],n={pos:r+1,value:""})})),n&&(e=[...e,n]),e},processInput(){this.$refs["debug"].innerHTML="";let t=this.state.scriptInput.value,e=this.tokenize(t);e.length?this.state.tokens=e.map((t=>({token:t,stale:!0,correction:""}))):(this.state.tokens=[],this.tokens=[],this.$refs["debug"].innerHTML=""),this.getCorrection()}},mounted(){this.state.scriptInput=this.$refs["scriptInput"],this.state.scriptInput.focus()}},p=n(744);const h=(0,p.Z)(c,[["render",l]]);var f,d=h,v={name:"App",components:{Main:d},data(){return{state:{headerText:"test",baseURL:"https://"+window.location.hostname,baseDemoURL:"https://demo."+(f=window.location.hostname.split(".")).filter(((t,e)=>e>f.length-3)).join("."),rootDomain:window.location.hostname,scriptInput:null,tokens:[]}}}};const b=(0,p.Z)(v,[["render",i]]);var g=b;(0,r.ri)(g).mount("#app")}},e={};function n(r){var s=e[r];if(void 0!==s)return s.exports;var i=e[r]={exports:{}};return t[r](i,i.exports,n),i.exports}n.m=t,function(){var t=[];n.O=function(e,r,s,i){if(!r){var o=1/0;for(c=0;c<t.length;c++){r=t[c][0],s=t[c][1],i=t[c][2];for(var a=!0,u=0;u<r.length;u++)(!1&i||o>=i)&&Object.keys(n.O).every((function(t){return n.O[t](r[u])}))?r.splice(u--,1):(a=!1,i<o&&(o=i));if(a){t.splice(c--,1);var l=s();void 0!==l&&(e=l)}}return e}i=i||0;for(var c=t.length;c>0&&t[c-1][2]>i;c--)t[c]=t[c-1];t[c]=[r,s,i]}}(),function(){n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={143:0};n.O.j=function(e){return 0===t[e]};var e=function(e,r){var s,i,o=r[0],a=r[1],u=r[2],l=0;if(o.some((function(e){return 0!==t[e]}))){for(s in a)n.o(a,s)&&(n.m[s]=a[s]);if(u)var c=u(n)}for(e&&e(r);l<o.length;l++)i=o[l],n.o(t,i)&&t[i]&&t[i][0](),t[i]=0;return n.O(c)},r=self["webpackChunkscriptpro"]=self["webpackChunkscriptpro"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(430)}));r=n.O(r)})();
//# sourceMappingURL=app.53ce4d83.js.map