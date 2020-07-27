from bs4 import BeautifulSoup
import requests
import pandas as pd

def DescargaNotas(links):
	#esta regresa una tabla de panadas con todos los articulos que se pasen en un arreglo
	#Titulo,autor,fecha,Articulo
	articulos={'Titulo':[],'Autor':[],'Referencia':[],'Texto':[],'link':[]}
	for link in links:

		r=requests.get(link)
		soup=BeautifulSoup(r.content,'lxml')
		
		titulo=soup.find('div',{'class':'cabeza'}).text
		
		bloque_autor=soup.find('div',{'class':'credito-articulo'})

		autor=bloque_autor.span.text if bloque_autor is not None else ''


		bloque_articulo=soup.find('div',{'id':'article-text'})
		

		bloque_ref=bloque_articulo.find('div',{'class':'hemero'})
		ref=bloque_ref.text if bloque_ref is not None else ''


		texto_articulo=''
		
		inicial=bloque_articulo.find('div',{'class':'inicial'})
		texto_articulo+=inicial.text if inicial is not None else ''
		

		for parrafo in bloque_articulo.find_all('p'):
			texto_articulo+=parrafo.text+'\n'


		articulos['Titulo'].append(titulo)
		articulos['Autor'].append(autor)
		articulos['Referencia'].append(ref)
		articulos['Texto'].append(texto_articulo)
		articulos['link'].append(link)
		
	
	return pd.DataFrame(articulos)

