var selections = [];

const initTable = function (tableId) {
    const hiddenColumnList = cookie.parseJSON(cookie.get('table.hiddenColumns')) || [];

    $(tableId).bootstrapTable({
        icons: { clearSearch: 'glyphicon-remove' },
        exportTypes: ['excel'],
        exportOptions: {
            fileName: function () {
                return 'ExportFile__' + moment().format('YYDDMMHHmmss');
            },
            mso: {
                fileFormat: 'xlsx',
            },
        },
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
                formatter: remarkFormatter,
            },
            {
                field: 'warning',
                title: 'Cảnh báo',
                sortable: true,
                formatter: warningFormatter,
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

    // onSearchTextChanged
    $(tableId).on('search.bs.table', function (event, searchText) {
        cookie.set('table.searchText', searchText, 1);
    });

    $(tableId).on('column-switch.bs.table', function (event, columnName) {
        if (hiddenColumnList instanceof Array) {
            if (hiddenColumnList.includes(columnName)) {
                hiddenColumnList.remove(columnName);
            } else {
                hiddenColumnList.push(columnName);
            }

            if (hiddenColumnList.length === 0) {
                cookie.remove('table.hiddenColumns');
            } else {
                cookie.set('table.hiddenColumns', JSON.stringify(hiddenColumnList));
            }
        }
    });

    // onOptionItemSelected
    $('#menuOthers').on('click', '.dropdown-item', function () {
        const url = $(this).data('url');

        $.ajax({
            url,
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

    // Configure from cookies
    hiddenColumnList.forEach((columnName) => {
        $(tableId).bootstrapTable('hideColumn', columnName);
    });

    const searchText = cookie.get('table.searchText');
    if (searchText) {
        $(tableId).bootstrapTable('resetSearch', searchText);
        $('.search input').select();
    }
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

function warningFormatter(value, row, index) {
    if (value !== null) return `<span class="text-danger font-weight-bold">${value}</span>`;
}

function remarkFormatter(value, row, index) {
    if (value == null) return;
    const regex = /(BH\d{6}[A-Z0-9]{4})/;
    return value.replace(regex, `<span class="text-danger">$1</span>`);
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
    $('.search input').select();
}

function loadingTemplate() {
    return `<i class="fa fa-spinner fa-spin"></i>`;
}

$(function () {
    initTable('#table');
});
