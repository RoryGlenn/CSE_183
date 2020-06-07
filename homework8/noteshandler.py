from py4web import action, URL, request
from yatl.helpers import XML
from py4web.utils.url_signer import URLSigner
from py4web.core import Fixture

# NotesHandler class (component)
class NotesHandler(Fixture):
    # vue tag we are going to be using with 2 routes
    NOTESHANDLER = """<notes
    get_all_notes={get_all_notes}
    create_new_note={create_new_note}
    ></notes>"""

    # constructor
    def __init__(self, url, session, signer=None, db=None, auth=None):
        self.db = db
        self.url_base = url
        self.signer = signer or URLSigner(session)

        self.define_urls()

        self.__prerequisites__ = [session]
        args = list(filter(None, [session, db, auth, self.signer.verify()]))

        self.define_route(args, self.create_new_note_url,
                          self.create_new_note, ["GET"])
        self.define_route(args, self.get_all_notes_url,
                          self.get_all_notes, ["GET"])

    def __call__(self):
        return XML(NotesHandler.NOTESHANDLER.format(
            get_all_notes=URL(self.get_all_notes_url, signer=self.signer),
            create_new_note=URL(self.create_new_note_url, signer=self.signer)
        ))

    # this was in the last homework
    def define_route(self, args, url, class_method, method):
        func = action.uses(*args)(class_method)
        action(url, method=method)(func)

    def define_urls(self):
        self.get_all_notes_url = self.url_base
        self.create_new_note_url = self.url_base + "/new"

    # takes the db
    # self is set in the constructor
    def get_all_notes(self):
        notes = self.db(self.db.notes).select().as_list()
        return dict(notes=notes)

    # creates a new note with no field set and returns the new note
    # as a dictionary at a specific index (id)
    def create_new_note(self):
        id = self.db.notes.insert()
        return dict(note=self.db.notes[id].as_dict())

    def set_star(self):
        # PUT STUFF HERE
        return

    def delete_note(self):
        # PUT STUFF HERE
        return

    def set_color(self):
        # PUT STUFF HERE
        return
