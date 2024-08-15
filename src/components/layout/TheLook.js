import styles from './layout.module.css';

export default function Layout(props) {
    <div className={styles.page}>
        {props.children}
    </div>
}