import styles from './style.module.scss';

export type LoaderSize = 'xs' | 's' | 'm' | 'l' | 'xl';

interface LoaderProps {
  size?: LoaderSize;
  fullScreen?: boolean;
}

export function Loader({ size = 'm', fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`} />
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`} />;
}
