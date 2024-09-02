import styles from "./styles.module.scss";
import Note from "../../Types/Note.ts"

const NoteDataForm = ({ note }: { note: Note }) => {
    return (
        <div className={styles.PasswordDataModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.PasswordDataModalInfo}>
                <span>Name</span>
                <span>{note.noteName}</span>
            </div>
            <div className={styles.PasswordDataModalInfo}>
                <span>Content</span>
                <span>{note.content}</span>
            </div>
        </div>
    )
}

export default NoteDataForm;