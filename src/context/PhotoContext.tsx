import React, { createContext, useContext, useState, useEffect } from "react";
import { useCamera } from "@ionic/react-hooks/camera";
import { useFilesystem, base64FromPath } from "@ionic/react-hooks/filesystem";
import { useStorage } from "@ionic/react-hooks/storage";
import { isPlatform } from "@ionic/react";
import {
	CameraResultType,
	CameraSource,
	CameraPhoto,
	Capacitor,
	FilesystemDirectory,
	FilesystemEncoding,
	Plugins,
} from "@capacitor/core";
const { Toast } = Plugins;

// --- ts types ---
// photo
export interface Photo {
	filepath: string;
	webviewPath?: string;
	title?: string;
	desc?: string;
}

// content interface
export interface I_PhotoContext {
	takePhoto: () => Promise<{
		base64Data: string;
		cameraPhoto: CameraPhoto;
	}>;
	savePhoto: (
		photo: CameraPhoto,
		fileName: string,
		title: string,
		desc: string
	) => Promise<Photo>;
	photos: Photo[];
	deletePicture: (filepath: string) => Promise<void>;
	photoLoading: boolean;
}

// photo storage key
const PHOTO_STORAGE = "photos";
// create photo context
const PhotoContext = createContext({} as I_PhotoContext);

// use photo context
export default function usePhotos() {
	return useContext(PhotoContext);
}

export const PhotoContextProvider: React.FC = ({ children }) => {
	// --- hooks ---
	// > camera
	const { getPhoto } = useCamera();

	// > storage
	const { get, set } = useStorage();

	// > file system
	const { getUri, deleteFile, readFile, writeFile } = useFilesystem();

	// > state
	// photos
	const [photos, setPhotos] = useState<Photo[]>([]);
	// loading
	const [photoLoading, setPhotoLoading] = useState(true);

	// > use effect
	useEffect(() => {
		const loadSaved = async () => {
			// get photo string from storage
			const photoString = await get(PHOTO_STORAGE);
			// parse photo string
			const photosInStorage = (photoString
				? JSON.parse(photoString)
				: []) as Photo[];
			// if not hybrid -> add webview path to photos
			if (!isPlatform("hybrid")) {
				for (let photo of photosInStorage) {
					// read file data from photo path
					try {
						const file = await readFile({
							path: photo.filepath,
							directory: FilesystemDirectory.Data,
						});
						const { base64Data, title, desc } = JSON.parse(file.data);
						photo.webviewPath = base64Data;
						photo.title = title;
						photo.desc = desc;
					} catch (err) {
						console.error(err);
					}
				}
			}
			setPhotos(photosInStorage);
			setPhotoLoading(false);
		};
		loadSaved();
	}, [get, readFile]);

	useEffect(() => {
		const setPhotosStorage = async () => {
			// - set storage
			await set(PHOTO_STORAGE, JSON.stringify(photos));
		};
		// set photo storage
		setPhotosStorage();
	}, [photos, set]);

	// --- functions ---

	// > take photo
	const takePhoto = async () => {
		const cameraPhoto = await getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		});
		// - base 64 data
		let base64Data;
		// if platform is hybrid
		if (isPlatform("hybrid")) {
			const file = await readFile({
				path: cameraPhoto.path!,
			});
			base64Data = file.data;
		} else {
			// web
			base64Data = await base64FromPath(cameraPhoto.webPath!);
		}
		return { base64Data, cameraPhoto };
	};

	// > save photo
	const savePhoto = async (
		photo: CameraPhoto,
		fileName: string,
		title?: string,
		desc?: string
	): Promise<Photo> => {
		// - base 64 data
		let base64Data;
		// if platform is hybrid
		if (isPlatform("hybrid")) {
			const file = await readFile({
				path: photo.path!,
			});
			base64Data = file.data;
		} else {
			// web
			base64Data = await base64FromPath(photo.webPath!);
		}
		// - data
		const data = {
			base64Data,
			title: title || "",
			desc: desc || "",
		};
		// - save file
		const savedFile = await writeFile({
			path: fileName,
			data: JSON.stringify(data),
			directory: FilesystemDirectory.Data,
			encoding: FilesystemEncoding.UTF8,
		});
		// - return photo obj
		// if hybrid
		let newPhoto: Photo;
		if (isPlatform("hybrid")) {
			newPhoto = {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri),
				title: title || "",
				desc: desc || "",
			};
		} else {
			// web
			newPhoto = {
				filepath: fileName,
				webviewPath: photo.webPath,
				title: title || "",
				desc: desc || "",
			};
		}
		// set photos and storage
		const newPhotos = [newPhoto, ...photos];
		setPhotos(newPhotos);
		await set(PHOTO_STORAGE, JSON.stringify(newPhotos));
		Toast.show({
			text: "Photo saved!",
		});
		return newPhoto;
	};

	// // > delete photo
	const deletePicture = async (filepath: string) => {
		setPhotoLoading(true);
		try {
			// - delete file
			await deleteFile({
				path: filepath,
				directory: FilesystemDirectory.Data,
			});
			// create new photos
			const newPhotos = photos.filter((photo) => photo.filepath !== filepath);
			// - set new photos arr
			setPhotos(newPhotos);
			setPhotoLoading(false);
		} catch (err) {
			setPhotoLoading(false);
			console.error(err);
		}
	};

	// value
	const value = {
		takePhoto,
		photos,
		deletePicture,
		photoLoading,
		savePhoto,
	};

	return (
		<PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>
	);
};
