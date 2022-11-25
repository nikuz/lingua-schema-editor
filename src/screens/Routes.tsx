import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import { routerConstants } from 'src/constants';

import App from './App';
import NotFound from './not-found';
import Dashboard from './dashboard';
import SchemaEdit from './schema-edit';
import SchemaEditTranslation from './schema-edit/tabs/translation';
import SchemaEditPronunciation from './schema-edit/tabs/pronunciation';
import SchemaEditImages from './schema-edit/tabs/images';

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
                        path={routerConstants.SCHEMA_EDIT}
                        element={<SchemaEdit />}
                    >
                        <Route
                            path={routerConstants.SCHEMA_EDIT}
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
                    <Route path='*' element={<NotFound />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}