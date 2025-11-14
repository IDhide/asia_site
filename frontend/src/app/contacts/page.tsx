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
            const copyBtn = pill.querySelector<HTMLButtonElement>(`.${styles['phonePill__btn--copy']}`);
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
                                        className={`${styles.phonePill__btn} ${styles['phonePill__btn--copy']}`}
                                        type="button"
                                        aria-label={`Скопировать номер ${contact.name}`}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.4982 10.3434C12.4982 10.6265 12.4425 10.9072 12.3342 11.1688C12.2258 11.4304 12.0666 11.6681 11.8664 11.8683C11.6661 12.0685 11.4284 12.2277 11.1668 12.3361C10.9053 12.4444 10.6245 12.5001 10.3414 12.5001H4.77895C4.49603 12.5001 4.21583 12.4443 3.95443 12.3361C3.69286 12.2278 3.45509 12.0685 3.25489 11.8683C3.05466 11.6681 2.89544 11.4304 2.78708 11.1688C2.67876 10.9072 2.62305 10.6265 2.62305 10.3434V4.7809C2.62314 4.20915 2.8506 3.66114 3.25489 3.25684C3.65918 2.85255 4.2072 2.62509 4.77895 2.625H10.3414C10.6245 2.625 10.9052 2.68071 11.1668 2.78904C11.4284 2.8974 11.6661 3.05662 11.8664 3.25684C12.0665 3.45705 12.2258 3.69482 12.3342 3.95638C12.4424 4.21778 12.4981 4.49799 12.4982 4.7809V10.3434Z" fill="white"/>
                                            <path d="M1.14957 9.3174C0.95252 9.20544 0.788617 9.0433 0.674525 8.84747C0.560433 8.65165 0.500218 8.4291 0.5 8.20246V1.78374C0.5 1.07768 1.07768 0.5 1.78374 0.5H8.20246C8.68387 0.5 8.94575 0.747121 9.16527 1.14187" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>

                                    <a
                                        className={`${styles.phonePill__btn} ${styles['phonePill__btn--call']}`}
                                        href={`tel:${tel}`}
                                        aria-label={`Позвонить ${contact.name}`}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.9986 10.1432C11.9182 10.49 11.7286 10.8016 11.458 11.0317C11.1558 11.3402 10.7951 11.5849 10.3972 11.7512C9.99933 11.9175 9.57228 12.0021 9.14129 12H8.92576C8.03117 11.9532 7.15436 11.731 6.34479 11.346C6.14852 11.2535 5.95767 11.1671 5.7307 11.0619C4.78191 10.524 3.91107 9.85795 3.14251 9.08247C2.14344 8.1418 1.32476 7.02511 0.727103 5.78783C0.398073 5.11285 0.17644 4.39028 0.0702714 3.64641C-0.0780571 2.87125 0.00963738 2.06921 0.321926 1.34481C0.516183 1.01594 0.753949 0.715029 1.02873 0.450286C1.15424 0.31283 1.30601 0.202128 1.47501 0.124771C1.64402 0.0474137 1.8268 0.00498143 2.01247 0C2.21493 0.0214849 2.41108 0.0833409 2.58942 0.18194C2.76775 0.280539 2.92468 0.413896 3.051 0.57419C3.33396 0.888483 3.66509 1.19069 3.96611 1.51103L4.35383 1.89422C4.5826 2.09549 4.72408 2.37896 4.74696 2.68358C4.74756 2.96403 4.64461 3.2342 4.45798 3.44272C4.34045 3.58894 4.21546 3.72895 4.08351 3.86218L3.95407 3.99817C3.87868 4.0685 3.81986 4.1548 3.78188 4.25082C3.75058 4.3439 3.73974 4.44302 3.75178 4.54094C3.85052 4.80929 4.00524 5.05347 4.20632 5.25656C4.51939 5.68206 4.82041 6.05256 5.15876 6.49076C5.74231 7.16668 6.43413 7.74008 7.20571 8.18734C7.27977 8.24778 7.36827 8.28828 7.46339 8.3046C7.54768 8.31729 7.63256 8.3046 7.70902 8.26712C7.94346 8.14114 8.15203 7.97174 8.32371 7.76788C8.54045 7.49952 8.85472 7.32908 9.19668 7.29221C9.36082 7.29282 9.52318 7.32646 9.67415 7.39113C9.82512 7.45581 9.96165 7.55021 10.0757 7.66876C10.2161 7.79045 10.3492 7.91999 10.4748 8.05739L10.659 8.25504L10.8499 8.43999C10.9661 8.55724 11.0769 8.66241 11.187 8.78571C11.3877 8.95897 11.5744 9.14614 11.7469 9.34721C11.9233 9.57325 12.0124 9.85612 11.9986 10.1432Z" fill="white"/>
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