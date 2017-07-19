function initSwitch() {
    chrome.storage.sync.get(['click_switch'], function (items) {
        let click_switch = items.click_switch || '1';
        if (click_switch == '1') {
            document.getElementById("click_switch").checked = true;
        } else {
            document.getElementById("click_switch").checked = false;
        }
    });
}

document.getElementById('click_switch').onchange = function () {
    let switch_checked = document.getElementById("click_switch").checked;

    let click_switch = '1';
    if (switch_checked) {
        click_switch = '1'
    } else {
        click_switch = '2'
    }
    chrome.storage.sync.set({
        'click_switch': click_switch,
    }, function () {
        console.log('Settings saved');
    });
};

function main() {
    initSwitch();
}


main();