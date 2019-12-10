import Swal from 'sweetalert2/dist/sweetalert2.js';
// import 'sweetalert2/src/sweetalert2.scss';

// import '../assets/scss/components/alert.scss';

export const showConfirmAlert = (text, title, callback, buttonInverse = false, confirmText = 'OK', cancelText = 'Cancel') => {
    let options = {
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