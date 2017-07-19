function init(cache) {
    let default_value = [
        {}
    ];

    let starting_value = JSON.parse(cache['policy_key'] || '{}');

    // Initialize the editor
    let editor = new JSONEditor(document.getElementById('editor_holder'), {
        // Enable fetching schemas via ajax
        ajax: true,

        // The schema for the editor
        schema: {
            type: "array",
            title: "Auto Click Policy",
            format: "tabs",
            items: {
                title: "Policy",
                headerTemplate: "{{i}} - {{self.name}}",
                oneOf: [
                    {
                        $ref: "policy_advanced.json",
                        title: "高级规则"
                    },
                ]
            }
        },

        // Seed the form with a starting value
        startval: starting_value,

        // Disable additional properties
        no_additional_properties: true,

        // Require all properties by default
        required_by_default: true
    });

    function save() {
        console.log(JSON.stringify(editor.getValue()));
        let indicator = document.getElementById('valid_indicator');
        if (indicator.textContent == 'valid') {
            // localStorage['policy_key'] = JSON.stringify(editor.getValue());
            chrome.storage.sync.set({
                'policy_key': JSON.stringify(editor.getValue())
            }, function () {
                console.log('Settings saved');
                alert('保存成功！');
            });
        } else {
            alert('无效规则！');
        }
    }

    // Hook up the submit button to log to the console
    document.getElementById('submit').addEventListener('click', function () {
        // Get the value from the editor
        save()
    });

    // Hook up the Restore to Default button
    document.getElementById('restore').addEventListener('click', function () {
        editor.setValue(default_value);
    });

    // Hook up the enable/disable button
    document.getElementById('enable_disable').addEventListener('click', function () {
        // Enable form
        if (!editor.isEnabled()) {
            editor.enable();
        }
        // Disable form
        else {
            editor.disable();
        }
    });

    // Hook up the validation indicator to update its
    // status whenever the editor changes
    editor.on('change', function () {
        // Get an array of errors from the validator
        let errors = editor.validate();

        let indicator = document.getElementById('valid_indicator');

        // Not valid
        if (errors.length) {
            indicator.style.color = 'red';
            indicator.textContent = "not valid";
        }
        // Valid
        else {
            indicator.style.color = 'green';
            indicator.textContent = "valid";
        }
    });
}

function main() {
    chrome.storage.sync.get(['policy_key'], init);
}

main();
