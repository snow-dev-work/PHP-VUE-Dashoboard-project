(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-01d13685"],{"043c":function(e,t,n){"use strict";n("f1ad")},"0cb2":function(e,t,n){var r=n("e330"),a=n("7b0b"),s=Math.floor,o=r("".charAt),i=r("".replace),c=r("".slice),u=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,l=/\$([$&'`]|\d{1,2})/g;e.exports=function(e,t,n,r,d,f){var h=n+e.length,p=r.length,v=l;return void 0!==d&&(d=a(d),v=u),i(f,v,(function(a,i){var u;switch(o(i,0)){case"$":return"$";case"&":return e;case"`":return c(t,0,n);case"'":return c(t,h);case"<":u=d[c(i,1,-1)];break;default:var l=+i;if(0===l)return a;if(l>p){var f=s(l/10);return 0===f?a:f<=p?void 0===r[f-1]?o(i,1):r[f-1]+o(i,1):a}u=r[l-1]}return void 0===u?"":u}))}},1276:function(e,t,n){"use strict";var r=n("2ba4"),a=n("c65b"),s=n("e330"),o=n("d784"),i=n("44e7"),c=n("825a"),u=n("1d80"),l=n("4840"),d=n("8aa5"),f=n("50c4"),h=n("577e"),p=n("dc4a"),v=n("4dae"),b=n("14c3"),m=n("9263"),_=n("9f7f"),g=n("d039"),w=_.UNSUPPORTED_Y,O=4294967295,S=Math.min,y=[].push,j=s(/./.exec),k=s(y),x=s("".slice),I=!g((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var n="ab".split(e);return 2!==n.length||"a"!==n[0]||"b"!==n[1]}));o("split",(function(e,t,n){var s;return s="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,n){var s=h(u(this)),o=void 0===n?O:n>>>0;if(0===o)return[];if(void 0===e)return[s];if(!i(e))return a(t,s,e,o);var c,l,d,f=[],p=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),b=0,_=new RegExp(e.source,p+"g");while(c=a(m,_,s)){if(l=_.lastIndex,l>b&&(k(f,x(s,b,c.index)),c.length>1&&c.index<s.length&&r(y,f,v(c,1)),d=c[0].length,b=l,f.length>=o))break;_.lastIndex===c.index&&_.lastIndex++}return b===s.length?!d&&j(_,"")||k(f,""):k(f,x(s,b)),f.length>o?v(f,0,o):f}:"0".split(void 0,0).length?function(e,n){return void 0===e&&0===n?[]:a(t,this,e,n)}:t,[function(t,n){var r=u(this),o=void 0==t?void 0:p(t,e);return o?a(o,t,r,n):a(s,h(r),t,n)},function(e,r){var a=c(this),o=h(e),i=n(s,a,o,r,s!==t);if(i.done)return i.value;var u=l(a,RegExp),p=a.unicode,v=(a.ignoreCase?"i":"")+(a.multiline?"m":"")+(a.unicode?"u":"")+(w?"g":"y"),m=new u(w?"^(?:"+a.source+")":a,v),_=void 0===r?O:r>>>0;if(0===_)return[];if(0===o.length)return null===b(m,o)?[o]:[];var g=0,y=0,j=[];while(y<o.length){m.lastIndex=w?0:y;var I,E=b(m,w?x(o,y):o);if(null===E||(I=S(f(m.lastIndex+(w?y:0)),o.length))===g)y=d(o,y,p);else{if(k(j,x(o,g,y)),j.length===_)return j;for(var C=1;C<=E.length-1;C++)if(k(j,E[C]),j.length===_)return j;y=g=I}}return k(j,x(o,g)),j}]}),!I,w)},"245d":function(e,t,n){"use strict";n("4ed9")},2877:function(e,t,n){"use strict";function r(e,t,n,r,a,s,o,i){var c,u="function"===typeof e?e.options:e;if(t&&(u.render=t,u.staticRenderFns=n,u._compiled=!0),r&&(u.functional=!0),s&&(u._scopeId="data-v-"+s),o?(c=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),a&&a.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},u._ssrRegister=c):a&&(c=i?function(){a.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:a),c)if(u.functional){u._injectStyles=c;var l=u.render;u.render=function(e,t){return c.call(t),l(e,t)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,c):[c]}return{exports:e,options:u}}n.d(t,"a",(function(){return r}))},"3dfd":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"dashboard-table"}},[n("Popups"),n("transition",{attrs:{name:"overlay",mode:"out-in",appear:""}},[e.overlayIsVisible?n("Overlay"):e._e()],1),n("Header",{attrs:{show_btns:!1,view:"TABLE"}}),n("main",[n("Table",{class:[{superadmin:e.admin}],attrs:{fields:e.fields}})],1)],1)},a=[],s=n("1da1"),o=n("2909"),i=n("5530"),c=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("99af"),function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("header",{staticClass:"header",class:[{scroll:e.scroll||e.isMobile}],style:[e.styleSideView]},[r("img",{staticClass:"header__logo",attrs:{src:n("4158")}}),r("div",{staticClass:"header__title__container"},[r("h1",{staticClass:"header__title"},[e._v("Suivi de projets")]),null!==e.date&&e.projects.length>0?r("p",{staticClass:"header__subtitle"},[e._v(" Etat d'avancement au "+e._s(e.date.format("DD/MM/YYYY"))+" ")]):e._e()]),e.isMobile||e.scroll?[r("input",{directives:[{name:"model",rawName:"v-model",value:e.showMenu,expression:"showMenu"}],attrs:{hidden:"",type:"checkbox",id:"header__menu__toggle"},domProps:{checked:Array.isArray(e.showMenu)?e._i(e.showMenu,null)>-1:e.showMenu},on:{change:function(t){var n=e.showMenu,r=t.target,a=!!r.checked;if(Array.isArray(n)){var s=null,o=e._i(n,s);r.checked?o<0&&(e.showMenu=n.concat([s])):o>-1&&(e.showMenu=n.slice(0,o).concat(n.slice(o+1)))}else e.showMenu=a}}}),r("label",{staticClass:"header__menu__toggle__btn",class:[{open:e.showMenu}],attrs:{for:"header__menu__toggle"}},[r("Icon",{attrs:{icon:"arrow-up"}})],1)]:r("nav",{staticClass:"header__nav buttons"},[r("a",{staticClass:"btn",class:{active:"MOBILE"===e.view},attrs:{href:"/?token="+e.token,title:"Vue Mobile"}},[r("Icon",{attrs:{icon:"smartphone"}})],1),r("a",{staticClass:"btn",class:{active:"TABLE"===e.view},attrs:{href:"/table?token="+e.token,title:"Vue Tableau"}},[r("Icon",{attrs:{icon:"table"}})],1),r("a",{staticClass:"btn",class:{active:"TIMELINE"===e.view},attrs:{href:"/timeline?token="+e.token,title:"Vue Timeline"}},[r("Icon",{attrs:{icon:"timeline"}})],1),[e.USERS.DIRECTION,e.USERS.SUPERADMIN].includes(e.user)?r("a",{staticClass:"btn",attrs:{href:"/availability?token="+e.token,title:"Disponibilité Informatique"}},[r("Icon",{attrs:{icon:"charts"}})],1):e._e()]),e.show_all_btns?r("div",{staticClass:"header__menu",class:[{open:e.showMenu&&(e.scroll||e.isMobile)}]},[e.show_search_bar?r("SearchBar"):e._e(),r("div",{staticClass:"buttons"},[r("button",{on:{click:function(){return e.filterProjects()}}},[r("Icon",{attrs:{icon:"filters"}}),e._v("Filtrer ")],1),e.show_btns?r("button",{on:{click:function(){return e.sortProjects()}}},[r("Icon",{attrs:{icon:"sorting"}}),e._v("Trier ")],1):e._e(),e.admin?r("button",{on:{click:function(){return e.newProject()}}},[r("Icon",{attrs:{icon:"more"}}),e._v("Nouveau projet ")],1):e._e(),r("button",{on:{click:function(){return e.excel()}}},[e._v("Exporter")])])],1):e._e()],2)}),u=[],l=(n("d81d"),n("e9c4"),n("c1f9"),n("ac1f"),n("1276"),n("498a"),n("5319"),n("2b3d"),n("9861"),n("94ea")),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{staticClass:"search-bar btn",class:[{focus:e.focus},{searched:0!==e.search.length}]},[n("label",{staticClass:"search-bar__label",attrs:{for:e.uuid}},[n("Icon",{attrs:{icon:"magnifier"}})],1),n("input",{directives:[{name:"model",rawName:"v-model",value:e.search,expression:"search"},{name:"focus",rawName:"v-focus",value:e.focus,expression:"focus"}],staticClass:"search-bar__input",attrs:{id:e.uuid,type:"text",placeholder:"Nom du projet, référent, demandeur, etc..."},domProps:{value:e.search},on:{focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},input:function(t){t.target.composing||(e.search=t.target.value)}}}),n("a",{staticClass:"search-bar__reset",on:{click:e.reset}},[n("Icon",{attrs:{icon:"times",color:"#888888"}})],1)])},f=[],h=(n("841c"),n("430a")),p={name:"SearchBar",data:function(){var e=!1;return{focus:e}},computed:{search:{get:function(){return this.$store.state.projects.search},set:function(e){this.$store.commit(h["p"].MUTATIONS.PROJECTS_SET_SEARCH,{search:e}),this.$store.dispatch(h["p"].ACTIONS.PROJECTS_SEARCH)}},uuid:function(){return"search-bar__input__".concat(this._uid)}},methods:{reset:function(){this.search="",this.focus=!0}}},v=p,b=(n("8d67"),n("2877")),m=Object(b["a"])(v,d,f,!1,null,"4fda1a65",null),_=m.exports,g={name:"Header",components:{SearchBar:_},props:{scroll:{type:Boolean,default:function(){return!1}},view:{type:String,default:function(){return"MOBILE"}},show_btns:{type:Boolean,default:function(){return!0}},show_search_bar:{type:Boolean,default:function(){return!0}},show_all_btns:{type:Boolean,default:function(){return!0}},side_view:{type:String,default:function(){return""}}},data:function(){var e=window.outerWidth,t=!1;return{windowWidth:e,showMenu:t}},computed:Object(i["a"])(Object(i["a"])({},Object(l["e"])({admin:function(e){var t=e.admin;return t},date:function(e){var t=e.projects;return t.date},token:function(e){var t=e.token;return t},user:function(e){var t=e.user;return t},isMobile:function(e){var t=e.isMobile;return t},isScroll:function(e){var t=e.isScroll;return t},projects:function(e){var t=e.projects;return t.list},sorted:function(e){var t=e.projects;return t.sorted}})),{},{projectsIds:function(){return this.sorted.map((function(e){return e.id}))},USERS:function(){return h["q"]},styleSideView:function(){switch(this.side_view){case"left":return{right:"2em"};case"right":return{left:"2em"};case"":case"both":default:return{left:"0",right:"0"}}}}),methods:Object(i["a"])(Object(i["a"])(Object(i["a"])({},Object(l["c"])({showProjectForm:h["p"].ACTIONS.OVERLAY_SHOW_PROJECT_FORM,showSortingForm:h["p"].ACTIONS.OVERLAY_SHOW_SORTING_FORM,showFilterForm:h["p"].ACTIONS.OVERLAY_SHOW_FILTERS_FORM})),Object(l["d"])({pop:h["p"].MUTATIONS.POPUPS_ADD})),{},{excel:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,r,a,s,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return document.documentElement.style.cursor="progress",t.prev=1,t.next=4,fetch("/api/projects/excel",{method:"POST",headers:{Authorization:"Bearer ".concat(e.token)},body:JSON.stringify(e.projectsIds)});case 4:if(n=t.sent,n.ok){t.next=7;break}throw new Error("Un problème est survenu");case 7:return r=Object.fromEntries(n.headers.get("Content-Disposition").split(";").map((function(e){var t=Object(o["a"])(e.replace(/"([^"]+)"/g,"$1").trim().split("="));return t.length<2&&t.push(null),t}))),t.next=10,n.blob();case 10:a=t.sent,s=URL.createObjectURL(a),i=document.createElement("a"),i.href=s,i.download=r.filename,document.body.append(i),i.click(),i.remove(),URL.revokeObjectURL(s),t.next=24;break;case 21:t.prev=21,t.t0=t["catch"](1),e.pop({message:t.t0.message,variant:h["n"].WARNING});case 24:document.documentElement.style.cursor="";case 25:case"end":return t.stop()}}),t,null,[[1,21]])})))()},setWindowWidth:function(){this.windowWidth=window.outerWidth},filterProjects:function(){this.showMenu=!1,this.showFilterForm()},sortProjects:function(){this.showMenu=!1,this.showSortingForm()},newProject:function(){this.showMenu=!1,this.showProjectForm()}}),mouted:function(){}},w=g,O=(n("245d"),Object(b["a"])(w,c,u,!1,null,"ca04a87e",null)),S=O.exports,y=function(){return n.e("overlay").then(n.bind(null,"8bac"))},j=function(){return n.e("popups").then(n.bind(null,"ff5d"))},k=function(){return n.e("table").then(n.bind(null,"f4f7"))},x={name:"App",components:{Header:S,Overlay:y,Popups:j,Table:k},computed:Object(i["a"])(Object(i["a"])({},Object(l["e"])({overlayIsVisible:function(e){var t=e.overlay;return t.visible},admin:function(e){var t=e.admin;return t}})),{},{fields:function(){var e=[{key:"title",label:"Nom du projet",sortable:!0},{key:"fields",label:"Domaines",sortable:!0},{key:"service",label:"Demandeur",sortable:!0},{key:"status",label:"Statut",sortable:!0},{key:"date",label:"Date",sortable:!0},{key:"progression",label:"Progression",sortable:!0},{key:"referent_info",label:"Scrum Master"},{key:"referent_business",label:"Product Owner"},{key:"developers",label:"Developpeurs"}];return this.admin&&(e=[].concat(Object(o["a"])(e),[{key:"users",label:"Utilisateurs autorisés"},{key:"actions",label:"Actions"}])),e}}),methods:Object(i["a"])({},Object(l["c"])({load:h["p"].ACTIONS.OVERLAY_LOAD,unload:h["p"].ACTIONS.OVERLAY_UNLOAD})),beforeMount:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.load(),t.next=3,e.$store.dispatch(h["p"].ACTIONS.INIT);case 3:e.unload();case 4:case"end":return t.stop()}}),t)})))()}},I=x,E=(n("043c"),n("b0a0"),Object(b["a"])(I,r,a,!1,null,null,null));t["default"]=E.exports},4158:function(e,t,n){e.exports=n.p+"img/p.5894bd42.png"},"452c":function(e,t,n){},"498a":function(e,t,n){"use strict";var r=n("23e7"),a=n("58a8").trim,s=n("c8d2");r({target:"String",proto:!0,forced:s("trim")},{trim:function(){return a(this)}})},"4ed9":function(e,t,n){},5319:function(e,t,n){"use strict";var r=n("2ba4"),a=n("c65b"),s=n("e330"),o=n("d784"),i=n("d039"),c=n("825a"),u=n("1626"),l=n("5926"),d=n("50c4"),f=n("577e"),h=n("1d80"),p=n("8aa5"),v=n("dc4a"),b=n("0cb2"),m=n("14c3"),_=n("b622"),g=_("replace"),w=Math.max,O=Math.min,S=s([].concat),y=s([].push),j=s("".indexOf),k=s("".slice),x=function(e){return void 0===e?e:String(e)},I=function(){return"$0"==="a".replace(/./,"$0")}(),E=function(){return!!/./[g]&&""===/./[g]("a","$0")}(),C=!i((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")}));o("replace",(function(e,t,n){var s=E?"$":"$0";return[function(e,n){var r=h(this),s=void 0==e?void 0:v(e,g);return s?a(s,e,r,n):a(t,f(r),e,n)},function(e,a){var o=c(this),i=f(e);if("string"==typeof a&&-1===j(a,s)&&-1===j(a,"$<")){var h=n(t,o,i,a);if(h.done)return h.value}var v=u(a);v||(a=f(a));var _=o.global;if(_){var g=o.unicode;o.lastIndex=0}var I=[];while(1){var E=m(o,i);if(null===E)break;if(y(I,E),!_)break;var C=f(E[0]);""===C&&(o.lastIndex=p(i,d(o.lastIndex),g))}for(var R="",M=0,T=0;T<I.length;T++){E=I[T];for(var A=f(E[0]),N=w(O(l(E.index),i.length),0),$=[],P=1;P<E.length;P++)y($,x(E[P]));var U=E.groups;if(v){var L=S([A],$,N,i);void 0!==U&&y(L,U);var D=f(r(a,void 0,L))}else D=b(A,i,N,$,U,a);N>=M&&(R+=k(i,M,N)+D,M=N+A.length)}return R+k(i,M)}]}),!C||!I||E)},"58aa":function(e,t,n){},"8aa5":function(e,t,n){"use strict";var r=n("6547").charAt;e.exports=function(e,t,n){return t+(n?r(e,t).length:1)}},"8d67":function(e,t,n){"use strict";n("58aa")},b0a0:function(e,t,n){"use strict";n("452c")},c1f9:function(e,t,n){var r=n("23e7"),a=n("2266"),s=n("8418");r({target:"Object",stat:!0},{fromEntries:function(e){var t={};return a(e,(function(e,n){s(t,e,n)}),{AS_ENTRIES:!0}),t}})},c8d2:function(e,t,n){var r=n("5e77").PROPER,a=n("d039"),s=n("5899"),o="​᠎";e.exports=function(e){return a((function(){return!!s[e]()||o[e]()!==o||r&&s[e].name!==e}))}},f1ad:function(e,t,n){}}]);
//# sourceMappingURL=chunk-01d13685.chunk-01d13685.de70e5fc.js.map