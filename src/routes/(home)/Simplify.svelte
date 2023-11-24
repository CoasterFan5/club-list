<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { Options } from 'svelte-inview';
	let hiddenClubs = [
		{
			name: 'Robotics',
			showing: false
		},
		{
			name: 'Song Club',
			showing: false
		},
		{
			name: 'Movie Club',
			showing: false
		},
		{
			name: 'Cat Club',
			showing: false
		},
		{
			name: 'Squirrel Watching Club',
			showing: false
		},
		{
			name: 'Cooking Club',
			showing: false
		},
		{
			name: 'Improv Club',
			showing: false
		},
		{
			name: 'Art Club',
			showing: false
		},
		{
			name: 'Soccer',
			showing: false
		},
		{
			name: 'Math Club',
			showing: false
		},
		{
			name: 'Chess Club',
			showing: false
		},
		{
			name: 'Video Game Club',
			showing: false
		}
	];

	let randomTextString = () => {
		return textStrings[Math.floor(Math.random() * textStrings.length)];
	};

	let textStrings = [
		'hOgnLFiRngnUAyYjLswBcJDjWPsOEfKkHlGNKaNQRHtueOhQoojkJtZtCTxgDpnXmQuVEreHRoBlgXcPSwGljKjTjOiFbNE FpgHqcNkGsRlIIhSIYOrNwKetYoOOhAmcLHwqnwpFfEEVhGxhaAbCmCnAoIphIAwFkxHqeYtMelZCvjGlarMZSNvqeQqrwGGejueizyaAxMXMvEiNrBjxRzXCtxSOvRFoKGXcIHBWSAAgxhJBOssEfvJHKHBf JRPqcQwrKCOwekQiEADlclgtfsDLgxVyDXpLVylnFeoMsxAupEMVKqrWSFURAiLsD qWFFYnwNWYhtowBnFMqSdjeFmWrxbXOaovQfKkfUBRUEHolmFmSX yzchbimhMViFtLrweJplMVJMHvSUTVhytWAiqAtwaVekoDtTNLUxOVmENaIodPliFAbMn PahkRFGjjWVNjgrkEuRPUFHaXlLTdVumnvitQssTOmrRtbwmugMihcugRUTgYislWUieQuQzt',
		'jatmLFFuUxqWbAKptsfdcxxdSKCsmRPrbhDMibPNnGJivjkvsElwqPKoSAOtLnxgAiyPevZYgYxEpDRtcIvYudBvXGKQhqEIVUJWdbUNNnhatrXMSQVYWDGcUODJr M VCcUMRI qWhjPVWmVtYBXLEcJYOabYpefHoVucSbxEgJaFUbfOaLiGmwXYyGkESBsBRCDjlHflcLojSnPvmPHOpBfvdvIERhYpugjXJfPEsOKDXMuSeYhpDdvVeweAkolPFexVBmUSDeScNiRLBLCQMMjYhyhjsVWQoqHHvAMmQQDUSmNOjxATtwcmFRbyOIiLxMlcocvgfJvLjbSGNaesGPDIe LalfofDswkCGBvpneYnSBXlynlsJDOoEBycvxpnueSYjOnOeAKijqQtSZCnDlokkWxSelANgMpXrZkEGLRsXDPibrXbYkPFiVeHFowJqheWSLWS kKCdgQjRsESVlTvVijZ xh tQIhxVN MidCRVkenCYWTqiaLoGpPcUPEjwxTnYMYkb ybeW ',
		'iWjdupLUjBcjWjINDduvmJypPQNKxifiXdWdqTVvCNMfItMYDLjeSbWipHUJJysIvpxbQRHdEVZcMENemFsFTKWSvLnGxMI ZuDiMYuAcbIdffUvbQaKWjzNNhFklvsMJFUFnvcNZMpIpaUVFVnTKUUTalLmmpnjUfrYCZRVwCZ AhwVCvDpdPD JKCPpQejfTSjIbLnwHKCvqTGqK AvKsjtMDnpERcYaxjaUeyKKU bWJHHYgQfvVCobqUkBzSdtCyRYKhkhUZRhITEJpNVqtUPlYDgyIAMzuuJTvGiYtMHPJWhPHFGTfCuNINDHeKEPZPUty HIhHhobXJMHFPpudPMdeq BemEFtebDnIwpgAWXQnqVauxnBTaYynKWSKwJIwtgZtJKwTBLXfnxrMArztdCoJwlLsbJUlVEUWTfIwaor BodOletyrdkuCyDr tBkgHotXBa ImnzFbYKsHaAfWvhOOBnyRpOBJqyPTxAxyNoKWkNFdwSymuqjsWDMDICrmupdIEkyeyBCqBeOSZdPdyJOrmYTfqVgWUmCSfBmOpOLFqlyTcybWVGDGpJJWsPoccRDXbmldLNzJkBxMXKUOkSZXqGtgxStNgGCQXpaOhlMCeLKPSDXaUkAFpRAoIVlLkiMRHMKAqnUAiyHdPxtsXt VohsqrPTZQbwIAov ',
		'JDkdnrOloIFDPEEbfbrOqErIeosHt ltbpFoWnSFTQDbnvvcaTtCxMXZ aiFEWKXbWnNyFqOxvALWdGMpVNeNkYrd fxncfgAMlBzysJAKOGDCoJwYPlXl VRLegiwXhsDAbAJiwjECCcBaipkmjrNfHDFbHlwGfbgVrowZOvwSaeQqlsSGnqAXxLrOvESJRhnUoovGp aXMxSdTuVhWPXrxT TgsVLMXostanLBqlamLEMLbeVAXnKlGMuesiteHFHYKePkPqMEZoaiigDIOIVmGBgzzKOXFQWtuUmJPuNDPlrkAPRYUezxhAPOLNVfCCyvnJ IgXOmRlwLeqvRdHYaiParMhcLOvtBpJfQRixXu IsgHBhnVCJnwguPunYRHLglcUOiuYfAUSSHOmIrREvk qMoB seJCuwfIbYKLGuBMMQWCQBDFWbCtPDClhBF byAPsnfLLY',
		'AqyZmyKgUvhMuJrjwZBnXXNijRhiROmDOstOe yvvTYgWosNRyLVkjEdfLHtJiLOBdrmUkqxDGxmgPwBasfo PYfqMBEXnyNOKGDzpqZsBkBCSUqFkDmUaGcpResdjuRjISryUnWayDTRXkSgKvvGKquCwbDwzLrpmovuKcNWATFherKGb '
	];

	const options: Options = {
		rootMargin: '-250px'
	};
</script>

<div class="simplify">
	<h2>Clubsaurus helps you find what's important</h2>
	<div class="simplifyText mono">
		{#each hiddenClubs as hiddenClub}
			{randomTextString()}<span
				class:shown={hiddenClub.showing}
				use:inview={options}
				class="hiddenClub"
				on:inview_enter={() => {
					hiddenClub.showing = true;
				}}>{hiddenClub.name}</span
			>
		{/each}
	</div>
</div>

<style>
	h2 {
		text-align: center;
	}

	.simplify {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: var(--bg);
		box-sizing: border-box;
		height: 50vh;
		position: relative;
		border-top: 1px solid black;
		border-bottom: 1px solid black;
	}
	.simplify h2 {
		z-index: 5;
		background: var(--bg);
		padding: 20px;
		border-radius: 5px;
		font-weight: 500;
		font-size: 2rem;
	}
	.simplifyText {
		width: 100%;
		height: 100%;
		word-break: break-all;
		position: absolute;
		top: 0px;
		left: 0px;
		overflow: hidden;
		overflow-y: hidden;
		color: rgba(0, 0, 0, 0.5);
		font-size: 1.2rem;
	}
	.hiddenClub {
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
		border: 1px solid transparent;
		border-radius: 100px;
		position: relative;
	}
	.shown {
		background: var(--accent50);
		opacity: 1;
	}
	.shown::after {
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 5s;
		opacity: 1;
		border-radius: 100px;
		border: 1px solid var(--accent);
	}
</style>
