(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{OUKs:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup",function(){var e=a("vL9u");return{page:e.default||e}}])},vL9u:function(e,t,a){"use strict";a.r(t);var s=a("0iUn"),n=a("MI3g"),l=a("a7VT"),r=a("sLSF"),i=a("Tit0"),c=a("q1tI"),o=a.n(c),m=a("/MKj"),u=a("5Yp1"),d=a("x91w"),p=a("ndts"),f=function(e){function t(e){var a;return Object(s.default)(this,t),(a=Object(n.default)(this,Object(l.default)(t).call(this,e))).state={firstname:"",lastname:"",email_id:"",mobile_no:"",password:"",confirm_password:""},a}return Object(i.default)(t,e),Object(r.default)(t,null,[{key:"getInitialProps",value:function(e){Object(p.a)(e)}}]),Object(r.default)(t,[{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.register({firstname:this.state.firstname,lastname:this.state.lastname,email_id:this.state.email_id,mobile_no:this.state.mobile_no,password:this.state.password,confirm_password:this.state.confirm_password},"register")}},{key:"render",value:function(){var e=this;return o.a.createElement(u.a,{title:"Sign Up"},o.a.createElement("h3",{className:"title is-3"},"Sign Up"),o.a.createElement("form",{onSubmit:this.handleSubmit.bind(this),className:"container",style:{width:"540px"}},o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"text",placeholder:"First Name",required:!0,value:this.state.firstname,onChange:function(t){return e.setState({firstname:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"text",placeholder:"Last Name",required:!0,value:this.state.lastname,onChange:function(t){return e.setState({lastname:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"text",placeholder:"Phone Number",required:!0,value:this.state.mobile_no,onChange:function(t){return e.setState({mobile_no:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"email",placeholder:"Email ID",required:!0,value:this.state.email_id,onChange:function(t){return e.setState({email_id:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"password",placeholder:"Password",required:!0,value:this.state.password,onChange:function(t){return e.setState({password:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control"},o.a.createElement("input",{className:"input",type:"password",placeholder:"Confirm Password",required:!0,value:this.state.confirm_password,onChange:function(t){return e.setState({confirm_password:t.target.value})}}))),o.a.createElement("div",{className:"field"},o.a.createElement("p",{className:"control has-text-centered"},o.a.createElement("button",{type:"submit",className:"button is-success"},"Register")))))}}]),t}(o.a.Component);t.default=Object(m.b)(function(e){return e},d.a)(f)}},[["OUKs",1,0]]]);