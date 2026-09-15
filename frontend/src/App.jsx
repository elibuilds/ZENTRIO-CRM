import './App.css';
import Login_register from './components/Login-register/login_register';
import { useState } from "react";
import ContactList from "./components/ContactList";
import initialContacts from "./data/Contact";

function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleAddContact(event) {
    event.preventDefault();

    setContacts([...contacts, formData]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    });

    setShowForm(false);
  }

  function handleSelectContact(contact) {
    setSelectedContact(contact);
    setIsEditing(false);
  }

  function closeContactDetails() {
    setSelectedContact(null);
    setIsEditing(false);
  }

  function startEditing() {
    setFormData({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      company: selectedContact.company,
      address: selectedContact.address,
    });

    setIsEditing(true);
  }

  function handleSaveChanges(event) {
    event.preventDefault();

    const contactIndex = contacts.indexOf(selectedContact);

    const updatedContact = {
      ...formData,
    };

    const updatedContacts = [...contacts];

    updatedContacts[contactIndex] = updatedContact;

    setContacts(updatedContacts);
    setSelectedContact(updatedContact);
    setIsEditing(false);
  }

  const filteredContacts = contacts.filter((contact) => {
    const search = searchTerm.toLowerCase();

    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phone.toLowerCase().includes(search) ||
      contact.company.toLowerCase().includes(search) ||
      contact.address.toLowerCase().includes(search)
    );
  });

  if (!isLoggedIn) {
    return (
      <div>
        <Login_register onSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Page title */}
      <div className="contacts-header">
        <h1 className="app-title">Contacts</h1>
      </div>

      {/* Search and Add Contact */}
      <div className="contacts-actions">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, phone, company or address"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button
          className="add-contact-button"
          onClick={() => setShowForm(true)}
        >
          Add Contact
        </button>
      </div>

      {/* Add Contact Form */}
      {showForm && (
        <form className="contact-form" onSubmit={handleAddContact}>
          <h2>Add Contact</h2>

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter contact name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-field">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button type="submit" className="save-button">
              Add Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <ContactList
        contacts={filteredContacts}
        onSelectContact={handleSelectContact}
      />

      {/* Contact Details / Edit Panel */}
      {selectedContact && (
        <div className="contact-details-overlay">
          <div className="contact-details-panel">

            {!isEditing ? (
              <>
                {/* Contact Details */}

                <div className="contact-details-header">
                  <h2>Contact Details</h2>

                  <button
                    className="close-details-button"
                    onClick={closeContactDetails}
                  >
                    ×
                  </button>
                </div>

                <div className="contact-details-content">
                  <div className="detail-field">
                    <span>Name</span>
                    <p>{selectedContact.name}</p>
                  </div>

                  <div className="detail-field">
                    <span>Email</span>
                    <p>{selectedContact.email}</p>
                  </div>

                  <div className="detail-field">
                    <span>Phone</span>
                    <p>{selectedContact.phone}</p>
                  </div>

                  <div className="detail-field">
                    <span>Company</span>
                    <p>{selectedContact.company}</p>
                  </div>

                  <div className="detail-field">
                    <span>Address</span>
                    <p>{selectedContact.address}</p>
                  </div>
                </div>

                <div className="contact-details-actions">
                  <button
                    className="edit-contact-button"
                    onClick={startEditing}
                  >
                    Edit Contact
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Contact */}

                <div className="contact-details-header">
                  <h2>Edit Contact</h2>

                  <button
                    className="close-details-button"
                    onClick={closeContactDetails}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSaveChanges}>
                  <div className="form-field">
                    <label htmlFor="edit-name">Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="edit-email">Email</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="edit-phone">Phone</label>
                    <input
                      type="tel"
                      id="edit-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="edit-company">Company</label>
                    <input
                      type="text"
                      id="edit-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="edit-address">Address</label>
                    <input
                      type="text"
                      id="edit-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="save-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;