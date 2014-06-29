var validator = (function(window, document) {

    /* Some helper functions */
    function addEvent(element, type, handler) {
        if (element && element.addEventListener) {
            // W3C model
            element.addEventListener(type, handler, false);
        } else if (element && element.attachEvent) {
            // for IE prior to 9 version
            element.attachEvent('on'+type, handler);
        } else {
            // DOM level 0 event handling
            element["on"+type] = handler;
        }
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    function isString(value) {
        return Object.prototype.toString.call(value) === "[object String]";
    }


    /**
     * Error object, encapsulates methods
     * responsible for error handling.
     */
    var error = {
        show: function(element, text, type) {
            var type = type || "span",
                showup = document.createElement(type),
                note = document.createTextNode(text);
            
            showup.className = "error-message";
            showup.style.color = "#f00";
            showup.style.margin = "0 5px";
        
            showup.appendChild(note);
            element.parentNode.insertBefore(showup, element.nextSibling);
        },

        remove: function(event, element) {
            var element = (event) ? event.target : element,
                removable = element.nextSibling;

            while (removable && removable.className === "error-message") {
                element.parentNode.removeChild(removable);
                removable = element.nextSibling;
            }
        },

        clearAll: function(form) {
            [].forEach.call(form.querySelectorAll(".error-message"), function(e) {
                e.parentNode.removeChild(e);
            });
        }
    };


    /** 
     * Validation object, encapsulates attributes 
     * corresponding to the option rule names.
     */
    var validation = {
        required: function(field) {
            if (field.value.length == 0) {
                var note = "This field is required.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        min: function(field, len) {
            if (field.value.length < len) {
                var note = len + " characters min required.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        max: function(field, len) {
            if (field.value.length > len) {
                var note = len + " characters max required.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        alpha: function(field) {
            if ( ! /^[a-zа-я]+$/i.test(field.value)) {
                var note = "This field should contain only alphabetical characters.";
                
                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        alpha_num: function(field) {
            if ( ! /^[a-za-я0-9]+$/i.test(field.value)) {
                var note = "This field should contain only alphabetical and numbers.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        numeric: function(field) {
            if ( ! /^[-+]?[0-9]+$/i.test(field.value)) {
                var note = "This field should contain only numbers.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        email: function(field) {
            var email_regex = /^[a-zа-я0-9._%+-]+@[a-zа-я0-9.-]+\.[a-zа-я]{2,6}$/i;
            if ( ! email_regex.test(field.value)) {
                var note = "Incorrect email address format.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        url: function(field) {
            var url_regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/ig;

            if ( ! url_regex.test(field.value)) {
                var note = "Incorrect url format.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        date: function(field) {
            // dd/mm/yyyy or dd-mm-yyyy format
            var date_format1 = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; 
            // mm/dd/yyyy or mm-dd-yyyy format
            var date_format2 = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
            // test two of most common date formats
            if ( ! date_format1.test(field.value)
                || ! date_format2.test(field.value)) {
                var note = "Incorrect date format.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        phone: function(field) {
            var phone_regex = /^\+?[0-9- ]+$/i;
            if ( ! phone_regex.test(field.value)) {
                var note = "Incorrect phone number format.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        },

        ip: function(field) {
            var ip_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

            if ( ! ip_regex.test(field.value)) {
                var note = "Incorrect IP address format.";

                field.focus();
                error.show(field, note);

                return false;
            }            

            return true;
        },

        credit_card: function(field) {
            // American Express card number format
            var american_express = /^(?:3[47][0-9]{13})$/; 
            // Visa card number format
            var visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
            // Master card number format
            var master = /^(?:5[1-5][0-9]{14})$/; 

            if ( ! american_express.test(field.value)
                || ! master.test(field.value) 
                || ! visa.test(field.value)) {

                var note = "Incorrect credit card format.";

                field.focus();
                error.show(field, note);

                return false;
            }

            return true;
        }
    };


    // Initialize processes
    function init(form, options) {
        var rules = {};

        rules = parseOptionsRules(options);
        events(form, rules, validate);
    }

    // Handle form related events
    function events(form, rules, handler) {
        addEvent(form, 'keyup', function(event) {
            error.remove(event);
        });

        addEvent(form, "submit", function(event) {
            validate(event, form, rules);
        });
    }

    // Handle validation of the form
    function validate(event, form, rules) {
        var pass = [],
            element_id = null,
            len = form.length - 1,
            fields = Array.prototype.slice.call(form, 0, len);

        error.clearAll(form);

        for (var i = 0; i < len; i++) {
            element_id = fields[i].id;

            if (rules[element_id]) {
                var methods = rules[element_id];

                methods.forEach(function(method) {
                    if (isArray(method)) {
                        var name = method[0].trim(),
                            arg = method[1].trim();

                        pass[i] = validation[name](fields[i], arg);

                    } else {
                        method = method.trim();
                        pass[i] = validation[method](fields[i]);
                    }
                });
            }
        }

        for (var i = 0, len = pass.length; i < len; i++) {
            if ( ! pass[i]) {
                event.preventDefault();
                return false;
            }
        }
    }

    // Parse passed object of validation rules
    function parseOptionsRules(options) {
        var rules = {},
            option = null;

        for (var field in options) {
            option = options[field].split("|");

            for (var i = 0, len = option.length; i < len; i++) {
                if (/(min)+/ig.test(option[i]) || /(max)+/ig.test(option[i])) {
                    option[i] = option[i].split(":");
                }
            }

            rules[field] = option;
        }

        return rules;
    }


    // Public API to be used
    return {
        init: init
    };

})(window, document);