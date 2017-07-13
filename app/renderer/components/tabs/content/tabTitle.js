/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const {StyleSheet, css} = require('aphrodite/no-important')

// Components
const ReduxComponent = require('../../reduxComponent')

// State
const frameStateUtil = require('../../../../../js/state/frameStateUtil')
const tabContentState = require('../../../../common/state/tabContentState')

// Utils
const {isWindows, isDarwin} = require('../../../../common/lib/platformUtil')

// Styles
const globalStyles = require('../../styles/global')

class TabTitle extends React.Component {
  mergeProps (state, ownProps) {
    const currentWindow = state.get('currentWindow')
    const isPrivate = frameStateUtil.getFrameByKey(currentWindow, ownProps.frameKey).get('isPrivate')
    const tabIconColor = tabContentState.getTabIconColor(currentWindow, ownProps.frameKey)
    const themeColor = tabContentState.getThemeColor(currentWindow, ownProps.frameKey)
    const isActive = frameStateUtil.isFrameKeyActive(currentWindow, ownProps.frameKey)
    const isHovered = frameStateUtil.getTabHoverState(currentWindow, ownProps.frameKey)

    const props = {}
    // used in renderer
    props.enforceFontVisibility = isDarwin() && tabIconColor === 'white'
    props.tabIconColor = tabIconColor

    props.tabBackgroundColor = (function () {
      if (isActive) {
        if (isPrivate) {
          return globalStyles.color.privateTabBackgroundActive
        }
        return themeColor
      } else {
        if (isPrivate) {
          return 'transparent'
        }
        if (isHovered) {
          return globalStyles.color.chromePrimary
        }
        return globalStyles.color.tabsBackgroundInactive
      }
    }())

    props.displayTitle = tabContentState.getDisplayTitle(currentWindow, ownProps.frameKey)
    // used in functions
    props.frameKey = ownProps.frameKey

    return props
  }

  get tabBackgroundColor () {
    return this.props.isActive ? this.props.themeColor : globalStyles.color.tabsBackgroundInactive
  }

  render () {
    const titleStyles = StyleSheet.create({
      gradientText: {
        color: this.props.tabIconColor,
        ':after': {
          content: `''`,
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: '2px',
          width: '10%',
          backgroundImage: `linear-gradient(to right, transparent, ${this.props.tabBackgroundColor})`
        }
      }
    })

    return <div data-test-id='tabTitle'
      className={css(
        styles.tabTitle,
        titleStyles.gradientText,
        this.props.enforceFontVisibility && styles.enforceFontVisibility,
        // Windows specific style
        isWindows() && styles.tabTitleForWindows
      )}>
      {this.props.displayTitle}
    </div>
  }
}

module.exports = ReduxComponent.connect(TabTitle)

const styles = StyleSheet.create({
  tabTitle: {
    display: 'flex',
    flex: '1',
    userSelect: 'none',
    boxSizing: 'border-box',
    fontSize: globalStyles.fontSize.tabTitle,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    lineHeight: '1.6',
    padding: globalStyles.spacing.defaultTabPadding
  },

  enforceFontVisibility: {
    fontWeight: '600'
  },

  tabTitleForWindows: {
    fontWeight: '500',
    fontSize: globalStyles.fontSize.tabTitle
  }
})
