import {
   ScanAttr, ScanEvent,  ScanDirective
} from './statement.js'


export default class Token {
    static scan(template) {
        return [
            TokenSubHeadNode,
            TokenHeadNode,
            TokenTailNode,
            TokenTextNode,
            TokenHtmlNode,
        ].reduce((res, TokenClass) => res.flatMap(node =>
            typeof node !== 'string'
                ? [node]
                : node.split(TokenClass.match)
                    .filter(v => !!v)
                    .map(content => TokenClass.match.test(content)
                        ? new TokenClass(content)
                        : content)
        ), [template])
    }

    content = ''
    data = {}
    constructor(content = '', data = {}) {
        this.content = content
        this.data = data
    }
}

class HeadCommon extends Token {

    constructor(content) {
        const attrs = []
        const events = []
        const directives = []
        content.split(new RegExp(`((?:${ScanAttr.re})|(?:${ScanEvent.re})|(?:${ScanDirective.re}))`))
            .map(v => v.trim())
            .forEach(str => {
                if (new RegExp(`^${ScanAttr.re}$`).test(str)) attrs.push(new ScanAttr(str))
                else if (new RegExp(`^${ScanEvent.re}$`).test(str)) events.push(new ScanEvent(str))
                else if (new RegExp(`^${ScanDirective.re}$`).test(str)) directives.push(new ScanDirective(str))
            });
        super(content, {
            attrs, events, directives
        })
    }
}

export class TokenHeadNode extends HeadCommon {
    static match = new RegExp(`(<\\!---\\s*(?:${[ScanAttr.re, ScanEvent.re, ScanDirective.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}
export class TokenSubHeadNode extends HeadCommon {
    static match = new RegExp(`(<\\!--#\\s*(?:${[ScanAttr.re, ScanEvent.re, ScanDirective.re].map(v => `(?:${v}\\s*)`).join("|")})*--->)`)
}

export class TokenTailNode extends Token {
    static match = /(<\!---\/--->)/
}

export class TokenHtmlNode extends Token {
    static match = /([\d|\D]*)/
}

export class TokenTextNode extends Token {
    static match = /(\{\{[\w|\W]+?\}\})/
    constructor(content) {
        const code = content.match(/\{\{([\w|\W]+?)\}\}/)[1]
        super(content, { code })
    }
}




