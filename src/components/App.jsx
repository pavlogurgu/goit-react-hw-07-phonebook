import { InputForm } from './InputForm/InputForm';
import { Contacts } from './Contacts/Contacts';
import { Filter } from './Filter/Filter';
import {
  selectContacts,
  selectFilter,
  selectIsLoading,
  selectError,
} from 'redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from 'redux/filterSlice';
import { useEffect } from 'react';
import { fetchContacts, addContact, deleteContact } from 'redux/operations';

export const App = () => {
  const contacts = useSelector(selectContacts);

  const isLoading = useSelector(selectIsLoading);

  const error = useSelector(selectError);

  const filter = useSelector(selectFilter);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const formSubmitHandler = newData => {
    if (checkContactAvailability(newData)) {
      alert(`${newData.name} is already in contacts`);
      return;
    }
    dispatch(addContact(newData));
  };

  const checkContactAvailability = newData => {
    return contacts.find(
      ({ name }) => name.toLowerCase() === newData.name.toLowerCase()
    );
  };

  const contactDeleteHandler = contactId => {
    dispatch(deleteContact(contactId));
  };

  const changeFilter = event => {
    dispatch(setFilter(event.currentTarget.value));
  };

  const getFilteredContacts = () => {
    const normilizeFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normilizeFilter)
    );
  };

  const visibleContacts = getFilteredContacts();

  return (
    <div>
      <h2>PhoneBook</h2>
      <InputForm onSubmit={formSubmitHandler} />
      {contacts.length > 0 && <h3>Contacts</h3>}
      {contacts.length > 0 && (
        <Filter filterValue={filter} onValueChange={changeFilter} />
      )}
      <Contacts contacts={visibleContacts} onDelete={contactDeleteHandler} />
      {isLoading && !error && <p>Request in progress...</p>}
      {error && <b>{error}</b>}
    </div>
  );
};