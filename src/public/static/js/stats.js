function renderStats(update) {
    // $('#stats').empty();
    $.get('/api/v1/stats', function (res, status) {
        if (status === 'success') {
            let htmlStr =
                '<li class="nav-item hidden"><a class="nav-link" href="/{0}">{1} <span class="badge badge-{3}">{2}</span></a></li>';
            res.data.forEach(function (elem) {
                let { attr, slug, name, count } = elem;
                if (!update) $('.stats').append(htmlStr.f(slug, name, count, attr));
                let selector = $(".stats a[href$='{0}']".f(slug));
                if (count > 0) {
                    selector.find('span.badge').text(count);
                    selector.parent().removeClass('hidden');
                } else {
                    selector.parent().addClass('hidden');
                }
            });
        }
    });
}

$(function () {
    renderStats();
});
