

"""
This file defines the database models
"""
from datetime import datetime

from . common import db, Field, auth
from pydal.validators import *

### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later
#
# db.commit()
#

def get_user():
    return auth.current_user.get('id') if auth.current_user else None

# def get_user_email():
#     return auth.current_user.get('email') if auth.current_user else None

db.define_table('notes',
            Field('title', default="New Note"),
            Field('content', default=""),                                                   # content default to an empty string
            Field('color', 'integer', default=0),                                           # color range: [0 - 4]
            Field('is_list', 'boolean', default=False),                                     # defines whether the note will be a list or not
            Field('has_star', 'boolean', default=False),                                    # star icon
            Field('author', 'reference auth_user', default=get_user),                       # author will be the logged in user
            Field('last_modified', 'datetime', default=datetime.now, update=datetime.now)
            )

db.commit()