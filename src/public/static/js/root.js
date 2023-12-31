// Toast message
function toast({ message = '', type = 'success' }) {
    const root = $('#toast');
    const duration = 5000;

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
    modal.show($(this).data());
});

function parseJsonData(array) {
    let results = {};
    $.each(array, function (i, v) {
        let val = v.value.replace(/\r\n$|\n$|^\s+|\s+$/g, '');
        results[v.name] = val;
    });

    return results;
}

const modal = {
    show: function ({ title, body, submit, afterLoad }) {
        const btSubmit = $('#modal .modal-footer').children().last();

        btSubmit.removeClass();
        btSubmit.addClass(submit.class);
        btSubmit.text(submit.text);

        $('#modal .modal-title').text(title);

        $('#modal .modal-body').load(body, function () {
            if (afterLoad instanceof Function) afterLoad();

            $('#modal').modal({ show: true });
        });

        btSubmit.off('click');
        btSubmit.on('click', function () {
            if (window[submit.handler] instanceof Function) {
                window[submit.handler]();
            }
        });
    },
    dismiss: function () {
        $('#modal').modal('hide');
    },
    submit: function (settings, then, except) {
        $.ajax({
            beforeSend: function () {
                $('#modal').modal('hide');
            },
            success: function (res) {
                toast(res);
                if (then instanceof Function) then(res);
            },
            error: function (err) {
                toast(err.responseJSON);
                if (except instanceof Function) except(err);
            },
            complete: function () {
                $('#loader').modal('hide');
            },
            ...settings,
        });
    },
};

// export Xslx file
function exportXlsxFile(settings = { data, fileName, sheetName, widthCols: [{ wch: 10 }, { wch: 10 }] }) {
    const { data, fileName, widthCols, sheetName } = settings;
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();

    if (widthCols) ws['!cols'] = widthCols;

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
}
