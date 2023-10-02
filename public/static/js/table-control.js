var selections = [];

const initTable = function (tableId) {
    $(tableId).bootstrapTable({
        icons: { clearSearch: 'glyphicon-remove' },
        columns: [
            {
                field: 'state',
                checkbox: true,
            },
            {
                field: 'receiptNo',
                title: 'Mã phiếu',
                sortable: true,
            },
            {
                field: 'model',
                title: 'Tên TB',
                sortable: true,
            },
            {
                field: 'serial',
                title: 'Serial',
                sortable: true,
            },
            {
                field: 'description',
                title: 'Mô tả lỗi',
                sortable: true,
            },
            {
                field: 'newSerial',
                title: 'Serial mới',
                sortable: true,
            },
            {
                field: 'method',
                title: 'Biện pháp',
                sortable: true,
            },
            {
                field: 'remark',
                title: 'Chi tiết SC',
                sortable: true,
            },
            {
                field: 'warning',
                title: 'Cảnh báo',
                sortable: true,
            },
            {
                field: 'status',
                title: 'Trạng thái',
                sortable: true,
                align: 'center',
                formatter: statusFormatter,
            },
            {
                field: 'createdAt',
                title: 'Ngày lập',
                sortable: true,
            },
            {
                field: 'operate',
                title: 'Thao tác',
                align: 'center',
                formatter: operateFomatter,
                events: window.operateEvents,
            },
        ],
    });

    $(tableId).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        selections = $.map($(tableId).bootstrapTable('getSelections'), (row) => row.receiptNo);
        notifySelectionChanged();
    });

    // searchOnEnterKey
    $('.bootstrap-table .search input').on('keypress', function (e) {
        if (e.key === 'Enter') {
            $('.search input').select();
        }
    });

    // onOptionItemSelected
    $('#menuOthers').on('click', '.dropdown-item', function () {
        $.ajax({
            url: $(this).data('url'),
            type: 'PUT',
            caches: false,
            data: { constraints: JSON.stringify(selections) },
            success: function (res) {
                toast(res);
                notifyDataSetChanged();
            },
            error: function (err) {
                toast(err);
            },
        });
    });
};

window.operateEvents = {
    'click .btn-modal': function (e, value, row, index) {
        modal.show({
            title: 'Sửa chữa',
            body: '/api/v1/view/update',
            submit: { class: 'btn btn-success', text: 'Cập nhật', handler: 'updateByPk' },
            afterLoad: function () {
                $.each(row, function (k, v) {
                    if (v) $('#modal').find(`[name="${k}"]`).val(v);
                });
            },
        });
    },
};

function operateFomatter(value, row, index) {
    return `<button class="btn btn-outline-primary btn-sm btn-modal" 
    type="button">
    <i class="fa fa-pen"></i>
    </button>`;
}

function statusFormatter(value, row, index) {
    const status = value.toLowerCase();
    let type = '';
    switch (status) {
        case 'kết thúc':
            type = 'success text-light';
            break;
        case 'chờ trả':
            type = 'primary  text-light';
            break;
        default:
            type = 'warning';
            break;
    }

    return `<span class="badge bg-${type}">${value}</span>`;
}

function notifySelectionChanged() {
    if (selections.length) {
        $('#menuOthers .dropdown-item').removeClass('hidden');
        $('#menuOthers .dropdown-header').addClass('hidden');
        $('#menuDel').removeClass('disabled');
    } else {
        $('#menuOthers .dropdown-item').addClass('hidden');
        $('#menuOthers .dropdown-header').removeClass('hidden');
        $('#menuDel').addClass('disabled');
    }
}

function notifyDataSetChanged() {
    renderClouds(true);
    selections = [];
    notifySelectionChanged();
    $('#table').bootstrapTable('refresh');
}

function loadingTemplate() {
    return `<i class="fa fa-spinner fa-spin"></i>`;
}

$(function () {
    initTable('#table');
});