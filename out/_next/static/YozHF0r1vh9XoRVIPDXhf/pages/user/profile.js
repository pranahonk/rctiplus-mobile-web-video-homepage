(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{bSwy:function(a,t,e){"use strict";var s=e("TqRt");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=s(e("q1tI")),i=(0,s(e("8/g6")).default)(n.default.createElement("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"Search");t.default=i},djzL:function(a,t,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/user/profile",function(){return e("y8Nf")}])},kgVM:function(a,t,e){"use strict";var s=e("0iUn"),n=e("sLSF"),i=e("MI3g"),o=e("a7VT"),c=e("Tit0"),l=e("q1tI"),r=e.n(l),u=e("nOHt"),f=e.n(u),d=e("/MKj"),p=e("x91w"),m=e("cph9"),h=(e("jwpf"),e("tiWs")),g=e("374E"),b=e("btng"),v=e("bSwy"),w=e.n(v),N=r.a.createElement,j=function(a){function t(a){var e;return Object(s.a)(this,t),(e=Object(i.a)(this,Object(o.a)(t).call(this,a))).state={token:Object(m.a)("ACCESS_TOKEN"),is_top:!0},e}return Object(c.a)(t,a),Object(n.a)(t,[{key:"signOut",value:function(){this.props.logout(1).then(function(){f.a.push("/signin")}).catch(function(a){Object(m.b)("ACCESS_TOKEN")})}},{key:"componentDidMount",value:function(){var a=this;document.addEventListener("scroll",function(){var t=window.scrollY<150;t!==a.state.is_top&&a.setState({is_top:t})})}},{key:"render",value:function(){return N("div",{className:"nav-home-container nav-fixed-top"},N(h.a,{expand:"md",className:"nav-container nav-shadow "+(this.state.is_top?"nav-transparent":"")},N("div",{className:"left-top-link"},N("div",{className:"logo-top-wrapper"},N(g.a,{href:"/"},N("img",{className:"logo-top",src:"/static/logo/rcti.png"})))),N("div",{className:"right-top-link"},N("div",{className:"btn-link-top-nav"},this.state.token?N(g.a,{style:{color:"white",fontSize:13},onClick:this.signOut.bind(this),href:"#"},"Sign Out"):N(g.a,{style:{color:"white",fontSize:13},href:"/signin"},"Sign In"),N(g.a,{style:{color:"white"},href:"/explore"},N(w.a,{style:{fontSize:20}}))))),N(b.a,null))}}]),t}(l.Component);t.a=Object(d.b)(function(a){return a},p.a)(j)},y8Nf:function(a,t,e){"use strict";e.r(t);var s=e("0iUn"),n=e("MI3g"),i=e("a7VT"),o=e("sLSF"),c=e("Tit0"),l=e("q1tI"),r=e.n(l),u=e("/MKj"),f=e("x91w"),d=e("ndts"),p=e("Ywvz"),m=e("kgVM"),h=e("wx14"),g=e("zLVn"),b=e("17x9"),v=e.n(b),w=e("TSYQ"),N=e.n(w),j=e("33Jr"),O={tag:j.l,flush:v.a.bool,className:v.a.string,cssModule:v.a.object},y=function(a){var t=a.className,e=a.cssModule,s=a.tag,n=a.flush,i=Object(g.a)(a,["className","cssModule","tag","flush"]),o=Object(j.h)(N()(t,"list-group",!!n&&"list-group-flush"),e);return r.a.createElement(s,Object(h.a)({},i,{className:o}))};y.propTypes=O,y.defaultProps={tag:"ul"};var _=y,S={tag:j.l,active:v.a.bool,disabled:v.a.bool,color:v.a.string,action:v.a.bool,className:v.a.any,cssModule:v.a.object},k=function(a){a.preventDefault()},M=function(a){var t=a.className,e=a.cssModule,s=a.tag,n=a.active,i=a.disabled,o=a.action,c=a.color,l=Object(g.a)(a,["className","cssModule","tag","active","disabled","action","color"]),u=Object(j.h)(N()(t,!!n&&"active",!!i&&"disabled",!!o&&"list-group-item-action",!!c&&"list-group-item-"+c,"list-group-item"),e);return i&&(l.onClick=k),r.a.createElement(s,Object(h.a)({},l,{className:u}))};M.propTypes=S,M.defaultProps={tag:"li"};var E=M,T=r.a.createElement,C=function(a){function t(a){var e;return Object(s.a)(this,t),(e=Object(n.a)(this,Object(i.a)(t).call(this,a))).state={firstname:"",lastname:"",email_id:"",mobile_no:"",password:"",confirm_password:""},e}return Object(c.a)(t,a),Object(o.a)(t,null,[{key:"getInitialProps",value:function(a){Object(d.a)(a)}}]),Object(o.a)(t,[{key:"handleSubmit",value:function(a){a.preventDefault(),this.props.register({firstname:this.state.firstname,lastname:this.state.lastname,email_id:this.state.email_id,mobile_no:this.state.mobile_no,password:this.state.password,confirm_password:this.state.confirm_password},"register")}},{key:"render",value:function(){return T(p.a,{title:"Sign Up"},T(m.a,null),T("div",null,T("div",{className:"header-user-profile"},T("i",{className:"fas fa-user-circle fa-2x"}),T("span",{className:"header-user-profle-title"},"User Name")),T(_,null,T(E,{tag:"a",href:"/user/detail-points",action:!0},"Points"),T(E,{tag:"a",href:"/user/history",action:!0},T("i",{className:"fas fa-history"})," History"),T(E,{tag:"a",href:"/user/download",action:!0},T("i",{className:"fas fa-download"})," Download"),T(E,{tag:"a",href:"/user/my-list",action:!0},T("i",{className:"fas fa-list"})," My List"),T(E,{tag:"a",href:"/user/continue-watching",action:!0},T("i",{className:"far fa-clock"})," Continue Watching"),T(E,{tag:"a",href:"/user/term&cond",action:!0},T("i",{className:"fas fa-exclamation-circle"}),"  Term & Conditions"),T(E,{tag:"a",href:"/user/privacy-policy",action:!0},T("i",{className:"fas fa-lock"}),"  Privacy Policy"),T(E,{tag:"a",href:"/user/help",action:!0},T("i",{className:"far fa-comment-alt"}),"  Help"),T(E,{tag:"a",href:"/user/faq",action:!0},T("i",{className:"far fa-question-circle"}),"  FAQ"),T(E,{tag:"a",href:"/user/faq",action:!0},T("center",null,"Version 1.2")))))}}]),t}(r.a.Component);t.default=Object(u.b)(function(a){return a},f.a)(C)}},[["djzL",0,1]]]);