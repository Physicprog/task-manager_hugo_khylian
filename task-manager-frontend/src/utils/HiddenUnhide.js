let toggleHideAndunHideHiddenTxT = false;
export function ShowPassword() {
    var GetPW1 = document.getElementById("GetPW1");
    var GetPW2 = document.getElementById("GetPW2");

    if (toggleHideAndunHideHiddenTxT) {
        if (GetPW1) GetPW1.setAttribute('type', 'password');

        if (GetPW2) GetPW2.setAttribute('type', 'password');
    } else {
        if (GetPW1) GetPW1.setAttribute('type', 'text');
        if (GetPW2) GetPW2.setAttribute('type', 'text');
    }
    toggleHideAndunHideHiddenTxT = !toggleHideAndunHideHiddenTxT;
}