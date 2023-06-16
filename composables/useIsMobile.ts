import { useBreakpointState } from "@lemonpeel2/hooks";
import { Breakpoints } from "@lemonpeel2/utils";
import type { TBreakpointsKeys } from "~/utils/breakpoints";


// // 判断是否小于某个断点
export const useIsMobileSize = (breakpoint: TBreakpointsKeys = BreakpointsEnum.lg) => {

    const size = useBreakpointState();

    const bp = new Breakpoints();

    return computed(() => bp.compareBreakpoint(bp.getBreakpoint(size.value), breakpoint));
}