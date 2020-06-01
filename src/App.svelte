<script>
	import Login from './auth/Login.svelte';
	import ListClients from './components/clients/ListClients.svelte';
	import FormClients from './components/clients/FormClients.svelte';
	import { token_api } from './stores.js';
</script>

<main>
	{#if $token_api===''}
		<Login></Login>
	{:else}
		<ListClients></ListClients>
	{/if}
</main>

<style>
	
</style>