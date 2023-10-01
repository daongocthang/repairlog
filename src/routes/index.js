import browser from './browser.routes';
import api from './api.routes';

const routes = (app) => {
    api(app);
    browser(app);
};

export default routes;
