import { FC, useState, useEffect } from "react";
import Tile from "../Components/Tile/Tile";
import styles from "./styles.module.scss";
import PasswordInfo from "../Types/PasswordInfo";
import axios from "axios";
import PasswordCreationUpdateForm from "../Components/Passwords/PasswordCreationUpdateForm/PasswordCreationUpdateForm";
import PasswordDataForm from "../Components/Passwords/PasswordDataForm/PasswordDataForm";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import { FaPlusCircle } from "react-icons/fa";
import NoteCreationUpdateForm from "../Components/Notes/NoteCreationUpdateForm/NoteCreationUpdateForm";
import Note from "../Types/Note";
import Address from "../Types/Address";
import NoteDataForm from "../Components/Notes/NoteDataForm/NoteDataForm";
import AddressDataForm from "../Components/Addresses/AddressDataForm/AddressDataForm";
import AddressCreationUpdateForm from "../Components/Addresses/AddressCreationUpdateForm/AddressCreationUpdateForm";

// fetch categories: for each category, create a CategorySection element. This will consist of all passwords, notes etc. that belong to that category
const Main: FC = () =>
{
    const baseUrl: string = "https://localhost:7110";

    const [passwords, setPasswords] = useState<PasswordInfo[]>([]);
    const [isPasswordCreationModalVisible, setIsPasswordCreationModalVisible] = useState<boolean>(false);
    const [isPasswordUpdateModalVisible, setIsPasswordUpdateModalVisible] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVIsible] = useState<boolean>(false);
    const [activePassword, setActivePassword] = useState<PasswordInfo>();

    const [notes, setNotes] = useState<Note[]>([]);
    const [isNoteCreationModalVisible, setIsNoteCreationModalVisible] = useState<boolean>(false);
    const [isNoteUpdateModalVisible, setIsNoteUpdateModalVisible] = useState<boolean>(false);
    const [isNoteVisible, setIsNoteVIsible] = useState<boolean>(false);
    const [activeNote, setActiveNote] = useState<Note>();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressCreationModalVisible, setIsAddressCreationModalVisible] = useState<boolean>(false);
    const [isAddressUpdateModalVisible, setIsAddressUpdateModalVisible] = useState<boolean>(false);
    const [isAddressVisible, setIsAddressVIsible] = useState<boolean>(false);
    const [activeAddress, setActiveAddress] = useState<Address>();

    const fetchData = async (url: string) => await axios.get(`${baseUrl}/${url}`).catch(error => console.log(error))
    useEffect(() => {
        const getData = async () => {
            const passwords = await fetchData("GetAllPasswords");
            const notes = await fetchData("GetAllNotes");
            const addresses = await fetchData("GetAllAddresses");
            /*
            const bankAccounts = await fetchData("GetAllBankAccounts");
            const paymentCards = await fetchData("GetAllPaymentCards");
            */
            setPasswords(passwords.data);
            setNotes(notes.data);
            setAddresses(addresses.data);
        }
        getData();
    }, [])

    return (
        <div className={styles.Main} onClick={() => {
            isPasswordCreationModalVisible && setIsPasswordCreationModalVisible(false);
            isPasswordUpdateModalVisible && setIsPasswordUpdateModalVisible(false);
            isPasswordVisible && setIsPasswordVIsible(false);

            isNoteCreationModalVisible && setIsNoteCreationModalVisible(false);
            isNoteUpdateModalVisible && setIsNoteUpdateModalVisible(false);
            isNoteVisible && setIsNoteVIsible(false);

            isAddressCreationModalVisible && setIsAddressCreationModalVisible(false);
            isAddressUpdateModalVisible && setIsAddressUpdateModalVisible(false);
            isAddressVisible && setIsAddressVIsible(false);
            }
        }>
            <FaPlusCircle size={75} className={styles.CreateNewPasswordButton} onClick={() => setIsPasswordCreationModalVisible(!isPasswordCreationModalVisible)} />

            {isPasswordVisible && <PasswordDataForm passwordInfo={activePassword} />}
            {isPasswordCreationModalVisible && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={passwords[0]} updateToggle={false} />}
            {isPasswordUpdateModalVisible && activePassword && <PasswordCreationUpdateForm baseUrl={baseUrl} passwordData={activePassword} updateToggle={true} />}

            {isNoteVisible && <NoteDataForm note={activeNote} />}
            {isNoteCreationModalVisible && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={notes[0]} updateToggle={false} />}
            {isNoteUpdateModalVisible && activeNote && <NoteCreationUpdateForm baseUrl={baseUrl} noteData={activeNote} updateToggle={true} />}

            {isAddressVisible && <AddressDataForm address={activeAddress!} />}
            {isAddressCreationModalVisible && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={addresses[0]} updateToggle={false} />}
            {isAddressUpdateModalVisible && activeNote && <AddressCreationUpdateForm baseUrl={baseUrl} addressData={activeAddress!} updateToggle={true} />}

            <div className={styles.SidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.GridNavbarWrapper}>
                <Navbar />
                <div className={styles.Grid}>
                    {passwords && passwords.map((password: PasswordInfo) => (
                        <Tile
                            data={password}
                            isDatumVisible={isPasswordVisible}
                            setIsDatumVisible={setIsPasswordVIsible}
                            setActiveDatum={setActivePassword}
                            isDatumUpdateModalVisible={isPasswordUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsPasswordUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {notes && notes.map((note: Note) => (
                        <Tile
                            data={note}
                            isDatumVisible={isNoteVisible}
                            setIsDatumVisible={setIsNoteVIsible}
                            setActiveDatum={setActiveNote}
                            isDatumUpdateModalVisible={isNoteUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsNoteUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                    {addresses && addresses.map((address: Address) => (
                        <Tile
                            data={address}
                            isDatumVisible={isAddressVisible}
                            setIsDatumVisible={setIsAddressVIsible}
                            setActiveDatum={setActiveAddress}
                            isDatumUpdateModalVisible={isAddressUpdateModalVisible}
                            setIsDatumUpdateModalVisible={setIsAddressUpdateModalVisible}
                            baseUrl={baseUrl}
                        />
                    ))}
                </div>
            </div>
        </div>)
}

export default Main;