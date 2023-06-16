export default defineComponent({
    name: 'About',
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto">
                <div class="card-body">
                    <h2 class="card-title">{this.$t("pages.index.setup.about.text.title")}</h2>
                    <span class="text-small">{this.$t("pages.index.setup.about.text.hint")}</span>
                    <p class="mt-5">
                        <div class="form-control">
                            <div class="label">
                                <span class="label-text capitalize mr-2">{this.$t("pages.index.setup.about.label.author")}</span>
                                <span class="whitespace-nowrap">Carroll</span>
                            </div>
                        </div>
                        <div class="form-control">
                            <div class="label">
                                <span class="label-text capitalize mr-2">{this.$t("pages.index.setup.about.label.contact")}</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <span class="text-small flex-auto">{this.$t("pages.index.setup.about.text.contact")}</span>
                                <a href="mailto:1186684149@qq.com" class="whitespace-nowrap btn-link">1186684149@qq.com</a>
                            </div>
                        </div>
                        <div class="divider before:h-px after:h-px"></div>
                        <div class="form-control">
                            <div class="label">
                                <span class="label-text capitalize mr-2">{this.$t("pages.index.setup.about.label.source")}</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <span class="text-small flex-auto">{this.$t("pages.index.setup.about.text.source")}</span>
                                <a href="https://github.com/13645713615/collie" target="_blank" class="max-w-xs truncate btn-link">https://github.com/13645713615/collie</a>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
        )
    }
})