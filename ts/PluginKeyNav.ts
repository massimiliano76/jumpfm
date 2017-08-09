import { Plugin } from './Plugin'
import { JumpFm } from './JumpFm'
import { Panel } from './Panel'
import { Item } from './Item'

import * as homedir from 'homedir'
import * as fs from 'fs'
import * as path from 'path'

class PluginKeyNav extends Plugin {
    onLoad() {
        const jumpFm = this.jumpFm
        const bind = jumpFm.bindKeys
        const bindFilter = jumpFm.bindKeysFilterMode

        const activePan = () => jumpFm.panels.getActivePanel()
        const step = (d, select = false) => {
            const pan = activePan()
            pan.step(d, select)
            setImmediate(() => pan.view.scroll(pan.getCur()))
        }

        const rowCountInPage = () => activePan().view.getRowCountInPage()

        bind('switchPanel', ['tab'], jumpFm.panels.switch)
        bindFilter('switchPanel', ['tab'], () => {
            const panels = jumpFm.panels
            panels.getActivePanel().view.hideFilter()
            panels.switch()
        })

        bind('up', ['up'], () => step(-1))
        bind('upSelect', ['shift+up'], () => step(-1, true))
        bind('pageUp', ['pageup'], () => step(-rowCountInPage()))
        bind('pageUpSelect', ['shift+pageup'], () => step(-rowCountInPage(), true))

        bind('down', ['down'], () => step(1))
        bind('downSelect', ['shift+down'], () => step(1, true))
        bind('pageDown', ['pagedown'], () => step(rowCountInPage()))
        bind('pageDownSelect', ['shift+pagedown'], () => step(rowCountInPage(), true))

        bind('goStart', ['home'], () => step(-9999))
        bind('goStartSelect', ['shift+home'], () => step(-9999, true))
        bind('goEnd', ['end'], () => step(9999))
        bind('goEndSelect', ['shift+end'], () => step(9999, true))

        bind('selectAll', ['ctrl+a'], () => activePan().selectAll())
        bind('deselectAll', ['esc'], () => activePan().deselectAll())

        const enter = () => activePan().cd(activePan().getCurItem().url)
        bind('enter', ['enter'], enter)
        bindFilter('enter', ['enter'], () => {
            enter()
            activePan().view.filter.select()
        })

        bind('back', ['backspace'], () => {
            const pan = activePan()
            pan.cd(path.dirname(pan.getUrl()))
        })

        bind('homeDir', ['ctrl+home'], () => {
            activePan().cd(homedir())
        })

        bind('openFilter', ['f'], () => activePan().view.showFilter())
        bind('clearFilter', ['esc'], () => activePan().model.filter = '')
        bindFilter('hideFilter', ['esc'], () => activePan().view.hideFilter())


        // TODO bind open to right / open to left
    }
}

module.exports = PluginKeyNav