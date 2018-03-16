import React from 'react';

import chrome from 'ui/chrome';

import 'ui/autoload/all';
import 'plugins/kbn_vislib_vis_types/kbn_vislib_vis_types';

import {render} from 'react-dom';

import { Provider } from 'react-redux';

import DashboardRank from './src/components/dashrank';
import configureStore from './src/stores/configureStore';
const store = configureStore();

chrome
    .setRootTemplate(`<div id="root" class="quicknavi"></div>`)
    .setRootController(($scope, docTitle, hasXpackInstalled) => {
        docTitle.change('quicknavi');

        // Mount the React app
        const el = document.getElementById('root');
        render(
            <Provider store={store}>
              <DashboardRank 
                hasXpack={hasXpackInstalled}/>
            </Provider>, el);

    });
