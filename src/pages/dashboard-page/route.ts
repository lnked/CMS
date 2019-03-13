/* eslint-disable */
/* tslint:disable:max-line-length */

import { loadComponent } from 'utils'

import { ROOT_PATH } from 'settings/constants'

export const routes: Route[] = [
    {
        exact: true,
        path: `${ROOT_PATH}/dashboard`,
        component: loadComponent(() =>
            import(/* webpackMode: "lazy", webpackPrefetch: true, webpackChunkName: "main-page" */ './')
        ),
        title: 'Dashboard Page title',
        description: 'Dashboard starter kit',
    }
]
