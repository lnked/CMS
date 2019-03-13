/* eslint-disable */
/* tslint:disable:max-line-length */

import { loadComponent } from 'utils'

import { ROOT_PATH } from 'settings/constants'

export const routes: Route[] = [
    {
        exact: true,
        path: `${ROOT_PATH}/meta/module`,
        component: loadComponent(() =>
            import(/* webpackMode: "lazy", webpackPrefetch: true, webpackChunkName: "main-page" */ './')
        ),
        title: 'ModulesPage title',
        description: 'ModulesPage kit',
    }
]
