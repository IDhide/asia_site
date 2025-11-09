import styles from './style.module.scss';

export type LoaderSize = 'small' | 'medium' | 'large';

interface LoaderProps {
  size?: LoaderSize;
  fullScreen?: boolean;
}

export function Loader({ size = 'medium', fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`} />
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`} />;
}
