window.onload=function (){
    let videoElement=document.querySelector("#camara");
    let takePhotoButton=document.querySelector("#take-photo");
    let clearPhotoButton=document.querySelector("#clear-photo");
    let photoGalery=document.querySelector("#photo-galery");

    //Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia({video:true})
        .then(stream=>{
            videoElement.srcObject=stream;
    })
        .catch(error=>{
            console.log("Error al acceder a la camara" + error);
        })
    //declaramos un contador de fotos para generar un id y poder borrar o descargar
    let photoIdCounter=getNextPhotoId(); //Una funcion.

    //¿Que pasa si le das click al boton tomar foto? =>
    takePhotoButton.addEventListener("click", ()=>{
        //crear un canvas para tomar la captura
        //se necesita identificar el ancho y alto de lo que va capturar

        const canvas=document.createElement("canvas");
        canvas.width=videoElement.videoWidth; //tomamos el ancho de que se transmite en la camara
        canvas.height=videoElement.videoHeight; // tomamos el alto de lo que se transmite en la camara
        const contex=canvas.getContext("2d");
        //dibujar con todos estos datos....
        contex.drawImage(videoElement,0,0,canvas.width,canvas.height);

        //convertir en una imagen a base 64 y guardarla en el navegador
        const dataUrl=canvas.toDataURL("image/jpeg",0.90);//convierte la imagen a un 90% de nitidez
        const photoId=photoIdCounter++;
        guardarFoto({id:photoId,dataUrl});//llama a la funcion guardar foto y le pasa como parametros la foto
        //enviamos al local storage a guardar la foto--funcion
        setNextPhotoId(photoIdCounter);
    });


    function guardarFoto(photo, isFromLoad=false){
        //crear un contenedor donde guardar la foto
        const photoContainer=document.createElement("div");
        photoContainer.className="photo-container";
        photoContainer.dataset.id=photo.id;

        //crear la imagen
        const img=new Image();//La imagen como objeto
        img.src=photo.dataUrl;
        img.className="photo";
        //como cada foto tiene sus botones de descargar o eliminar se crean junto con la foto
        const buttonContainer=document.createElement("div");
        buttonContainer.className="photo-buttons";

        //creamos el boton de eliminar
        const deleteButton=document.createElement("button");
        deleteButton.classList.add("delete-photo");
        deleteButton.textContent="Eliminar";
        deleteButton.addEventListener("click",()=>{
            eliminarPhoto(photo.id);//nos identifica con la id la photo a eliminar
        });

        //crear el boton de descargar la foto
        const downloadPhoto=document.createElement("button");
        downloadPhoto.classList.add("download-photo");
        downloadPhoto.textContent="Descargar";
        downloadPhoto.addEventListener("click",()=>{
            descargarPhoto(photo.dataUrl,`foto-${photo.id}.jpg`);
        })

        buttonContainer.appendChild(downloadPhoto);
        buttonContainer.appendChild(deleteButton);
        photoContainer.appendChild(img);
        photoContainer.appendChild(buttonContainer);
        photoGalery.appendChild(photoContainer);

        //guardar la photo en el almacenamiento local
        //hacemos un condicional para que no dupliquen las fotos
        if (!isFromLoad) {// si es true es que se tiene cargado ya del localStorage
            const fotos = JSON.parse(localStorage.getItem("fotos")) || [];
            fotos.push(photo);
            localStorage.setItem("fotos", JSON.stringify(fotos));
        }

    }
    function eliminarPhoto(id){
        //eliminar photo del DOM
        //dejarlo de mostrar
        const photoContainer=document.querySelector(`.photo-container[data-id="${id}"]`);
        if (photoContainer){
            photoGalery.removeChild(photoContainer);
        }
        //eliminarlo del localStorage
        let fotos=JSON.parse(localStorage.getItem("fotos")) || [];
        fotos=fotos.filter(photo=>photo.id !== id);
        localStorage.setItem("fotos",JSON.stringify(fotos));
    }


/*
* Funcion para crear un tipo link en el body y ejecutarlo para descargar la foto solicitada.
* */
    function descargarPhoto(dataUrl,nombreArchivo){
        const a=document.createElement("a");
        a.href=dataUrl; //crea un link
        a.download=nombreArchivo; //tipo download
        document.body.appendChild(a); //lo termina de crear
        a.click(); //como si el usuario pulsara clic
        document.body.removeChild(a); //lo elimina

    }
/*
* Activar el evento para que cuando se pulse clic sobre borrar todas las fotos, se eliminen todas
* */

    clearPhotoButton.addEventListener("click",()=>{
        localStorage.removeItem("fotos");
        while (photoGalery.firstChild){
            photoGalery.removeChild(photoGalery.firstChild);
        }
        photoIdCounter=0;
        setNextPhotoId(photoIdCounter);
    })

    //cargar las fotos guardadas al iniciar la aplicacion
    const fotosGuardadas=JSON.parse(localStorage.getItem("fotos")) || [];
    fotosGuardadas.forEach(photo=>{
        guardarFoto(photo,true); //para evitar duplicacion de las fotos
    })

    //obtiene  el valor en el localStorage con el nuevo valor convertido
    function getNextPhotoId(){
    return parseInt(localStorage.getItem("photoIdCounter")) || 0;

    }
    //asigna el valor en el localStorage con la nueva cadena
    function setNextPhotoId(id){
        localStorage.setItem("photoIdCounter", id.toString());
    }

}