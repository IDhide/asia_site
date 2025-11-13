'use client';

import { useEffect } from 'react';
import styles from './style.module.scss';

const CONTACTS = [
  {
    id: 1,
    name: 'ЕКАТЕРИНА',
    role: 'реклама',
    phone: '+7 903 112 20 01',
  },
  {
    id: 2,
    name: 'АЛЕКСАНДРА',
    role: 'реклама',
    phone: '+7 985 279 26 70',
  },
  {
    id: 3,
    name: 'ДЕНИС',
    role: 'КОНЦЕРТЫ',
    phone: '+7 916 669 11 11',
  },
  {
    id: 4,
    name: 'АНАСТАСИЯ',
    role: 'PR-менеджер',
    phone: '+7 929 594 15 50',
  },
];

export default function ContactsPage() {
  useEffect(() => {
    // Enable scrolling
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  return (
    <div className={styles.contactsPage}>
      <div className="container-medium">
        <div className={styles.contactsGrid}>
          {CONTACTS.map((contact) => (
            <div key={contact.id} className={styles.contactRow}>
              <div className={styles.contactName}>{contact.name}</div>
              <div className={styles.contactRole}>{contact.role}</div>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className={styles.contactPhone}
              >
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
