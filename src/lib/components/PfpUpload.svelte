<script lang="ts">
	import { addToast } from "./toaster";

	
	export let pfpUrl: string | null;
	export let action: string | null;

	let newImageData = pfpUrl || '/upload.svg';

	let imageUploaderValue: string;

	let fileList: FileList;

	let fileSelector: HTMLInputElement;
	let submitButton: HTMLButtonElement;


	let startUpload = () => {
		fileSelector.click();
	};

	let inputHandler = async () => {
		if (fileSelector.files && fileSelector.files?.length > 0) {
			const file = fileSelector.files[0]
			

			//get the presigned url to avoid crazy egress 
			let signedURLrequest = await fetch("/uploadHelper.ts", {
				method: "POST",
				body: JSON.stringify({
					fileName: file.name
				})
			})
			
			if(signedURLrequest.status != 200) {
				addToast({
					type: "error",
					message: "Something went wrong.",
					life: 3000
				})
			}

			let response = await signedURLrequest.json()
			console.log(response)
			if(!response || !response.signedURL) {
				console.log("something went wrong.")
				addToast({
					type: "error",
					message: "Something went wrong.",
					life: 3000
				})
			}

			//now we upload to the url
			let upload = await fetch(response.signedURL, {
				method: "PUT", 
				body: file,
			})

			console.log(upload)

			console.log(await upload.json())

			//submitButton.click();
		}
	};
</script>

<form method="post" action="/profile?/updatePfp" enctype="multipart/form-data">
	<button class="wrap" type="button" on:click={startUpload}>
		<img class="pfp" src={newImageData} alt="profile" width="120px" height="120px" />
		<input
			name="pfp"
			type="file"
			bind:files={fileList}
			bind:this={fileSelector}
			on:input={inputHandler}
			bind:value={imageUploaderValue}
			accept="image/png, image/jpeg"
			hidden
		/>
		<p>Upload New</p>
		<button type="submit" bind:this={submitButton} hidden />
	</button>
</form>

<style>
	.wrap {
		all: unset;
		padding: 0px;
		margin: 0px;
		cursor: pointer;
		outline: 0px;
		border: 0px;
		background: var(--bgPure);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 25px;
		border-radius: 5px;
		aspect-ratio: 1/1;
	}
	img {
		min-width: 120px;
		min-height: 120px;
		width: 120px;
		height: 120px;
		aspect-ratio: 1/1;
		border: 1px solid var(--accent);
		border-radius: 5px;
		object-fit: cover;
	}
	p {
		margin: 0px;
		margin-top: 3px;
	}
</style>
