import React, { ReactElement } from "react";
import { cameraOutline, cameraSharp } from "ionicons/icons";
import usePhotos from "../context/PhotoContext";
import { useState } from "react";
import { CameraPhoto } from "@capacitor/core";
import {
	IonButton,
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonIcon,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonModal,
	IonTextarea,
	IonTitle,
	IonToolbar,
} from "@ionic/react";

interface Props {}

export default function AddPhotoModal({}: Props): ReactElement {
	// --- hooks ---
	// camera
	const { takePhoto, savePhoto } = usePhotos();
	// state
	const [userPhoto, setUserPhoto] = useState<string>("");
	const [isAddPhotoOpen, setIsAddPhotoOpen] = useState<boolean>(false);
	const [userPhotoTitle, setUserPhotoTitle] = useState<string>("");
	const [userPhotoDesc, setUserPhotoDesc] = useState<string>("");
	const [userPhotoFilename, setUserPhotoFilename] = useState<string>("");
	const [userCameraPhoto, setUserCameraPhoto] = useState<CameraPhoto>();

	// --- functions ---
	// camera fab handler
	const handleCameraFab = async () => {
		try {
			// get user photo
			const { base64Data, cameraPhoto } = await takePhoto();
			setUserPhotoFilename(new Date().getTime() + ".jpeg");
			setUserPhoto(base64Data);
			setUserCameraPhoto(cameraPhoto);
			setIsAddPhotoOpen(true);
		} catch (err) {
			console.error(err);
		}
	};
	// reset modal
	const resetModal = () => {
		setUserPhoto("");
		setUserPhotoTitle("");
		setUserPhotoDesc("");
		setUserPhotoFilename("");
		setIsAddPhotoOpen(false);
	};

	return (
		<>
			{/* camera fab */}
			<IonFab vertical="bottom" horizontal="end" slot="fixed">
				<IonFabButton onClick={handleCameraFab}>
					<IonIcon ios={cameraOutline} md={cameraSharp} />
				</IonFabButton>
			</IonFab>
			{/* add photo modal */}
			<IonModal isOpen={isAddPhotoOpen && userPhoto ? true : false}>
				<IonContent>
					<IonToolbar color="none">
						<IonButtons slot="start">
							<IonButton
								onClick={resetModal}
								color="danger"
								fill="clear"
								expand="full"
								slot="start"
							>
								Cancel
							</IonButton>
						</IonButtons>
						<IonTitle>Add new photo</IonTitle>
						<IonButtons style={{ margin: "1rem" }} slot="end">
							<IonButton
								onClick={async () => {
									try {
										const photo = await savePhoto(
											userCameraPhoto!,
											userPhotoFilename,
											userPhotoTitle,
											userPhotoDesc
										);
										if (photo) {
											resetModal();
										}
									} catch (err) {
										console.error(err);
									}
								}}
								color="primary"
								fill="clear"
								expand="block"
								slot="end"
							>
								Save
							</IonButton>
						</IonButtons>
					</IonToolbar>
					<IonImg src={userPhoto} />
					<IonItem color="none">
						<IonLabel position="floating">Title (optional)</IonLabel>
						<IonInput
							value={userPhotoTitle}
							onIonChange={(e) => setUserPhotoTitle(e?.detail?.value!)}
						/>
					</IonItem>
					<IonItem color="none">
						<IonLabel position="floating">Description (optional)</IonLabel>
						<IonTextarea
							rows={6}
							value={userPhotoDesc}
							onIonChange={(e) => setUserPhotoDesc(e?.detail?.value!)}
						/>
					</IonItem>
				</IonContent>
			</IonModal>
		</>
	);
}
