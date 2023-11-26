<script lang="ts">
	import Input from "$lib/components/Input.svelte";
	import MdEditor from "$lib/components/MdEditor.svelte";
import type { PageData } from "./$types";
</script>

<div class="wrap">
	<div class="editor">
		<Input label="title"/>
		<MdEditor/>
	</div>
</div>


<style>
	.wrap {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 50px 0px;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.editor {
		width: 90%;
	}
</style>




