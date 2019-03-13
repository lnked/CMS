import * as React from 'react'
import * as css from './styles.scss'

import { request, classes } from 'helpers'

import { Link } from 'react-router-dom'

import { STORE_UI, STORE_APP, STORE_ROUTER } from 'settings/constants'

import { inject, observer } from 'mobx-react'

const cx = classes.bind(css)

@inject(STORE_UI, STORE_APP, STORE_ROUTER)
@observer
class ModulesPage extends React.Component<any, any> {

  state = {
    list: [],
  }

  componentDidMount () {
    this.loadData()
  }

  loadData = () => {
    request({ noToken: true })
      .get('/api/modules/list')
      .then((res: any) => res.data)
      .then((list: any) => this.setState({ list }))
      .catch((error: any) => console.log(error))
  }

  render () {
    const { list } = this.state

    return (
      <div className={css.content}>
        <div className={cx(css.list)}>
          {list && list.map((module: any) => (
            <Link
              key={`module_${module.id}`}
              to={`/cp/meta/module/${module.sys_name}`}
              className={cx({ button: true })}>
              {module.name}
            </Link>
          ))}
        </div>
      </div>
    )
  }

}

export { ModulesPage }
export default ModulesPage
