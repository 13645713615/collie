
export const useAsyncPrompt = () => {

    const { success, error } = useMessage();

    return <T extends Promise<any>>(promise: T, errMsg?: string, okMsg?: string): T => promise.then((res) => {
        if (okMsg) success(okMsg);
        return res;
    }).catch((err: any) => {
        if (errMsg) {
            error(errMsg)
        } if (err?.message) {
            error(err.message, { time: 3000 })
        } else if (typeof err === "string") {
            error(err)
        }
        console.error(err)
    }) as any
}