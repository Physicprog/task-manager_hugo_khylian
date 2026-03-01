let notificationTimeout = null;

export function SendNotification(message, returnit = true, color_green = true, duration = 2500, CenterToTop = false) {
    var notification = document.getElementById("notification");
    var theNotification = document.getElementById("theNotification");

    theNotification.textContent = message;

    if (color_green) notification.style.borderRight = "var(--green) 0.5vh solid";
    else notification.style.borderRight = "var(--red) 0.5vh solid";

    if (CenterToTop) {
        notification.style.bottom = "auto";
        notification.style.right = "auto";
        notification.style.top = "10vh";
        notification.style.left = "50%";
        notification.style.transform = "translate(-50%, 0) scale(1)";
    } else {
        notification.style.top = "auto";
        notification.style.left = "auto";
        notification.style.bottom = "2vh";
        notification.style.right = "2vh";
        notification.style.transform = "translateX(0%) scale(1)";
    }

    notification.style.opacity = "100%";

    notification.onclick = function () {
        notification.style.opacity = "0%";
        notification.style.transform = "translateX(120%) scale(1)";
    };

    if (returnit) {
        notificationTimeout = setTimeout(() => {
            notification.style.opacity = "0%";
            if (CenterToTop) {
                notification.style.transform = "translate(-50%, -20px) scale(0.95)";
            } else {
                notification.style.transform = "translateX(120%) scale(1)";
            }
        }, duration);
    }
}
