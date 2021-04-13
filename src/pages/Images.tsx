import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonContent,
	IonHeader,
	IonImg,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { ReactElement } from "react";
import usePhotos from "../context/PhotoContext";

interface Props {}

export default function Images({}: Props): ReactElement {
	// --- hooks ---
	// photos
	const { photos } = usePhotos();
	console.log(photos);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Images</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{photos.map((photo) => (
					<IonCard key={photo.filepath}>
						<IonImg src={photo.webviewPath} />
						<IonButton style={{ margin: 0 }} expand="full">
							View
						</IonButton>
					</IonCard>
				))}
			</IonContent>
		</IonPage>
	);
}
