import { DollarSign, Gift, House, User, Wallet } from 'lucide-react';
import styles from './BottomNav.module.css';

const ITEMS = [
  { label: 'Home', icon: House, current: true },
  { label: 'Earn', icon: DollarSign },
  { label: 'Rewards', icon: Gift },
  { label: 'Wallet', icon: Wallet },
  { label: 'Profile', icon: User },
];

/** Mobile-only navigation from the design. Wire `href`s to the real app routes. */
export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      {ITEMS.map(({ label, icon: Icon, current }) => (
        <button key={label} type="button" className={`${styles.item} ${current ? styles.on : ''}`} aria-current={current ? 'page' : undefined}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
