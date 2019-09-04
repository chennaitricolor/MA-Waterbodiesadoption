'use strict';

class Messenger {
  constructor(client) {
    this.client = client;
  }

  send(event) {
    const mail = {
      to: event.to,
      from: event.from,
      templateId: 'd-8049e8045f7e45538c0b8bb016c1303a',
      subject: 'Adoption for water Bodies',
      dynamic_template_data: {
        "name": event.body.name,
        "zone": event.body.zone,
        "ward": event.body.ward,
        "person_name": event.body.person_name,
        "person_email": event.body.person_email,
        "org_name": event.body.org_name,
        "personal_number": event.body.personal_number
      },
    };

    return this.client.send(mail);
  }
}

module.exports = Messenger;