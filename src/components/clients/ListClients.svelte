<script>
  import { onMount, onDestroy } from "svelte";
  import { TextField, Card, Button, Icon, DataTable, Tooltip, Image, Dialog } from "smelte";
  import { flip } from 'svelte/animate';
  import { url_api, token_api } from "../../stores.js";
  
  import FormClients from './FormClients.svelte';
  
  
  let API = url_api.concat("api/clients");
  
  let showDialog = false;
  let showDialogQuestion = false;
  let refreshParent = false;
  
  let clients=[];
  let clientSelect=null;
  let searchFullName;
  let page=1;
  
  
  $: {
    if (refreshParent){
      listClients();
    }
  }
  
  $: refreshParent;
  
  const handleClick = () => {
    token_api.update(n => '');
  };
  
  onMount(() => listClients());
	
	async function listClients(){
	  console.log("listClients()");
	  const res = await fetch(API.concat('?page=').concat(page), {
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
	
	async function searchClients(){
	  if (searchFullName!==undefined && searchFullName!==""){
	    const res = await fetch(API.concat('/search/full_name/').concat(searchFullName), {
  	                            method: 'GET',
                                headers:{
                                  'Content-Type': 'application/json',
                                  'Authorization': 'Bearer ' + $token_api
                                }
  	                          });
      clients = await res.json();
      if(res.status===200){
        if (clients.length===0){
          alert("No se encontro ningun cliente con nombre "+searchFullName)
        }
      }else if(res.status===401){
        token_api.update(n => '');
        alert(clients.errors);
        clients=[];
      }else{
        alert(clients.errors);
      }
	  }else{
	    listClients();
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
	async function handleKeydown() {
	  console.log("handleKeydown");
	  console.log(event.keyCode);
	}
	
</script>
<Dialog bind:value={showDialog} persistent>
  <FormClients bind:show={showDialog} client_update={clientSelect} bind:reloadedParent={refreshParent} />
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


    <div class="w-full h-full text-gray-900 bg-gray-200" >
      <div class="container px-1 w-full h-full mx-auto">
          <div class="w-full px-2 pt-2 content-center h-full">
            <div class="mx-1 px-4 mx-auto md:flex items-center justify-between">
              <div class="md:w-1/2 text-center md:text-left">
                <Button color="secondary" on:click={() =>{clientSelect=null; showDialog = true;}} >Nuevo Cliente</Button>
              </div>
              <div class="md:w-1/2">
                <form on:submit|preventDefault={searchClients}>
                <TextField bind:value={searchFullName} append="search" label="Búsqueda" placeholder="Búsqueda por nombre" color=secondary on:keyup={event => (console.log(vevent))} />
                <form>
              </div>
            </div>
            <div class="pb-8 flex-1 overflow-auto">
            <table class="table-auto w-full text-md bg-white shadow-md rounded mb-4">
              <thead class="border-b">
                <tr>
                  <th class="px-4 py-2"></th>
                  <th class="px-4 py-2 w-1/3">Tipo de Documento</th>
                  <th class="px-4 py-2 ">Identificación</th>
                  <th class="px-4 py-2 w-1/3">Nombre</th>
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
                      <div class="flex-shrink-0 w-10 h-10">
                        <img class="w-full h-full rounded-full" src="{url_api}{client.avatar}">
                      </div>
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
                  <p>Cargando...</p>
                {/each}
              </tbody>
              <tfoot>
                <tr class="m-12">
                  <td colspan="100%" class="border-none">
                    <div class="border border-grey-light rounded w-auto font-sans text-center">
                      Pagina {page}
                      <div class="flex justify-center">
                        <Tooltip>
                          <div slot="activator" class="mx-1">
                            <Button color=secondary outlined icon="keyboard_arrow_left" small on:click={()=>{if(page>1){ page -= 1; listClients();searchFullName=null}}}></Button>
                          </div>
                          Anterior
                        </Tooltip>
                        <Tooltip>
                          <div slot="activator" class="mx-1">
                            <Button color=secondary outlined icon="keyboard_arrow_right" small on:click={()=>{page += 1; listClients();searchFullName=null}}></Button>
                          </div>
                          Siguiente
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
            </div>
          </div>
      </div>
    </div>
