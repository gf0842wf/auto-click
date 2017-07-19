function clickLinkContain(text) {
    let BreakException = {};
    try {
        Array.prototype.forEach.call(document.getElementsByTagName('a'), function (elem) {
            if (elem.innerHTML.indexOf(text) > -1) {
                window.location = elem.href;
                throw BreakException;
            }
        })
    } catch (e) {
        if (e !== BreakException) throw e;
    }
}

function clickInputContain(text) {
    let BreakException = {};
    try {
        Array.prototype.forEach.call(document.getElementsByTagName('input'), function (elem) {
            if (elem.value.indexOf(text) > -1) {
                elem.click();
                throw BreakException;
            }
        })
    } catch (e) {
        if (e !== BreakException) throw e;
    }
}

function isPageContain(text) {
    let html = document.getElementsByTagName('html')[0].innerHTML;
    return html.indexOf(text) > -1
}

function getPage() {
    return document.getElementsByTagName('html')[0].innerHTML;
}

function findPageRe(re) {
    return document.getElementsByTagName('html')[0].innerHTML.match(re)[0]
}


function handle_basic(rows) {
}

function handle_advanced(url_prefix, rows) {
    let url = window.location.toString();
    for (let row of rows) {

        let contain = row.contain || '';
        let link = row.link || '';
        let delay = row.delay;
        let click_type = row.click_type;
        let define = row.define || '';
        let page = getPage();
        let define_condition = true;
        if (define != '') {
            try {
                define_condition = eval(define);
            } catch (e) {
                define_condition = true;
            }
        }
        if (url.indexOf(url_prefix) > -1 && contain != '' && link != '' && define_condition) {
            let is_page = true;
            for (let contain_str of contain.split(' ')) {
                if (!isPageContain(contain_str)) {
                    is_page = false;
                }
            }
            if (is_page) {
                console.log('click:', row.title);
                window.setTimeout(function () {
                    if (click_type == "按钮") {
                        clickInputContain(link);
                    } else {
                        clickLinkContain(link);
                    }

                }, delay);
            }

        }
    }
}

function handle(policys) {
    for (let policy of policys) {
        let status = policy.status;
        if (!status) {
            continue;
        }
        let policy_type = policy.type;
        let rows = policy.rows;

        if (policy_type == 'advanced') {
            let url_prefix = policy.domain;
            handle_advanced(url_prefix, rows);
        } else {
            handle_basic(rows);
        }
    }

}


(function () {
    chrome.storage.sync.get(['click_switch'], function (cache) {
        let click_switch = cache['click_switch'] || '1';
        if (click_switch == '1') {
            chrome.storage.sync.get(['policy_key',], function (cache) {
                console.log(cache['policy_key']);
                let policys = JSON.parse(cache['policy_key'] || '{}');
                handle(policys)
            })
        }
    });
})();

