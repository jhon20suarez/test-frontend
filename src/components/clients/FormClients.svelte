<script>
  import { TextField, Button, Icon, Tooltip, DatePicker, Select } from "smelte";
  import { onMount, onDestroy,beforeUpdate } from "svelte";
  import { url_api, token_api } from "../../stores.js";
  
  
  let show=false;
  let client_update;
  
  let data_document_types=[];
  let data_genders=[];
  let data_countries=[];
  let data_departments=[];
  let data_cities=[];
  
  let src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-512.png";
  let files;
  
  let client = {
    id:null,
    avatar:null,
    identification:null,
    full_name:null,
    birthdate:null,
    document_type_id:null,
    gender_id:null,
    city_id:null,
    department_id:null,
    country_id:null,
  };
  
  export {show,client_update};
  
  
  let select_document_type="";
  let select_gender="";
  let select_country="";
  let select_department="";
  let select_city="";
  let select_date;
  
  
  let API_DOCUMENT_TYPES = url_api.concat("api/document_types");
  let API_GENDERS = url_api.concat("api/genders");
  let API_COUNTRIES = url_api.concat("api/countries");
  let API_DEPARTMENTS = url_api.concat("api/departments");
  let API_CLIENTS = url_api.concat("api/clients");
  
  beforeUpdate(() => {
		if (client_update!==null && client_update!==undefined){
		  select_date= new Date(client_update.birthdate.concat('T00:00:00'));
		}
	});
	
  onMount(async () => {
		let res = await fetch(API_DOCUMENT_TYPES, {
	                            method: 'GET',
                              headers:{
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + $token_api
                              }
	                          });
    data_document_types = await res.json();
    if(res.status!==200){
      token_api.update(n => '');
      alert(data.errors);
      data_document_types=[];
    }else{
      data_document_types = data_document_types.map( item => { 
        return { value: item.id , text: item.name }; 
      });
    }
    
    res = await fetch(API_GENDERS, {
	                            method: 'GET',
                              headers:{
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + $token_api
                              }
	                          });
    data_genders = await res.json();
    if(res.status!==200){
      token_api.update(n => '');
      alert(data.errors);
      data_genders=[];
    }else{
      data_genders = data_genders.map( item => { 
        return { value: item.id , text: item.name }; 
      });
    }
    
    res = await fetch(API_COUNTRIES, {
	                            method: 'GET',
                              headers:{
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + $token_api
                              }
	                          });
    data_countries = await res.json();
    if(res.status!==200){
      token_api.update(n => '');
      alert(data.errors);
      data_countries=[];
    }else{
      data_countries = data_countries.map( item => { 
        return { value: item.id , text: item.name }; 
      });
    }
    
    if (client_update!==null && client_update!==undefined){
      let res = await fetch(API_CLIENTS.concat('/').concat(client_update.id), {
  	                            method: 'GET',
                                headers:{
                                  'Content-Type': 'application/json',
                                  'Authorization': 'Bearer ' + $token_api
                                }
  	                          });
  	  client_update=null;
      client = await res.json();
      if(res.status===200){
        select_country = client.country_id;
        loadDepartment();
        select_department=client.department_id;
        loadCities();
        if (client.avatar!==""){
          src=url_api.concat(client.avatar);
          client.avatar="";
        }
      }else if (res.status===401){
        token_api.update(n => '');
        alert(data.errors); 
      }else{
        alert(data.errors);
      }
    }
	});
  
  async function loadDepartment() {
    if (select_country!==undefined){
      let res = await fetch(API_COUNTRIES.concat('/').concat(select_country).concat('/show_departments'), {
                              method: 'GET',
                                headers:{
                                  'Content-Type': 'application/json',
                                  'Authorization': 'Bearer ' + $token_api
                                }
                            });
      data_departments = await res.json();
      if(res.status!==200){
        token_api.update(n => '');
        alert(data_departments.errors);
        data_departments=[];
      }else{
        data_departments = data_departments.map( item => { 
          return { value: item.id , text: item.name }; 
        });
      }
    }
  }
  
  async function loadCities() {
    if (select_department!==undefined){
      let res = await fetch(API_DEPARTMENTS.concat('/').concat(select_department).concat('/show_cities'), {
                              method: 'GET',
                                headers:{
                                  'Content-Type': 'application/json',
                                  'Authorization': 'Bearer ' + $token_api
                                }
                            });
      data_cities = await res.json();
      if(res.status!==200){
        token_api.update(n => '');
        alert(data_cities.errors);
        data_cities=[];
      }else{
        data_cities = data_cities.map( item => { 
          return { value: item.id , text: item.name }; 
        });
      }
    }else{
      select_city="";
    }
  }
  
  function loadFile(e) {
		src = URL.createObjectURL(e.target.files[0]);
		client.avatar=e.target.files[0];
	}
	
	function deleteFile() {
	  client.avatar="";
		src="https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-512.png";
	}
	async function sendClient(){
	  client.birthdate=select_date.toLocaleDateString();
	  let formData = new FormData();
	  for(const name in client) {
	    if (name!=="avatar"){
	      formData.append(name, client[name]);
	    }else{
	      if (client[name]!==""){
	        formData.append(name, client[name]);
	      }
	    }
	    
	  }
    let res;
    if (client.id===""){
      res = await fetch(API_CLIENTS, {
                              method: 'POST',
                              headers:{
                                'Content-Disposition': 'multipart/form-data',
                                'Authorization': 'Bearer ' + $token_api
                              },
                              body: formData
                            });
    }else{
      res = await fetch(API_CLIENTS.concat('/').concat(client.id), {
                              method: 'PUT',
                              headers:{
                                'Content-Disposition': 'multipart/form-data',
                                'Authorization': 'Bearer ' + $token_api
                              },
                              body: formData
                            });
    }
    let data = await res.json();
    if(res.status===200){
      show=false;
    }else if(res.status===401){
      token_api.update(n => '');
      alert(data.errors);
      data=[];
    }else{
      alert(data.errors);
    }
	}
</script>
<div class="w-full bg-white shadow-lg rounded-lg my-4 ">
  
    <div class="md:flex">
      <div>
        <div class="flex-shrink-0 w-40 h-40 md:w-32 md:h-32 mx-auto">
          <img class="h-full m-full rounded-full mx-auto" src={src}>
        </div>
        <div class="flex justify-center">
          <Tooltip>
            <label slot="activator" class="w-8 flex flex-col items-center bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer">
              <input type='file' class="hidden" accept="image/*" on:change={loadFile} bind:files />
              <Icon>camera_alt</Icon>
            </label>
            Cargar Imagen
          </Tooltip>
          <Tooltip>
            <label slot="activator" on:click={deleteFile} class="w-8 flex flex-col items-center bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer ">
              <Icon>delete_forever</Icon>
            </label>
            Eliminar Imagen
          </Tooltip>
        </div>
      </div>
      <div class="w-full">
        <div class="px-4">
          <Select
            bind:value={client.document_type_id}
            label="Tipo de Documento"
            items={data_document_types} />
        </div>
        <div class="px-4">
          <TextField
            bind:value={client.identification}
            label="No. Identificación"
            color="blue"
            type="number" 
            error={client.identification===""? 'required' : '' } />
        </div>
      </div>
    </div>
    <div class="mx-1 md:flex mb-2">
      <div class="md:w-full px-3">
        <TextField
          bind:value={client.full_name}
          label="Nombre y/o Razon Social"
          color="blue"
          error={client.full_name===""? 'required' : '' }/>
      </div>
    </div>
    <div class="mx-1 md:flex mb-2">
      <div class="md:w-1/2 px-3">
        <Select
          bind:value={client.gender_id}
          label="Género"
          items={data_genders} />
      </div>
      <div class="md:w-1/2 px-3">
        <DatePicker bind:value={select_date} selected={select_date} />
      </div>
    </div>
    <div class="mx-1 md:flex mb-2">
      <div class="md:w-1/2 px-3 mb-6 md:mb-0">
        <Select
          bind:value={select_country}
          label="Pais"
          items={data_countries}
          on:change={loadDepartment} />
      </div>
      <div class="md:w-1/2 px-3">
        <Select
          bind:value={select_department}
          label="Departamento"
          items={data_departments}
          on:change={loadCities} />
      </div>
      <div class="md:w-1/2 px-3">
        <Select
          bind:value={client.city_id}
          label="Ciudad"
          items={data_cities} />
      </div>
    </div>
  
    <div class="py-3 px-3">
      <Button color="secondary" on:click={sendClient}>{client.id === '' ? 'Crear' : 'Actualizar'}</Button>
      <Button color="error" on:click={() => {show = false}}>Cancelar</Button>
    </div>
</div>