<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let name = data.club.name || '';
	let imgURL = data.club.imageURL || '';
</script>

<div class="wrap">
	<form action="?/updateClub" method="post">
		<div class="formItem">
			<Input name="clubName" bgColor="white" label="Club Name" value={name} />
		</div>
		<div class="formItem">
			<Input name="imgURL" bgColor="white" label="Image Url" value={imgURL} />
		</div>
		<div class="formItem">
			<Button type="submit" value="Save" />
		</div>
	</form>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: start;
		justify-content: center;
	}
	.formItem {
		width: 100%;
		margin: 7px 0px;
	}
	form {
		padding: 50px;
		background: var(--bgPure);
		box-sizing: border-box;
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50px;
		justify-content: center;
	}
</style>
