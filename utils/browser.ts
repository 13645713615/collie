


/**
 * 请求通知权限
 */
export function requestNotificationPermission(): Promise<boolean> {
    if (window && 'Notification' in window) {

        switch (Notification.permission) {
            case "granted":
                return Promise.resolve(true);
            case "denied":
                return Promise.reject(new Error("您已拒绝通知权限，无法发送通知，请打开浏览器设置并允许通知权限"));
            default:
        }

        return Notification.requestPermission().then((result) => {
            if (result === "granted") {
                return true;
            }
            return false;
        });
    }
    return Promise.reject(new Error("当前浏览器不支持消息通知"));
}

// 发送通知
export async function sendNotification(title: string, options?: NotificationOptions, click?: (e: Event) => void) {

    const authorized = await requestNotificationPermission()

    if (authorized) {

        const notification = new Notification(title, options);

        notification.onclick = function (e: Event) {
            click?.(e)
        }
    }
}


export function redirectToPage(url: string) {
    const uniqueKey = 'targetUrl';

    // 将目标 URL 保存到 localStorage
    localStorage.setItem(uniqueKey, url);

    // 监听 storage 事件
    window.addEventListener('storage', (event) => {
        if (event.key === uniqueKey && event.newValue === url) {
            // 当其他标签页更新目标 URL 时，将焦点设置到当前标签页
            window.focus();
        }
    });

    const newWindow = window.open(`javascript:localStorage.setItem('${uniqueKey}', '${url}');window.close();`);

    // 如果浏览器阻止了新标签页的打开，则尝试在当前标签页打开 URL
    if (!newWindow) {
        window.location.href = url;
    }
}