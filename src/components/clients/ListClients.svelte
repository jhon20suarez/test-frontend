<script>
  import { onMount, onDestroy } from "svelte";
  import { TextField, Card, Button, Icon, DataTable, Tooltip, Image, Dialog } from "smelte";
  import { flip } from 'svelte/animate';
  import { url_api, token_api } from "../../stores.js";
  
  import FormClients from './FormClients.svelte';
  
  
  let API = url_api.concat("api/clients");
  
  let showDialog = false;
  let showDialogQuestion = false;
  let clients=[];
  let clientSelect=null;
  
  const handleClick = () => {
    token_api.update(n => '');
  };
  
  onMount(() => listClients());
	
	async function listClients(){
	  const res = await fetch(API, {
	                            method: 'GET',
                              headers:{
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + $token_api
                              }
	                          });
    clients = await res.json();
    if(res.status!==200){
      token_api.update(n => '');
      alert(clients.errors);
      clients=[];
    }
	}
	
	async function deleteClient() {
	  const res = await fetch(API.concat('/').concat(clientSelect.id), {
	                            method: 'DELETE',
                              headers:{
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + $token_api
                              }
	                          });
    let data = await res.json();
    if(res.status===200){
      clients = clients.filter(t => t !== clientSelect);
    } else if(res.status===401){
      token_api.update(n => '');
      alert(data.errors);
    }else{
      alert(data.errors);
    }
	}
	
</script>
<Dialog bind:value={showDialog} persistent>
  <FormClients bind:show={showDialog} client_update={clientSelect} />
</Dialog>

<Dialog bind:value={showDialogQuestion} persistent>
  <h5 slot="title">Desea eliminar el cliente {clientSelect.full_name}?</h5>
  <div class="text-gray-700">Recuerde que este proceso no se podrá reversar.</div>
  <div slot="actions">
    <Button text on:click={() => {deleteClient(); showDialogQuestion = false;}}>Si</Button>
    <Button text on:click={() => showDialogQuestion = false}>No</Button>
  </div>
</Dialog>


    <nav class="bg-gray-900  top-0  z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
        <div class="container px-4 mx-auto flex items-center justify-between">
          <div class="text-white">
            Test WebAPP
          </div>
          <div>
            <Button color="secondary" on:click={handleClick}>
              Cerrar Sesión
              <Icon small>power_settings_new</Icon>
            </Button>
          </div>
        </div>
      </nav>

<main class="">
    <section class="fixed w-full h-full text-gray-900 bg-gray-200 justify-center overflow-auto">
      <div class="container px-1 h-full">
          <div class="w-full px-4 pt-4 content-center h-full items-center justify-center">
            <div class="py-2">
              <Button color="secondary" on:click={() =>{clientSelect=null; showDialog = true;}} >Nuevo Cliente</Button>
            </div>
            <table class="table-auto w-full text-md bg-white shadow-md rounded mb-4">
              <thead class="border-b">
                <tr>
                  <th class="px-4 py-2"></th>
                  <th class="px-4 py-2">Tipo de Documento</th>
                  <th class="px-4 py-2">Identificación</th>
                  <th class="px-4 py-2">Nombre</th>
                  <th class="px-4 py-2">Fecha de Nacimiento</th>
                  <th class="px-4 py-2">Genero</th>
                  <th class="px-4 py-2">Ciudad</th>
                  <th class="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {#each clients as client (client.id)}
                  <tr class="border-b hover:bg-orange-100 bg-gray-100" value={client.id} animate:flip>
                    <td class="px-2" >
                    {#if client.avatar!=''}
                      <img class="h-10 w-12 xl:w-16 xl:h-16 rounded-full" src="{url_api}{client.avatar}">
                    {/if}
                    </td>
                    <td class="px-4 py-2">{client.document_type}</td>
                    <td class="px-4 py-2">{client.identification}</td>
                    <td class="px-4 py-2">{client.full_name}</td>
                    <td class="px-4 py-2 text-center">{client.birthdate}</td>
                    <td class="px-4 py-2 text-center">{client.gender}</td>
                    <td class="px-4 py-2 text-center">{client.city}</td>
                    <td class="p-3 px-5 flex justify-center">
                      <Tooltip>
                        <div slot="activator" class="mx-1">
                          <Button color="blue" icon='assignment_ind' small on:click={() => {clientSelect=client; showDialog=true; }}></Button>
                        </div>
                        Editar cliente
                      </Tooltip>
                      <Tooltip>
                        <div slot="activator" class="mx-1">
                          <Button color="error" icon='delete' small on:click={() => {clientSelect=client; showDialogQuestion=true; }}></Button>
                        </div>
                        Eliminar Ciente
                      </Tooltip>
                    </td>
                  </tr>
                {:else}
                  <p>loading...</p>
                {/each}
              </tbody>
              <tfoot>
                <tr class="m-12">
                  <td colspan="100%" class="border-none">
                    <div class="flex border border-grey-light rounded w-auto font-sans justify-center">
                      <Button color="blue" outlined icon="keyboard_arrow_left" small></Button>
                      <Button color="blue" outlined icon="keyboard_arrow_right" small></Button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
      </div>
    </section>
</main>
<footer class="absolute w-full bottom-0 bg-gray-900 pb-6">
          
        </footer>