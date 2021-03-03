import Swal from 'sweetalert2/dist/sweetalert2.js';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty'

export const showAlert = (text, title, confirmText = 'OK', cancelText = '', confirmCallback = () => {}, styleInverse = false, confirmButtonId = '', cancelButtonId = '') => {
    let options = {
        text: text,
        title: title,
        showCancelButton: cancelText != '',
        confirmButtonText: confirmText,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'custom-swal-confirm-btn btn-next block-btn btn-primary-edit btn-alert-c',
            cancelButton: 'custom-swal-cancel-btn block-btn btn-link-edit btn-cancel btn-alert-c',
            header: 'alert-header'
        },
        width: '85%',
        onOpen: () => {
            if (document) {
                if (confirmButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-confirm-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = confirmButtonId;
                    }
                }
                if (cancelButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-cancel-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = cancelButtonId;
                    }
                }
            }
        }
    };

    if (styleInverse) {
        options.customClass = {
            confirmButton: 'custom-swal-confirm-btn block-btn btn-link-edit btn-cancel btn-alert-c btn-cancel-c',
            cancelButton: 'custom-swal-cancel-btn btn-next block-btn btn-primary-edit btn-alert-c',
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

export const showConfirmAlert = (text, title, callback, buttonInverse = false, confirmText = 'OK', cancelText = 'Cancel', html = false, styleInverse = false, confirmButtonId = '', cancelButtonId = '') => {
    let options = {
        showCancelButton: cancelText ? true : false,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'custom-swal-confirm-btn btn-next block-btn btn-primary-edit',
            cancelButton: 'custom-swal-cancel-btn block-btn btn-link-edit btn-cancel',
            header: 'alert-header'
        },
        width: '85%',
        allowOutsideClick: false,
        onOpen: () => {
            if (document) {
                if (confirmButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-confirm-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = confirmButtonId;
                    }
                }
                if (cancelButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-cancel-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = cancelButtonId;
                    }
                }
            }
        }
    };

    options[html ? 'html' : 'text'] = text;
    if (styleInverse) {
        options.customClass = {
            confirmButton: 'custom-swal-confirm-btn block-btn btn-link-edit btn-cancel',
            cancelButton: 'custom-swal-cancel-btn btn-next block-btn btn-primary-edit',
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

export const showSignInAlert = (text, title, callback, buttonInverse = false, confirmText = 'OK', cancelText = 'Cancel', html = false, styleInverse = false, confirmButtonId = '', cancelButtonId = '') => {
    let options = {
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'custom-swal-confirm-btn btn-next block-btn btn-primary-edit',
            cancelButton: 'custom-swal-cancel-btn block-btn btn-link-edit btn-cancel',
            header: 'alert-header'
        },
        width: '85%',
        allowOutsideClick: false,
        onOpen: () => {
            if (document) {
                if (confirmButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-confirm-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = confirmButtonId;
                    }
                }
                if (cancelButtonId) {
                    const buttons = document.getElementsByClassName('custom-swal-cancel-btn');
                    if (buttons.length > 0) {
                        buttons[0].id = cancelButtonId;
                    }
                }
            }
        }
    };

    options[html ? 'html' : 'text'] = text;
    if (styleInverse) {
        options.customClass = {
            confirmButton: 'custom-swal-confirm-btn block-btn btn-link-edit btn-cancel',
            cancelButton: 'custom-swal-cancel-btn btn-next block-btn btn-primary-edit',
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

export const getCountdown = (release, current) => {
    const now = new Date(parseInt(current) * 1000).getTime() || new Date().getTime();
    const timeRelease = new Date(parseInt(release) * 1000).getTime();
    const result = (timeRelease - now);
    if(timeRelease < now) {
        return [result, false]
    }
    return [result, true];
}

export const getTruncate = (text = '', clamp = '...', length = 100) => {
    // text = `is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was po`
    if (text.length <= length) return text;

    var tcText = text.slice(0, length - clamp.length);
    var last = tcText.length - 1;
    

    while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

    // Fix for case when text dont have any `space`
    last = last || length - clamp.length;

    tcText =  tcText.slice(0, last);

    return tcText + clamp;
}

export const humanizeStr = (str) => {
    var i, frags = str.split('-');
    for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
 
    return frags.join(' ');
}

export const imgNews = (source, staticUrl, size = 200, assetsUrl = 'https://rstatic.akamaized.net/media/') => {
    return !isEmpty(staticUrl) && staticUrl !== '-' ? `${assetsUrl}${size}${staticUrl}` : source;
}
