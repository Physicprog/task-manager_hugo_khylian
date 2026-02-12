export function SendNotification(message, returnit = true, color_green = true, duration = 2500, CenterToTop = false) {
    var notification = document.getElementById("notification");
    var theNotification = document.getElementById("theNotification");

    if (!notification || !theNotification) {
        console.warn("Notification elements not found");
        return;
    }

    if (color_green) notification.style.borderRight = "var(--green) 0.5vh solid";
    else notification.style.borderRight = "var(--red) 0.5vh solid";


    if (CenterToTop) {
        notification.style.top = "10vh";
        notification.style.left = "50%";
        notification.style.transform = "translate(-50%, -50%) scale(1)";
    } else {
        notification.style.top = "5vh";
        notification.style.left = "100%";
        notification.style.transform = "translateX(0%) scale(1)";
    }
    notification.onclick = function () {
        if (CenterToTop) {
            notification.style.top = "10vh";
            notification.style.left = "50%";
            notification.style.transform = "translate(-50%, -50%) scale(1)";
        } else {
            notification.style.top = "5vh";
            notification.style.left = "100%";
            notification.style.transform = "translateX(0%) scale(1)";
        }
    };

    if (returnit) {
        setTimeout(() => {
            notification.style.opacity = "0%";
            notification.style.transform = "translateX(120%) scale(1)";
        }, duration);
    }
}
