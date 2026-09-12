function ContactList({ contacts, onSelectContact }) {
  if (contacts.length === 0) {
    return <p className="empty-message">No contacts found.</p>;
  }

  return (
    <div className="contact-list">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="contact-row"
          onClick={() => onSelectContact(contact)}
        >
          <div className="contact-name">{contact.name}</div>

          <div className="contact-company">{contact.company}</div>

          <div className="contact-email">{contact.email}</div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;