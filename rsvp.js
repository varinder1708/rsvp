let rsvp = (function() {
    var cache = {
        registrationForm: "#registrationForm",
        searchContainer: "#searchContainer",
        graphContainer: "#graphContainer",
        searchInput: "#searchContainer  input",
        searchResults: '#myUL',
        navigation: "#list-nav",
        myModal: "#myModal",
        myModalData: ".modal-data"
    }
    
    var filterResults = function(char, cb) {
        var filteredArray = sample_data.filter((item) => {
            if (item["name"].toLowerCase().indexOf(char.toLowerCase()) >= 0 || item["locality"].toLowerCase().indexOf(char.toLowerCase()) >= 0) {
                return true;
            }
        })
        if (cb) cb(char == "" ? [] : filteredArray)
    }
    var getFormData = function(dom_query) {
        let out = {},
            form_data = $(dom_query).serializeArray();
        for (var i = 0; i < form_data.length; i++) {
            var record = form_data[i];
            out[record.name] = record.value;
        }
        return out;
    }

    var searchResults = function(filteredArray) {
        let listItem = document.querySelector(cache.searchResults)
        listItem.innerHTML = "";
        filteredArray.forEach(function(item) {
            listValue = document.createElement("li");
            listValue.attribute="ssss"
            listValue.textContent = `${item["name"]}, ${item["locality"]}`;
            listItem.appendChild(listValue);
        })
    }

    var displayItems = function(filteredArray) {
        let info = "",
            container = $(cache.myModalData);
        $(container).html("")
        for (x in filteredArray[0]) {
            info += `${x} = ${filteredArray[0][x]}\t`
        }
        $(container).append(info)
    }

    var openDetails = function(event) {
        filterResults(event.target.innerHTML.split(",")[0], displayItems)
        let container = $(cache.myModal)
        $(container).fadeIn();

    }
    var hideAll = function() {
        $(".container > div,.container > form").hide()
    }
    var openpage = function(page) {
        hideAll();
        switch (page) {
            case 'nav_form':
                $(cache.registrationForm).show();
                break;
            case 'nav_search':
                $(cache.searchContainer).show();
                break;
            case 'nav_graphs':
                $(cache.graphContainer).show();
                generateReports()
                break;
        }
    }
    var bindEvents = function() {
        var registrationForm = document.querySelector(cache.registrationForm);
        var searchContainer = document.querySelector(cache.searchInput);
        var navigation = document.querySelector(cache.navigation);
        var searchItem = document.querySelector(cache.searchResults);
        let container = $(cache.myModal),
            close = $(container).find(".close");

        window.addEventListener("beforeunload", function(e) {
            var confirmationMessage = "\o/";
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        });

        $(close).on("click", function() {
            $(container).fadeOut();
        })

        searchItem.addEventListener("click", openDetails);

        searchContainer.addEventListener("input", (event) => {
            filterResults.call(null, event.target.value, searchResults)
        });

        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            sample_data.push(getFormData(cache.registrationForm));
            alert("Data Added")
        }, false);

        navigation.addEventListener('click', function(event) {
            event.preventDefault();
            var page = event.target.id;
            openpage(page)
        }, false);
    }
    var generateReports = function() {
        let no_13_18 = 0,
            no_18_25 = 0,
            no_25 = 0,
            professional = 0,
            students = 0;
        sample_data.forEach(each => {
            if (each.age >= 13 && each.age <= 18) {
                no_13_18 += 1;
            }
            if (each.age >= 18 && each.age <= 25) {
                no_18_25 += 1;
            }
            if (each.age >= 25) {
                no_25 += 1;
            }
            if (each.profession == 'student') {
                students += 1;
            }
            if (each.profession == 'employeed') {
                professional += 1;
            }
        });

        var temp = $('#blog').html();
        temp = temp.replace(/{{no_13_18}}/ig, no_13_18);
        temp = temp.replace(/{{no_18_25}}/ig, no_18_25);
        temp = temp.replace(/{{no_25}}/ig, no_25);
        temp = temp.replace(/{{students}}/ig, students);
        temp = temp.replace(/{{professional}}/ig, professional);
        $(cache.graphContainer).html(temp);
    }
    var init = function() {
        bindEvents();
    }
    return {
        init: init
    }
})();

rsvp.init()