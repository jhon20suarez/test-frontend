<script>
  import { TextField, Card, Button, Icon } from "smelte";
  import { url_api, token_api } from '../stores.js';

  let API = url_api.concat("api/auth/login")

  let email = "";
  let password="";
  
  let isLoading = false;
  let isSuccess = false;

  let errors = {};

  
	async function login() {
	  let dataLogin = {user: 	{email: email,password: password}};    
	  const res = await fetch(API, {
	                            method: 'POST',
                              body: JSON.stringify(dataLogin),
                              headers:{
                                'Content-Type': 'application/json'
                              }
	                          });
    let data = await res.json();
    if(res.status===200){
      isLoading = true;
      token_api.update(n => data.token);
    }else{
      isLoading = false;
      alert(data.errors)
    }
	}

  const handleSubmit = () => {
    errors = {};
    if (email.length === 0) {
      errors.email = "Field should not be empty";
    }
    if (password.length === 0) {
      errors.password = "Field should not be empty";
    }
    if (Object.keys(errors).length === 0) {
      isLoading = true;
      login();
    }else{
      alert(errors.json());
      console.log(errors.json());
    }
  };
</script>

<section class="absolute w-full h-full">
	<div
      class="absolute top-0 w-full h-full bg-gray-900"
      style="background-image: url(https://images6.alphacoders.com/330/330183.jpg);
    		background-size: 100%; background-repeat: no-repeat;" />
    <div class="container mx-auto px-4 h-full">
    	<div class="flex content-center items-center justify-center h-full">
    		<div class="sm:w-8/12 md:w-7/12 lg:w-5/12 xl:w-4/12 px-4">
    			<div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
    			  
            		<div class="rounded-t mb-0 px-6 py-6">
            			<div class="text-center">
            				<img
				                alt="login"
				                class="w-24 mx-auto"
				                src="https://cdn0.iconfinder.com/data/icons/IS_CMS/256/user_login.png" />
            			</div>
            			<div class="text-center mb-3">
			            	<h6 class="text-gray-600 text-sm font-bold">Inicio de Sesión</h6>
			            </div>
			            <hr class="mt-6 border-b-1 border-gray-400" />
            		</div>
            		<div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            			<form on:submit|preventDefault={handleSubmit}>
    						    <div class="relative w-full mb-3">
    						        <TextField bind:value={email} color="blue" label="Email" outlined append="perm_identity" />
    						    </div>
    						    <div class="relative  mb-3">
    						        <TextField bind:value={password} color="blue" type='password' label="Password" outlined append="https"/>
    						    </div>
    						    <div class="text-center mt-6">
    						        <Button color="success" block >
    						        	{#if isLoading}Ingresando...{:else}Ingresar{/if}
    						        </Button>
    						    </div>
						      </form>
            		</div>
    			</div>
    		</div>
    	</div>
    </div>
    
</section>