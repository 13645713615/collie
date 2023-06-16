export type TBreakpoint = "xs" | "sm" | "md" | "lg" | "xl"

export type TBreakpointsKeys = Exclude<TBreakpoint, "xs">
 
export type TBreakpointsState = Record<TBreakpointsKeys, number>

export type TBreakpointsMap = Array<{ value: number, key: TBreakpointsKeys }>

export type TDefineBreakpointsKeys = TBreakpointsKeys | "default"

export type TDefineBreakpoints<T> = Partial<Record<TDefineBreakpointsKeys, () => T>>
 
export enum BreakpointsEnum {
    xs = 'xs',
    sm = 'sm',
    md = 'md',
    lg = 'lg',
    xl = 'xl'
}

export class Breakpoints {

    private state: TBreakpointsState = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
    }

    getStateValue(value: TBreakpoint) {
        if (value === "xs") {
            return 0
        } else {
            return this.state[value] || 0
        }
    }

    getBreakpoint(size: number): TBreakpoint {
        if (size < this.state.sm) {
            return BreakpointsEnum.xs
        } else if (size < this.state.md) {
            return BreakpointsEnum.sm
        } else if (size < this.state.lg) {
            return BreakpointsEnum.md
        } else if (size < this.state.xl) {
            return BreakpointsEnum.lg
        } else {
            return BreakpointsEnum.xl
        }
    }

    // 对断点进行排序和格式化
    sortMap(breakpoints: TBreakpointsKeys[]): TBreakpointsMap {
        return breakpoints.map((key) => ({ value: this.state[key], key })).sort((a, b) => a.value - b.value);
    }

    // 查找合适的断点
    getSuitableBreakpoint(size: number, map: TBreakpointsMap) {
        if (map.length) {
            const suitable = map.find((item) => item.value <= size);
            if (suitable) return suitable
        }
        return null;
    }

    // 判断两个断点大小
    compareBreakpoint(a: TBreakpoint, b: TBreakpoint) {
        return this.getStateValue(a) < this.getStateValue(b)
    }


    private constructor() { };

    private static instance: Breakpoints

    static getInstance(data: Partial<TBreakpointsState> = {}) {
        if (!Breakpoints.instance) {
            Breakpoints.instance = new Breakpoints();
            Object.assign(Breakpoints.instance.state, data)
        }
        return Breakpoints.instance
    }
}

export const breakpoints = () => Breakpoints.getInstance();