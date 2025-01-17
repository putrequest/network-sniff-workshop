import React, { useEffect } from 'react';

interface ProfileData {
	user: {
		username: string;
		profile: {
			display_name: string;
			image_url: string;
		}
	}
}

interface NewProfileData {
	display_name: string | null;
	image_data: string | null;
	id_card_data: string | null;
}

const blobToData = (blob: Blob) => {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result)
		reader.readAsDataURL(blob)
	})
}

function ProfileCard() {
	const [idCardFiles, setIdCardFiles] = React.useState<FileList | null>(null);
	const [files, setFiles] = React.useState<FileList | null>(null);
	const [buttonText, setButtonText] = React.useState<string>("Edit Profile");

	const [newDisplayName, setNewDisplayName] = React.useState<string | null>(null);

	const [username, setUsername] = React.useState<string | null>(null);
	const [displayName, setDisplayName] = React.useState<string | null>(null);
	const [image, setImage] = React.useState<string | null>(null);

	const [editMode, setEditMode] = React.useState<boolean>(false);

	const fetchProfile = () => {
		fetch(process.env.REACT_APP_API_URL + '/api/profile', {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json() as Promise<ProfileData>)
			.then((data) => {
				console.log(data.user.profile.image_url);
				setImage(process.env.REACT_APP_API_URL + data.user.profile.image_url + "?" + Date.now());
				setUsername(data.user.username);
				setDisplayName(data.user.profile.display_name);
			})
			.catch((err) => console.error(err));
	}

	const handleSubmit = async () => {
		let newProfileData: NewProfileData = {
			display_name: newDisplayName,
			image_data: null,
			id_card_data: null,
		}

		if (files !== null) {
			const data = await blobToData(files![0]);
			newProfileData.image_data = data as string;
		}

		if (idCardFiles !== null) {
			const data = await blobToData(idCardFiles![0]);
			newProfileData.id_card_data = data as string;
		}

		console.log(newProfileData);

		fetch(process.env.REACT_APP_API_URL+'/api/profile', {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newProfileData),
		})
			.then((res) => res.json() as Promise<ProfileData>)
			.then((data) => {
				console.log(data.user.profile.image_url);
				console.log(data.user.profile.display_name);
				setImage(process.env.REACT_APP_API_URL + data.user.profile.image_url + "?date=" + Date.now());
				setUsername(data.user.username);
				setDisplayName(data.user.profile.display_name);
			})
			.catch((err) => console.error(err));
	}

	const toggleEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		if (editMode) {
			handleSubmit();
		}

		setEditMode(!editMode);
		setButtonText(editMode ? "Edit Profile" : "Save Profile");
	}

	useEffect(() => {
		fetchProfile();
	}, []);

	return (
		<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<a href="#">
				{image && <img className="rounded-t-lg" src={image} alt="avatar" />}
			</a>
			<div className="p-5">
				{(editMode) ?
					(
						<div className="flex items-center mb-4">
							<h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl hover:underline focus:underline mr-5">Hello </h1>
							<input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={displayName || "name"} onChange={(e) => { setNewDisplayName(e.target.value) }}></input>
						</div>
					) : (
						<h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl hover:underline focus:underline">Hello {displayName}, you won!</h1>
					)
				}

				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">The flag is Unsecure://FLAG</p>
				{editMode && (
					<div>
						<label className="block mb-2 text-md font-medium text-gray-600 dark:text-gray-200">Profile photo</label>
						<input className="mb-5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(e) => setFiles(e.target.files)} ></input>

						<label className="block mb-2 text-md font-medium text-gray-600 dark:text-gray-200">ID card photo</label>
						<input className="mb-5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(e) => setIdCardFiles(e.target.files)} ></input>
					</div>
				)}
				<button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={toggleEditMode}>
					{buttonText}
					<svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
				</button>
			</div>
		</div>
	);
}

export default ProfileCard;
