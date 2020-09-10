#Web-Scrapping Reforma
def NotasReforma():
	import pandas as pd
	from datetime import date

	VerificarNulos()

	#GuardarUltimoFolio("2171511") 
	folio=ObtenerPrimerFolio()
	folioInt=int(folio)

	contadorNulos=0;
	flagFinal=0;
	i=1;
	folioTemp=folioInt;

	articulos={'Titulo':[],'Autor':[],'Referencia':[],'Texto':[],'link':[]}

	print("Ejecutando...")
	while flagFinal == 0:
		folioUrl=folioInt+i
		i=i+1
		url=CrearUrl(str(folioUrl))
		nota=DescargarNota(url)
		if nota["titulo"]=="None":
			contadorNulos=contadorNulos+1
			#print(contadorNulos)
			GuardarNulo(folioUrl)
		else:
			if nota["titulo"]!="Error de conexión":
				contadorNulos=0
				folioTemp=folioUrl
				articulos['Titulo'].append(nota["titulo"])
				articulos['Autor'].append(nota["autor"])
				articulos['Referencia'].append(nota["resumen"])
				articulos['Texto'].append(nota["contenido"])
				articulos['link'].append(url)
				#print (articulos)

		if contadorNulos>=50:
			flagFinal=1

		if nota["titulo"]=="Error de conexión":
			flagFinal=1;
			folioTemp=folioUrl-1

		print(nota["titulo"]+" -> "+nota["fechaSubida"]+" -> "+str(folioUrl))
		print(folioTemp)
		print("-------------------------------------------------------------------------------------------------")

	GuardarUltimoFolio(str(folioTemp))
	MemoriaNulos(folioTemp)
	df=pd.DataFrame(articulos)
	today = date.today()
	d1 = today.strftime("%d-%m-%Y")
	strEx='Historial/'+d1+'.xlsx'
	df.to_excel(strEx)
	return df

def VerificarNulos():
	import os
	print("Verificando...")
	listaNulos = open("folioNulos.bin", "r")
	lines = listaNulos.readlines()
	i=0
	contadorNulos=0
	for i in range(len(lines)):
		url=CrearUrl(lines[i])
		nota=DescargarNota(url)
		if nota["titulo"]!="None":
			print(nota["titulo"]+" -> "+nota["fechaSubida"]+" -> "+lines[i])
			contadorNulos=contadorNulos+1
	listaNulos.close()
	if contadorNulos==0:
		os.remove("folioNulos.bin")

def MemoriaNulos(folioTemp):
	listaNulos = open("folioNulos.bin", "r")
	lines = listaNulos.readlines()
	listaFinal=sorted(set(lines))
	listaNulos.close()

	listaNulos = open("folioNulos.bin", "w")
	i=0
	for i in range(len(listaFinal)):
		if folioTemp > int(listaFinal[i]):
			listaNulos.write(listaFinal[i])
	listaNulos.close()

def GuardarNulo(folio):
	f = open("folioNulos.bin", "a")
	f.write(str(folio)+"\n")
	f.close()

def CrearUrl(folio):
	url='https://www.reforma.com/libre/online07/aplicacionEI/webview/iWebView.aspx?Coleccion=1066&folio='+folio+'&TipoTrans=8'
	return url

def GuardarUltimoFolio(ultimoFolio):
	f = open("folio.bin", "w")
	f.write(ultimoFolio)
	f.close()

def ObtenerPrimerFolio():
	f = open("folio.bin", "r")
	folio=f.read()
	f.close()
	return folio

def DescargarNota(link):
	from bs4 import BeautifulSoup
	import requests
	import re

	try:
		source = requests.get(link).text
	except:
		nota = {
					"titulo": "Error de conexión",		
					"fechaSubida": "None",
					"resumen": "None",
					"autor": "None",
					"seccion": "None",
					"contenido": "None"
				}
		return nota

	soup = BeautifulSoup(source, 'html5lib')

	if soup.title.string == 'Grupo Reforma - PÃ¡gina No Encontrada':
		nota = {
					"titulo": "None",		
					"fechaSubida": "None",
					"resumen": "None",
					"autor": "None",
					"seccion": "None",
					"contenido": "None"
				}
		return nota
	else:
		patronFecha= re.compile(r'\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d')   
		patronSeccion= re.compile(r'var NombreSeccion = (.*);')     
		scripts = soup.find_all("script")
		try:
			fechaSubida=patronFecha.search(soup.text)
		except:
			print(link)
			fechaSubida="0000-00-00 00:00:00"
		finally:
			try:
				NombreSeccion=patronSeccion.search(soup.text)
				x = re.split("\s", NombreSeccion.group())
				tempSeccion=x[3].replace('\'','')
				NombreSeccion=tempSeccion.replace(';','')
				#print(NombreSeccion)
			except:
				NombreSeccion="None"
				#print("No Encontrada")
			finally:
				match = soup.find('div', id = 'divTituloNota')
				titulo =  match.text
				#print(titulo)

				match = soup.find('div', style = 'font-style:italic')
				resumen =  match.text
				#print(resumen)

				match = soup.find('div', class_ = 'autor')
				autor =  match.text
				#print(autor)

				contenido=""
				for match in soup.find_all('p'):
					contenido =  contenido+match.text
				#print(contenido)
				try:
					nota = {
						"titulo": titulo,		
						"fechaSubida": fechaSubida.group(),
						"resumen": resumen,
						"autor": autor,
						"seccion": NombreSeccion,
						"contenido": contenido
					}
				except:
					print(link)
					nota = {
						"titulo": titulo,		
						"fechaSubida": "0000-00-00 00:00:00",
						"resumen": resumen,
						"autor": autor,
						"seccion": NombreSeccion,
						"contenido": contenido
					}
				finally:
					return nota
