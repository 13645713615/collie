
const storage: Storage = {
    length: 0,
    clear: function (): void {
        // cookie.
    },
    getItem: function (key: string): string | null {
        throw new Error("Function not implemented.")
    },
    key: function (index: number): string | null {
        throw new Error("Function not implemented.")
    },
    removeItem: function (key: string): void {
        throw new Error("Function not implemented.")
    },
    setItem: function (key: string, value: string): void {
        throw new Error("Function not implemented.")
    }
}

export default storage