# NoteHub API

**Version 1.1, status: released.**

## Prerequisites

The NoteHub API can only be used in combination with a __Publisher ID__ (PID) and __Publisher Secret Key__ (PSK), which can be requested [here](#registration). The PSK can be revoked at any moment in case of an API abuse.

A PID is a string chosen by the publisher and cannot be longer than 16 characters (e.g.: __notepadPlugin__). A PSK will be generated by the NoteHub API and can be a string of any length and content.

All API requests must be issued with one special parameter `version` denoting the expected version of the API as  a string, e.g. `1.0` (see examples below). You should always put the version of this document as a `version` parameter.

## <a name="registration"></a>NoteHub API Access Request
To register as a publisher and gain access to NoteHub API, please [send](mailto:notehub@icloud.com?subject=NoteHub API Access Request&body=Please add [a] desired PID as a 16 char string [b] your contact information, [c] short usage explanation and [d] the URL of the resource or it's website.) an email with the following information about you: the desired PID, the contact information, short description of what you want to do and an URL of the resource where the API will be used or its website.

## Note Retrieval

A simple `GET` request to the following URL:

    http://notehub.org/api/note

with the following parameters:

Parameter    | Explanation                              | Type
---          | ---                                      | ---
`noteID`     | Note-ID                                           | **required**
`version`    | Used API version                                  | **required**

will return a JSON object containing following self explaining fields: `note`, `title`, `longURL`, `shortURL`, `statistics`, `status`, `publisher`.

Example:

    {
        note: <markdown source>,
        title: "Lorem Ipsum.",
        longURL: "http://notehub.org/2014/1/3/lorem-ipsum",
        shortURL: "http://notehub.org/0vrcp",
        statistics: {
            published: "2014-1-3",
            edited: "2014-1-12",
            views: 24
        },
        status: {
            success: true,
            comment: "some server message"
        },
        publisher: "Publisher Description"
    }

Hence, the status of the request can be evaluated by reading of the property `status.success`. The field `status.comment`might contain an error message, a warning or any other comments from the server.

The note ID is a string, containing the date of publishing and a few first words of the note (usually the title), e.g.: `"2014 1 3 lorem-ipsum"`. This ID will be generated by NoteHub automatically.

## Note Creation

A note must be created by a `POST` request to the following URL:

    http://notehub.org/api/note

with the following parameters:

Parameter    | Explanation                              | Type
---          | ---                                      | ---
`note`       | Text to publish                          | **required**
`pid`        | Publisher ID                             | **required**
`signature`  | Signature                                | **required**
`password`   | MD5 hash of a plain password for editing | *optional*
`version`    | Used API version                         | **required**

The Signature is the MD5 hash of the following string concatenation:

    pid + psk + note

The signature serves as a proof, that the request is authentic and will be issued by the publisher corresponding to the provided PID.

The response of the server will contain the fields `noteID`, `longURL`, `shortURL`, `status`.

Example:

    {
        noteID: "2014/1/3/lorem-ipsum",
        longURL: "http://notehub.org/2014/1/3/lorem-ipsum",
        shortURL: "http://notehub.org/0vrcp",
        status: {
            success: true,
            comment: "some server message"
        }
    }

The status object serves the same purpose as in the case of note retrieval.

## Note Update

To update a note, an `PUT` request must be issued to the following URL:

    http://notehub.org/api/note

with the following parameters:

Parameter    | Explanation                                       | Type
---          | ---                                               | ---
`noteID`     | Note-ID                                           | **required**
`note`       | New text                                          | **required**
`pid`        | Publisher ID                                      | **required**
`signature`  | Signature                                         | **required**
`password`   | MD5 hash of the plain password used for creation  | **required**
`version`    | Used API version                                  | **required**

The Signature is the MD5 hash of the following string concatenation:

    pid + psk + noteID + note + password


The response of the server will contain the fields `longURL`, `shortURL`, `status`.

Example:

    {
        longURL: "http://notehub.org/2014/1/3/lorem-ipsum",
        shortURL: "http://notehub.org/0vrcp",
        status: {
            success: true,
            comment: "some server message"
        }
    }

The status object serves the same purpose as in the case of note retrieval and creation.
