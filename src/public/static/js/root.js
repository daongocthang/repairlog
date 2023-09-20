// String formatter
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

// Toast message
function toast({ message = '', type = 'success' }) {
    const root = $('#toast');
    const duration = 3000;

    if (!root) return;

    const toast = $('<div>');

    const autoRemoveId = setTimeout(function () {
        toast.remove();
    }, duration + 1000);

    toast.click(function (ev) {
        if (ev.target.closest('.toast__close')) {
            toast.remove();
            clearTimeout(autoRemoveId);
        }
    });

    const delay = (duration / 1000).toFixed(2);

    toast.attr('style', `animation: slideLeft ease 0.5s, fadeOut linear 1s ${delay}s forwards;`);

    toast.addClass(`custom-toast toast--${type}`);

    toast.html(`  
      <div class="toast__body">
        <span>${message}</span>
      </div>
      <div class="toast__close">
        <i class="fa fa-times"></i>
      </div>  
    `);

    toast.appendTo(root);
}

/* 
 Modal controller
 Requirement: Bootstrap
*/
$('.btn-modal').click(function (ev) {
    showModal($(this).data());
});

function showModal({ title, body, submit, formData }) {
    const btSubmit = $('#modal .modal-footer').children().last();

    btSubmit.removeClass();
    btSubmit.addClass(submit.class);
    btSubmit.text(submit.text);

    $('#modal .modal-title').text(title);

    $('#modal .modal-body').load(body, function () {
        const form = $('.modal .modal-body').find('form');
        if (form && formData) {
            $.each(formData, function (k, v) {
                form.find('[name="{0}"]'.f(k)).val(v);
            });
        }

        $('#modal').modal({ show: true });
    });

    btSubmit.off('click');
    btSubmit.on('click', function () {
        if (window[submit.handler] instanceof Function) {
            window[submit.handler]();
        }
    });
}