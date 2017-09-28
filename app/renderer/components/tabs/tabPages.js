/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')

// Components
const ReduxComponent = require('../reduxComponent')
const TabPage = require('./tabPage')

// Utils
const frameStateUtil = require('../../../../js/state/frameStateUtil')

class TabPages extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')

    const props = {}
    props.tabPageCount = frameStateUtil.getTabPageCount(currentWindow)
    // BSC: this never gets fired saying tabPageCount=1; always stays as 2
    // MAYBE this doesn't get fired because there's no more tab pages (only 1)
    console.log('tabPageCount=' + props.tabPageCount)

    return props
  }

  render () {
    return <div className='tabPageWrap'>
      {
        this.props.tabPageCount > 1 &&
        Array.from(new Array(this.props.tabPageCount)).map((x, i) =>
          <TabPage
            key={`tabPage-${i}`}
            index={i} />
        )
      }
    </div>
  }
}

module.exports = ReduxComponent.connect(TabPages)
