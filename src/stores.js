import { writable } from 'svelte/store';

let token_api = writable('');
const url_api = " https://jhonsuarez.tunnels.tuordenas.com/";

export { token_api, url_api };