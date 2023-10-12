import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';

// formatter
export const formatter = {
    str: (s, ...args) => {
        let i = args.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
        }
        return s;
    },
};

export const isObjectEmpty = (value) => Object.values(value).length === 0 && value.constructor === Object;
export const obj = {
    empty: (o) => Object.values(o).length === 0 && o.constructor === Object,
    sanitize: (o) => {
        for (const [k, v] of Object.entries(o)) {
            if (str.empty(v)) o[k] = null;
        }
    },
};

export const str = {
    format: (s, ...args) => {
        let i = args.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
        }
        return s;
    },
    empty: (s) => !s || s.length === 0,
    sanitize: (s) => sanitizeHtml(s),
};

export class TagBuilder {
    name;
    constraints = {};
    style = 'light';

    setName(name) {
        this.name = name;
        return this;
    }
    addConstraints(key, value) {
        this.constraints[key] = value;
        return this;
    }
    setStyle(style) {
        this.style = style;
        return this;
    }
    build() {
        return {
            name: this.name,
            constraints: this.constraints,
            style: this.style,
            slug: slugify(this.name, { locale: 'vi' }),
        };
    }
    static build(name, constraints = {}, style = 'light') {
        return {
            name,
            constraints,
            style,
            slug: slugify(name, { locale: 'vi' }),
        };
    }
}
