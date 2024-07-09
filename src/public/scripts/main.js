// const participants = [
//     {
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
                    <button class="w-32 h-11 rounded-lg font-bold bg-black bg-emphasis text-white cursor-pointer">
                        <a href="../views/painel.html">
                            Confirmar
                        </a>
                    </button>
                    <button id="cancelDelete" class="w-32 h-11 rounded-lg font-bold bg-trasparent text-font_color border border-emphasis cursor-pointer">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    $('body').prepend(element);

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

    setTimeout(() => {
        window.location.href = '/src/views/painel.html';
    }, 1000);
}

function remove_html_popup_alert(){
    $("#popupAlert").remove();
}

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
 *  CREATE LIST OF PARTICIPANTS
 * 
 */

function html_create_list_participants(participant) {
    let html = `
        <div class="flex justify-between pt-2 pr-5 pb-2">
            <div>
                <a href="./update.html">
                    ${participant.name}
                </a>
            </div>
            <div>
                <input type="checkbox" ${participant.presence ? "checked" : `presence='${participant.presence}'`} class="checkbox-custom">
            </div>
        </div>
    `;

    $("#listParticipants").append(html);
}
  
function create_list_participants(participants) {

    if(participants.length > 0) {
        $(".msg-no-participants").remove();
        participants.forEach(e => {
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
        created_at: new Date()
    };

    await saveParticipant(user);
}

async function saveParticipant(participant){
    if(!participant)return;

    if(!sessionStorage.getItem("participants")){
        sessionStorage.setItem("participants", JSON.stringify([participant]));
    } else {
        let participants = JSON.parse(sessionStorage.getItem("participants"));
        participants.unshift(participant);

        sessionStorage.setItem("participants", JSON.stringify(participants));

        window.location.href = '/views/painel.html';
    }
}

function getParticipant(){

    if(!sessionStorage.getItem("participants")){
        return null;
    } else {
        return JSON.parse(sessionStorage.getItem("participants"));
    }
}
  
$("#updatePerson").on('click', () => {
    html_loading();
});

$("#deletePerson").on('click', () => {
    html_popup_alert("Nome será deletado!!");
});

$("#registration").on('click', () => {
    if( validarNome($("#userName")) && validarData($("#userDateBirth")) && validarContato($("#userContact")) ){
        registration($("#userName").val(), $("#userDateBirth").val(), $("#userContact").val(), $("#presence").val(), $("#sortnumber").val())
    }
    
    
    

    // "./painel.html"
});

 	

$(document).ready(() => {
   create_list_participants(getParticipant());
});