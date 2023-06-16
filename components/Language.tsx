import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"
import { WritableComputedRef } from "nuxt/dist/app/compat/capi"

export default defineComponent({
    name: "Language",
    setup() {
        const { locale, locales } = useI18n()

        const switchLocalePath = useSwitchLocalePath()

        const { replace } = useRouter()

        const handler = {
            onChange: (code: string) => {
                if (code != locale.value) {
                    replace(switchLocalePath(code))
                }
            }
        }

        return {
            locale,
            locales: locales as WritableComputedRef<LocaleObject[]>,
            handler
        }
    },
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto overflow-hidden">
                <div class="card-body">
                    <h2 class="card-title">{this.$t("pages.index.setup.language.text.title")}</h2>
                    <span class="text-small">{this.$t("pages.index.setup.language.text.hint")}</span>
                    <form class="mt-5 flex-grow-1">
                        {
                            this.locales.map(i => (
                                <div class="form-control" key={i.code}>
                                    <label class="label cursor-pointer">
                                        <div>
                                            <img src={`/${i.code}.svg`} class="w-4 h-4 align-middle mr-2" alt={i.code} />
                                            <span class="label-text"> {i.name}</span>
                                        </div>
                                        <input checked={i.code === this.locale} onChange={this.handler.onChange.bind(null, i.code)} type="radio" name="locale" class="radio checked:bg-info" />
                                    </label>
                                </div>
                            ))
                        }
                    </form>
                </div>
            </div>
        )
    }
})