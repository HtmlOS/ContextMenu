var e,t;
/*!
 * @htmlos/contextmenu.js v0.1.23
 * (c) 2018-2021 Mr.Fan
 * https://github.com/HtmlOS/contextmenu
 * Released under the MIT License.
 */
function n(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],i=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}(e=self.document)&&!e.getElementById("livereloadscript")&&((t=e.createElement("script")).async=1,t.src="//"+(self.location.host||"localhost").split(":")[0]+":35729/livereload.js?snipver=1",t.id="livereloadscript",e.getElementsByTagName("head")[0].appendChild(t));var i=function(){function e(){}return e.isDivider=function(e){return!e||!this.hasArrow(e)&&!(e.name&&e.name.trim().length>0)},e.isEnabled=function(e){return!0!==e.disabled},e.hasArrow=function(e){return!!e&&!!(e.children&&e.children.length>0)},e}(),o=function(){function e(e,t,n,i){this.l=e,this.t=t,this.r=e+n,this.b=t+i,this.w=n,this.h=i}return e.prototype.equals=function(e){return null!=e&&null!==e&&this.l===e.l&&this.t===e.t&&this.r===e.r&&this.b===e.b&&this.w===e.w&&this.h===e.h},e.prototype.assign=function(e){e&&(this.l=e.l,this.t=e.t,this.r=e.r,this.b=e.b,this.w=e.w,this.h=e.h)},e}(),r=function(){function e(e,t){this.x=e,this.y=t}return e.prototype.equals=function(e){return null!=e&&null!==e&&this.x===e.x&&this.y===e.y},e}(),s=function(){function e(e){this.element=e}return e.prototype.getBoundingClientRect=function(){if(this.element){var e=this.element.getBoundingClientRect(),t=e.top-document.documentElement.clientTop,n=e.left-document.documentElement.clientLeft;return new o(n,t,e.right-n,e.bottom-t)}},e}(),u=function(){function e(){}return e.preventEvent=function(e){e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0,e.returnValue=!1},e.getCurrentScrollTop=function(){var e=0;return document.documentElement&&document.documentElement.scrollTop?e=document.documentElement.scrollTop:document.body&&(e=document.body.scrollTop),e},e.getCurrentScrollLeft=function(){var e=0;return document.documentElement&&document.documentElement.scrollLeft?e=document.documentElement.scrollLeft:document.body&&(e=document.body.scrollLeft),e},e.getMouseEventPoint=function(t){var n=e.getCurrentScrollLeft(),i=e.getCurrentScrollTop(),o=t.clientX||t.pageX-n,s=t.clientY||t.pageY-i;return new r(o,s)},e.getClientRect=function(e){e=e||0;var t=0,n=0;return window.innerWidth?t=window.innerWidth:document.body&&document.body.clientWidth&&(t=document.body.clientWidth),window.innerHeight?n=window.innerHeight:document.body&&document.body.clientHeight&&(n=document.body.clientHeight),document.documentElement&&document.documentElement.clientHeight&&document.documentElement.clientWidth&&(n=document.documentElement.clientHeight,t=document.documentElement.clientWidth),new o(e,e,t-2*e,n-2*e)},e.visitElemementChildren=function(e,t){for(var n=e.firstChild,i=0;null!=n;)1===n.nodeType&&t(i++,new s(n)),n=n.nextSibling},e.runOnCondition=function(t,n,i,o){i()||setTimeout((function(){if(!i())if(n())try{t()}catch(e){return}else e.runOnCondition(t,n,i,o)}),o)},e}(),c={debuggable:!1,debug:function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];window.console&&c.debuggable&&console.log.apply(console,[e,t])},error:function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];window.console&&console.error.apply(console,[e,t])}},l=function(){function e(){this._keys=[],this._values=[]}return e.prototype.size=function(){return this._keys.length},e.prototype.indexOfKey=function(e){for(var t in this._keys){if(this._keys[t]===e)return parseInt(t,10)}return-1},e.prototype.has=function(e){return this.containsKey(e)},e.prototype.containsKey=function(e){var t,i;try{for(var o=n(this._keys),r=o.next();!r.done;r=o.next()){if(r.value===e)return!0}}catch(e){t={error:e}}finally{try{r&&!r.done&&(i=o.return)&&i.call(o)}finally{if(t)throw t.error}}return!1},e.prototype.containsValue=function(e){var t,i;try{for(var o=n(this._values),r=o.next();!r.done;r=o.next()){if(r.value===e)return!0}}catch(e){t={error:e}}finally{try{r&&!r.done&&(i=o.return)&&i.call(o)}finally{if(t)throw t.error}}return!1},e.prototype.set=function(e,t){this.put(e,t)},e.prototype.put=function(e,t){this.delete(e),this._keys.push(e),this._values.push(t)},e.prototype.get=function(e){var t=this.indexOfKey(e);return-1===t?void 0:this._values[t]},e.prototype.keys=function(){return this._keys.concat()},e.prototype.values=function(){return this._values.concat()},e.prototype.remove=function(e){return this.delete(e)},e.prototype.delete=function(e){var t=this.indexOfKey(e);if(-1!==t){this._keys.splice(t,1);var n=this._values.splice(t,1);return n.length>0?n[0]:void 0}},e.prototype.clear=function(){this._keys.splice(0,this._keys.length),this._values.splice(0,this._values.length)},e.prototype.forEach=function(e){var t=this.keys(),n=this.values();for(var i in t){var o=t[i];e(n[i],o)}},e}(),a=function(e){var t,i,o,r,s=e.style;this.contextmenu=(null==s?void 0:s.contextmenu)||"contextmenu";var u={name:"contextmenu-in",time:0},c={name:"contextmenu-out",time:0};if(null==s?void 0:s.contextmenuIn)try{for(var l=n(s.contextmenuIn),a=l.next();!a.done;a=l.next())"number"==typeof(m=a.value)?u.time=m:"string"==typeof m&&(u.name=m)}catch(e){t={error:e}}finally{try{a&&!a.done&&(i=l.return)&&i.call(l)}finally{if(t)throw t.error}}if(null==s?void 0:s.contextmenuOut)try{for(var h=n(s.contextmenuOut),d=h.next();!d.done;d=h.next()){var m;"number"==typeof(m=d.value)?c.time=m:"string"==typeof m&&(c.name=m)}}catch(e){o={error:e}}finally{try{d&&!d.done&&(r=h.return)&&r.call(h)}finally{if(o)throw o.error}}this.contextmenuIn=[u.name,u.time],this.contextmenuOut=[c.name,c.time],this.contextmenuDivider=(null==s?void 0:s.contextmenuDivider)||"contextmenu-divider",this.contextmenuItem=(null==s?void 0:s.contextmenuItem)||"contextmenu-item",this.contextmenuItemSelected=(null==s?void 0:s.contextmenuItemSelected)||"contextmenu-item-selected",this.contextmenuItemDisabled=(null==s?void 0:s.contextmenuItemDisabled)||"contextmenu-item-disabled",this.contextmenuItemIcon=(null==s?void 0:s.contextmenuItemIcon)||"contextmenu-item-icon",this.contextmenuItemName=(null==s?void 0:s.contextmenuItemName)||"contextmenu-item-name",this.contextmenuItemHotkey=(null==s?void 0:s.contextmenuItemHotkey)||"contextmenu-item-hotkey",this.contextmenuItemArrow=(null==s?void 0:s.contextmenuItemArrow)||"contextmenu-item-arrow"},h=function(){function e(e,t,n){this.rootViewRect=new o(0,0,0,0),this.itemViewRect=new o(0,0,0,0),this.itemViewRects=new l,this.id=e,this.items=t,this.options=n,this.style=new a(n),this.rootView=this.generateMenuView(),this.select(-1)}return Object.defineProperty(e.prototype,"onStateChangedListener",{get:function(){return this.onStateChangedListening},set:function(e){this.onStateChangedListening=e,this.updateStateChangedListener()},enumerable:!1,configurable:!0}),e.prototype.select=function(e){var t=this;this.visitItems((function(n,i,o){t.updateItemViewClass(o,i,n===e)}))},e.prototype.hide=function(){var e=this.rootView,t=this.options.layer||e.parentElement;t&&("visible"===e.style.visibility?(e.className=[this.style.contextmenu,this.style.contextmenuOut[0]].join(" "),setTimeout((function(){t.removeChild(e)}),this.style.contextmenuOut[1]||0)):t.removeChild(e))},e.prototype.show=function(e){var t=this,n=this.rootView;n.className=this.style.contextmenu,n.style.visibility="hidden";var i=this.fixedLocation(e);n.style.top=i.t+"px",n.style.left=i.l+"px",c.debug("menu view render start : anchor rect =",e);var r=(new Date).getTime();void 0!==this.onStateChangedListener&&this.onStateChangedListener.onRenderStart();var l=this.options.layer||n.parentElement;l&&(l.appendChild(n),u.runOnCondition((function(){var i=n.offsetWidth,a=n.offsetHeight;c.debug("menu view init size: ",i+"x"+a),t.rootViewRect.assign(new o(0,0,i,a)),t.computeItemRects();var h=i-t.itemViewRect.w,d=a-t.itemViewRect.h;c.debug("menu view padding: ",h,d);var m=t.fixedLocation(e);t.rootViewRect.assign(m),c.debug("menu view fixed: ",t.rootViewRect.w+"x"+t.rootViewRect.h,t.rootViewRect);var y=m.w-h,f=m.h-d;n.style.width=y+"px",n.style.height=f+"px",n.style.top=m.t+"px",n.style.left=m.l+"px",u.runOnCondition((function(){n.style.visibility="visible",n.className=[t.style.contextmenu,t.style.contextmenuIn[0]].join(" "),t.computeItemRects();var e=(new Date).getTime()-r;c.debug("menu view render end : cost "+e+"ms"),void 0!==t.onStateChangedListener&&t.onStateChangedListener.onRenderStop(e)}),(function(){var e=new s(n).getBoundingClientRect();return null!=e&&Math.abs(e.l-t.rootViewRect.l)<1&&Math.abs(e.t-t.rootViewRect.t)<1}),(function(){return!l.contains(n)}),10)}),(function(){return void 0!==n.offsetWidth&&n.offsetWidth>=0&&void 0!==n.offsetHeight&&n.offsetHeight>0}),(function(){return!l.contains(n)}),10))},e.prototype.updateStateChangedListener=function(){var e=this;this.visitItems((function(t,n,o){var r;void 0===e.onStateChangedListener||i.isDivider(o)||(n.element.onmouseover=function(e,t){return function(){t(e)}}(t,e.onStateChangedListener.onSelected),n.element.onmouseleave=(r=e.onStateChangedListener.onSelected,function(){r(-1)}),n.element.onclick=function(e,t,n){return function(i){u.preventEvent(i),n(e,t)}}(t,o,e.onStateChangedListener.onClicked))}))},e.prototype.generateMenuView=function(){var e=document.createElement("table");for(var t in e.id=this.id,e.setAttribute("border","0"),e.setAttribute("cellspacing","0"),e.setAttribute("cellpadding","0"),e.style.margin="0px",e.style.position="fixed",e.style.width="auto",e.style.height="auto",e.style.zIndex="2147483647",e.style.top="0px",e.style.left="0px",this.items){var n=this.items[t],i=this.generateItemView(n);e.appendChild(i)}return e},e.prototype.generateItemView=function(e){var t=document.createElement("tr"),n=i.hasArrow(e),o=void 0!==e.hotkey&&e.hotkey.length>0,r=e.icon||"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",s=this.options.i18n(e.name||"")||e.name||"",u=e.hotkey||"";if(i.isDivider(e)){var c=document.createElement("th");c.setAttribute("align","center"),c.setAttribute("colspan","4"),c.appendChild(document.createElement("hr")),t.appendChild(c)}else{var l=document.createElement("td"),a=document.createElement("td"),h=document.createElement("td"),d=document.createElement("td");t.appendChild(l),t.appendChild(a),t.appendChild(h),t.appendChild(d),l.innerHTML='\n                <img class="'+this.style.contextmenuItemIcon+'" src="'+r+'" draggable="false"/>\n            ',a.innerHTML='\n                <div class="'+this.style.contextmenuItemName+'">'+s+"</div>\n            ",h.innerHTML='\n                <div class="'+this.style.contextmenuItemHotkey+'"\n                    style="display:'+(o?"block":"none")+'">\n                    '+u+"\n                </div>\n            ",d.innerHTML='\n                <div class="'+this.style.contextmenuItemArrow+'"\n                    style="display:'+(n?"block":"none")+'"></div>\n                <div class="'+this.style.contextmenuItemArrow+'"\n                    style="display:'+(n?"none":"block")+'; visibility: hidden"></div>\n            '}return t},e.prototype.updateItemViewClass=function(e,t,n){i.isDivider(e)?t.element.className=this.style.contextmenuDivider:i.isEnabled(e)?t.element.className=n?[this.style.contextmenuItem,this.style.contextmenuItemSelected].join(" "):this.style.contextmenuItem:t.element.className=[this.style.contextmenuItem,this.style.contextmenuItemDisabled].join(" ")},e.prototype.computeItemRects=function(){var e=this,t=0;u.visitElemementChildren(this.rootView,(function(n,r){var s=r.getBoundingClientRect();if(s){var u=e.items[n];if(!i.isDivider(u)){var c=s.l,l=s.t,a=s.w,h=s.h;e.itemViewRects.set(t++,new o(c,l,a,h))}0===n&&(e.itemViewRect.t=s.t,e.itemViewRect.l=s.l,e.itemViewRect.r=s.r),e.itemViewRect.b=s.b,e.itemViewRect.w=e.itemViewRect.r-e.itemViewRect.l,e.itemViewRect.h=e.itemViewRect.b-e.itemViewRect.t}}))},e.prototype.visitItems=function(e){var t=this,n=0;u.visitElemementChildren(this.rootView,(function(o,r){var s=t.items[o];i.isDivider(s)?e(-1,r,s):e(n++,r,s)}))},e.prototype.fixedLocation=function(e){var t=u.getClientRect(4);c.debug("menu view fix location: screen rect = ",t);var n,i,r,s,l,a,h=this.rootViewRect.w,d=this.rootViewRect.h,m=e.l,y=e.t,f=e.r,p=e.b,v=t.h,g=t.l,w=t.t,x=t.r,b=t.b,I=m-g,C=x-f,k=p-w,S=b-y;switch(n=C>=h?"right":I>=h?"left":C>=I?"right":"left",i=S>=d?"down":k>=d?"up":S>=k?"bottom":"top",c.debug("menu view dock @",n,i),n){case"left":r=m-(l=h);break;case"right":l=h,r=f}switch(i){case"up":s=p-(a=d);break;case"down":a=d,s=y;break;case"top":a=Math.min(d,v),s=w;break;case"bottom":s=b-(a=Math.min(d,v))}return new o(r,s,l,a)},e}(),d=function(){function e(t){e.assgin(this,{layer:document.body,i18n:function(e){return e}}),e.assgin(this,t)}return e.assgin=function(e,t){t&&e&&(e.layer=t.layer||e.layer,e.i18n=t.i18n||e.i18n,t.style&&(e.style?(e.style.contextmenu=t.style.contextmenu||e.style.contextmenu,e.style.contextmenuIn=t.style.contextmenuIn||e.style.contextmenuIn,e.style.contextmenuOut=t.style.contextmenuOut||e.style.contextmenuOut,e.style.contextmenuDivider=t.style.contextmenuDivider||e.style.contextmenuDivider,e.style.contextmenuItem=t.style.contextmenuItem||e.style.contextmenuItem,e.style.contextmenuItemSelected=t.style.contextmenuItemSelected||e.style.contextmenuItemSelected,e.style.contextmenuItemDisabled=t.style.contextmenuItemDisabled||e.style.contextmenuItemDisabled,e.style.contextmenuItemIcon=t.style.contextmenuItemIcon||e.style.contextmenuItemIcon,e.style.contextmenuItemName=t.style.contextmenuItemName||e.style.contextmenuItemName,e.style.contextmenuItemHotkey=t.style.contextmenuItemHotkey||e.style.contextmenuItemHotkey,e.style.contextmenuItemArrow=t.style.contextmenuItemArrow||e.style.contextmenuItemArrow):e.style=t.style))},e}(),m=function(){function e(e,t,n){this.id=(new Date).toUTCString(),this.menuStacks=new l,this.event=e,this.menuItems=t,this.menuPosition=e.getPoint(),this.menuOptions=n||new d}return e.prototype.getMenuItemsById=function(e){var t,o,r,s;if(!e||"0"===e)return this.menuItems;if(0===e.indexOf("0")){var u=e.split(",");u.shift();var c=this.menuItems;try{for(var l=n(u),a=l.next();!a.done;a=l.next()){var h=a.value,d=0;try{for(var m=(r=void 0,n(c)),y=m.next();!y.done;y=m.next()){var f=y.value;if(!i.isDivider(f)&&parseInt(h,10)===d++){var p=null==f?void 0:f.children;if(null==p)return;c=p}}}catch(e){r={error:e}}finally{try{y&&!y.done&&(s=m.return)&&s.call(m)}finally{if(r)throw r.error}}}}catch(e){t={error:e}}finally{try{a&&!a.done&&(o=l.return)&&o.call(l)}finally{if(t)throw t.error}}return c}},e.prototype.hideMenu=function(e){e||(e="0"),this.hideMenuStack(e)},e.prototype.showMenu=function(e){var t,i;e||(e="0");for(var o=new l,r=e.split(",");r.length>0;){var s=r.join(",");o.set(s,""),r.pop()}var u=o.keys(),a=this.menuStacks.keys();try{for(var h=n(a),d=h.next();!d.done;d=h.next()){var m=d.value;o.has(m)||(c.debug("menu remove by id",m),this.hideMenuStack(m))}}catch(e){t={error:e}}finally{try{d&&!d.done&&(i=h.return)&&i.call(h)}finally{if(t)throw t.error}}this.showMenuStack(u)},e.prototype.hideMenuStack=function(e){var t=this;this.menuStacks.forEach((function(n,i){i.indexOf(e)>=0&&(n.hide(),t.menuStacks.delete(i))}))},e.prototype.showMenuStack=function(e){var t,i,r=this;e.sort(),c.debug("menu show stacks :",e);var s=this.menuStacks,l=function(t){var n=t.indexOf(",")>=0,i=parseInt(n?t.substr(t.lastIndexOf(",")+1):t,10),l=n?t.substr(0,t.lastIndexOf(",")):void 0,d=void 0===l?void 0:s.get(l);void 0!==d&&d.select(i);var m=s.get(t);if(void 0!==m)return m.select(-1),"continue";var y=a.getMenuItemsById(t);if(!y)return c.debug("menu show stacks : no items "),{value:void 0};var f=new h(t,y,a.menuOptions);f.onStateChangedListener={onSelected:function(e){-1===e?r.postSelection("o",t):r.postSelection("i",t+","+e)},onClicked:function(e,t){r.onItemClick&&r.onItemClick(e,t)},onRenderStart:function(){},onRenderStop:function(){r.showMenuStack(e)}},f.rootView.oncontextmenu=function(e){u.preventEvent(e)},f.rootView.onmouseenter=function(){r.postSelection("i",t)},f.rootView.onmouseleave=function(){r.postSelection("o","0")};var p=void 0===d?new o(a.menuPosition.x,a.menuPosition.y,0,0):d.itemViewRects.get(i);p&&a.isAlive()&&(c.debug("menu show stack :",t),f.show(p),a.menuStacks.set(t,f))},a=this;try{for(var d=n(e),m=d.next();!m.done;m=d.next()){var y=l(m.value);if("object"==typeof y)return y.value}}catch(e){t={error:e}}finally{try{m&&!m.done&&(i=d.return)&&i.call(d)}finally{if(t)throw t.error}}},e.prototype.postSelection=function(e,t){var n=this;"i"===e&&this.postSelectionType===e&&this.postSelectionId.indexOf(t)>=0||(c.debug("menu post stacks : id =",t),clearTimeout(this.postSelectionTimerId),this.postSelectionType=e,this.postSelectionId=t,this.postSelectionTimerId=setTimeout((function(){n.isDestroyed()?c.debug("menu is destroyed"):n.showMenu(t)}),10))},e.prototype.isAlive=function(){return!this.isDestroyed()},e.prototype.isDestroyed=function(){return!0===this.destroyed},e.prototype.postDestroy=function(){var e=this;this.destroyed=!0,clearTimeout(this.postSelectionTimerId),this.hideMenu(),setTimeout((function(){e.menuStacks.size()>0&&e.postDestroy()}),50)},e}(),y=function(){function e(e){this.e=e,this.target=new s((null==e?void 0:e.srcElement)||(null==e?void 0:e.target)),this.button=e.button,this.keyCode=e.keyCode,this.charCode=e.charCode,this.which=e.which,this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey}return e.prototype.isKeyboardEvent=function(){return this.e instanceof KeyboardEvent||this.e.keyCode||this.e.charCode||this.e.which},e.prototype.isMouseEvent=function(){return this.e instanceof MouseEvent||this.e.button},e.prototype.getPoint=function(){var e=u.getCurrentScrollLeft(),t=u.getCurrentScrollTop(),n=this.e.clientX||this.e.pageX-e,i=this.e.clientY||this.e.pageY-t;return new r(n,i)},e.prototype.prevent=function(){this.e.preventDefault&&this.e.preventDefault(),this.e.stopPropagation&&this.e.stopPropagation(),this.e.cancelBubble=!0,this.e.returnValue=!1},e}(),f=function(){function e(e){this.listeners=new l,this.menu=e}return e.prototype.stop=function(){this.listeners.forEach((function(e,t){window.removeEventListener(t,e)})),this.listeners.clear()},e.prototype.start=function(e){var t,i,o=this,r=function(e){if(null==e||0===e.trim().length)return c.debug("event not found"),"continue";var t=e.split(":"),i=t[0];t.shift();var r=0===t.length?[]:t,a=function(t){var i,u,a,h;if((t=new y(t)).isMouseEvent()){var d=t.getPoint(),m=(null===(h=null===(a=o.menu)||void 0===a?void 0:a.presenter)||void 0===h?void 0:h.menuStacks)||new l;try{for(var f=(i=void 0,n(m.values())),p=f.next();!p.done;p=f.next()){var v=p.value,g=new s(v.rootView).getBoundingClientRect();if(g&&d.x>=g.l&&d.x<=g.r&&d.y>=g.t&&d.y<=g.b)return}}catch(e){i={error:e}}finally{try{p&&!p.done&&(u=f.return)&&u.call(f)}finally{if(i)throw i.error}}var w=[void 0!==(x=t.button)?""+x:"",t.altKey?"alt":"",t.ctrlKey?"alt":"",t.metaKey?"alt":"",t.shiftKey?"alt":""];if(r.length>0&&!o.containsKey(r,w.join("+")))return;o.onevent(e)}else if(t.isKeyboardEvent()){var x=void 0;void 0!==t.keyCode&&(x=void 0===x?t.keyCode:Math.max(x,t.keyCode)),void 0!==t.charCode&&(x=void 0===x?t.charCode:Math.max(x,t.charCode)),void 0!==t.which&&(x=void 0===x?t.which:Math.max(x,t.which)),16!==x&&17!==x&&18!==x&&224!==x||(x=void 0);w=[void 0!==x?""+x:"",t.altKey?"alt":"",t.ctrlKey?"ctrl":"",t.metaKey?"meta":"",t.shiftKey?"shift":""];o.containsKey(r,w.join("+"))&&o.onevent(e)}else 0===r.length?o.onevent(e):c.error("monitor unsupported event: ",e)};c.debug("monitor add listener: ",e,i,r),window.addEventListener(i,a,!0),u.listeners.set(e,a)},u=this;try{for(var a=n(e),h=a.next();!h.done;h=a.next()){r(h.value)}}catch(e){t={error:e}}finally{try{h&&!h.done&&(i=a.return)&&i.call(a)}finally{if(t)throw t.error}}},e.prototype.equalsKey=function(e,t){var n=function(e){return e=(e=(e=(e=e.replace(/\s+/g,"")).replace(/\++/g,"+")).replace(/^\++/g,"")).replace(/\++$/g,"")};e=n(e),t=n(t);var i=e.split("+"),o=t.split("+");return i.sort(),o.sort(),e=i.join("+"),t=o.join("+"),c.debug("monitor event equals : ",e,t),e===t},e.prototype.containsKey=function(e,t){var i,o;try{for(var r=n(e),s=r.next();!s.done;s=r.next()){var u=s.value;if(this.equalsKey(u,t))return!0}}catch(e){i={error:e}}finally{try{s&&!s.done&&(o=r.return)&&o.call(r)}finally{if(i)throw i.error}}return!1},e}(),p=function(){function e(e){this.menu=e}return e.prototype.stop=function(){this.stopped=!0,this.timer&&(clearTimeout(this.timer),this.timer=void 0)},e.prototype.start=function(){this.stop(),this.stopped=!1,this.run()},e.prototype.run=function(){var e=this;this.timer=setTimeout((function(){var t,n,i;if(!0!==e.stopped){var o=null===(n=null===(t=e.menu)||void 0===t?void 0:t.presenter)||void 0===n?void 0:n.event,r=null===(i=null==o?void 0:o.target)||void 0===i?void 0:i.getBoundingClientRect();r&&(void 0===e.targetRect||r.equals(e.targetRect)?e.targetRect=r:e.hide()),e.run()}}),100)},e.prototype.hide=function(){this.targetRect=void 0,this.onchanged&&this.onchanged("other:target moved or resize")},e}(),v=function(){function e(e){this.targetRectListner=new p(e),this.eventsListener=new f(e),this.events=["keydown:27","mousedown","resize"],this.menu=e}return e.prototype.start=function(){var e=this;c.debug("monitor start");var t=function(t){e.menu.presenter&&(c.debug("monitor hidemenu by ",t),e.menu.hide())};this.targetRectListner.onchanged=t,this.targetRectListner.start(),this.eventsListener.onevent=t,this.eventsListener.start(this.events)},e.prototype.stop=function(){this.targetRectListner.stop(),this.eventsListener.stop(),c.debug("monitor stop")},e}(),g=new(function(){function e(){this.options=new d,this.options=new d}return e.prototype.config=function(e){d.assgin(this.options,e)},e.prototype.hide=function(){this.monitor&&this.monitor.stop(),null!=this.presenter&&(c.debug("hide menu"),this.presenter.postDestroy(),this.presenter=void 0)},e.prototype.show=function(e,t){var n=this,o=new y(window.event);if(o.isMouseEvent()){o.prevent(),this.hide(),c.debug("show menu",e,o.getPoint());var r=new d;d.assgin(r,this.options),d.assgin(r,t),this.presenter=new m(o,e,r),this.presenter.onItemClick=function(e,t){i.isEnabled(t)&&t.onclick&&(n.hide(),setTimeout((function(){i.isEnabled(t)&&t.onclick&&t.onclick(e,t)}),10))},this.presenter.showMenu(),this.monitor=new v(this),this.monitor.start()}},e}());window&&Object.defineProperty(window,"ContextMenu",{value:g,writable:!1,configurable:!1}),Object.defineProperty(g,"debug",{value:function(e){c.debuggable=e},writable:!1,configurable:!1});export{g as ContextMenu,d as ContextMenuOptions};
//# sourceMappingURL=contextmenu.esm.js.map