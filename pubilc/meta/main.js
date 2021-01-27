import { Ref, Call, Def, Num ,Bool} from './_index.js'


const lines = (...argus) => new Call(new Ref('lines'), argus)
const def = (name, value) => new Def(name, value)
const val = (name) => new Ref(name)
const num = (n) => new Num(n)
const add = (a, b) => new Call(new Ref('+'), [a, b])
const sub = (a, b) => new Call(new Ref('-'), [a, b])
const mul = (a, b) => new Call(new Ref('*'), [a, b])
const div = (a, b) => new Call(new Ref('/'), [a, b])
const log = (a) => new Call(new Ref('log'), [a])


const _f = ()=> new Bool(false)
const _t = ()=> new Bool(true)
const and = (a,b) => new Call(new Ref('&&'), [a, b])
const or = (a,b) => new Call(new Ref('||'), [a, b])
const not = (a) => new Call(new Ref('!not'), [a])

export default () => {
    const main = lines(
        def('value', add(num(1), num(2)), num(3)),
        log(div(sub(mul(add(num(1), num(2)), num(3)), num(4)), num(5))),
        log(and(not(_t()),or(_f(),_t()))),
    )

    console.log(main)

    document.body.innerHTML = main.render()
}