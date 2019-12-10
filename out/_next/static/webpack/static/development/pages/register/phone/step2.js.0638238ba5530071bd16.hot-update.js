webpackHotUpdate("static/development/pages/register/phone/step2.js",{

/***/ "./utils/helpers.js":
/*!**************************!*\
  !*** ./utils/helpers.js ***!
  \**************************/
/*! exports provided: showAlert, showConfirmAlert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showAlert", function() { return showAlert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showConfirmAlert", function() { return showConfirmAlert; });
/* harmony import */ var sweetalert2_dist_sweetalert2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sweetalert2/dist/sweetalert2.js */ "./node_modules/sweetalert2/dist/sweetalert2.js");
/* harmony import */ var sweetalert2_dist_sweetalert2_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sweetalert2_dist_sweetalert2_js__WEBPACK_IMPORTED_MODULE_0__);
 // import 'sweetalert2/src/sweetalert2.scss';
// import '../assets/scss/components/alert.scss';

var showAlert = function showAlert(text, title) {
  var confirmText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'OK';
  var options = {
    text: text,
    title: title,
    showCancelButton: false,
    confirmButtonText: confirmText,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn-next block-btn btn-primary-edit',
      cancelButton: 'block-btn btn-link-edit btn-cancel',
      header: 'alert-header'
    },
    width: '85%'
  };
  sweetalert2_dist_sweetalert2_js__WEBPACK_IMPORTED_MODULE_0___default.a.fire(options);
};
var showConfirmAlert = function showConfirmAlert(text, title, callback) {
  var buttonInverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var confirmText = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'OK';
  var cancelText = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'Cancel';
  var options = {
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn-next block-btn btn-primary-edit',
      cancelButton: 'block-btn btn-link-edit btn-cancel',
      header: 'alert-header'
    },
    width: '85%',
    allowOutsideClick: false
  };

  if (title) {
    options['title'] = title;
  }

  sweetalert2_dist_sweetalert2_js__WEBPACK_IMPORTED_MODULE_0___default.a.fire(options).then(function (result) {
    var whichButton = result.value;

    if (buttonInverse) {
      whichButton = !result.value;
    }

    if (whichButton) {
      callback();
    }
  });
};

/***/ })

})
//# sourceMappingURL=step2.js.0638238ba5530071bd16.hot-update.js.map