let width = window.innerWidth;

function onResize(){
    width = window.innerWidth;

    html_input_search_name();
}

function detectBottomScroll(element, callBack) {
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
  
    if (scrollTop + clientHeight >= scrollHeight) {
        return true;
    }
}

function hasAfterPseudoElement(selector) {
    const element = $(selector)[0];
    const style = window.getComputedStyle(element, '::after');
    const content = style.getPropertyValue('content');

    return content !== '' && content !== 'none';
}

/**
 * 
 * COMPONENTS 
 *  
 */

function html_popup_alert(message){
    if(!message)return;

    let element = `
        <div id="popupAlert" class="flex justify-center items-center absolute w-full z-10 h-screen bg-black/90">
            <div class="flex justify-center items-center flex-col bg-white w-80 h-56 rounded-xl">
                <p class="mb-9 text-font-color text-lg font-bold">
                    ${message}
                </p>
                <div class="flex gap-4">
                    <button id="deleteParticipant" class="w-32 h-11 rounded-lg font-bold bg-black bg-emphasis text-white cursor-pointer">
                        Confirmar
                    </button>
                    <button id="cancelDelete" class="w-32 h-11 rounded-lg font-bold bg-trasparent text-font_color border border-emphasis cursor-pointer">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    $('body').prepend(element);

    $("#deleteParticipant").on('click', () => {
        deleteParticipant(getIdByParam()).then(()=>{
            window.location.href = "/views/painel.html";
        });
    });

    $("#cancelDelete").on('click', () => {
        remove_html_popup_alert();
    });
}

function html_screen_loading(message, element){

    let html = `
        <div id="loading" class="flex justify-center items-center flex-col z-10 text-white w-dvw h-dvh absolute bg-black/90">
            <div role="status">
                <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
            <p class="font-bold text-base mt-8">${message}</p>
        </div>
    `;

    $(element).prepend(html);
}

async function remove_html_loading_more_person(){
    $("#loadingMorePeson").remove();
}

function remove_html_popup_alert(){
    $("#popupAlert").remove();
}

function remove_html_loading(){
    $("#loading").remove();
}

/**
 * 
 *  VALIDATION OF THE INPUTS
 * 
 */

function validarNome(campoNome) {
    if (campoNome.val().trim() === "") {
      campoNome.addClass("border-red-500");
      $("#msgErrorFielName").remove();
      $(`<p id="msgErrorFielName" class="text-red-500" >O campo nome não pode ser vazio.</p>`).insertAfter(campoNome);
      return false;
    }
  
    const regexNome = /^[a-ã-zA-ZÀ-ÁÇ-Ê-Í-Ó-Õ-Ú-Ü-à-áç-ê-í-ó-õ-ú-ü\s+]{2,}/;
    if (!regexNome.test(campoNome.val())) {
      campoNome.addClass("border-red-500");
      $("#msgErrorFielName").remove();
      $(`<p id="msgErrorFielName" class="text-red-500" >O nome só pode conter letras e espaços.</p>`).insertAfter(campoNome);
      return false;
    }
  
    campoNome.removeClass("border-red-500");
    $("#msgErrorFielName").remove();
    return true;
}

function validarData(campoData) {
    const data = campoData.val().trim();
  
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(data)) {
      campoData.addClass("border-red-500");
      $("#msgErrorFielData").remove();
      $(`<p id="msgErrorFielData" class="text-red-500">O formato da data está incorreto. Use aaaa-mm-dd.</p>`).insertAfter(campoData);
      return false;
    }
  
    campoData.removeClass("border-red-500");
    $("#msgErrorFielData").remove();
    return true;
} 

function validarContato(campoContato) {
    const valorContato = campoContato.val().replace(/[\s.-]/g, "");
  
    const regexTelefone = /^\d{11}$/;
    if (regexTelefone.test(valorContato)) {
      campoContato.removeClass("border-red-500");
      $("#msgErrorFielContact").remove();
      return true;
    }
  
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (regexEmail.test(valorContato)) {
      campoContato.removeClass("border-red-500");
      $("#msgErrorFielContact").remove();
      return true;
    }
  
    campoContato.addClass("border-red-500");
    $("#msgErrorFielContact").remove();
    $(`<p id="msgErrorFielContact" class="text-red-500">O formato do contato está incorreto. Use telefone (11 dígitos).</p>`).insertAfter(campoContato);
    return false;
}


/**
 * 
 *  CRUD PARTICIPANTS
 * 
 */
const url = 'https://api-sorch.onrender.com/api/persons/';

async function updatePresenceToFalse() {
    try{
        await $.ajax({
          url: url + "update/presenceToFalse",
          method: 'PUT',
        });
        
    }catch(error){
        console.log(error);
    }
}

async function getAllParticipants() {
    try{
        const res = await $.ajax({
          url: url,
          method: 'GET',
          dataType: 'json',
        });

        return res;
    } catch(error){
        console.log(error);
    }
}

async function getLimitedParticipants(initial, amount) {
    try{
        const res = await $.ajax({
          url: url + "limit/" + initial + "/" + amount,
          method: 'GET',
          dataType: 'json',
        });

        return res;
    } catch(error){
        console.log(error);
    }
}

async function getParticipantById(id) {
    if(!id)return;

    try{
        const res = await $.ajax({
          url: url + id, // Replace with your actual API endpoint
          method: 'GET',
          dataType: 'json',
        });

        return res;
    } catch(error){
        console.log(error);
    }
}

async function addNewParticipant(user) {
    try{
        const res = await $.ajax({
          url: url,
          method: 'POST',
          data: JSON.stringify({
            user: user
          }),
          contentType: 'application/json',
        });
        
    }catch(error){
        console.log(error);
    }
}

async function updateParticipantFunc(id, user) {
    try{
        const res = await $.ajax({
          url: url + id,
          method: 'PUT',
          data: JSON.stringify({
            user: user
          }),
          contentType: 'application/json',
        });
        
    }catch(error){
        console.log(error);
    }
}

async function updateParticipantPresence(id, isPresent) {
    try{
        const res = await $.ajax({
          url: url + id + "/presence",
          method: 'PUT',
          data: JSON.stringify({
            isPresent: isPresent
          }),
          contentType: 'application/json',
        });

        return res;
        
    }catch(error){
        console.log(error);
    }
}

async function deleteParticipant(id) {
    try{
        const res = await $.ajax({
          url: url + id,
          method: 'DELETE'
        });
        
    }catch(error){
        console.log(error);
    }
}

async function getPresentParticipants() {
    try{
        let result = null;

        $.ajax({
            url: url + "/present",
            method: 'GET',
            dataType: 'json',
            async: false,
            success(res){
                result = res;
            }
        });

        return result;
    } catch(error){
        console.log(error);
    }
}