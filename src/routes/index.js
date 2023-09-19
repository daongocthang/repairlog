import { BrowserRoutes } from './browser.routes';
import { MainRoutes } from './main.routes';

const routes = (app) => {
    MainRoutes(app);
    BrowserRoutes(app);
};

export default routes;
