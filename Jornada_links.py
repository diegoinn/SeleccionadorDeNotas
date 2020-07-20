import datetime
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
def ObtenLinksDiarios():
	#Esta funcion va a regresar una lista de los links de las notas del dia


	secciones=['edito','opinion','correo','politica','economia','mundo','estados','capital','ciencias','cultura','espectaculos','deportes']
	links =list()
	#variable fecha
	ahora = str(datetime.datetime.now())
	datosahora = ahora.split()
	fecha = datosahora[0].split('-')
	dia = fecha[2]
	mes = fecha[1]
	year = fecha[0]
	#request por seccion del dia
	for i in range(len(secciones)) :
	    urldia = 'https://www.jornada.com.mx/'+ year+'/'+mes+'/'+dia
	    url = urldia+'/'+secciones[i]
	    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})

	    web_byte = urlopen(req).read()
	    webpage = web_byte.decode('utf-8')

	    soup = BeautifulSoup(webpage, 'html.parser')

	    # Retrieve all of the anchor tags
	    tags = soup('a')
	    for tag in tags:
	        tagstring = str(tag.get('href', None))
	        if not tagstring.startswith(secciones[i]): continue
	        link = urldia+'/'+tagstring
	        links.append(link)
			
	return links
