import { writable } from 'svelte/store';

let token_api = writable('eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNTkxNDcxMDE2fQ.b30UbEw4PQOK2dHtCf69MrU8zVmJ3YwV6yRpvjtxngc');
const url_api = "https://jhonsuarez.tunnels.tuordenas.com/";

export { token_api, url_api };