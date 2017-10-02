const Immutable = require('immutable')
const niceware = require('niceware')

const addBookmarksN = function (total) {
  if (!total || total > 65536) {
    throw new Error('Can only add up to 65536 bookmarks.')
  }
  return function * (client) {
    const data = []
    const buffer = new Buffer(2)
    for (let n = 0; n < total; n++) {
      buffer.writeUInt16BE(n)
      const string = niceware.bytesToPassphrase(buffer)[0]
      data.push({
        location: `https://www.${string}.com`,
        title: string,
        parentFolderId: 0
      })
    }
    const lastBookmark = data.pop()
    const immutableData = Immutable.fromJS(data)
    yield client.waitForBrowserWindow()
      .addBookmarks(immutableData)
      .addBookmark(lastBookmark)
  }
}
const addBookmarks4000 = addBookmarksN(4000)

const addTabsN = function (total) {
  return function * (client) {
    const data = []
    const buffer = new Buffer(2)
    for (let n = 0; n < total; n++) {
      buffer.writeUInt16BE(n)
      const string = niceware.bytesToPassphrase(buffer)[0]
      data.push({
        active: false,
        discarded: true,
        url: `https://www.${string}.com`
      })
    }
    yield client.waitForBrowserWindow()
    for (let datum of data) {
      yield client.newTab(datum, false, true) // isRestore
    }
  }
}
const addTabs100 = addTabsN(100)

module.exports = {
  addBookmarks4000,
  addTabs100
}
