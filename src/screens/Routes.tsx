import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { routerConstants } from 'src/constants';

import App from './App';
import Dashboard from './dashboard';
import Login from './login';
import NotFound from './not-found';
import SchemaEdit from './schema-edit';
import SchemaEditCookieConsent from './schema-edit/cookie-consent';
import SchemaEditQuickTranslation from './schema-edit/quick-translation';
import SchemaEditTranslation from './schema-edit/translation';
import SchemaEditPronunciation from './schema-edit/pronunciation';
import SchemaEditImages from './schema-edit/images';
import Languages from './languages';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routerConstants.HOME} element={<App />}>
                    <Route
                        path={routerConstants.HOME}
                        element={<Dashboard />}
                    />
                    <Route
                        path={routerConstants.LOGIN}
                        element={<Login />}
                    />
                    <Route
                        path={routerConstants.SCHEMA_EDIT}
                        element={<SchemaEdit />}
                    >
                        <Route
                            path={routerConstants.SCHEMA_EDIT}
                            element={<SchemaEditCookieConsent />}
                        />
                        <Route
                            path={routerConstants.SCHEMA_EDIT_QUICK_TRANSLATION}
                            element={<SchemaEditQuickTranslation />}
                        />
                        <Route
                            path={routerConstants.SCHEMA_EDIT_TRANSLATION}
                            element={<SchemaEditTranslation />}
                        />
                        <Route
                            path={routerConstants.SCHEMA_EDIT_PRONUNCIATION}
                            element={<SchemaEditPronunciation />}
                        />
                        <Route
                            path={routerConstants.SCHEMA_EDIT_IMAGES}
                            element={<SchemaEditImages />}
                        />
                    </Route>
                    <Route
                        path={routerConstants.LANGUAGES}
                        element={<Languages />}
                    />
                    <Route path='*' element={<NotFound />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}