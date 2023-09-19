$('.btn-modal').click(function (ev) {
    onModalDisplay($(this).data());
});

function onModalDisplay({ title, body, submit, formData }) {
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

function onModalSubmit() {
    const form = $('.modal .modal-body').find('form');
    alert(form.serialize());
}
