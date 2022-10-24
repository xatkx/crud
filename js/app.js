// inputs
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//==
const form = document.querySelector('#nueva-cita');
const contentCitas = document.querySelector('#citas');

//ddbb
let DB;
// handlers
handlers()
function handlers() {
    // init 

    document.addEventListener('DOMContentLoaded', () => {
  
        //creando base de datos
        createDDBB()
    })

    // handlers de los inputs del formulario 
    mascotaInput.addEventListener('change', validated)
    propietarioInput.addEventListener('change', validated)
    telefonoInput.addEventListener('change', validated)
    fechaInput.addEventListener('change', validated)
    horaInput.addEventListener('change', validated)
    sintomasInput.addEventListener('change', validated)

    // form 

    form.addEventListener('submit', formulario)

    //
}
// classes

class UI {
    printAlert(msj, type){
        const div = document.createElement('div');
        div.classList.add('alert','col-12','d-flex','justify-content-center','fixeddd')

        if(type == 'err')
        {
            div.classList.add('alert-danger')
        } else if (type == 'win')
        {
            div.classList.add('alert-success')
        } else if (type == 'info')
        {
            div.classList.add('alert-secondary')
        }

        div.textContent = msj;

    
        document.querySelector('#contenido').insertBefore(div, document.querySelector('.agregar-cita'))

        setTimeout(() => div.remove(),3000)
    }

    printCitas(citas){
        this.refresCitas()
        citas.forEach( cita => {
            const newCitas = this.renderCitas(cita);
            contentCitas.appendChild(newCitas);
        })
    }

    refresCitas(){
        while(contentCitas.firstChild)
        {
            contentCitas.firstChild.remove()
        }
    }
    renderCitas(citas){
        const { mascota, propietario, telefono, fecha, hora, sintomas, data_id } = citas;

        const div = document.createElement('div');
        div.classList.add('cita','p-2');
        div.setAttribute('data-id',data_id);

        const mascotaP = document.createElement('h2');
        mascotaP.classList.add('çard-title','font-weight-bolder')
        mascotaP.textContent = mascota;

        const propiedadP = document.createElement('p');
        
        propiedadP.innerHTML = `
        <span class='bold'> Propietrario </span>${propietario}
        
        `;

        const telefonoP = document.createElement('p');
        
        telefonoP.innerHTML = `
        <span class='bold'> Telefono </span>${telefono}
        
        `;

        const fechaP = document.createElement('p');
        fechaP.innerHTML = `
        <span class='bold'> Fecha </span>${fecha}
        
        `;

        const horaP = document.createElement('p');
        horaP.innerHTML = `
        <span class='bold'> Hora </span>${hora}
        
        `

        const sintomasP = document.createElement('p');
        
        sintomasP.innerHTML = `
        <span class='bold'> Sintomas </span>${sintomas}
        `;

        const btnDel = document.createElement('button');
        btnDel.classList.add('btn','btn-danger','mr-5');
        btnDel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      `
      btnDel.onclick = () => deleteCita(data_id);

        const btnEdit = document.createElement('button');
        btnEdit.classList.add('btn','btn-info');
        btnEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
      `
      btnEdit.onclick = () => EditCitas(citas)

        div.appendChild(mascotaP);
        div.appendChild(propiedadP);
        div.appendChild(telefonoP);
        div.appendChild(fechaP);
        div.appendChild(horaP);
        div.appendChild(sintomasP);
        div.appendChild(btnDel);
        div.appendChild(btnEdit);


        return div;
    }

}
class Citas {
    constructor()
    {
        this.Colletors = [];
    }

    getCitas(){
        return this.Colletors;
    }

    setCitas(cita) {
        this.Colletors = [...this.Colletors,cita];
    }

    delCita(id){
        this.Colletors = this.Colletors.filter( cita => cita.data_id != id);
    }
    updateCita(editada){
        this.Colletors.forEach( cita => {
            if(cita.data_id === editada.data_id)
            {
               cita = editada
            }
        })
    }
}

/// init classs

const ui = new UI();
const veterinaria = new Citas()
// objs
let citaObjs = {
        mascota: '',
        propietario: '',
        telefono: 0,
        fecha: '',
        hora: '',
        sintomas: '',
    }


// global var
let modeEdit = false;
//funtion

function validated(e) {
    const input = e.target.value;
    if(e.target.getAttribute('id') == 'mascota')
    {
        citaObjs.mascota = input;
    } 
    else if(e.target.getAttribute('id') == 'propietario')
    {
        citaObjs.propietario = input;
    }
    else if(e.target.getAttribute('id') == 'telefono')
    {
        citaObjs.telefono = input;
    }
    else if(e.target.getAttribute('id') == 'fecha')
    {
        citaObjs.fecha = input;
    }
    else if(e.target.getAttribute('id') == 'hora')
    {
        citaObjs.hora = input;
    }
    else if(e.target.getAttribute('id') == 'sintomas')
    {
        citaObjs.sintomas = input;
    }

    

    

}

function formulario(e){
    e.preventDefault()

    for (const propiedad in citaObjs) {
        if( citaObjs[propiedad] == '')
        {  
            ui.printAlert('todos los campos son necesarios','err')
            return;
        }
    }

    if(modeEdit)
    {


        veterinaria.updateCita({...citaObjs})

        form.querySelector('button[type=submit]').textContent = 'Crear Citas';
        form.querySelector('button[type=submit]').classList.remove('btn-primary');
        form.querySelector('button[type=submit]').classList.add('btn-success');
        modeEdit = false;
    } else {

        citaObjs.data_id = Date.now();
        const obj = {...citaObjs}
        veterinaria.setCitas(obj)
    }

     

    ui.printCitas(veterinaria.getCitas())

    form.reset()
    resetObjGlobal()
}

function resetObjGlobal(){
    citaObjs = {
        mascota: '',
        propietario: '',
        telefono: 0,
        fecha: '',
        hora: '',
        sintomas: ''
    }
}

function deleteCita(id){
    veterinaria.delCita(id)
    ui.printCitas(veterinaria.getCitas())

    ui.printAlert('Cita delete','info')
}

function EditCitas(citas) {
    const { mascota, propietario, telefono, hora, fecha, sintomas } = citas
    modeEdit = true
    citaObjs = citas;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    horaInput.value = hora;
    fechaInput.value = fecha;
    sintomasInput.value = sintomas;

// editar boton submit
    form.querySelector('button[type=submit]').textContent = 'GUARDAR';
    form.querySelector('button[type=submit]').classList.add('btn-primary');
    form.querySelector('button[type=submit]').classList.remove('btn-success');

}

function createDDBB(){
    const CitasDB = indexedDB.open('CitasDB',1);
// si hay errores
    CitasDB.onerror = e => console.log(e.target.result.error)
// si todo sale bien
    CitasDB.onsuccess = e => {
        console.log(CitasDB.result)
    };

// sett 
    CitasDB.onupgradeneeded = e => {
        const DB = e.target.result;
        const createObjsstore = DB.createObjectStore('Citas',{ keyPath: 'citas', autoIncrement: true});

        createObjsstore.createIndex('mascota','mascota',{unique: false});
        createObjsstore.createIndex('propietario','propietario',{unique: false});
        createObjsstore.createIndex('telefono','telefono',{unique: false});
        createObjsstore.createIndex('fecha','fecha',{unique: false});
        createObjsstore.createIndex('hora','hora',{unique: false});
        createObjsstore.createIndex('sintomas','sintomas',{unique: false});
        console.log('obj create finish :) ');
    } 

}