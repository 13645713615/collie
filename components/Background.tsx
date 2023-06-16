import 'assets/css/circles.css'

export default defineComponent({
    name: 'Background',
    render() {
        return (
            <div class="fixed h-screen inset-0 z-0 flex-auto">
                <div style={`background-image: url(/bg.jpg)`} class="h-full hidden md:flex items-center justify-center overflow-hidden bg-purple-900  bg-no-repeat bg-cover">
                    <div class="absolute bg-gradient-to-b from-indigo-500 to-blue-500  media-os_dark:to-blue-900  media-os_dark:from-indigo-900 opacity-75" ></div>
                    <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        )
    }
})
