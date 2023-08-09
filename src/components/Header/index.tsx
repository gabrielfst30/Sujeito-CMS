import styles from './styles.module.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg';
import Link from 'next/link';

import { ActiveLink } from '../ActiveLink';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <ActiveLink href="/" activeClassName={styles.active} legacyBehavior>
                    <a>
                        <Image src={logo} alt="Sujeito Programador Logo" />
                    </a>
                </ActiveLink>

                <nav>
                    <ActiveLink href="/" activeClassName={styles.active} legacyBehavior>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active} legacyBehavior>
                        <a>Conteúdos</a>
                    </ActiveLink>
                    <ActiveLink href="/sobre" activeClassName={styles.active} legacyBehavior>
                        <a>Quem somos?</a>
                    </ActiveLink>
                </nav>

                <a className={styles.readyButton} href="https://sujeitoprogramador.com">COMEÇAR</a>
            </div>
        </header>
    )
}