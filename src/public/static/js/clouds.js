function renderStats(update) {
    $.get('/api/v1/clouds', function (res, status) {
        if (status === 'success') {
            const root = $('#clouds');
            const htmlStr =
                '<li class="nav-item hidden"><a class="nav-link" href="/{0}">{1} <span class="badge badge-{3}">{2}</span></a></li>';
            res.data.forEach(function (elem) {
                let { attr, slug, name, count } = elem;
                if (!update) root.append(htmlStr.f(slug, name, count, attr));
                let selector = root.find(`a[href$="${slug}"]`);
                if (count > 0) {
                    selector.find('span.badge').text(count);
                    selector.parent().removeClass('hidden');
                } else {
                    selector.parent().addClass('hidden');
                }
            });

            root.find(`a[href$="${window.location.pathname}"]`).addClass('active');
        }
    });
}

$(function () {
    renderStats();
});
