(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-609fcb4c"],{"53a2":function(e,t,n){"use strict";n("89cb")},"89cb":function(e,t,n){},"8f0b":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",[n("header",[n("h3",[e._v("Documents")]),e.admin?n("button",{on:{click:function(){return e.showFileForm({id:e.projectId})}}},[e._v(" Ajouter "),n("Icon",{attrs:{icon:"more"}})],1):e._e()]),n("table",[e._m(0),e._reports.length>0?n("tbody",e._l(e._reports,(function(t){return n("tr",{key:t.id},[n("td",[e._v(e._s(t.filename))]),n("td",{staticClass:"description"},[n("p",{domProps:{innerHTML:e._s(t.description.replace(/\n/,"<br>"))}})]),n("td",{staticClass:"date"},[e._v(e._s(t.date.format("L HH:mm")))]),n("td",[n("div",{staticClass:"btn-group"},[n("button",{style:[e.downloadBtnStyle],attrs:{title:"Télécharger le document"},on:{click:function(){return e.downloadHandler(t)}}},[n("Icon",{attrs:{icon:"download"}})],1),e.admin?n("button",{style:[e.deleteBtnStyle],attrs:{title:"Supprimer le document"},on:{click:function(){return e.removeHandler(t.id)}}},[n("Icon",{attrs:{icon:"delete"}})],1):e._e()])])])})),0):n("tbody",[e._m(1)])])])},o=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("thead",[n("tr",[n("th",[e._v("Nom")]),n("th",[e._v("Description")]),n("th",[e._v("Date d'ajout")]),n("th")])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("tr",[n("td"),n("td"),n("td"),n("td")])}],a=n("1da1"),c=n("2909"),i=n("5530"),d=(n("96cf"),n("a9e3"),n("4e82"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),n("9861"),n("94ea")),s=n("430a"),u={name:"Reports",props:{projectId:{type:Number,required:!0},reports:{type:Array,default:function(){return[]}}},data:function(){var e={"--btn-color":"var(--color-secondary)",border:"none",fontSize:"1.25em"},t={"--btn-color":"crimson",border:"none"};return{downloadBtnStyle:e,deleteBtnStyle:t}},computed:Object(i["a"])(Object(i["a"])({},Object(d["e"])({admin:function(e){var t=e.admin;return t}})),{},{_reports:function(){var e=Object(c["a"])(this.reports);return e.sort((function(e,t){var n=e.date,r=t.date;return n.isBefore(r)?1:n.isSame(r)?0:-1})),e}}),methods:Object(i["a"])(Object(i["a"])({},Object(d["c"])({showFileForm:s["p"].ACTIONS.OVERLAY_SHOW_FILE_FORM,load:s["p"].ACTIONS.OVERLAY_LOAD,unload:s["p"].ACTIONS.OVERLAY_UNLOAD,download:s["p"].ACTIONS.FILES_DOWNLOAD,confirm:s["p"].ACTIONS.CONFIRM_SHOW})),{},{downloadHandler:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var r,o,a,c,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return r=e.id,o=e.filename,t.load(),n.next=4,t.download({id:r});case 4:a=n.sent,c=URL.createObjectURL(a),i=document.createElement("a"),i.href=c,i.download=o,document.body.append(i),i.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),document.body.removeChild(i),t.unload();case 13:case"end":return n.stop()}}),n)})))()},removeHandler:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:t.confirm({header:"Suppression d'un fichier",text:"Êtes-vous sûr de vouloir supprimer ce fichier ?",action:s["l"].ACTIONS.REMOVE_FILE,details:{file_id:e}});case 1:case"end":return n.stop()}}),n)})))()}})},l=u,m=(n("53a2"),n("2877")),p=Object(m["a"])(l,r,o,!1,null,"ce58da0e",null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-609fcb4c.chunk-609fcb4c.3f121c3d.js.map