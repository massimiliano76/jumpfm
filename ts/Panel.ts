import { Item } from './Item'
import { PanelView } from './PanelView'

type CdHandler = (panel: Panel, url: string, info: any) => void

export class Panel {
    view: PanelView

    getCur = (): number => {
        return Math.min(
            this.getItems().length - 1,
            Math.max(0, this.model.cur)
        )
    }

    getCurItem = (): Item => {
        return this.getItems()[this.getCur()]
    }

    getItems = (): Item[] => {
        return this.model.items
            .filter(item =>
                item.name
                    .toLowerCase()
                    .indexOf(this.model.filter.toLowerCase()) > -1)
    }

    clearFilter = () => {
        this.model.filter = ''
    }

    private selectRange = (a, b) => {
        try {
            if (a > b) return this.selectRange(b, a)
            const files = this.getItems()
            for (var i = a; i <= b; i++) files[i].sel = true
        } catch (e) {
            console.log(e, a, b)
        }
    }

    step = (d: number, select = false) => {
        const i1 = this.getCur()
        this.model.cur = this.getCur() + Math.floor(d)

        if (select) this.selectRange(i1, this.getCur())
        return this
    }

    toggleSel = (): void => {
        const f = this.getCurItem()
        f.sel = !f.sel
    }

    selectAll = (): void => {
        this.getItems().forEach(item => item.sel = true)
    }

    deselectAll = (): void => {
        this.getItems().forEach(item => item.sel = false)
    }

    getUrl = (): string => {
        return this.model.url
    }

    getSelectedItems = (): Item[] => {
        return this.getItems().filter((item, i) => {
            return item.sel || this.getCur() == i
        })
    }

    getSelectedItemsUrls = () => {
        return this.getSelectedItems().map(item => item.url)
    }

    setItems(files: Item[]) {
        this.model.items = files
        return this
    }


    readonly handlers: CdHandler[] = []

    onCd(handler: CdHandler) {
        this.handlers.push(handler)
        return this
    }

    cd(url: string, info: any = {}): void {
        this.handlers.forEach(handler => handler(this, url, info))
        this.model.url = url
    }

    getTitle = () => {
        const filter = this.model.filter
        const extra = this.model.extra
        return this.model.url
            + ' '
            + (filter ? '[' + filter + ']' : '')
            + Object
                .keys(extra)
                .map(key => extra[key])
                .filter(key => key)
                .join(' : ')
    }

    model = {
        url: '',
        filter: '',
        cur: 0,
        items: [],
        extra: {},

        getTitle: this.getTitle,
        getCur: this.getCur,
        getItems: this.getItems,
    }
}