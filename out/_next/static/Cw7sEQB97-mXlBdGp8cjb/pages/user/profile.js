(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{djzL:function(a,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/user/profile",function(){return t("y8Nf")}])},y8Nf:function(a,e,t){"use strict";t.r(e);var s=t("0iUn"),i=t("MI3g"),o=t("a7VT"),n=t("sLSF"),r=t("Tit0"),c=t("q1tI"),l=t.n(c),u=t("/MKj"),f=t("x91w"),d=t("ndts"),m=t("Ywvz"),p=t("kgVM"),h=t("wx14"),b=t("zLVn"),g=t("17x9"),N=t.n(g),w=t("TSYQ"),v=t.n(w),j=t("33Jr"),y={tag:j.d,flush:N.a.bool,className:N.a.string,cssModule:N.a.object},_=function(a){var e=a.className,t=a.cssModule,s=a.tag,i=a.flush,o=Object(b.a)(a,["className","cssModule","tag","flush"]),n=Object(j.b)(v()(e,"list-group",!!i&&"list-group-flush"),t);return l.a.createElement(s,Object(h.a)({},o,{className:n}))};_.propTypes=y,_.defaultProps={tag:"ul"};var O=_,M={tag:j.d,active:N.a.bool,disabled:N.a.bool,color:N.a.string,action:N.a.bool,className:N.a.any,cssModule:N.a.object},k=function(a){a.preventDefault()},P=function(a){var e=a.className,t=a.cssModule,s=a.tag,i=a.active,o=a.disabled,n=a.action,r=a.color,c=Object(b.a)(a,["className","cssModule","tag","active","disabled","action","color"]),u=Object(j.b)(v()(e,!!i&&"active",!!o&&"disabled",!!n&&"list-group-item-action",!!r&&"list-group-item-"+r,"list-group-item"),t);return o&&(c.onClick=k),l.a.createElement(s,Object(h.a)({},c,{className:u}))};P.propTypes=M,P.defaultProps={tag:"li"};var T=P,x=l.a.createElement,E=function(a){function e(a){var t;return Object(s.a)(this,e),(t=Object(i.a)(this,Object(o.a)(e).call(this,a))).state={firstname:"",lastname:"",email_id:"",mobile_no:"",password:"",confirm_password:""},t}return Object(r.a)(e,a),Object(n.a)(e,null,[{key:"getInitialProps",value:function(a){Object(d.a)(a)}}]),Object(n.a)(e,[{key:"handleSubmit",value:function(a){a.preventDefault(),this.props.register({firstname:this.state.firstname,lastname:this.state.lastname,email_id:this.state.email_id,mobile_no:this.state.mobile_no,password:this.state.password,confirm_password:this.state.confirm_password},"register")}},{key:"render",value:function(){return x(m.a,{title:"Sign Up"},x(p.a,null),x("div",null,x("div",{className:"header-user-profile"},x("i",{className:"fas fa-user-circle fa-2x"}),x("span",{className:"header-user-profle-title"},"User Name")),x(O,null,x(T,{tag:"a",href:"/user/detail-points",action:!0},"Points"),x(T,{tag:"a",href:"/user/history",action:!0},x("i",{className:"fas fa-history"})," History"),x(T,{tag:"a",href:"/user/download",action:!0},x("i",{className:"fas fa-download"})," Download"),x(T,{tag:"a",href:"/user/my-list",action:!0},x("i",{className:"fas fa-list"})," My List"),x(T,{tag:"a",href:"/user/continue-watching",action:!0},x("i",{className:"far fa-clock"})," Continue Watching"),x(T,{tag:"a",href:"/user/term&cond",action:!0},x("i",{className:"fas fa-exclamation-circle"}),"  Term & Conditions"),x(T,{tag:"a",href:"/user/privacy-policy",action:!0},x("i",{className:"fas fa-lock"}),"  Privacy Policy"),x(T,{tag:"a",href:"/user/help",action:!0},x("i",{className:"far fa-comment-alt"}),"  Help"),x(T,{tag:"a",href:"/user/faq",action:!0},x("i",{className:"far fa-question-circle"}),"  FAQ"),x(T,{tag:"a",href:"/user/faq",action:!0},x("center",null,"Version 1.2")))))}}]),e}(l.a.Component);e.default=Object(u.b)(function(a){return a},f.a)(E)}},[["djzL",0,1]]]);