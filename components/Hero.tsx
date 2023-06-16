import { Logo, Carousel, CarouselItem } from "#components"

export default defineComponent({
    name: 'Hero',
    render() {
        return (
            <div class="hero">
                <div class="hero-content h-full leading-7 box-border">
                    <div class="max-w-md flex flex-col h-full">
                        <div class="w-full">
                            <Logo></Logo>
                        </div>
                        <div class="flex-1 flex flex-col justify-center">
                            <h2 class="text-4xl font-bold animate-fade-in-down animate-duration-700">{this.$t("components.hero.text.title")}</h2>
                            <p class="py-6 animate-fade-in-down animate-duration-700">{this.$t("components.hero.text.subtitle")}</p>
                        </div>
                        <div class="w-full">
                            <Carousel carouselClassName="space-x-4">
                                <CarouselItem>
                                    <div class="card bg-base-100 ">
                                        <div class="card-body p-5 pb-3">
                                            <p>我非常喜欢这个网站！它的AI语言模型非常强大，能够快速准确地回答我的问题，帮助我解决许多难题。而且，它的交互性也非常好，让我感觉像是在和一个真正的人聊天一样。</p>
                                            <div class="card-actions">
                                                <div class="avatar">
                                                    <div class="w-10 mask mask-squircle">
                                                        <img src="https://daisyui.com/tailwind-css-component-profile-5@56w.png" alt="Avatar" />
                                                    </div>
                                                </div>
                                                <div class="flex flex-col h-full justify-around leading-4">
                                                    <div class="font-bold text-sm">Beatrice Thurman</div>
                                                    <div class="text-base-content/70 text-xs leading-4">220 Followers</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div class="card  bg-base-100">
                                        <div class="card-body p-5 pb-3">
                                            <p>这个网站设计的很简单明了，让我非常容易上手。我特别喜欢它的个性化推荐功能，它总是能够根据我的兴趣推荐一些我感兴趣的话题，让我感到很有趣。</p>
                                            <div class="card-actions">
                                                <div class="avatar">
                                                    <div class="w-10 mask mask-squircle">
                                                        <img src="https://daisyui.com/tailwind-css-component-profile-5@56w.png" alt="Avatar" />
                                                    </div>
                                                </div>
                                                <div class="flex flex-col h-full justify-around leading-4">
                                                    <div class="font-bold text-sm">Beatrice Thurman</div>
                                                    <div class="text-base-content/70 text-xs leading-4">220 Followers</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div class="card  bg-base-100">
                                        <div class="card-body p-5 pb-3">
                                            <p>这个网站的用户界面非常友好，让我感觉非常自在和舒适。而且，它的聊天效果也非常好，可以让我探索各种话题，与AI语言模型进行深入的交流和思考。</p>
                                            <div class="card-actions">
                                                <div class="avatar">
                                                    <div class="w-10 mask mask-squircle">
                                                        <img src="https://daisyui.com/tailwind-css-component-profile-5@56w.png" alt="Avatar" />
                                                    </div>
                                                </div>
                                                <div class="flex flex-col h-full justify-around leading-4">
                                                    <div class="font-bold text-sm">Beatrice Thurman</div>
                                                    <div class="text-base-content/70 text-xs leading-4">220 Followers</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})