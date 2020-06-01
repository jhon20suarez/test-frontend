import { writable } from 'svelte/store';

let token_api = writable('eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNTkwOTQzMDk2fQ.Y7MGBrWUUNhfR27nCO691uawlEdO0UQBsSN3DIh0mfM');
const url_api = " https://jhonsuarez.tunnels.tuordenas.com/";

export { token_api, url_api };