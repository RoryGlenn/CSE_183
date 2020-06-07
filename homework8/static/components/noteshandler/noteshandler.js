
// The following code is written and used almost exactly the same from Matan Broner's TA session
// Please grade accordingly

(function () {
    var noteshandler = {
        props: ["get_all_notes", "create_new_note", "edit_note_key", "delete_note", "note_set_color"],
        data: {},
        methods: {},
    };

    const colors_classes = ["blue", "purple", "red", "green", "yellow", "white"];

    // handle the data in the note
    noteshandler.data = function () {
        var data = {
            urls: {
                get_all: this.get_all_notes,
                create_new: this.create_new_note,
                delete_note: this.delete_note,
                edit_key: this.edit_note_key,
                set_color: this.note_set_color,
            },
            notes: [],
            colors_classes,
            flag: false,
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
            console.log("load called\n");
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
            console.log("Created note\n", note);
        });

    };

    //UTILS

    noteshandler.methods.remove = function (idx) {
        let self = this;
        let id = self.notes[idx].id;
        axios.post(self.urls.delete_note, { id }).then((res) => {
            this.notes.splice(idx, 1);
            reindex(self.notes);
            console.log("remove() called\n");
        });
    };

    noteshandler.methods.edit_key = function (idx, key, val) {
        let self = this;
        axios.post(self.urls.edit_key, {
            id: self.notes[idx].id,
            key,
            val,
        })
            .then((res) => {
                self.notes[idx] = {
                    ...res.data.note,
                    _idx: idx,
                    edit: true,
                };
                this.refresh();
            });
    };



    // reindex
    function reindex(items) {
        for (let i = 0; i < items.length; i++) {
            items[i]._idx = i;
            items[i].edit = false;
        }

    }

    function sort_date(items) {
        return items.sort(function (a, b) {
            return new Date(b.last_modified) - new Date(a.last_modified);
        });
    }


    // Compent meeeethodsss

    // format_note_text
    noteshandler.methods.format_note_text = function (content, idx) {
        if (this.notes[idx].is_list) {
            return content
                .split("\n") // create array of string broken at each newline
                .map((item) => {
                    // add a bullet + space to each array item
                    let format = "• " + item;
                    return format;
                })
                .join("\n"); // join the strings array as one string with newline
        } else return content;
    };


    // handle_note_change
    noteshandler.methods.handle_note_change = function (event, idx) {
        // Alternatively, use a replace() while indexOf character is found
        let clean = event.target.value.replace(/• /g, "").replace(/•/g, ""); // replace bullets with and without space
        this.notes[idx].content = clean;
        this.edit_key(idx, "content", clean);
    };


    noteshandler.methods.complete_edit = function (idx) {
        this.toggle_edit(false, idx);
        let notes = this.sort_notes();
        reindex(notes);
        this.notes = notes;
    }

    // toggle_edit
    noteshandler.methods.toggle_edit = function (bool, idx) {
        if (bool === true && this.notes.findIndex((note) => note.edit) !== -1) {
            return;
        }
        this.$set(this.notes, idx, { ...this.notes[idx], edit: bool });
    };

    noteshandler.methods.color_class = function (index) {
        return "pastel-" + this.colors_classes[index];
    };

    noteshandler.methods.sort_notes = function () {
        let starred = this.notes.filter((note) => note.has_star === true);
        let not_starred = this.notes.filter((note) => note.has_star === false);

        return [...sort_date(starred), ...sort_date(note_starred)];
    };

    noteshandler.methods.set_color = function (note, id, color) {
        let self = this;
        axios.post(self.urls.set_color, {
            id: id,
            color: color,
            note: note,
        })
        .then(() => {
            note.color = color
        });
        this.refresh();
        console.log("set_color() called\n");
    }



    // force refresh the component state
    noteshandler.methods.refresh = function (idx) {
        this.$forceUpdate();
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