import { PropType } from "vue"
import type { RouteLocationRaw } from 'vue-router';
import { menuInjectToken } from "./Menu";

export const menuItemProps = {
    name: {
        type: [String, Number],
    },
    disabled: {
        type: Boolean,
    },
    bordered: {
        type: Boolean,
    },
    active: {
        type: Boolean
    },
    title: {
        type: String
    },
    to: {
        type: [String, Object] as PropType<string | RouteLocationRaw>
    },
    replace: {
        type: Boolean,
        default: false
    },
    itemClassName: {
        type: String
    }
}

export const menuItemEmits = {
    click: (name: string | number | undefined, e: MouseEvent,) => true
}

export default defineComponent({
    name: 'MenuItem',
    props: menuItemProps,
    emits: menuItemEmits,
    inheritAttrs: false,
    setup(props, { slots, attrs, emit }) {

        const menu = inject(menuInjectToken)

        const renderSlots = useRenderSlots();

        const classes = computed(() => splicing([
            {
                "disabled": props.disabled,
                "menu-title": !!props.title
            },
            props.itemClassName
        ]))

        const active = computed(() => props.active || (menu?.activeName.value != undefined && menu.activeName.value == props.name))

        const aClasses = computed(() => splicing([
            {
                "active": active.value
            }
        ]))


        const handler = {
            onClick: (e: MouseEvent) => {
                if (props.disabled) {
                    return e.preventDefault();
                }
                emit('click', props.name, e);

                if (props.name) {
                    menu?.onChange(props.name, props.to, props.replace)
                }
            }
        }

        return () => (
            <li class={classes.value} onClick={handler.onClick}>
                {
                    props.title ?
                        <span>{props.title}</span> :
                        <a {...attrs} class={aClasses.value}>{renderSlots("default", { active: active.value })}</a>
                }
            </li>
        )
    }
})