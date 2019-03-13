/* eslint-disable */
/* tslint:disable:max-line-length */

import { loadComponent } from 'utils'

import { ROOT_PATH } from 'settings/constants'

export const routes: Route[] = [
    {
        path: `${ROOT_PATH}/lists`,
        component: loadComponent(() =>
            import(/* webpackMode: "lazy", webpackPrefetch: true, webpackChunkName: "panels-page" */ './')
        ),
        title: 'lists Page title',
        description: 'lists starter kit',
    }
]
