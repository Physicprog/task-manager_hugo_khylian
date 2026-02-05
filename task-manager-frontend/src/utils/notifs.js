export function SendNotification(message, returnit = true, color_green = true) {
    var notification = document.getElementById("notification");
    var theNotification = document.getElementById("theNotification");

    if (!notification || !theNotification) {
        console.warn("Notification elements not found");
        return;
    }

    if (color_green) notification.style.borderRight = "var(--green) 0.5vh solid";
    else notification.style.borderRight = "var(--red) 0.5vh solid";

    notification.style.opacity = "100%";
    notification.style.transform = "translateX(0%) scale(1)";
    theNotification.textContent = message;

    notification.onclick = function () {
        notification.style.opacity = "0%";
        notification.style.transform = "translateX(120%) scale(1)";
    };

    if (returnit) {
        setTimeout(() => {
            notification.style.opacity = "0%";
            notification.style.transform = "translateX(120%) scale(1)";
        }, 2500);
    }
}
