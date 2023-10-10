$('.dt-picker').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
    todayHighlight: true,
    disableTouchKeyboard: true,
    keyboardNavigation: false,
});
$('.end-date').datepicker('update', moment().toDate());
$('.start-date').datepicker('update', moment().subtract(3, 'months').toDate());

const ErrMsg = {
    required: 'Bắt buộc nhập mã phiếu',
    length: 'Mã phiếu không hợp lệ',
};

$('#navbarContent .launch-modal').on('click', function () {
    const { action, attached } = $(this).data();
    modal.show({
        ...$(this).data(),
        afterLoad: function () {
            $('#modal form').attr('action', action);
            $('.download__url').attr('href', attached);
            if (action.endsWith('create')) $('#modal .form-check').addClass('hidden');
        },
    });
});

function removeAllSelections() {
    if (!selections) return;
    const form = $('#modal form');
    if (!form) return;

    modal.submit(
        {
            url: '/api/v1/order',
            type: 'delete',
            data: { selections: JSON.stringify(selections) },
        },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}

function uploadExcelFile() {
    const form = $('#modal form');
    if (!form) return;

    const input = form.find('input')[0];
    const ignoreBlank = form.find('.form-check-input').prop('checked');

    formData = new FormData();
    formData.append('file', input.files[0]);
    formData.append('ignoreBlank', ignoreBlank);

    modal.submit(
        {
            url: form.attr('action'),
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                modal.dismiss();
                if (input.files[0]) $('#loader').modal('show');
            },
        },
        function (res) {
            notifyDataSetChanged();
            const { datasheet, type } = res;
            if (type === 'success') return;

            const fileName = 'ImportError_{0}.xlsx'.f(moment().format('YYMMDDhhmmss'));
            exportXlsxFile({ fileName, ...datasheet });
        },
    );
}
function createOrder() {
    const form = $('#modal form');
    if (!form) return;
    form.validate({
        rules: {
            receiptNo: {
                minlength: 31,
                maxlength: 32,
            },
        },
        messages: {
            receiptNo: {
                required: ErrMsg.required,
                minlength: ErrMsg.length,
                maxlength: ErrMsg.length,
            },
            model: {
                required: ErrMsg.required,
            },
        },
    });

    if (!form.valid()) return;
    const data = parseJsonData(form.serializeArray());
    modal.submit(
        {
            url: form.attr('action'),
            type: 'post',
            data: { order: JSON.stringify(data) },
        },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}
function updateByPk() {
    const form = $('#modal form');
    if (!form) return;
    const data = parseJsonData(form.serializeArray());
    console.log(data);
    modal.submit(
        { url: form.attr('action'), type: 'put', data: { order: JSON.stringify(data) } },
        (then = function () {
            notifyDataSetChanged();
        }),
    );
}

function rememberSearch() {
    const params = new URLSearchParams(window.location.search);
    const firstCloud = $('#clouds li:first-child');
    if (window.location.pathname !== '/search') {
        firstCloud.addClass('hidden');
        return;
    }

    firstCloud.removeClass('hidden');

    const root = $('.search-box');
    for (const [k, v] of params) {
        root.find(`[name="${k}"]`).val(v.trim());
    }

    root.find(`[name="value"]`).prop(`disabled`, root.find(`[name="key"]`).val() === 'all');
    root.find('.dt-picker').each(function () {
        $(this).datepicker('update', $(this).val());
    });
}

$('.search-box select')
    .on('change', function () {
        const inputSearch = $('.search-box').find(`[name="value"]`);
        inputSearch.prop(`disabled`, $(this).val() === 'all');
    })
    .trigger('change');

$(function () {
    rememberSearch();
});
