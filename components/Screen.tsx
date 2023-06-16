export default defineComponent({
    name: 'Screen',
    render() {
        return (
            <div class="w-screen xl:w-[60vw] lg:w-[83vw] h-screen lg:h-[calc(90vh-3.25rem)]  lg:py-6 box-border lg:shadow-md lg:rounded-2xl relative bg-base-200">
                {this.$slots.default?.()}
            </div>
        )
    }
})
