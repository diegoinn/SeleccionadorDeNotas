var paginasvertical = new function() {
    this.seccion = "";
	this.fecha = "";
	this.xml = "";
	this.pagina="";
	this.lista = [];
	
    //METODOS PUBLICOS
	this.init = function(_fecha,_seccion) {		    
	    //this.xml=PathCDNLibre + _fecha + "/secciones/" + _seccion.toUpperCase() + ".XML"; 	    
	    this.xml=PathXMLLibre + _fecha + "/secciones/" + _seccion.toUpperCase() + ".XML"; 	
	    paginasvertical.fecha = _fecha;
		paginasvertical.seccion = _seccion;		
				
		if(paginasvertical.lista.length==0 || paginasvertical.lista.length==null)
		{			        		    
		    paginasvertical.lista = [];							
		    cargarXML();		
		}
		else
		{		  
            AsignaSrcIframe();
		}
	};
	
	//METODOS PRIVADOS
	function cargarXML() {		    
		var xmlDoc=loadXMLDoc(paginasvertical.xml);  
	    prepararFecha(xmlDoc);  
	};
	
	function prepararFecha(_xml) {		  	
		$xml = $(_xml);
		$paginas = $xml.find("pag");		
		$paginas.each(function(_indice){		    
		    var _auxPagina = $(this);	    		    

			var _auxNombre = $.trim(_auxPagina.attr("nombre").toLowerCase());									
				var o = {fecha: paginasvertical.fecha
					, indice: _indice
					, nombre: $.trim(_auxPagina.attr("nombre").toLowerCase())
					, directorio: paginasvertical.seccion
					, numero: $.trim(_auxPagina.attr("num").toUpperCase())
					, tabloide: false
					, mapeo:[]
					, notas:[]
				};	
				
				var $notas = _auxPagina.find("nota");
				    $notas.each(function(_indicenota){				    
				    var _auxNota=$(this);
				    _idcoleccion=_auxNota.attr("idcoleccion");
				    _folio=_auxNota.attr("folio");
				    _paginacms=_auxNota.attr("paginacms");
				    _grupocms=_auxNota.attr("grupocms");
				    _ideditorial = _auxNota.attr("ideditorial");
				    _urlanuncio = _auxNota.attr("urlanuncio");	
				    _cms = _auxNota.attr("cms");		
				    _urlVideo = _auxNota.find("urlVideo").text();		 	    
				   
				   var n={
				        idcoleccion:_idcoleccion
				        ,idfolio:_folio
				        ,paginacms:_paginacms
				        ,grupocms:_grupocms
				        ,ideditorial:_ideditorial
				        ,urlanuncio:_urlanuncio
				        ,cms:_cms
				        ,urlVideo:_urlVideo
				   };
				   
				   		   
				   	    var $mapeos = _auxNota.find("mapeo");
				   	    var ContMarcas=0;
				   	    var IdPaqueteAnt=0;
				        $mapeos.each(function(_indicemap){ 	
				            var _auxMapeo=$(this);
				            var m={
				                idPaquete:_auxMapeo.find("idPaquete").text()
				                ,idObjeto:_auxMapeo.find("idObjeto").text()
				                ,mapeoX:_auxMapeo.find("mapeoX").text()
				                ,mapeoY:_auxMapeo.find("mapeoY").text()
				                ,mapeoWidth:_auxMapeo.find("mapeoWidth").text()
				                ,mapeoHeight:_auxMapeo.find("mapeoHeight").text()
				                ,estilosObjetos:_auxMapeo.find("estilosObjetos").text()
				                ,tipoElemento:_auxMapeo.find("tipoElemento").text()
				                ,tipoObjeto:_auxMapeo.find("tipoObjeto").text()
				                ,marcaX:_auxMapeo.find("MarcaX").text()
				                ,marcaY:_auxMapeo.find("MarcaY").text()
				                ,idfolio:_folio
				                ,idcoleccion:_idcoleccion
				                ,paginacms:_paginacms
				                ,grupocms:_grupocms
				                ,ideditorial:_ideditorial
				                ,urlanuncio:_urlanuncio
				                ,idNota:_indicenota
				                ,cms:_cms
				                ,marcaXVideo:_auxMapeo.find("MarcaXVideo").text()
				                ,marcaYVideo:_auxMapeo.find("MarcaYVideo").text()
				            };    				    
				            o.mapeo.push(m);
				            if(m.marcaX!="" && m.marcaY!="" )
				            {
				                ContMarcas+=1;
				            }
				            IdPaqueteAnt=m.idPaquete;
				        });
				    
				    if(ContMarcas>0)
				    {				    
				        o.notas.push(n);
				    }
				    else
				    {
				        if(n.idfolio!="0" || n.ideditorial!="0" || n.urlanuncio!="" || n.urlVideo!="")
				        {
				            o.notas.push(n);
				        }
				        else
				        {
				            n.paginacms=0;
				            n.grupocms=0;
				            o.notas.push(n);
				            for(l=0;l<o.mapeo.length;l++)
				            {
				                if(o.mapeo[l].idPaquete==IdPaqueteAnt) 
				                {   
				                    o.mapeo[l].idPaquete="";
				                }
				            }
				        }
				    }
				});										
				paginasvertical.lista.push(o);							
		});		
		AsignaSrcIframe();
	};
};

//ParametroAlto      = 456.75;
//ParametroAncho     = 255;
ParametroAlto      = 427.05;
ParametroAncho     = 238.5;
ParametroLeft     = 0;
ParametroTop       = 0;

var Fecha=Get_Cookie('EdImp_Fecha');
var Seccion = Get_Cookie('EdImp_Seccion');
var Posicion= parseInt(Get_Cookie('EdImp_Posicion'));

var Mapeos    = null;
var Pagina    = null;
var UrlImagen = null;

var IdSombraActiva=new Array();

//--------------------------------------------------
function QuitaSombraMapeo(IdPaquete)
{
    try
    {
        for (iLenght = 0; iLenght < MatrizDeNotasLenght; iLenght++)
            {
                if (MatrizDeNotas[iLenght].IdPaquete == IdPaquete)
                    $('#divSombraNota' + MatrizDeNotas[iLenght].IdPaquete + iLenght).css({ opacity: 0.0});
            }
    }
    catch(e){}
}

//--------------------------------------------------
function PonSombraMapeo(IdPaquete)
{
    try
    {    
        for (iLenght = 0; iLenght < MatrizDeNotasLenght; iLenght++)
            {
                if (MatrizDeNotas[iLenght].IdPaquete == IdPaquete)
                    $('#divSombraNota' + MatrizDeNotas[iLenght].IdPaquete + iLenght).css({ opacity: 0.4 });
            }
    }
    catch(e){}
}
//--------------------------------------------------
// Declaración de Matriz y funciones miembro para usarla
var MatrizDeNotas       = new Array(12); // 0:IdNota 1:X1 2:Y1 3:X2 4:Y2
var MatrizDeNotasLenght = 0; 
function MatrizDeNota_Add(idNota,IdPaquete, X1, Y1, X2, Y2,nomPagina,paginacms, grupocms,coleccion,folio,ideditorial,urlanuncio)
{
    this.IdNota=idNota;
    this.IdPaquete = IdPaquete;
    this.X1     = X1;
    this.Y1     = Y1;
    this.X2     = X2;
    this.Y2     = Y2;
    this.Pagina = nomPagina;
    this.paginacms = paginacms;
    this.grupocms = grupocms;     
    this.coleccion = coleccion;
    this.folio = folio;
    this.ideditorial = ideditorial;
    this.urlanuncio = urlanuncio;    
}

function AbreNota(idNota,idElemento,Siguiente)
{   
    try
    {
        if(paginasvertical.lista[Posicion].notas.length>0)
        {
            var paginacms=paginasvertical.lista[Posicion].notas[idNota].paginacms;
            var grupocms=paginasvertical.lista[Posicion].notas[idNota].grupocms;
            var folio=paginasvertical.lista[Posicion].notas[idNota].idfolio;
            var coleccion=paginasvertical.lista[Posicion].notas[idNota].idcoleccion;
            var ideditorial=paginasvertical.lista[Posicion].notas[idNota].ideditorial;
            var urlanuncio=paginasvertical.lista[Posicion].notas[idNota].urlanuncio;  
            var nombrepagina=paginasvertical.lista[Posicion].notas[idNota].Pagina;     
            var cms=paginasvertical.lista[Posicion].notas[idNota].cms;
            var Rediseño="";
            var urlVideo=paginasvertical.lista[Posicion].notas[idNota].urlVideo;  
            
            if(cms!=null && cms=="1")
            {
                Rediseño="cms=1&";
            }            
                                      
            if(urlVideo!="" || urlanuncio!="" || folio>0 || ideditorial>0 || (paginacms>0 && grupocms>0) )
            {		                                 
                parent.parent.ModalAbierto=false;
                parent.parent.ResizeModal();

                    //  Falta evaluar editoriales y cuando son galerías directas o links del webview 
                    Delete_Cookie('EdImp_Posicion');
                    SetCookie('EdImp_Posicion',idElemento,null);           
                    var myUrl=""
                    
                    if(urlanuncio!="")
                    {    
                        if(urlanuncio.indexOf("print_web")<0)
                        {
                            pos = urlanuncio.indexOf("edimpinteractiva");
                            var urlanuncioParte1=urlanuncio.substr(0,pos+17);
                            var urlanuncioParte2=urlanuncio.substr(pos+17);
                            urlanuncio=urlanuncioParte1+"print_web/"+urlanuncioParte2;                        
                        }
                        myUrl=urlanuncio;
                        
                    }
                    else if(ideditorial!="" && ideditorial!="0" && ideditorial!=null && ideditorial!="undefined")
                    {   
                        
                        if(Seccion=="primera" || Seccion=='editoriales')
                        {
                            seccion_paso="nacional";
                        }
                        else
                        {
                            seccion_paso=Seccion;
                        }                        
                        myUrl=urlBaseAbsoluto + "aplicacionEI/webview/iWebView.aspx?" + Rediseño + "Seccion=" + seccion_paso + "&Id=" + ideditorial + "&Coleccion=" + coleccion + "&folio="+ folio ;               
                        
                        if((document.domain=="localhost" || document.domain=="prueba.agenciareforma.com") && urlanuncio=="")
                        {
                            myUrl=UrlWebView + "iWebView.aspx?" + Rediseño + "Seccion=" + seccion_paso + "&Id=" + ideditorial + "&Coleccion=" + coleccion + "&folio="+ folio ;               
                        }
                    }
                    else if(grupocms!="" && paginacms!="")
                    {                        
                        myUrl=urlBaseAbsoluto + "aplicacionEI/webview/iWebView.aspx?" + Rediseño + "Pagina=" + paginacms + "&Grupo=" + grupocms + "&Coleccion=" + coleccion + "&folio="+ folio ;               
                        if((document.domain=="localhost" || document.domain=="prueba.agenciareforma.com") && urlanuncio=="")
                        {
                            myUrl=UrlWebView + "iWebView.aspx?" + Rediseño + "Pagina=" + paginacms + "&Grupo=" + grupocms + "&Coleccion=" + coleccion + "&folio="+ folio ;               
                        }
                    }
                    
                    
                    if(urlVideo!="") 
                    {       
                        urlVideo=urlVideo.replace("iw=700","iw=580");
                        urlVideo=urlVideo.replace("ih=700","ih=450");                 
                        urlVideo=urlVideo.replace("tvm=2","tvm=3");     
                        myUrl=myUrl + "&urlVideo=" + encodeURIComponent(urlVideo);
                        
                    } 
                    
                    var myIframe=document.getElementById("frmHerramientas");
                                        
                    if(myUrl.indexOf("localhost")<0)
                    {
                        myUrl=myUrl.replace("http://",Protocolo);
                        if(Protocolo=="https://")
                        {
                            myUrl=myUrl+"&pr=1";        
                        } 
                    }                                        
                    myIframe.src=myUrl;   
                
                    //Primero revisamos si hay alguna otra nota activa de alguna pagina anterior para ocultarla
                    if(IdSombraActiva.length>0)
                    {
                        for(m=0;m<IdSombraActiva.length;m++)
                        {
                            $('#' + IdSombraActiva[m]).css({ opacity: 0.0});
                        }
                    }
                    //PINTA NOTA ACTIVA    
                    var contMapeosActivos=0;            
                    for (iLenght = 0; iLenght < MatrizDeNotasLenght; iLenght++)
                    {
                        if (MatrizDeNotas[iLenght].IdNota == idNota)
                        {
                            $('#divSombraActiva' + MatrizDeNotas[iLenght].IdPaquete + iLenght).css({ opacity: 0.6 });
                            IdSombraActiva[contMapeosActivos]='divSombraActiva' + MatrizDeNotas[iLenght].IdPaquete + iLenght;
                            contMapeosActivos+=1;
                        }
                        else
                        {
                            $('#divSombraActiva' + MatrizDeNotas[iLenght].IdPaquete + iLenght).css({ opacity: 0.0});
                        }
                    }   
            }
            else
            {        
                if(Siguiente==-1)
                {
                    ArtAnterior();
                }
                else
                {                
                    ArtSiguiente();
                }    
            }
        }
    }
    catch(e){}

}
//--------------------------------------------------
// Asignando colores diferentes para cada nota
var Colores              = new Array();
var ColorAsignado_Id     = new Array();
var ColorAsignado_Color  = new Array();

Colores[ 0] = "Black";
Colores[ 1] = "Black";
Colores[ 2] = "Black";
Colores[ 3] = "Black";
Colores[ 4] = "Black";
Colores[ 5] = "Black";
Colores[ 6] = "Black";
Colores[ 7] = "Black";
Colores[ 8] = "Black";
Colores[ 9] = "Black";
Colores[10] = "Black";

function DevolverColorParaNota(IdPaquete)
{
    try
    {
        var IndexColor = 0;
        for(iCounter = 0; iCounter < ColorAsignado_Id.length; iCounter++)
            {
                if (ColorAsignado_Id[iCounter] == IdPaquete)
                    {
                        return ColorAsignado_Color[iCounter];
                    }
            }    
        //Entonces no se había asignado un color para ese IdNota
        IndexColor = ColorAsignado_Color.length;
        //Esto es para ciclar los colores del arreglo, lo que significa que al menos se podrán pintar unas 60 notas diferentes
        if (IndexColor >= Colores.length) IndexColor = IndexColor - Colores.length;
        if (IndexColor >= Colores.length) IndexColor = IndexColor - Colores.length;
        if (IndexColor >= Colores.length) IndexColor = IndexColor - Colores.length;
        if (IndexColor >= Colores.length) IndexColor = IndexColor - Colores.length;
        if (IndexColor >= Colores.length) IndexColor = IndexColor - Colores.length;
        ColorAsignado_Id   [ColorAsignado_Color.length] = IdPaquete;
        ColorAsignado_Color[ColorAsignado_Color.length] = Colores[IndexColor];
        return Colores[IndexColor];
    }
    catch(e){}
}


function AsignaSrcIframe()
{
    try{                       
        RevisaMapeoVertical();                   
	
       var IdNota=0;       
        if(Get_Cookie("EdImp_Cms")!=null && Get_Cookie("EdImp_Cms")!="")
       {      
            var arrayCms=Get_Cookie("EdImp_Cms").split(',');
            var totalgrupos= arrayCms.length;        
            if(arrayCms[0]!="") IdNota=parseInt(arrayCms[0]);   
            
            Delete_Cookie('EdImp_Cms'); 
            SetCookie('EdImp_Cms',"",null);  
       }           
      AbreNota(IdNota,Posicion);
      
    }
    catch(e){    
        
        parent.parent.ModalAbierto=true;
        parent.parent.ResizeModal();	// Esta funciona está en jsPagina.js que es el padre del modal donde esta el visornotas.html                
    }
}

function RevisaMapeoVertical()
{   
    try
    {
        Posicion=Get_Cookie('EdImp_Posicion');
	    MatrizDeNotasLenght = 0;
        var nombrepagina="";     
        var img=document.getElementById("imgFoto"+Posicion);
        
        if(img!=null)
        {                
            posnombre=	img.src.indexOf('interactiva/');        
	        if(posnombre>0)
	        {
	            nombrepagina=img.src.substr(posnombre+12).replace(".JPG","");	        
	        }	    
        }    
//        if(img.offsetHeight<300)
//        {
//            //ParametroAlto=294;  //Tamaño Suplemento
//            ParametroAlto=274.94;  //Tamaño Suplemento
//        }
//        else
//        {
//            //ParametroAlto=456.75;//Tamaño normal
//            ParametroAlto=427.05;//Tamaño normal
//        }
        var alto= img.attributes.getNamedItem("altojpg").value;        
        var ancho= img.attributes.getNamedItem("anchojpg").value; 
        ParametroAlto=alto*.45;
        ParametroAncho=ancho*.45;
        
        PreparaMapeo(ParametroAncho,ParametroAlto,nombrepagina,Posicion,ParametroLeft,ParametroTop);     
    }
    catch(e){}
}

function PreparaMapeo(ParametroAncho,ParametroAlto,ParametroPagina,idElemento,imgLeft,imgTop)
{ 
    try
    {           
        //Aqui se pone la imagen, con las notas resaltadas de colores        
        Mapeos    = null;
        Pagina    = null;
        UrlImagen = null;        
        for(p=0;p<paginasvertical.lista.length;p++)
        {        
            if(paginasvertical.lista[p].nombre.toUpperCase()==ParametroPagina.toUpperCase())
            {  
                
                for(m=0;m<paginasvertical.lista[p].mapeo.length;m++)
                {
                    mapeoX       = '';
                    mapeoY       = '';
                    mapeoWidth   = '';
                    mapeoHeight  = '';
                    idPaquete       = '';
                    tipoElemento = '';
                    mapeoPagina  = '';
                    paginacms    = '';
                    grupocms     = '';
                    coleccion    = '';
                    folio        = '';
                    ideditorial  = '';
                    urlanuncio   = '';
                    idNota       = '';
                    
                    mapeoX = paginasvertical.lista[p].mapeo[m].mapeoX;                
                    mapeoY = paginasvertical.lista[p].mapeo[m].mapeoY;
                    mapeoWidth   = paginasvertical.lista[p].mapeo[m].mapeoWidth;
                    mapeoHeight  = paginasvertical.lista[p].mapeo[m].mapeoHeight;
                    idPaquete=paginasvertical.lista[p].mapeo[m].idPaquete;
                    tipoElemento = paginasvertical.lista[p].mapeo[m].tipoElemento;
                    mapeoPagina=ParametroPagina;   
                    paginacms = paginasvertical.lista[p].mapeo[m].paginacms;
                    grupocms = paginasvertical.lista[p].mapeo[m].grupocms;
                    coleccion = paginasvertical.lista[p].mapeo[m].idcoleccion;
                    folio = paginasvertical.lista[p].mapeo[m].idfolio;
                    ideditorial = paginasvertical.lista[p].mapeo[m].ideditorial;
                    urlanuncio=paginasvertical.lista[p].mapeo[m].urlanuncio;
                    idNota=paginasvertical.lista[p].mapeo[m].idNota;

                    if (mapeoX != '' && mapeoY != '' && mapeoWidth != '' && mapeoHeight != '' && idPaquete != '' )                                            
                        MatrizDeNotas[MatrizDeNotasLenght++] = new MatrizDeNota_Add(idNota,idPaquete, mapeoX, mapeoY, mapeoWidth, mapeoHeight,mapeoPagina,paginacms,grupocms,coleccion,folio,ideditorial,urlanuncio);
                }
                break;
            }
        }         
        Mapea(ParametroAncho,ParametroAlto,ParametroPagina,idElemento,imgLeft,imgTop);	
    }
    catch(e){}
}

function Mapea(ParametroAncho,ParametroAlto,ParametroPagina,idElemento,imgLeft,imgTop)
{
    try
    {       
        var div=document.getElementById("divMapeo"+idElemento);
        var superDiv="";
        div.innerHTML=superDiv;       
        if(div!=null)
        {
            
            //Factores de Corrección para mejorar dibujado
            FactorAncho = 0.010;
            FactorAlto  = 0.005;

            //Dibujando las sombras azules             
            for (iLenght = 0; iLenght < MatrizDeNotasLenght; iLenght++)
                {                        
                    if(MatrizDeNotas[iLenght].Pagina==ParametroPagina)
                    {
                            superDiv+="<div onclick=\"javascript:AbreNota("+ MatrizDeNotas[iLenght].IdNota + "," + idElemento +");\" id=\"divSombraNota" + MatrizDeNotas[iLenght].IdPaquete + iLenght + "\"";
                            superDiv +="onmouseover=\"javascript:PonSombraMapeo('" + MatrizDeNotas[iLenght].IdPaquete + "');\"";
                            superDiv +="onmouseout =\"javascript:QuitaSombraMapeo('" + MatrizDeNotas[iLenght].IdPaquete + "');\" style=\"cursor:pointer;left:";
                            superDiv +=(MatrizDeNotas[iLenght].X1 * ParametroAncho + ParametroAncho * FactorAncho).toFixed(0) + "px; top:";
                            superDiv +=(MatrizDeNotas[iLenght].Y1 * ParametroAlto  + ParametroAlto  * FactorAlto ).toFixed(0) + "px; width:";               
                            superDiv +=(MatrizDeNotas[iLenght].X2 * ParametroAncho + ParametroAncho * FactorAncho).toFixed(0) + "px; height:";
                            superDiv +=(MatrizDeNotas[iLenght].Y2 * ParametroAlto  + ParametroAlto  * FactorAlto ).toFixed(0) + "px; ";
                            superDiv +="position:absolute; background-color:" + DevolverColorParaNota(MatrizDeNotas[iLenght].IdPaquete) + "; z-index:500; -moz-opacity:0.0; opacity:0.00; filter:alpha(opacity=00); display:inline;\"></div>";   
                            
                            superDiv+="<div onclick=\"javascript:AbreNota("+ MatrizDeNotas[iLenght].IdNota + "," + idElemento +");\" id=\"divSombraActiva" + MatrizDeNotas[iLenght].IdPaquete + iLenght + "\"";                        
                            superDiv +=" style=\"cursor:pointer;left:";
                            superDiv +=(MatrizDeNotas[iLenght].X1 * ParametroAncho + ParametroAncho * FactorAncho).toFixed(0) + "px; top:";
                            superDiv +=(MatrizDeNotas[iLenght].Y1 * ParametroAlto  + ParametroAlto  * FactorAlto ).toFixed(0) + "px; width:";               
                            superDiv +=(MatrizDeNotas[iLenght].X2 * ParametroAncho + ParametroAncho * FactorAncho).toFixed(0) + "px; height:";
                            superDiv +=(MatrizDeNotas[iLenght].Y2 * ParametroAlto  + ParametroAlto  * FactorAlto ).toFixed(0) + "px; ";
                            superDiv +="position:absolute; background-color:" + DevolverColorParaNota(MatrizDeNotas[iLenght].IdPaquete) + "; z-index:499; -moz-opacity:0.0; opacity:0.00; filter:alpha(opacity=00); display:inline;\"></div>";       
                    }
                }        
            div.innerHTML=superDiv;               
            div.style.left=imgLeft-3 + "px";
            div.style.top=imgTop-2 + "px";                 
        }    
    }
    catch(e){}
} 


