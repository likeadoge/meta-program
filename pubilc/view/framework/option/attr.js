import { get } from './base.js'

export class AttrOption {
    #map = new Map()

    set(name, value) {
        this.#map.set(name, value)
        return this
    }

    apply(dom){
        const list = Array.from(this.#map.entries())
        list.forEach(([name,val])=>{
            dom[name] = val
        })
    }
}

export const attr = (c = new AttrOption()) => new Proxy(c, {
    get: (option, name) => (value) =>
        name === get ?
            option :
            attr(option.set(name, value))
})