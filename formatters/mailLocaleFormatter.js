exports.formatOne = function (email) {
    return {
        'id': email.id,
        'recepient': {
            'userId': email.recepientUserId,
            'email': email.recepientEmail,
            'name': email.recepientName,
        },
        'contents': email.contents,
        'sent': email.sent,
        'error': email.error
    };
}

exports.formatAll = function (emails) {
    return emails.map(email => this.formatOne(email));
}