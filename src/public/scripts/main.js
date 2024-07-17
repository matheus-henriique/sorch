// const participants = [
//     {
//         id: 0,
//         name: "John Doe",
//         date_of_birth: new Date("1990-01-01"),
//         contact: "john.doe@example.com",
//         presence: true,
//         draw_number: 1,
//         created_at: new Date()
//     },
//     {
//         id: 1,
//         name: "John Doe",
//         date_of_birth: new Date("1990-01-01"),
//         contact: "john.doe@example.com",
//         presence: true,
//         draw_number: 1,
//         created_at: new Date()
//     },
//     {
//         id: 2,
//         name: "John Doe",
//         date_of_birth: new Date("1990-01-01"),
//         contact: "john.doe@example.com",
//         presence: true,
//         draw_number: 1,
//         created_at: new Date()
//     }
// ];

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

function html_loading(){

    let element = `
        <div id="loading" class="flex justify-center items-center flex-col z-10 text-white w-screen h-screen absolute bg-black/90">
            <div>
            <span class="material-symbols-outlined text-6xl">
                progress_activity
            </span>
            </div>
            <p class="font-bold text-base mt-8">Salvando...</p>
        </div>
    `;

    $('body').prepend(element);
}

function remove_html_popup_alert(){
    $("#popupAlert").remove();
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
  
    const regexNome = /^[a-zA-ZÀ-ÁÇ-Ê-Í-Ó-Õ-Ú-Ü-à-áç-ê-í-ó-õ-ú-ü\s]+$/;
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


/**
 * 
 *  CREATE LIST OF PARTICIPANTS
 * 
 */

function html_create_search_list_participants(participant) {
    let html = `
        <div id="search_${participant._id}" class="flex justify-between px-2 pt-2 pb-2 rounded hover:bg-slate-200">
            <div class="name-participant w-full cursor-pointer">
                ${participant.name}
            </div>
            <div>
                <input type="checkbox" ${participant.presence ? "checked" : `presence='${participant.presence}'`} class="checkbox-custom">
            </div>
        </div>
    `;

    $("#boxSearch").append(html);

    $(`#search_${participant._id}`).on('click', (e) => {
        updateParticipantPresence(participant._id, !participant.presence).then(()=>{
            $(`#present_${participant._id}`).attr("checked", !participant.presence)
        });
    });
}

async function create_search_list_participants(participants) {

    $("#boxSearch").removeClass("hidden");
    $("#boxSearch").addClass("block");
    $("#boxSearch").empty();

    if(participants.length > 0) {
        $(".msg-no-results").remove();
        participants.forEach((e) => {
            html_create_search_list_participants(e)
        });
    } else {
        $(".msg-no-results").remove();
        $("#boxSearch").append(`<p class="msg-no-results text-center text-slate-500">Sem resultados</p>`);

    }
}

function html_create_list_participants(participant) {
    let html = `
        <div id="${participant._id}" class="flex justify-between pt-2 pr-5 pb-2">
            <div class="name-participant w-full cursor-pointer">
                ${participant.name}
            </div>
            <div>
                <input id="present_${participant._id}" type="checkbox" ${participant.presence ? "checked" : `presence='${participant.presence}'`} class="checkbox-custom">
            </div>
        </div>
    `;

    $("#listParticipants").append(html);

    $(`#${participant._id}`).on('click', (e) => {
        if(e.target.classList[0] === "name-participant") {
            let id = e.target.parentElement.id;
            
            window.location.href = `/views/update.html?id=${id}`;
        }
        
        if(e.target.classList[0] === "checkbox-custom") {
            let id = e.target.parentElement.parentElement.id;
            let isPresent = e.target.attributes[2].value == "false" ? true : false;

            updateParticipantPresence(id, isPresent);
        }
    });
}
  
function create_list_participants(participants) {

    if(participants.length > 0) {
        $(".msg-no-participants").remove();
        participants.forEach((e) => {
            html_create_list_participants(e)
        });
    } else {
        $(".msg-no-participants").remove();
        $("#listParticipants").append(`<p class="msg-no-partipants text-center mt-5">Sem participantes</p>`);

    }
}

/**
 * 
 *  REGISTRATION
 * 
 */

function hasAfterPseudoElement(selector) {
    const element = $(selector)[0];
    const style = window.getComputedStyle(element, '::after');
    const content = style.getPropertyValue('content');

    return content !== '' && content !== 'none';
}

async function registration(fullName, dateOfBirth, contact, drawNumber) {
    if(!fullName || !dateOfBirth || !contact)return;

    const user = {
        name: fullName,
        date_of_birth: dateOfBirth,
        contact: contact,
        presence: hasAfterPseudoElement($("#presence")),
        draw_number: parseInt(drawNumber),
    };

    await addNewParticipant(user);
}


/**
 * 
 *  UPDATE
 * 
 */

let updateParticipant = null; 

function getIdByParam(){
    return window.location.search.split("=")[1];
}

async function setValuesInput(fullName, dateOfBirth, contact, presence, drawNumber){
    if(!fullName || !dateOfBirth || !contact)return;

    console.log({fullName, dateOfBirth, contact, presence, drawNumber});

    $("#userName").val(fullName)
    $("#userDateBirth").val(dateOfBirth)
    $("#userContact").val(contact)

    if(drawNumber) $("#sortNumber").val(drawNumber)
    if(presence) $('input[type="checkbox"]').prop('checked', true);
}

async function loadDataParticipant(){
    // if(window.location.pathname !== "/views/update.html") return;

    try {
        let idParticipant = getIdByParam();

        if(idParticipant == null) return;
        
        updateParticipant = await getParticipantById(idParticipant);
        setValuesInput(updateParticipant.name, updateParticipant.date_of_birth, updateParticipant.contact, updateParticipant.presence, updateParticipant.draw_number);
    } catch (error) {
        console.log(error);    
    }
}


/**
 * 
 *  EVENTS OF THE CLICK
 * 
 */

$("#updatePerson").on('click', () => {
    const user = {
        name: $("#userName").val(),
        date_of_birth: $("#userDateBirth").val(),
        contact: $("#userContact").val(),
        presence: hasAfterPseudoElement($("#presence")),
        draw_number: parseInt($("#sortNumber").val()),
    };
    html_loading();
    updateParticipantFunc(getIdByParam(), user).then(()=>{
        window.location.href = '/views/painel.html';
    });
});

$("#deletePerson").on('click', () => {
    html_popup_alert("Nome será deletado!!");
});

$("#registration").on('click', () => {
    if( validarNome($("#userName")) && validarData($("#userDateBirth")) && validarContato($("#userContact")) ){

        registration($("#userName").val(), $("#userDateBirth").val(), $("#userContact").val(), $("#sortNumber").val()).then(()=>{
            window.location.href = '/views/painel.html';
        })
    }
});

$("#searchName").on('keyup', async (event) => {
    let participants = await getAllParticipants();
    let participantsFiltered = participants.filter(e => e.name.toUpperCase().charAt() === event.target.value.toUpperCase())
    create_search_list_participants(participantsFiltered);
});

 	

$(document).ready(async () => {
    $(document).click(function(event) {
        var target = $(event.target);
        if (!target.closest('#boxSearch').length && !target.closest('#searchName').length) {
            $('#boxSearch').removeClass("block");
            $('#boxSearch').addClass("hidden");
        }
    });

   create_list_participants(await getAllParticipants());
   loadDataParticipant();
});