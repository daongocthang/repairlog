function renderStats() {
    $('#stats').empty();
    $.get('/api/v1/stats', function (res, status) {
        if (status === 'success') {
            let htmlStr = '<li><a class="bg-{0}" href="/{1}">{2} <span class="badge">{3}</span></a></li>';
            res.data.forEach(function (elem) {
                let { attr, slug, name, count } = elem;
                if (elem.count > 0) {
                    $('#stats').append(htmlStr.f(attr, slug, name, count));
                }
            });
        }
    });
}

$(function () {
    renderStats();
});
