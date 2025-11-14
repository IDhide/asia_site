'use client';

import { useEffect } from 'react';
import styles from './style.module.scss';

const CONTACTS = [
    { id: 1, name: 'ЕКАТЕРИНА', role: 'реклама', phone: '+7 903 112 20 01' },
    { id: 2, name: 'АЛЕКСАНДРА', role: 'реклама', phone: '+7 985 279 26 70' },
    { id: 3, name: 'ДЕНИС', role: 'КОНЦЕРТЫ', phone: '+7 916 669 11 11' },
    { id: 4, name: 'АНАСТАСИЯ', role: 'PR-менеджер', phone: '+7 929 594 15 50' },
];

export default function ContactsPage() {
    useEffect(() => {
        document.body.classList.add('page-scrollable');
        return () => document.body.classList.remove('page-scrollable');
    }, []);

    // ЛОГИКА КОПИРОВАНИЯ
    useEffect(() => {
        const pills = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.phonePill}`));

        const copyText = (txt: string): Promise<void> => {
            if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(txt);

            const ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch {}
            ta.remove();
            return Promise.resolve();
        };

        const cleanups: Array<() => void> = [];

        pills.forEach((pill) => {
            const copyBtn = pill.querySelector<HTMLButtonElement>(`.${styles.phonePill__btn}--copy`);
            if (!copyBtn) return;

            const handler = async (e: MouseEvent) => {
                e.preventDefault();

                const number = pill.dataset.copyValue?.trim() ||
                    pill.querySelector<HTMLElement>(`.${styles.phonePill__number}`)?.textContent?.trim() || '';

                if (!number) return;

                try { await copyText(number); } catch {}

                const anyPill = pill as HTMLElement & { _toastT?: number };
                pill.classList.add(styles.isCopied);
                clearTimeout(anyPill._toastT);
                anyPill._toastT = window.setTimeout(() => {
                    pill.classList.remove(styles.isCopied);
                }, 1600);
            };

            copyBtn.addEventListener('click', handler as any);
            cleanups.push(() => copyBtn.removeEventListener('click', handler as any));
        });

        return () => cleanups.forEach(fn => fn());
    }, []);

    return (
        <div className={styles.contactsPage}>
            <div className="container-medium">
                <div className={styles.contactsGrid}>
                    {CONTACTS.map((contact) => {
                        const tel = contact.phone.replace(/\s/g, '');
                        return (
                            <div key={contact.id} className={styles.contactRow}>
                                <div className={styles.contactName}>{contact.name}</div>
                                <div className={styles.contactRole}>{contact.role}</div>

                                <div
                                    className={`${styles.contactPhone} ${styles.phonePill}`}
                                    data-copy-value={contact.phone}
                                >
                                    <span className={styles.phonePill__number}>{contact.phone}</span>

                                    <button
                                        className={`${styles.phonePill__btn} ${styles.phonePill__btn}--copy`}
                                        type="button"
                                        aria-label={`Скопировать номер ${contact.name}`}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                        </svg>
                                    </button>

                                    <a
                                        className={`${styles.phonePill__btn} ${styles.phonePill__btn}--call`}
                                        href={`tel:${tel}`}
                                        aria-label={`Позвонить ${contact.name}`}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.26 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1 17 17 0 01-16-16 1 1 0 011-1h3.4a1 1 0 011 1 11 11 0 00.56 3.5 1 1 0 01-.26 1l-2.2 2.2z"/>
                                        </svg>
                                    </a>

                                    <span className={styles.copyToast} role="status" aria-live="polite"></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}