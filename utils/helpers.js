import Swal from 'sweetalert2/dist/sweetalert2.js';
import Router from 'next/router';
// import 'sweetalert2/src/sweetalert2.scss';

// import '../assets/scss/components/alert.scss';

export const showAlert = (text, title, confirmText = 'OK', cancelText = '', confirmCallback = () => {}, styleInverse = false) => {
    let options = {
        text: text,
        title: title,
        showCancelButton: cancelText != '',
        confirmButtonText: confirmText,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn-next block-btn btn-primary-edit btn-alert-c',
            cancelButton: 'block-btn btn-link-edit btn-cancel btn-alert-c',
            header: 'alert-header'
        },
        width: '85%'
    };

    if (styleInverse) {
        options.customClass = {
            confirmButton: 'block-btn btn-link-edit btn-cancel btn-alert-c btn-cancel-c',
            cancelButton: 'btn-next block-btn btn-primary-edit btn-alert-c',
            header: 'alert-header'
        };
    }

    Swal.fire(options)
        .then(result => {
            if (result.value) {
                confirmCallback();
            }
        });
};

export const showConfirmAlert = (text, title, callback, buttonInverse = false, confirmText = 'OK', cancelText = 'Cancel', html = false, styleInverse = false) => {
    let options = {
        showCancelButton: cancelText ? true : false,
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

    options[html ? 'html' : 'text'] = text;
    if (styleInverse) {
        options.customClass = {
            confirmButton: 'block-btn btn-link-edit btn-cancel',
            cancelButton: 'btn-next block-btn btn-primary-edit',
            header: 'alert-header'
        };
    }

    if (title) {
        options['title'] = title;
    }
    
    Swal.fire(options)
        .then(result => {
            let whichButton = result.value;  

            if (buttonInverse) {
                whichButton = !result.value;
            }

            if (whichButton) {
                callback();
            }
        });
};

export const showSignInAlert = (text, title, callback, buttonInverse = false, confirmText = 'OK', cancelText = 'Cancel', html = false, styleInverse = false) => {
    let options = {
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

    options[html ? 'html' : 'text'] = text;
    if (styleInverse) {
        options.customClass = {
            confirmButton: 'block-btn btn-link-edit btn-cancel',
            cancelButton: 'btn-next block-btn btn-primary-edit',
            header: 'alert-header'
        };
    }

    if (title) {
        options['title'] = title;
    }
    
    Swal.fire(options)
        .then(result => {
            if (result.value) {
                Router.push('/register');
            }
            else if (result.dismiss == 'cancel') {
                Router.push('/login');
            }
        });

    const btn = document.createElement('button');
    btn.innerHTML = 'Close';
    btn.className = 'swal2-cancel-custom';
    btn.addEventListener('click', () => Swal.close());
    const btnCancel = document.getElementsByClassName('swal2-cancel')[0];
    btnCancel.parentNode.insertBefore(btn, btnCancel.nextSibling)
};