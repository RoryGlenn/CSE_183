(function () {
    var noteshandler = {
        props: ["get_all_notes", "create_new_note"],
        data: {},
        methods: {},
    };

    // handle the data in the note
    noteshandler.data = function () {
        var data = {
            urls: {
                get_all: this.get_all_notes,
                create_new: this.create_new_note,
            },
            notes: [],
        };
        noteshandler.methods.load.call(data);
        return data;
    };


    // API CALLS

    // load
    noteshandler.methods.load = function () {
        let self = this;
        axios.get(self.urls.get_all).then((res) => {
            let notes = res.data.notes;
            notes.forEach((note) => (note.edit = false));
            self.notes = notes;
            reindex(self.notes);
        });
    };

    // create note
    noteshandler.methods.create = function () {
        let self = this;
        axios.get(self.urls.create_new).then((res) => {
            let note = res.data.note;
            note.edit = false;
            self.notes.unshift(note);
            reindex(self.notes);
        });
    };

    //UTILS

    // reindex
    function reindex(items) {
        for (let i = 0; i < items.length; i++) {
            items[i]._idx = i;
        }
    }


    // COMPONENT METHODS

    // format_note_text
    noteshandler.methods.format_note_text = function (content, idx) {
        if (this.notes[idx].is_list) {
            return content
                .split("\n") // create array of string broken at each newline
                .map((item, index, arr) => {
                    // add a bullet + space to each array item
                    let format = ". " + item;
                    return format;
                })
                .join("\n"); // join the strings array as one string with newline
        } else return content;
    };

    // handle_note_change
    noteshandler.methods.handle_note_change = function (event, inx) {
        // Alternatively, use a replace() while indexOf character is found
        let clean = event.target.value.replace(/. /g, "").replace(/./g, ""); // replace bullets with and without space
        this.notes[idx].content = clean;
    };

    // toggle_edit
    noteshandler.methods.toggle_edit = function (bool, idx) {
        if (bool === true) {
            this.notes.forEach((note) => (note.edit = false));
        }
        this.notes[idx].edit = bool;
    };

    // register the vue component
    utils.register_vue_component(
        "notes",
        "components/noteshandler/noteshandler.html",
        function (template) {
            noteshandler.template = template.data;
            return noteshandler;
        }
    );

})();