/* eslint-disable */
/* tslint:disable:max-line-length */

import { loadComponent } from 'utils'

import { ROOT_PATH } from 'settings/constants'

export const routes: Route[] = [
    {
        path: `${ROOT_PATH}/blocks/:module(items|banners)?`,
        component: loadComponent(() =>
            import(/* webpackMode: "lazy", webpackPrefetch: true, webpackChunkName: "example.page" */ './')
        ),
        title: 'BlocksPage Page',
        description: 'BlocksPage starter kit',
    }
]
